import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerUptimeTools(server: McpServer): void {
  server.tool(
    "list_monitors",
    "List all uptime monitors in an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, cursor }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/monitors/`,
        { query: { cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_monitor",
    "Get details of a specific uptime monitor",
    {
      organization_slug: z.string().describe("Organization slug"),
      monitor_id: z.string().describe("Monitor ID"),
    },
    async ({ organization_slug, monitor_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/monitors/${monitor_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_monitor",
    "Create a new uptime monitor",
    {
      organization_slug: z.string().describe("Organization slug"),
      name: z.string().describe("Monitor name"),
      url: z.string().describe("URL to monitor"),
      monitor_type: z.enum(["Ping", "GET", "POST", "Heartbeat"]).optional().describe("Monitor type"),
      interval: z.number().optional().describe("Check interval in seconds (60-86400)"),
      expected_status: z.number().optional().describe("Expected HTTP status code"),
      project: z.string().optional().describe("Project ID to associate with"),
    },
    async ({ organization_slug, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/monitors/`,
        { method: "POST", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_monitor",
    "Update an uptime monitor's settings",
    {
      organization_slug: z.string().describe("Organization slug"),
      monitor_id: z.string().describe("Monitor ID"),
      name: z.string().optional().describe("New name"),
      url: z.string().optional().describe("New URL"),
      interval: z.number().optional().describe("Check interval in seconds"),
      expected_status: z.number().optional().describe("Expected HTTP status"),
    },
    async ({ organization_slug, monitor_id, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/monitors/${monitor_id}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_monitor",
    "Delete an uptime monitor",
    {
      organization_slug: z.string().describe("Organization slug"),
      monitor_id: z.string().describe("Monitor ID"),
    },
    async ({ organization_slug, monitor_id }) => {
      await request(
        `/api/0/organizations/${organization_slug}/monitors/${monitor_id}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Monitor ${monitor_id} deleted.` }] };
    },
  );

  server.tool(
    "list_monitor_checks",
    "List check results for a monitor",
    {
      organization_slug: z.string().describe("Organization slug"),
      monitor_id: z.string().describe("Monitor ID"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, monitor_id, cursor }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/monitors/${monitor_id}/checks/`,
        { query: { cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "send_heartbeat",
    "Record a heartbeat ping for a heartbeat-type monitor",
    {
      organization_slug: z.string().describe("Organization slug"),
      endpoint_id: z.string().describe("Heartbeat endpoint ID"),
    },
    async ({ organization_slug, endpoint_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/heartbeat_check/${endpoint_id}/`,
        { method: "POST" },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Status pages
  server.tool(
    "list_status_pages",
    "List public status pages for an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/status-pages/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_status_page",
    "Create a new public status page",
    {
      organization_slug: z.string().describe("Organization slug"),
      name: z.string().describe("Status page name"),
      monitors: z.array(z.string()).optional().describe("Monitor IDs to include"),
    },
    async ({ organization_slug, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/status-pages/`,
        { method: "POST", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
