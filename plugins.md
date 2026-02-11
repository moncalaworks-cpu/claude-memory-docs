# Understanding Claude Code Plugins

## What Are Plugins?

Plugins are packaged collections of Claude Code extensions that include:
- **Slash Commands** (e.g., `/commit`, `/code-review`)
- **Agents** (specialized autonomous task executors)
- **Skills** (domain-specific expertise)
- **MCP Servers** (external service integrations)

## Plugin Structure

Each plugin follows this standard directory structure:
```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Metadata (name, description, author)
├── .mcp.json                # MCP server configuration (optional)
├── commands/                # Slash commands (optional)
├── agents/                  # Agent definitions (optional)
├── skills/                  # Skill definitions (optional)
├── README.md                # Documentation
```

## Available Plugins in Official Marketplace

### Workflow Plugins
- **commit-commands** - Git workflow: `/commit`, `/commit-push-pr`, `/clean_gone`
- **code-review** - Automated PR review with parallel agents
- **pr-review-toolkit** - 6 specialized code review agents

### Development Plugins
- **agent-sdk-dev** - Tools for building custom agents
- **plugin-dev** - Framework for building new plugins
- **feature-dev** - Feature development workflow

### Code Quality Plugins
- **code-simplifier** - Simplify and refactor code
- **security-guidance** - Security-focused code analysis
- **typescript-lsp** - TypeScript language server
- **pyright-lsp** - Python language server (Pyright)
- **rust-analyzer-lsp** - Rust language server

### Setup & Configuration
- **claude-code-setup** - Initial Claude Code setup
- **claude-md-management** - Manage CLAUDE.md files
- **hookify** - Configure Claude Code hooks

### Style & Output Plugins
- **explanatory-output-style** - Detailed output format
- **learning-output-style** - Educational output format

### Specialized Plugins
- **frontend-design** - Frontend design workflows
- **ralph-loop** - Specialized loop implementation
- **playground** - Experimentation environment

## How Plugins Work

### 1. Plugin Discovery
```bash
# View installed plugins
ls ~/.claude/plugins/marketplaces/claude-plugins-official/plugins/

# Each plugin is a directory with plugin.json
```

### 2. Plugin Installation
Add to `~/.claude/settings.json`:
```json
{
  "enabledPlugins": {
    "plugin-name@marketplace-id": true
  }
}
```

### 3. Plugin Activation
- Restart Claude Code after enabling
- Commands become available as slash commands
- Agents can be invoked via Task tool
- MCPs connect to external services

## Plugin Types & What They Do

### Command Plugins
Execute specific workflows when invoked
- Example: `/commit` analyzes changes and creates commits
- Single-purpose or multi-purpose
- Direct interaction with user

### Agent Plugins
Define specialized autonomous agents
- Example: code-review plugin has 4 parallel review agents
- Can run independently or as part of workflow
- Handle complex multi-step processes

### MCP Plugins
Connect Claude to external systems
- Databases, APIs, file systems
- Enable data exchange with external services
- Configuration via .mcp.json

### Skill Plugins
Provide domain-specific expertise
- Similar to commands but more specialized
- Often invoked as slash commands
- Focus on specific domain knowledge

## Real-World Plugin Workflows

### Workflow 1: Quick Commit
```
1. Make code changes
2. Run /commit (from commit-commands plugin)
3. Plugin analyzes changes
4. Generates commit message
5. Creates commit
```

### Workflow 2: Comprehensive Code Review
```
1. Create/update PR
2. Run /code-review (from code-review plugin)
3. Plugin launches 4 parallel review agents
4. Each agent audits from different perspective
5. High-confidence issues posted as comments
```

### Workflow 3: Multi-Agent Review
```
1. PR ready for detailed review
2. Invoke pr-review-toolkit agents
3. 6 specialized agents review different aspects:
   - Comment accuracy
   - Test coverage
   - Error handling
   - Type design
   - Code quality
   - Simplification opportunities
4. Comprehensive feedback generated
```

## Plugin Ecosystem Features

### Trust & Security
- Official plugins from Anthropic (in /plugins)
- Third-party plugins (in /external_plugins)
- Must trust plugins before installing
- Review plugin source before use

### Marketplace System
- Official: `claude-plugins-official` marketplace
- Can add custom marketplaces to settings
- Plugin versioning and updates supported
- Install via settings or discovery UI

### Configuration
Each plugin can have user-configurable settings:
```json
{
  "pluginConfigs": {
    "plugin-name@marketplace": {
      "mcpServers": {
        "server-name": {
          "setting-key": "value"
        }
      }
    }
  }
}
```

## Creating Your Own Plugins

### Basic Steps

1. Create plugin directory structure
2. Add `plugin.json` metadata
3. Create commands, agents, or MCPs
4. Document with README.md
5. Enable in settings
6. Test and iterate

### Plugin Directory Structure

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json           # Required: Plugin metadata
├── commands/                 # Optional: Slash commands
│   └── my-command.md
├── agents/                   # Optional: Agent definitions
│   └── my-agent.md
├── skills/                   # Optional: Skill definitions
│   └── my-skill/
│       └── SKILL.md
├── .mcp.json                 # Optional: MCP server config
└── README.md                 # Recommended: Documentation
```

### 1. Create plugin.json

Required file in `.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "description": "Brief description of what your plugin does",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  }
}
```

### 2. Create Slash Commands

Commands are markdown files in `commands/` directory.

**File:** `commands/my-command.md`

```yaml
---
description: Short description for /help
argument-hint: <required-arg> [optional-arg]
allowed-tools: [Read, Glob, Grep, Bash]
---

# My Command

Describe what this command does.

## What it does

1. First step
2. Second step

## Usage

The user invoked with: $ARGUMENTS

(Your prompt instructions here)
```

**Frontmatter Options:**
- `description`: Shown in `/help`
- `argument-hint`: Hints for arguments
- `allowed-tools`: Pre-approved tools (reduces permission prompts)
- `model`: Override model (haiku, sonnet, opus)
- `allowed-tools`: Pre-approved tools for command

### 3. Create Marketplace Metadata

Custom plugins need a `marketplace.json` to be discovered. Create in `.claude-plugin/marketplace.json`:

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "local-plugins",
  "description": "My local plugins",
  "owner": { "name": "Your Name", "email": "you@example.com" },
  "plugins": [
    {
      "name": "my-plugin",
      "description": "Your plugin description",
      "version": "1.0.0",
      "author": { "name": "Your Name", "email": "you@example.com" },
      "source": "./my-plugin"
    }
  ]
}
```

**Key fields:**
- `$schema`: Reference to marketplace schema
- `name`: Marketplace name (appears in @marketplace-name)
- `source`: Path to plugin (not `path`)
- `version`: Plugin version
- `owner`: Marketplace owner

### 4. Register Custom Marketplace

Add to `~/.claude/settings.json`:

```json
{
  "enabledPlugins": {
    "my-plugin@local-plugins": true
  },
  "extraKnownMarketplaces": {
    "local-plugins": {
      "source": {
        "source": "directory",
        "path": "/Users/kenshinzato/.claude/plugins/my-plugins"
      }
    }
  }
}
```

### 5. Restart Claude Code

Changes to settings require Claude Code restart to take effect.

### 4. Test Your Plugin

After enabling and restarting Claude Code:
```bash
/my-command my-argument
```

### Example: Create a Simple `/greet` Plugin

**Step 1:** Create directory structure
```bash
mkdir -p ~/.claude/plugins/my-plugins/greet-plugin/.claude-plugin
mkdir -p ~/.claude/plugins/my-plugins/greet-plugin/commands
```

**Step 2:** Create `.claude-plugin/plugin.json`
```json
{
  "name": "greet-plugin",
  "description": "Simple greeting plugin",
  "author": {
    "name": "Your Name",
    "email": "you@example.com"
  }
}
```

**Step 3:** Create `commands/greet.md`
```yaml
---
description: Send a personalized greeting
argument-hint: <name>
---

# Greet Command

Creates a personalized greeting message.

## Arguments

The user provided: $ARGUMENTS

## Instructions

1. Extract the person's name from arguments
2. Create a warm, personalized greeting
3. Add a relevant emoji or fun fact
```

**Step 4:** Enable in settings
```json
{
  "enabledPlugins": {
    "greet-plugin": true
  }
}
```

(Note: If stored in custom directory, use full path in settings)

### Advanced Plugin Features

#### Add Agents

Create `agents/my-agent.md`:
```yaml
---
name: my-agent
description: Triggered when analyzing code
model: sonnet
tools: [Read, Grep, Bash]
---

You are an expert code analyzer...
```

#### Add Skills

Create `skills/my-skill/SKILL.md`:
```yaml
---
name: my-skill
description: When user needs to refactor code
version: 1.0.0
---

You specialize in code refactoring...
```

#### Add MCP Integration

Create `.mcp.json`:
```json
{
  "my-database": {
    "type": "http",
    "url": "https://api.example.com/mcp"
  }
}
```

### Plugin Development Tips

1. **Start simple**: Begin with one command
2. **Test locally**: Enable and test before sharing
3. **Document well**: Clear README helps users
4. **Use tool restrictions**: Specify `allowed-tools` for safety
5. **Handle errors**: Provide helpful error messages
6. **Iterate**: Test with real workflows

## Key Insights About Plugins

1. **Composable**: Multiple plugins can work together
2. **Extensible**: Add new functionality without core changes
3. **Marketplace-based**: Discover and share easily
4. **Structured**: Standardized format enables compatibility
5. **Configurable**: User settings control behavior
6. **Community-driven**: Open to third-party contributions
