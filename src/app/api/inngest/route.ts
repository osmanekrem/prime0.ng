import {serve} from "inngest/next";
import {inngest} from "@/inngest/angular-agent/client";
import {angularAgent} from "@/inngest/angular-agent/functions";
import {codeOptimizerAgent} from "@/inngest/performance-analyzer/functions";

export const {GET, POST, PUT} = serve({
    client: inngest,
    functions: [
        angularAgent,
        codeOptimizerAgent
    ]
})