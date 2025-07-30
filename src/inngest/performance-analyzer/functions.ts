import {inngest, projectChannel} from "@/inngest/angular-agent/client";
import {createAgent, createNetwork, createState, createTool, gemini, Tool} from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import {getResponseFromOutput, getSandbox, lastAssistantMessage} from "@/inngest/utils";
import {z} from "zod";
import {db} from "@/db/drizzle";
import {fragments, messages} from "@/db/schema";
import {
    LANGUAGE_DETECTION_PROMPT,
    OPTIMIZER_SYSTEM_PROMPT,
    RESPONSE_GENERATOR_PROMPT
} from "@/inngest/performance-analyzer/prompts";

interface AgentState {
    originalCode?: string;
    analysisReport?: string;
    improvedCode?: string;
    benchmarkResults?: string;
    finalReport?: string;
    files?: Record<string, string>;
}

export const codeOptimizerAgent = inngest.createFunction(
    {id: "code-optimizer-agent", name: "Code Optimizer Agent"},
    {event: "optimizer-agent/run"},
    async ({event, step, publish,}) => {
        await publish(projectChannel(event.data.projectId).status({
            status: "running",
            message: "Code optimizer agent is running"
        }))


        const userCode = event.data.value;
        const languageDetectorAgent = createAgent({
            name: 'language-detector',
            system: LANGUAGE_DETECTION_PROMPT,
            model: gemini({model: 'gemini-2.0-flash-lite'})
        });
        const {output} = await languageDetectorAgent.run(userCode);
        const detectedLanguage = getResponseFromOutput(output).trim().toLowerCase();

        if (!['javascript', 'python', 'java'].includes(detectedLanguage)) {
            await publish(projectChannel(event.data.projectId).status({
                status: "error",
                message: `Unsupported language detected: ${detectedLanguage}`
            }));
            throw new Error(`Unsupported language detected: ${detectedLanguage}`);
        }

        const sandboxTemplateId = await step.run("select-sandbox-template", async () => {
            switch (detectedLanguage) {
                case 'javascript':
                    return 'js';
                case 'python':
                    return 'py';
                case 'java':
                    return 'java';
                default:
                    throw new Error(`No sandbox configured for language: ${detectedLanguage}`);
            }
        });

        await publish(projectChannel(event.data.projectId).status({
            status: "running",
            message: `Language detected: ${detectedLanguage}. Starting optimization...`
        }));

        const sandboxId = await step.run("Get sandbox id", async () => {
            await publish(projectChannel(event.data.projectId).status({status: "running", message: "Creating sandbox"}))
            const sandbox = await Sandbox.create(sandboxTemplateId)
            return sandbox.sandboxId
        })
        if (!sandboxId) {
            await publish(projectChannel(event.data.projectId).status({
                status: "error",
                message: "Sandbox creation failed"
            }))
            throw new Error("Sandbox creation failed");
        }

        const state = createState<AgentState>({
            originalCode: userCode,
            files: {}
        });

        const optimizerAgent = createAgent<AgentState>({
            name: 'optimizer-agent',
            description: 'An expert agent that analyzes code performance, suggests improvements, and provides benchmarks.',
            system: OPTIMIZER_SYSTEM_PROMPT,
            model: gemini({
                model: 'gemini-2.0-flash',
                defaultParameters: {
                    generationConfig: {
                        temperature: 0.1,
                    },
                },
            }),
            tools: [
                createTool({
                    name: 'terminal',
                    description: 'use terminal to run commands',
                    parameters: z.object({
                        command: z.string()
                    }),
                    handler: async ({command}, {step}) => {
                        return await step?.run("terminal", async () => {
                            const buffers = {stdout: "", stderr: ""};

                            try {
                                const sandbox = await getSandbox(sandboxId);
                                const res = await sandbox.commands.run(command, {
                                    onStdout: (data) => {
                                        buffers.stdout += data
                                    },
                                    onStderr: (data) => {
                                        buffers.stderr += data
                                    }
                                })
                                return res.stdout
                            } catch (error) {
                                await publish(projectChannel(event.data.projectId).status({
                                    status: "error",
                                    message: `Error running command: ${command}`
                                }))
                                console.error(`Error running command: ${command}\n Stdout: ${buffers.stdout}\nStderr: ${buffers.stderr}`);
                                return `Error running command: ${command}\n Stdout: ${buffers.stdout}\nStderr: ${buffers.stderr}`;
                            }
                        })
                    }
                }),
                createTool({
                    name: 'createOrUpdateFiles',
                    description: 'Create or update files in the sandbox',
                    parameters: z.object({
                        files: z.array(
                            z.object({
                                path: z.string(),
                                content: z.string()
                            })
                        )
                    }),
                    handler: async ({files}, {step, network}: Tool.Options<AgentState>) => {
                        const newFiles = await step?.run("createOrUpdateFiles", async () => {
                            try {
                                const updatedFiles = network.state.data.files || {};
                                const sandbox = await getSandbox(sandboxId);
                                for (const file of files) {
                                    await sandbox.files.write(file.path, file.content);
                                    updatedFiles[file.path] = file.content;
                                }
                                return updatedFiles;
                            } catch (error) {
                                await publish(projectChannel(event.data.projectId).status({
                                    status: "error",
                                    message: `Error creating or updating files: ${error}`
                                }))
                                console.error("Error creating or updating files:", error);
                                return "Error creating or updating files: " + error
                            }
                        })

                        if (typeof newFiles === "object") {
                            network.state.data.files = newFiles;
                        }
                    }
                }),
                createTool({
                    name: 'readFiles',
                    description: 'Read files from the sandbox',
                    parameters: z.object({
                        files: z.array(
                            z.string()
                        )
                    }),
                    handler: async ({files}, {step}) => {
                        return await step?.run("readFiles", async () => {
                            try {
                                const sandbox = await getSandbox(sandboxId);
                                const contents = [];
                                for (const file of files) {
                                    const content = await sandbox.files.read(file);
                                    contents.push({path: file, content});
                                }
                                return JSON.stringify(contents);
                            } catch (error) {
                                await publish(projectChannel(event.data.projectId).status({
                                    status: "error",
                                    message: `Error reading files: ${error}`
                                }))
                                console.error("Error reading files:", error);
                                return "Error reading files: " + error;
                            }
                        })
                    }
                })
            ],
            lifecycle: {
                onResponse: async ({result, network}) => {
                    const lastMessage = lastAssistantMessage(result)

                    if (lastMessage && network) {
                        if (lastMessage.includes("<task_summary>")) {
                            network.state.data.finalReport = lastMessage;
                        }
                    }

                    return result
                }
            }
        })

        const network = createNetwork<AgentState>({
            name: "performance-agent-network",
            agents: [optimizerAgent],
            maxIter: 15,
            defaultState: state,
            router: async ({network}) => {
                const summary = network.state.data.finalReport;

                if (summary) {
                    return
                }

                return optimizerAgent
            }
        })
        await publish(projectChannel(event.data.projectId).status({status: "running", message: "code-agent-running"}))
        const result = await network.run(`Language: ${detectedLanguage}\n\nPlease analyze, improve, and benchmark the following code:\n\n\`\`\`${detectedLanguage}\n${userCode}\n\`\`\``, {state})
        const finalReport = result.state.data.finalReport
        const isError = !finalReport || Object.keys(result.state.data.files || {}).length === 0

        if (isError) {
            await publish(projectChannel(event.data.projectId).status({
                status: "error",
                message: "An error occurred, and the report could not be completed."
            }));
            await db.insert(messages).values({
                projectId: event.data.projectId,
                content: "I'm sorry, I encountered a problem while analyzing your code. Please try again later.",
                messageRole: "ASSISTANT",
                messageType: "ERROR"
            }).returning();
            throw new Error("The agent failed to generate the final report.");
        }

        const benchmarkData = await step.run("run-controlled-benchmark", async () => {
            await publish(projectChannel(event.data.projectId).status({
                status: "running",
                message: `Running controlled benchmark for ${detectedLanguage}...`
            }));

            const sandbox = await getSandbox(sandboxId);

            let benchmarkCommand = '';
            switch (detectedLanguage) {
                case 'javascript':
                    benchmarkCommand = 'node benchmark_runner.js';
                    break;
                case 'python':
                    benchmarkCommand = 'python3 benchmark_runner.py';
                    break;
                case 'java':
                    benchmarkCommand = 'javac *.java && java BenchmarkRunner';
                    break;
                default:
                    throw new Error(`No benchmark command configured for language: ${detectedLanguage}`);
            }

            const {stdout, stderr} = await sandbox.commands.run(benchmarkCommand);

            if (stderr) {
                throw new Error(`Benchmark execution failed: ${stderr}`);
            }

            return JSON.parse(stdout);
        });

        const responseGenerator = createAgent({
            name: 'response-generator',
            description: 'Converts a technical report into a user-friendly message.',
            system: RESPONSE_GENERATOR_PROMPT,
            model: gemini({
                model: 'gemini-2.0-flash-lite',
            })
        });

        await publish(projectChannel(event.data.projectId).status({
            status: "running",
            message: "Generating final response..."
        }));

        const {output: finalUserResponse} = await responseGenerator.run(finalReport)


        await step.run("save-result", async () => {
            await publish(projectChannel(event.data.projectId).status({status: "running", message: "Saving result"}))

            const message = await db.insert(messages).values({
                projectId: event.data.projectId,
                content: getResponseFromOutput(finalUserResponse),
                messageRole: "ASSISTANT",
                messageType: "RESULT"
            }).returning()

            await db.insert(fragments).values({
                messageId: message[0].id,
                title: "Code Optimization Report",
                files: JSON.stringify(result.state.data.files || {}),
                benchmarkData: JSON.stringify(benchmarkData),
            }).returning();

            return message
        })

        await publish(projectChannel(event.data.projectId).status({
            status: "completed",
            message: "Optimizer agent completed successfully"
        }))
        return {
            report: getResponseFromOutput(finalUserResponse),
            files: result.state.data.files,
            benchmarkData: benchmarkData,
        };
    }
)