import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerOrganizationTools(server: McpServer): void {
  server.tool(
    "list_organizations",
    "List all organizations the authenticated user belongs to",
    {},
    async () => {
      const data = await request("/api/0/organizations/");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_organization",
    "Get details of a specific organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(`/api/0/organizations/${organization_slug}/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_organization",
    "Create a new organization",
    { name: z.string().describe("Organization name") },
    async ({ name }) => {
      const data = await request("/api/0/organizations/", {
        method: "POST",
        body: { name },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_organization",
    "Update an organization's settings",
    {
      organization_slug: z.string().describe("Organization slug"),
      name: z.string().optional().describe("New name"),
    },
    async ({ organization_slug, ...body }) => {
      const data = await request(`/api/0/organizations/${organization_slug}/`, {
        method: "PUT",
        body,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_organization",
    "Delete an organization permanently",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      await request(`/api/0/organizations/${organization_slug}/`, {
        method: "DELETE",
      });
      return { content: [{ type: "text", text: `Organization "${organization_slug}" deleted.` }] };
    },
  );
}
