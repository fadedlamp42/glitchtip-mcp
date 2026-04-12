import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerProjectTools(server: McpServer): void {
  server.tool(
    "list_projects",
    "List all projects accessible to the authenticated user",
    {},
    async () => {
      const data = await request("/api/0/projects/");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_organization_projects",
    "List all projects within an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/projects/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_project",
    "Get details of a specific project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_project",
    "Create a new project within a team",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
      name: z.string().describe("Project name"),
      platform: z.string().optional().describe("Platform (e.g. python, javascript)"),
    },
    async ({ organization_slug, team_slug, name, platform }) => {
      const data = await request(
        `/api/0/teams/${organization_slug}/${team_slug}/projects/`,
        { method: "POST", body: { name, platform } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_project",
    "Update project settings",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      name: z.string().optional().describe("New project name"),
      platform: z.string().optional().describe("Platform"),
    },
    async ({ organization_slug, project_slug, ...body }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_project",
    "Delete a project permanently",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      await request(
        `/api/0/projects/${organization_slug}/${project_slug}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Project "${project_slug}" deleted.` }] };
    },
  );

  // Project keys (DSNs)
  server.tool(
    "list_project_keys",
    "List DSN keys for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/keys/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_project_key",
    "Create a new DSN key for a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      name: z.string().optional().describe("Key label"),
    },
    async ({ organization_slug, project_slug, name }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/keys/`,
        { method: "POST", body: { name } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_project_key",
    "Revoke a DSN key",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      key_id: z.string().describe("Key ID"),
    },
    async ({ organization_slug, project_slug, key_id }) => {
      await request(
        `/api/0/projects/${organization_slug}/${project_slug}/keys/${key_id}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Key "${key_id}" revoked.` }] };
    },
  );

  // Project teams
  server.tool(
    "list_project_teams",
    "List teams assigned to a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
    },
    async ({ organization_slug, project_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/teams/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "assign_team_to_project",
    "Assign a team to a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, project_slug, team_slug }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/teams/${team_slug}/`,
        { method: "POST" },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "remove_team_from_project",
    "Remove a team from a project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, project_slug, team_slug }) => {
      await request(
        `/api/0/projects/${organization_slug}/${project_slug}/teams/${team_slug}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Team "${team_slug}" removed from project.` }] };
    },
  );
}
