import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTeamTools(server: McpServer): void {
  server.tool(
    "list_teams",
    "List all teams in an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/teams/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_team",
    "Get details of a specific team",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, team_slug }) => {
      const data = await request(
        `/api/0/teams/${organization_slug}/${team_slug}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_team",
    "Create a new team in an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      slug: z.string().describe("Team slug (URL-safe identifier)"),
    },
    async ({ organization_slug, slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/teams/`,
        { method: "POST", body: { slug } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_team",
    "Update a team's settings",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
      slug: z.string().optional().describe("New slug"),
    },
    async ({ organization_slug, team_slug, ...body }) => {
      const data = await request(
        `/api/0/teams/${organization_slug}/${team_slug}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_team",
    "Delete a team permanently",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, team_slug }) => {
      await request(`/api/0/teams/${organization_slug}/${team_slug}/`, {
        method: "DELETE",
      });
      return { content: [{ type: "text", text: `Team "${team_slug}" deleted.` }] };
    },
  );

  server.tool(
    "list_team_members",
    "List members of a team",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, team_slug }) => {
      const data = await request(
        `/api/0/teams/${organization_slug}/${team_slug}/members/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_team_projects",
    "List projects belonging to a team",
    {
      organization_slug: z.string().describe("Organization slug"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, team_slug }) => {
      const data = await request(
        `/api/0/teams/${organization_slug}/${team_slug}/projects/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
