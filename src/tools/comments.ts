import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerCommentTools(server: McpServer): void {
  server.tool(
    "list_issue_comments",
    "List all comments on an issue",
    { issue_id: z.string().describe("Issue ID") },
    async ({ issue_id }) => {
      const data = await request(`/api/0/issues/${issue_id}/comments/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_issue_comment",
    "Add a comment to an issue",
    {
      issue_id: z.string().describe("Issue ID"),
      text: z.string().describe("Comment text"),
    },
    async ({ issue_id, text }) => {
      const data = await request(`/api/0/issues/${issue_id}/comments/`, {
        method: "POST",
        body: { data: { text } },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_issue_comment",
    "Update an existing comment",
    {
      issue_id: z.string().describe("Issue ID"),
      comment_id: z.string().describe("Comment ID"),
      text: z.string().describe("Updated comment text"),
    },
    async ({ issue_id, comment_id, text }) => {
      const data = await request(
        `/api/0/issues/${issue_id}/comments/${comment_id}/`,
        { method: "PUT", body: { data: { text } } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_issue_comment",
    "Delete a comment from an issue",
    {
      issue_id: z.string().describe("Issue ID"),
      comment_id: z.string().describe("Comment ID"),
    },
    async ({ issue_id, comment_id }) => {
      await request(`/api/0/issues/${issue_id}/comments/${comment_id}/`, {
        method: "DELETE",
      });
      return { content: [{ type: "text", text: `Comment ${comment_id} deleted.` }] };
    },
  );
}
