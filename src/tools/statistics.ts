import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerStatisticsTools(server: McpServer): void {
  server.tool(
    "get_organization_stats",
    "Query time-series statistics for an organization (events received, events dropped, etc.)",
    {
      organization_slug: z.string().describe("Organization slug"),
      stat: z.string().optional().describe("Stat type (e.g. received)"),
      start: z.string().optional().describe("Start timestamp (ISO 8601)"),
      end: z.string().optional().describe("End timestamp (ISO 8601)"),
      interval: z.string().optional().describe("Interval (e.g. 1h, 1d)"),
      project: z.string().optional().describe("Project ID filter"),
    },
    async ({ organization_slug, ...params }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/stats_v2/`,
        { query: params },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
