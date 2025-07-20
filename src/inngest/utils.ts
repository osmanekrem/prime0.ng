import {Sandbox} from "@e2b/code-interpreter";
import {AgentResult, TextMessage} from "@inngest/agent-kit";
import {db} from "@/db/drizzle";
import {messages} from "@/db/schema";

export async function getSandbox(sandboxId: string) {
    const sandbox = Sandbox.connect(sandboxId);
    return sandbox;
}

export function lastAssistantMessage(result: AgentResult) {
    const lastAssistantMessageIndex = result.output.findLastIndex(
        (message) => message.role === "assistant"
    )

    const message = result.output[lastAssistantMessageIndex] as | TextMessage | undefined;

    return message?.content
        ? typeof message?.content === "string"
            ? message.content
            : message.content.map((c) => c.text).join("")
        : undefined;
}

export function getTitleFromOutput(output:  Message[]): string {
    if(output[0].type !== "text") {
        return "Fragment";
    }

    if(Array.isArray(output[0].content)) {
        return output[0].content.map(t => t).join("");
    } else {
        return output[0].content;
    }
}

export function getResponseFromOutput(output:  Message[]): string {
    if(output[0].type !== "text") {
        return "Here is the result of your request.";
    }

    if(Array.isArray(output[0].content)) {
        return output[0].content.map(t => t).join("");
    } else {
        return output[0].content;
    }
}