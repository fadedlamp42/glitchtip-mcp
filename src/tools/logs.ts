import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerLogTools(server: McpServer): void {
  server.tool(
    "query_logs",
    "Query logs with filters (level, service, message, time range)",
    {
      organization_slug: z.string().describe("Organization slug"),
      query: z.string().optional().describe("Search query"),
      project: z.string().optional().describe("Project ID filter"),
      environment: z.string().optional().describe("Environment filter"),
      level: z.string().optional().describe("Log level filter (e.g. error, warning, info)"),
      service: z.string().optional().describe("Service name filter"),
      cursor: z.string().optional().describe("Pagination cursor"),
      start: z.string().optional().describe("Start timestamp (ISO 8601)"),
      end: z.string().optional().describe("End timestamp (ISO 8601)"),
    },
    async ({ organization_slug, ...params }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/logs/`,
        { query: params },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_log",
    "Get a specific log entry by ID",
    {
      organization_slug: z.string().describe("Organization slug"),
      log_id: z.string().describe("Log entry ID"),
    },
    async ({ organization_slug, log_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/logs/${log_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_log_stats",
    "Get hourly log count statistics",
    {
      organization_slug: z.string().describe("Organization slug"),
      project: z.string().optional().describe("Project ID filter"),
      start: z.string().optional().describe("Start timestamp (ISO 8601)"),
      end: z.string().optional().describe("End timestamp (ISO 8601)"),
    },
    async ({ organization_slug, ...params }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/logs/stats/`,
        { query: params },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_log_resources",
    "List available services, hosts, and environments for log filtering",
    {
      organization_slug: z.string().describe("Organization slug"),
      project: z.string().optional().describe("Project ID filter"),
    },
    async ({ organization_slug, project }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/logs/resources/`,
        { query: { project } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
