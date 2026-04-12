import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTokenTools(server: McpServer): void {
  server.tool(
    "list_api_tokens",
    "List all API tokens for the authenticated user",
    {},
    async () => {
      const data = await request("/api/0/api-tokens/");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "create_api_token",
    "Create a new API token",
    {
      scopes: z.array(z.string()).optional().describe("Token scopes (e.g. project:read, event:read)"),
      label: z.string().optional().describe("Token label/name"),
    },
    async ({ scopes, label }) => {
      const data = await request("/api/0/api-tokens/", {
        method: "POST",
        body: { scopes, label },
      });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "delete_api_token",
    "Delete an API token",
    { token_id: z.string().describe("Token ID") },
    async ({ token_id }) => {
      await request(`/api/0/api-tokens/${token_id}/`, { method: "DELETE" });
      return { content: [{ type: "text", text: `Token ${token_id} deleted.` }] };
    },
  );
}
