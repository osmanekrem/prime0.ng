import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import config from "@/lib/config";

const baseURL = config.env.apiEndpoint ?? "";
export const client = hc<AppType>(baseURL);
