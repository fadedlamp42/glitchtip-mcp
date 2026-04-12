#!/usr/bin/env node

/**
 * GlitchTip MCP Server
 *
 * Complete Model Context Protocol server for GlitchTip — the open-source
 * error tracking, uptime monitoring, and performance platform.
 *
 * Exposes 80+ tools covering every GlitchTip API endpoint: organizations,
 * projects, teams, issues, events, alerts, uptime monitors, performance
 * transactions, logs, members, environments, repositories, users, and
 * API tokens.
 *
 * Configuration via environment variables:
 *   GLITCHTIP_BASE_URL — Your GlitchTip instance URL (e.g. https://app.glitchtip.com)
 *   GLITCHTIP_API_TOKEN — API authentication token
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { configure } from "./client.js";

import { registerOrganizationTools } from "./tools/organizations.js";
import { registerProjectTools } from "./tools/projects.js";
import { registerTeamTools } from "./tools/teams.js";
import { registerIssueTools } from "./tools/issues.js";
import { registerCommentTools } from "./tools/comments.js";
import { registerEventTools } from "./tools/events.js";
import { registerAlertTools } from "./tools/alerts.js";
import { registerMemberTools } from "./tools/members.js";
import { registerEnvironmentTools } from "./tools/environments.js";
import { registerUptimeTools } from "./tools/uptime.js";
import { registerPerformanceTools } from "./tools/performance.js";
import { registerLogTools } from "./tools/logs.js";
import { registerUserTools } from "./tools/users.js";
import { registerStatisticsTools } from "./tools/statistics.js";
import { registerTokenTools } from "./tools/tokens.js";
import { registerRepositoryTools } from "./tools/repositories.js";

const baseUrl = process.env.GLITCHTIP_BASE_URL;
const token = process.env.GLITCHTIP_API_TOKEN;

if (!baseUrl || !token) {
  console.error(
    "Missing required environment variables: GLITCHTIP_BASE_URL and GLITCHTIP_API_TOKEN",
  );
  process.exit(1);
}

configure({ baseUrl, token });

const server = new McpServer({
  name: "glitchtip-mcp",
  version: "1.0.0",
});

// Register all tool groups
registerOrganizationTools(server);
registerProjectTools(server);
registerTeamTools(server);
registerIssueTools(server);
registerCommentTools(server);
registerEventTools(server);
registerAlertTools(server);
registerMemberTools(server);
registerEnvironmentTools(server);
registerUptimeTools(server);
registerPerformanceTools(server);
registerLogTools(server);
registerUserTools(server);
registerStatisticsTools(server);
registerTokenTools(server);
registerRepositoryTools(server);

const transport = new StdioServerTransport();
await server.connect(transport);
