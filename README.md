# GlitchTip MCP Server

The most complete [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server for [GlitchTip](https://glitchtip.com) — the open-source error tracking, uptime monitoring, and performance platform.

**80+ tools** covering the entire GlitchTip REST API. Query issues, manage projects, monitor uptime, analyze performance, read logs, manage teams and members — all from your AI assistant.

## Features

| Category | Tools | Read | Write |
|---|---|---|---|
| **Organizations** | list, get, create, update, delete | 2 | 3 |
| **Projects** | list, get, create, update, delete, list by org | 3 | 3 |
| **Project Keys (DSN)** | list, create, delete | 1 | 2 |
| **Project Teams** | list, assign, remove | 1 | 2 |
| **Teams** | list, get, create, update, delete, members, projects | 4 | 3 |
| **Issues** | list (org/project), get, update, delete, bulk update, bulk delete, tags, hashes, user reports, commits, stats | 8 | 4 |
| **Comments** | list, create, update, delete | 1 | 3 |
| **Events** | list (issue/project), get latest, get by ID, get raw JSON | 6 | 0 |
| **Alerts** | list, create, update, delete, test | 1 | 4 |
| **Members** | list, get, invite, update role, remove, set owner, add/remove from team | 2 | 6 |
| **Environments** | list (org/project), update visibility | 2 | 1 |
| **Uptime Monitors** | list, get, create, update, delete, checks, heartbeat | 3 | 4 |
| **Status Pages** | list, create | 1 | 1 |
| **Performance** | transaction groups, spans, trends, span groups, N+1 detection | 6 | 0 |
| **Logs** | query, get, stats, resources | 4 | 0 |
| **Users** | list, get, update, delete, emails, notification prefs | 5 | 4 |
| **Statistics** | time-series stats | 1 | 0 |
| **API Tokens** | list, create, delete | 1 | 2 |
| **Repositories** | list, register | 1 | 1 |

## Quick Start

### Prerequisites

- Node.js 18+
- A GlitchTip instance (self-hosted or [hosted](https://glitchtip.com))
- A GlitchTip API token ([create one here](https://app.glitchtip.com/settings/api-tokens))

### Installation

```bash
npm install -g glitchtip-mcp
```

Or run directly with npx:

```bash
npx glitchtip-mcp
```

### Configuration

Set two environment variables:

```bash
export GLITCHTIP_BASE_URL="https://your-glitchtip-instance.com"
export GLITCHTIP_API_TOKEN="your-api-token"
```

The token is user-scoped — it gives access to all organizations and projects your account can reach. No need to pre-select a project.

## Usage with Claude Desktop

Add this to your Claude Desktop configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "glitchtip": {
      "command": "npx",
      "args": ["-y", "glitchtip-mcp"],
      "env": {
        "GLITCHTIP_BASE_URL": "https://your-glitchtip-instance.com",
        "GLITCHTIP_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Usage with Claude Code

Add via the CLI:

```bash
claude mcp add glitchtip -e GLITCHTIP_BASE_URL=https://your-instance.com -e GLITCHTIP_API_TOKEN=your-token -- npx -y glitchtip-mcp
```

## Usage with VS Code

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "glitchtip": {
      "command": "npx",
      "args": ["-y", "glitchtip-mcp"],
      "env": {
        "GLITCHTIP_BASE_URL": "https://your-glitchtip-instance.com",
        "GLITCHTIP_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Usage with Cursor

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "glitchtip": {
      "command": "npx",
      "args": ["-y", "glitchtip-mcp"],
      "env": {
        "GLITCHTIP_BASE_URL": "https://your-glitchtip-instance.com",
        "GLITCHTIP_API_TOKEN": "your-api-token"
      }
    }
  }
}
```

## Example Prompts

Once connected, you can ask your AI assistant things like:

- **"List all unresolved issues in my project"**
- **"Show me the latest error event with full stack trace"**
- **"Resolve issue #42 and add a comment explaining the fix"**
- **"Create an alert that fires when more than 10 errors occur in 5 minutes"**
- **"Show me the uptime status of all my monitors"**
- **"What are the slowest transactions in production?"**
- **"Detect N+1 queries in my application"**
- **"Query error logs from the last hour"**
- **"Invite john@example.com as a member of the backend team"**
- **"Create a new project called 'mobile-app' in the default team"**
- **"List all DSN keys for my project"**
- **"Show me the performance trend for the /api/users endpoint"**

## Tool Reference

### Issue Management

| Tool | Description |
|---|---|
| `list_organization_issues` | Search and filter issues across an org |
| `list_project_issues` | List issues for a specific project |
| `get_issue` | Get full issue details |
| `update_issue` | Change status (resolved/unresolved/ignored), assign |
| `delete_issue` | Delete an issue |
| `bulk_update_issues` | Batch resolve/ignore multiple issues |
| `bulk_delete_issues` | Batch delete issues |
| `list_issue_tags` | View tags on an issue |
| `list_issue_hashes` | View grouping hashes |
| `list_issue_commits` | View related commits |
| `list_issue_user_reports` | View user feedback |
| `get_issues_stats` | Aggregated issue statistics |

### Events & Debugging

| Tool | Description |
|---|---|
| `list_issue_events` | List all occurrences of an issue |
| `get_latest_event` | Get the most recent event (stack trace, context) |
| `get_event` | Get a specific event by ID |
| `list_project_events` | List all events across a project |
| `get_project_event` | Get a project event by ID |
| `get_event_json` | Get the raw JSON payload (full debug data) |

### Uptime Monitoring

| Tool | Description |
|---|---|
| `list_monitors` | List all uptime monitors |
| `get_monitor` | Get monitor details and current status |
| `create_monitor` | Create HTTP/Ping/Heartbeat monitor |
| `update_monitor` | Change URL, interval, expected status |
| `delete_monitor` | Remove a monitor |
| `list_monitor_checks` | View check result history |
| `send_heartbeat` | Record a heartbeat ping |
| `list_status_pages` | List public status pages |
| `create_status_page` | Create a new status page |

### Performance

| Tool | Description |
|---|---|
| `list_transaction_groups` | Overview of all transactions |
| `get_transaction_group` | Transaction details |
| `list_transaction_spans` | Span breakdown for a transaction |
| `get_transaction_trend` | Performance trend over time |
| `list_span_groups` | Database queries, HTTP calls, etc. |
| `detect_n_plus_one` | Find N+1 query patterns |

### Logs

| Tool | Description |
|---|---|
| `query_logs` | Search logs with filters (level, service, time range) |
| `get_log` | Get a specific log entry |
| `get_log_stats` | Hourly log volume statistics |
| `list_log_resources` | Available services/hosts for filtering |

## Development

```bash
git clone https://github.com/adfdev/glitchtip-mcp.git
cd glitchtip-mcp
pnpm install
pnpm dev
```

## API Coverage

This server covers the complete GlitchTip API as documented at `/api/openapi.json`. If GlitchTip adds new endpoints, contributions are welcome.

The only endpoints intentionally excluded are:
- **Event ingestion** (`/api/{project_id}/store/`) — use the official SDKs for this
- **Stripe billing** — specific to the hosted GlitchTip.com service
- **Debug file uploads** — binary operations better suited for CLI tools
- **Data import** — one-time migration operations

## License

MIT

## Credits

Built with the [Model Context Protocol SDK](https://github.com/modelcontextprotocol/typescript-sdk).
