import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/**
 * GlitchTip's bulk mutate endpoints treat "no id list and no search query" as
 * "every issue in the organization". that is a real capability of the API and a
 * catastrophic default for a tool call, so an unscoped bulk operation is refused
 * and the caller has to state the org-wide intent explicitly.
 */
function assertBulkScope(
  toolName: string,
  id: string[] | undefined,
  query: string | undefined,
): void {
  const hasIds = id !== undefined && id.length > 0;
  const hasQuery = query !== undefined && query !== "";
  if (!hasIds && !hasQuery) {
    throw new Error(
      `${toolName} refused: neither 'id' nor 'query' was supplied, which GlitchTip ` +
        `interprets as EVERY issue in the organization. pass an explicit 'id' array, ` +
        `or pass a 'query' such as "is:unresolved" if an org-wide change is genuinely intended.`,
    );
  }
}

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
      assertBulkScope("bulk_update_issues", id, query);
      // `id` and `query` SELECT the issues and belong in the query string; only
      // the mutation itself goes in the body. sending `id` in the body leaves the
      // request unscoped and silently mutates the whole organization.
      const data = await request(
        `/api/0/organizations/${organization_slug}/issues/`,
        {
          method: "PUT",
          query: { id, query },
          body: { status },
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
      assertBulkScope("bulk_delete_issues", id, query);
      // same scoping rule as bulk_update_issues, and the stakes are higher here:
      // an unscoped DELETE destroys every issue in the organization.
      await request(
        `/api/0/organizations/${organization_slug}/issues/`,
        {
          method: "DELETE",
          query: { id, query },
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
