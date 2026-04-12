import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerMemberTools(server: McpServer): void {
  server.tool(
    "list_members",
    "List all members of an organization",
    { organization_slug: z.string().describe("Organization slug") },
    async ({ organization_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_member",
    "Get details of a specific organization member",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
    },
    async ({ organization_slug, member_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "invite_member",
    "Invite a new member to an organization by email",
    {
      organization_slug: z.string().describe("Organization slug"),
      email: z.string().describe("Email address to invite"),
      role: z.enum(["admin", "manager", "member"]).optional().describe("Role to assign"),
      teams: z.array(z.string()).optional().describe("Team slugs to add the member to"),
    },
    async ({ organization_slug, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/`,
        { method: "POST", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_member",
    "Update a member's role in an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
      role: z.enum(["admin", "manager", "member"]).optional().describe("New role"),
      teams: z.array(z.string()).optional().describe("Team slugs"),
    },
    async ({ organization_slug, member_id, ...body }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "remove_member",
    "Remove a member from an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
    },
    async ({ organization_slug, member_id }) => {
      await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Member ${member_id} removed.` }] };
    },
  );

  server.tool(
    "set_member_as_owner",
    "Promote a member to organization owner",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
    },
    async ({ organization_slug, member_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/set_owner/`,
        { method: "POST" },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "add_member_to_team",
    "Add a member to a specific team",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, member_id, team_slug }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/teams/${team_slug}/`,
        { method: "POST" },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "remove_member_from_team",
    "Remove a member from a specific team",
    {
      organization_slug: z.string().describe("Organization slug"),
      member_id: z.string().describe("Member ID"),
      team_slug: z.string().describe("Team slug"),
    },
    async ({ organization_slug, member_id, team_slug }) => {
      await request(
        `/api/0/organizations/${organization_slug}/members/${member_id}/teams/${team_slug}/`,
        { method: "DELETE" },
      );
      return { content: [{ type: "text", text: `Member removed from team "${team_slug}".` }] };
    },
  );
}
