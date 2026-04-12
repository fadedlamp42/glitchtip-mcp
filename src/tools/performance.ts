import { request } from "../client.js";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPerformanceTools(server: McpServer): void {
  server.tool(
    "list_transaction_groups",
    "List transaction groups (performance overview) for an organization",
    {
      organization_slug: z.string().describe("Organization slug"),
      project: z.string().optional().describe("Project ID filter"),
      environment: z.string().optional().describe("Environment filter"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, project, environment, cursor }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/transaction-groups/`,
        { query: { project, environment, cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_transaction_group",
    "Get details of a specific transaction group",
    {
      organization_slug: z.string().describe("Organization slug"),
      transaction_group_id: z.string().describe("Transaction group ID"),
    },
    async ({ organization_slug, transaction_group_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/transaction-groups/${transaction_group_id}/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_transaction_spans",
    "List spans for a transaction group",
    {
      organization_slug: z.string().describe("Organization slug"),
      transaction_group_id: z.string().describe("Transaction group ID"),
    },
    async ({ organization_slug, transaction_group_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/transaction-groups/${transaction_group_id}/spans/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "get_transaction_trend",
    "Get performance trend data for a transaction group",
    {
      organization_slug: z.string().describe("Organization slug"),
      transaction_group_id: z.string().describe("Transaction group ID"),
    },
    async ({ organization_slug, transaction_group_id }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/transaction-groups/${transaction_group_id}/trend/`,
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "list_span_groups",
    "List span groups across an organization (database queries, HTTP calls, etc.)",
    {
      organization_slug: z.string().describe("Organization slug"),
      project: z.string().optional().describe("Project ID filter"),
      cursor: z.string().optional().describe("Pagination cursor"),
    },
    async ({ organization_slug, project, cursor }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/span-groups/`,
        { query: { project, cursor } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );

  server.tool(
    "detect_n_plus_one",
    "Detect N+1 query patterns in an organization's transactions",
    {
      organization_slug: z.string().describe("Organization slug"),
      project: z.string().optional().describe("Project ID filter"),
    },
    async ({ organization_slug, project }) => {
      const data = await request(
        `/api/0/organizations/${organization_slug}/n-plus-one/`,
        { query: { project } },
      );
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    },
  );
}
