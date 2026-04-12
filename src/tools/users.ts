import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerUserTools(server: McpServer): void {
  server.tool(
    "get_current_user",
    "Get the currently authenticated user's profile",
    {},
    async () => {
      const data = await request("/api/0/users/");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_user",
    "Get a specific user's profile",
    { user_id: z.string().describe("User ID (use 'me' for current user)") },
    async ({ user_id }) => {
      const data = await request(`/api/0/users/${user_id}/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_user",
    "Update user profile information",
    {
      user_id: z.string().describe("User ID"),
      name: z.string().optional().describe("Display name"),
    },
    async ({ user_id, ...body }) => {
      const data = await request(`/api/0/users/${user_id}/`, {
        method: "PUT",
        body,
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_user",
    "Delete a user account",
    { user_id: z.string().describe("User ID") },
    async ({ user_id }) => {
      await request(`/api/0/users/${user_id}/`, { method: "DELETE" });
      return { content: [{ type: "text", text: `User ${user_id} deleted.` }] };
    },
  );

  server.tool(
    "list_user_emails",
    "List email addresses associated with a user",
    { user_id: z.string().describe("User ID") },
    async ({ user_id }) => {
      const data = await request(`/api/0/users/${user_id}/emails/`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "add_user_email",
    "Add a new email address to a user account",
    {
      user_id: z.string().describe("User ID"),
      email: z.string().describe("Email address to add"),
    },
    async ({ user_id, email }) => {
      const data = await request(`/api/0/users/${user_id}/emails/`, {
        method: "POST",
        body: { email },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "set_primary_email",
    "Set the primary email address for a user",
    {
      user_id: z.string().describe("User ID"),
      email: z.string().describe("Email address to set as primary"),
    },
    async ({ user_id, email }) => {
      const data = await request(`/api/0/users/${user_id}/emails/`, {
        method: "PUT",
        body: { email },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  // Notification preferences
  server.tool(
    "get_notification_preferences",
    "Get alert notification preferences for a user",
    { user_id: z.string().describe("User ID (use 'me' for current)") },
    async ({ user_id }) => {
      const data = await request(
        `/api/0/users/${user_id}/notifications/alerts/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "update_notification_preferences",
    "Update alert notification preferences",
    {
      user_id: z.string().describe("User ID"),
      subscribe_by_default: z.boolean().optional().describe("Auto-subscribe to new project alerts"),
    },
    async ({ user_id, ...body }) => {
      const data = await request(
        `/api/0/users/${user_id}/notifications/alerts/`,
        { method: "PUT", body },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
