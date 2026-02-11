# Understanding MCPs (Model Context Protocol)

## What Are MCPs?

**MCPs** are the mechanism for **connecting Claude to external services**:
- Databases, APIs, file systems
- Real-time data sources
- External tools and services
- Custom integrations

**Key difference:**
- **Skills/Commands**: Direct user-facing workflows
- **Plugins**: Package of extensions (commands, agents, MCPs)
- **MCPs**: External service connections within plugins

## The MCP Ecosystem

```
Claude Code
    ↓
Plugin with MCP configuration
    ↓
MCP Server (local or remote)
    ↓
External Service (Database, API, GitHub, Slack, etc.)
```

## MCP Architecture

### Server Types

#### 1. **Stdio MCP**
- Local subprocess
- Communicates via stdin/stdout
- Best for: Local services, scripts
- Example: Local database client

#### 2. **HTTP/SSE MCP**
- Remote HTTP server
- Real-time updates via Server-Sent Events
- Best for: Cloud services, APIs
- Example: GitHub API, Slack API

#### 3. **Custom MCP**
- Build your own server
- Full protocol implementation
- Best for: Specialized services

## Real-World MCP Examples

### Example 1: GitHub MCP
```json
{
  "github": {
    "type": "http",
    "url": "https://api.github.com"
  }
}
```
Enables:
- List repositories
- Create issues
- Comment on PRs
- Manage projects

### Example 2: Database MCP
```json
{
  "postgres": {
    "type": "stdio",
    "command": "node",
    "args": ["pg-mcp-server.js"]
  }
}
```
Enables:
- Query databases
- Insert/update records
- Run migrations

### Example 3: Slack MCP
```json
{
  "slack": {
    "type": "http",
    "url": "https://slack.com/api"
  }
}
```
Enables:
- Send messages
- List channels
- Manage workflows

## How MCPs Work in Plugins

### Configuration File: `.mcp.json`

Located in plugin root directory:

```json
{
  "server-name": {
    "type": "stdio|http",
    "command": "command-to-run",
    "args": ["arg1", "arg2"],
    "url": "https://api.example.com",
    "env": {
      "API_KEY": "your-key"
    }
  }
}
```

### Enabling MCPs in Settings

In `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "my-plugin@marketplace": true
  },
  "pluginConfigs": {
    "my-plugin@marketplace": {
      "mcpServers": {
        "my-database": {
          "connection_string": "postgres://...",
          "api_key": "your-key"
        }
      }
    }
  }
}
```

## MCP Data Flow

### 1. Agent Makes Request
```
Agent: "Get all open GitHub issues"
```

### 2. Claude Routes to MCP
```
→ Routes through plugin's MCP configuration
→ Connects to GitHub MCP server
```

### 3. MCP Server Executes
```
MCP Server:
1. Validates request
2. Connects to external service
3. Executes operation
4. Returns results
```

### 4. Results Back to Claude
```
Claude receives: [List of open issues]
Agent processes results
```

## Practical MCP Patterns

### Pattern 1: Query External Data
```
Command/Agent:
"Search GitHub for open issues with label 'bug'"
    ↓
MCP: Connects to GitHub API
    ↓
Returns: List of issues
    ↓
Command formats for user
```

### Pattern 2: Modify External Systems
```
Agent Decision: "This needs attention on Slack"
    ↓
MCP: Sends Slack message
    ↓
Updates external system
    ↓
Confirms action
```

### Pattern 3: Real-Time Integration
```
Event happens in external system
    ↓
MCP notifies Claude
    ↓
Agent responds autonomously
    ↓
Action triggered
```

## MCP Security

### Best Practices
1. **Credentials in settings** - Never hardcode API keys
2. **Environment variables** - Use for sensitive data
3. **Scope limitation** - Request only needed permissions
4. **Token rotation** - Regularly update credentials
5. **Audit logging** - Track what the MCP does

### Configuration Protection
```json
{
  "my-database": {
    "env": {
      "DB_PASSWORD": "${DB_PASSWORD}"  // Use env var
    }
  }
}
```

## Common MCPs You Might Use

### Development
- **GitHub MCP**: Repository operations, issues, PRs
- **GitLab MCP**: Alternative to GitHub
- **Jira MCP**: Issue tracking and project management

### Communication
- **Slack MCP**: Messaging and workflows
- **Gmail MCP**: Email operations
- **Discord MCP**: Chat platform integration

### Data & Storage
- **PostgreSQL MCP**: Relational database
- **MongoDB MCP**: NoSQL database
- **S3 MCP**: File storage

### Productivity
- **Google Sheets MCP**: Spreadsheet operations
- **Notion MCP**: Note-taking and databases
- **Linear MCP**: Issue tracking

## Creating a Custom MCP

### Basic Structure

1. **Create MCP Server**
```javascript
// my-mcp-server.js
const http = require('http');

server.on('request', (req, res) => {
  // Handle requests from Claude
  // Return results in JSON format
});
```

2. **Configure in Plugin**
```json
{
  "my-server": {
    "type": "stdio",
    "command": "node",
    "args": ["my-mcp-server.js"]
  }
}
```

3. **Use in Agent/Command**
```
Agent calls: get_data("some-query")
  ↓
MCP server processes
  ↓
Results returned to agent
```

## MCP vs. Direct API Calls

### Using MCP
✅ Standardized protocol
✅ Credential management
✅ Error handling built-in
✅ Real-time capabilities
✅ Plugin marketplace integration

### Direct API (via WebFetch)
✅ No setup required
✅ Simple for one-off requests
❌ Harder to manage credentials
❌ No real-time support

## Key Insights About MCPs

1. **Extensibility**: Connect Claude to any external system
2. **Security**: Centralized credential management
3. **Standardization**: Common protocol for all integrations
4. **Scalability**: From local scripts to cloud APIs
5. **Flexibility**: Stdio, HTTP, or custom servers
6. **Integration**: Works seamlessly with plugins, skills, agents

## MCP Workflow Example

```
User command: /github-summary
    ↓
Plugin command executes
    ↓
Launches agent: "summarize recent GitHub activity"
    ↓
Agent needs data: "Get open issues from repo X"
    ↓
MCP: GitHub server
    ↓
GitHub API returns: Issues data
    ↓
Agent processes and summarizes
    ↓
Command formats output
    ↓
User sees: "You have 5 open issues, 2 PRs pending"
```

## Getting Started with MCPs

### Step 1: Understand Your Service
- What API/service do you want to connect?
- What operations do you need?
- What credentials are required?

### Step 2: Choose Server Type
- **Stdio**: For local services/scripts
- **HTTP**: For cloud APIs
- **Custom**: For specialized needs

### Step 3: Configure in Plugin
- Create `.mcp.json` file
- Define server configuration
- Add credentials to plugin settings

### Step 4: Use in Commands/Agents
- Reference MCP server in agent/command
- Execute operations
- Process results

### Step 5: Test and Iterate
- Verify connection works
- Test operations
- Handle errors gracefully
