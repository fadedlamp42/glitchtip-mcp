import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerRepositoryTools(server: McpServer): void {
  server.tool(
    "list_repositories",
    "List source code repositories linked to an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/repos/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_repository",
    "Register a source code repository with an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      name: z.string().describe("Repository name (e.g. owner/repo)"),
      url: z.string().optional().describe("Repository URL"),
    },
    async ({ organization_slug, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/repos/`,
        { method: "POST", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
