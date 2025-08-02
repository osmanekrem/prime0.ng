import {Hono} from "hono";
import {handle} from "hono/vercel";
import auth from "@/features/auth/server/route";
import messages from "@/features/messages/server/route";
import projects from "@/features/projects/server/route";


const app = new Hono().basePath("/api")

const routes = app
    .route('/user', auth)
    .route("/messages", messages)
    .route("/projects", projects)


export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)

export type AppType = typeof routes;