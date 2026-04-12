import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerEnvironmentTools(server: McpServer): void {
  server.tool(
    "list_organization_environments",
    "List all environments across an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/environments/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_project_environments",
    "List environments for a specific project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/environments/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_project_environment",
    "Update environment settings (e.g. visibility) for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      environment_name: z.string().describe("Environment name"),
      isHidden: z.boolean().optional().describe("Whether to hide this environment"),
    },
    async ({ organization_slug, project_slug, environment_name, ...body }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/environments/${environment_name}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
