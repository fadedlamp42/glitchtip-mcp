import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerAlertTools(server: McpServer): void {
  server.tool(
    "list_alerts",
    "List alert rules for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/alerts/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_alert",
    "Create a new alert rule for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      name: z.string().describe("Alert name"),
      timespan_minutes: z.number().optional().describe("Time window in minutes"),
      quantity: z.number().optional().describe("Threshold count"),
      uptime: z.boolean().optional().describe("Whether this is an uptime alert"),
    },
    async ({ organization_slug, project_slug, ...body }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/alerts/`,
        { method: "POST", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_alert",
    "Update an existing alert rule",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      alert_id: z.string().describe("Alert ID"),
      name: z.string().optional().describe("New name"),
      timespan_minutes: z.number().optional().describe("Time window"),
      quantity: z.number().optional().describe("Threshold count"),
    },
    async ({ organization_slug, project_slug, alert_id, ...body }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/alerts/${alert_id}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_alert",
    "Delete an alert rule",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      alert_id: z.string().describe("Alert ID"),
    },
    async ({ organization_slug, project_slug, alert_id }) => {
      await request(
        `/api/0/projects/${organization_slug}/${project_slug}/alerts/${alert_id}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Alert ${alert_id} deleted.` }] };
    },
  );

  server.tool(
    "test_alert",
    "Send a test notification for an alert rule",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      alert_id: z.string().describe("Alert ID"),
    },
    async ({ organization_slug, project_slug, alert_id }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/alerts/${alert_id}/test/`,
        { method: "POST" },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
