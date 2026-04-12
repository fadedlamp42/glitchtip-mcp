import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerIssueTools(server: McpServer): void {
  server.tool(
    "list_organization_issues",
    "List issues across an organization with filtering and search",
    {
      organization_slug: z.string().describe("Organization slug"),
      query: z.string().optional().describe("Search query string"),
      project: z.string().optional().describe("Project ID to filter by"),
      sort: z.enum(["date", "new", "priority", "freq"]).optional().describe("Sort order"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, query, project, sort, cursor }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues/`,
        { query: { query, project, sort, cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_project_issues",
    "List issues for a specific project",
    {
      organization_slug: z.string().describe("Organization slug"),
      project_slug: z.string().describe("Project slug"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, project_slug, cursor }) => {
      const data = await request(
        `/api/0/projects/${organization_slug}/${project_slug}/issues/`,
        { query: { cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_issue",
    "Get detailed information about a specific issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(`/api/0/issues/${issue_id}/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_issue",
    "Update issue metadata (status, assignee, etc.)",
    {
      issue_id: z.string().describe("Issue ID"),
      status: z.enum(["resolved", "unresolved", "ignored"]).optional().describe("Issue status"),
      assignedTo: z.string().optional().describe("Assign to user email or empty to unassign"),
    },
    async ({ issue_id, ...body }) => {
      const data = await request(`/api/0/issues/${issue_id}/`, {
        method: "PUT",
        body,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_issue",
    "Delete an issue permanently",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      await request(`/api/0/issues/${issue_id}/`, { method: "DELETE" });
      return { content: [{ type: "text", text: `Issue ${issue_id} deleted.` }] };
    },
  );

  server.tool(
    "bulk_update_issues",
    "Bulk update multiple issues in an organization (resolve, ignore, etc.)",
    {
      organization_slug: z.string().describe("Organization slug"),
      id: z.array(z.string()).optional().describe("List of issue IDs"),
      query: z.string().optional().describe("Search query to match issues"),
      status: z.enum(["resolved", "unresolved", "ignored"]).optional().describe("New status"),
    },
    async ({ organization_slug, id, query, status }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues/`,
        {
          method: "PUT",
          body: { id, query, status },
        },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "bulk_delete_issues",
    "Bulk delete issues in an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      id: z.array(z.string()).optional().describe("List of issue IDs"),
      query: z.string().optional().describe("Search query to match issues"),
    },
    async ({ organization_slug, id, query }) => {
      await request(
        `/api/0/organizations/${organization_slug}/issues/`,
        {
          method: "DELETE",
          body: { id, query },
        },
      );
      return { content: [{ type: "text", text: "Issues deleted." }] };
    },
  );

  // Issue tags
  server.tool(
    "list_issue_tags",
    "List tags associated with an issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(`/api/0/issues/${issue_id}/tags/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Issue hashes
  server.tool(
    "list_issue_hashes",
    "List grouping hashes for an issue",
    {
      organization_slug: z.string().describe("Organization slug"),
      issue_id: z.string().describe("Issue ID"),
    },
    async ({ organization_slug, issue_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues/${issue_id}/hashes/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Issue user reports
  server.tool(
    "list_issue_user_reports",
    "List user feedback/reports for an issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(`/api/0/issues/${issue_id}/user-reports/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Issue commits
  server.tool(
    "list_issue_commits",
    "List commits related to an issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(`/api/0/issues/${issue_id}/commits/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Issues stats
  server.tool(
    "get_issues_stats",
    "Get aggregated issue statistics for an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      id: z.array(z.string()).optional().describe("List of issue IDs"),
    },
    async ({ organization_slug, id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues-stats/`,
        { query: { id: id?.join(",") } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
