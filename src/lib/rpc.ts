import { hc } from "hono/client";
import type { AppType } from "@/app/api/[[...route]]/route";
import config from "@/lib/config";

export const client = hc<AppType>(
  config.env.apiEndpoint ?? "http://localhost:3000"
);
