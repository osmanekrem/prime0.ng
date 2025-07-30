import {inngest, projectChannel} from "@/inngest/angular-agent/client";
import {createAgent, createNetwork, createState, createTool, gemini, Message, Tool} from "@inngest/agent-kit";
import {Sandbox} from "@e2b/code-interpreter";
import {getResponseFromOutput, getSandbox, getTitleFromOutput, lastAssistantMessage} from "@/inngest/utils";
import {z} from "zod";
import {FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT} from "@/inngest/angular-agent/prompts";
import {db} from "@/db/drizzle";
import {fragments, messages} from "@/db/schema";
import {asc, eq} from "drizzle-orm";

interface AgentState {
    summary: string;
    files?: Record<string, string>;
}

export const angularAgent = inngest.createFunction(
    {id: "angular-agent", name: "Angular Agent"},
    {event: "angular-agent/run"},
    async ({event, step, publish,}) => {
        await publish(projectChannel(event.data.projectId).status({
            status: "running",
            message: "Angular agent is running"
        }))
        const sandboxId = await step.run("Get sandbox id", async () => {
            await publish(projectChannel(event.data.projectId).status({status: "running", message: "Creating sandbox"}))
            const sandbox = await Sandbox.create("prime0-ng-test")
            return sandbox.sandboxId
        })
        if (!sandboxId) {
            await publish(projectChannel(event.data.projectId).status({
                status: "error",
                message: "Sandbox creation failed"
            }))
            throw new Error("Sandbox creation failed");
        }

        const previousMessages = await step.run("get-previous-messages", async () => {
            await publish(projectChannel(event.data.projectId).status({
                status: "running",
                message: "Fetching previous messages"
            }))
            const formattedMessages: Message[] = [];

            const messagesData = await db.select().from(messages).where(eq(messages.projectId, event.data.projectId)).orderBy(asc(messages.createdAt));

            for (const message of messagesData) {
                formattedMessages.push({
                    content: message.content,
                    role: message.messageRole === "USER" ? "user" : "assistant",
                    type: "text",
                });
            }

            return formattedMessages;
        })

        const state = createState<AgentState>({
                summary: "",
                files: {}
            },
            {messages: previousMessages})

        const codeAgent = createAgent<AgentState>({
            name: 'code-agent',
            description: 'An expert coding agent',
            system: PROMPT,
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
                            network.state.data.summary = lastMessage;
                        }
                    }

                    return result
                }
            }
        })

        const network = createNetwork<AgentState>({
            name: "coding-agent-network",
            agents: [codeAgent],
            maxIter: 15,
            defaultState: state,
            router: async ({network}) => {
                const summary = network.state.data.summary;

                if (summary) {
                    return
                }

                return codeAgent
            }
        })
        await publish(projectChannel(event.data.projectId).status({status: "running", message: "code-agent-running"}))
        const result = await network.run(event.data.value, {state})

        const fragmentTitleGenerator = createAgent({
            name: 'fragment-title-generator',
            description: 'Generates a title for the code fragment',
            system: FRAGMENT_TITLE_PROMPT,
            model: gemini({
                model: 'gemini-2.0-flash-lite',
            })
        })
        const responseGenerator = createAgent({
            name: 'response-generator',
            description: 'Generates a response for the user',
            system: RESPONSE_PROMPT,
            model: gemini({
                model: 'gemini-2.0-flash-lite',
            })
        })

        await publish(projectChannel(event.data.projectId).status({
            status: "running",
            message: "Generating final response"
        }))
        const {output: fragmentTitleOutput} = await fragmentTitleGenerator.run(result.state.data.summary)
        const {output: response} = await responseGenerator.run(result.state.data.summary)


        const isError = !result.state.data.summary || Object.keys(result.state.data.files || {}).length === 0

        const sandboxUrl = await step.run("Get sandbox url", async () => {
            await publish(projectChannel(event.data.projectId).status({
                status: "running",
                message: "Fetching sandbox URL"
            }))
            const sandbox = await getSandbox(sandboxId)
            const host = sandbox.getHost(4200)
            return `https://${host}`
        })

        await step.run("save-result", async () => {
            await publish(projectChannel(event.data.projectId).status({status: "running", message: "Saving result"}))
            if (isError) {
                await publish(projectChannel(event.data.projectId).status({
                    status: "error",
                    message: "An error occurred while processing the request"
                }))
                return db.insert(messages).values({
                    projectId: event.data.projectId,
                    content: "Bir şeylerler ters gitti. Lütfen daha sonra tekrar deneyin.",
                    messageRole: "ASSISTANT",
                    messageType: "ERROR"
                }).returning()
            }
            const message = await db.insert(messages).values({
                projectId: event.data.projectId,
                content: getResponseFromOutput(response),
                messageRole: "ASSISTANT",
                messageType: "RESULT"
            }).returning()
            const data = await db.insert(fragments).values({
                messageId: message[0].id,
                sandboxUrl: sandboxUrl,
                title: getTitleFromOutput(fragmentTitleOutput),
                files: JSON.stringify(result.state.data.files)
            }).returning()

            return data
        })

        await publish(projectChannel(event.data.projectId).status({
            status: "completed",
            message: "Angular agent completed successfully"
        }))
        return {
            url: sandboxUrl,
            title: getTitleFromOutput(fragmentTitleOutput),
            files: result.state.data.files,
            summary: getResponseFromOutput(response)
        }
    }
)