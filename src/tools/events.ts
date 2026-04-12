import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerEventTools(server: McpServer): void {
  server.tool(
    "list_issue_events",
    "List all events (occurrences) for an issue",
    {
      issue_id: z.string().describe("Issue ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ issue_id, cursor }) => {
      const data = await request(`/api/0/issues/${issue_id}/events/`, {
        query: { cursor },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_latest_event",
    "Get the most recent event for an issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(
        `/api/0/issues/${issue_id}/events/latest/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_event",
    "Get a specific event by ID for an issue",
    {
      issue_id: z.string().describe("Issue ID"),
      event_id: z.string().describe("Event ID"),
    },
    async ({ issue_id, event_id }) => {
      const data = await request(
        `/api/0/issues/${issue_id}/events/${event_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_project_events",
    "List all events for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, project_slug, cursor }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/events/`,
        { query: { cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_project_event",
    "Get a specific event within a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      event_id: z.string().describe("Event ID"),
    },
    async ({ organization_slug, project_slug, event_id }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/events/${event_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_event_json",
    "Get the raw JSON payload of an event (full stack trace, context, etc.)",
    {
      organization_slug: z.string().describe("Organization slug"),
      issue_id: z.string().describe("Issue ID"),
      event_id: z.string().describe("Event ID"),
    },
    async ({ organization_slug, issue_id, event_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues/${issue_id}/events/${event_id}/json/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
