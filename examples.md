# Claude Features Examples

This file contains practical examples of how to use Claude features effectively.

## Skills Usage Examples

### The `/commit` Skill (commit-commands plugin)
**Setup:** Enable in `~/.claude/settings.json`:
```json
{
  "enabledPlugins": {
    "commit-commands@claude-plugins-official": true
  }
}
```

**Usage:**
```
/commit
→ Analyzes staged & unstaged changes
→ Reviews recent commit messages for style matching
→ Drafts appropriate commit message
→ Stages relevant files
→ Creates commit with proper attribution
```

**Features:**
- Matches your repo's commit style
- Avoids committing files with secrets (.env, credentials.json)
- Includes Claude Code attribution
- Follows conventional commit practices

### Bonus Commands in commit-commands Plugin
- `/commit-push-pr` - Full workflow: commit → push → create PR
- `/clean_gone` - Clean up deleted remote branches

### When to Use Skills vs General Instructions
- **Use Skill**: Need focused expertise (commit generation, PR review, PDF analysis)
- **Use General**: Need flexible reasoning or multi-step problem solving

## Agent Usage Examples

### Successfully Demonstrated Agent Types

#### 1. Explore Agent (Fast Search)
```
Launched: Task(subagent_type="Explore", ...)
Result: Found all .json files in plugin directory
Speed: ⚡ Fast - optimized for file searches
Tools: Glob, Grep, Read
```

#### 2. general-purpose Agent (Flexible Reasoning)
```
Launched: Task(subagent_type="general-purpose", ...)
Result: Analyzed entire project structure & documentation
Speed: 🔶 Slower but flexible
Tools: All available
```

#### 3. Bash Agent (Terminal Operations)
```
Launched: Task(subagent_type="Bash", ...)
Result: Executed commands and showed settings
Speed: ⚡ Fast for system ops
Tools: Bash only
```

### Parallel Agent Execution
```
Two agents launched simultaneously:
Task 1 (Explore): Search for config files
Task 2 (Bash): Check current settings

Both ran in parallel:
├─ Explore agent → Found plugin.json, marketplace.json
└─ Bash agent → Showed current enabled plugins

Results returned together to main conversation
```

### Creating Agents in Plugins
**File location:** `agents/agent-name.md`

```yaml
---
name: agent-name
description: What this agent does
model: haiku
tools: [WebFetch, WebSearch]
---

Your agent instructions here...
```

**Example: name-analyst agent**
- Analyzes names and etymology
- Uses WebFetch/WebSearch for research
- Generates insights for greetings
- Part of greet-plugin

## Context Leveraging Examples

### Using Auto-Memory
```
Session 1: Learn about skills, update memory files
Session 2: Claude automatically reads MEMORY.md
→ No need to re-explain previous learnings
→ Can reference "as we discussed in memory" patterns
```

### File Context
```
Read a key architecture file
→ Claude maintains awareness of contents
→ Can reference specific lines/patterns throughout session
→ Enables more efficient exploration
```

### Project Context Building
```
Explore codebase structure with Explore agent
→ Understand patterns and conventions
→ Reference architecture in subsequent work
→ Build mental model of project
```

## MCP Integration Examples

### Connecting to External Services
```
MCP setup:
- Define connection parameters
- Claude connects via protocol
- Access external data/APIs seamlessly
```

## Custom Plugin Example: /greet (Command + Agent Integration)

**Successfully created, integrated with agent, and tested!**

### Architecture
```
greet-plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/
│   └── greet.md          ← Orchestrates workflow
├── agents/
│   └── name-analyst.md   ← Researches names autonomously
└── README.md
```

### Workflow
```
User: /greet Luna
    ↓
greet.md command executes
    ↓
Launches name-analyst agent
    ↓
Agent researches: origin, meaning, facts
    ↓
Returns: "Luna means moon, symbolizes wisdom..."
    ↓
Command formats: Final greeting
    ↓
Output: "Hello Luna! Your name carries wisdom and intuition..."
```

### Result
```
/greet Luna
→ Agent researches autonomously
→ Personalized greeting with research-backed insights
→ Professional, warm, informative
```

### Key Learning: Command + Agent Pattern
**Most powerful pattern in plugins:**
- Command handles user interaction & orchestration
- Agent handles autonomous research/analysis
- Command formats results for presentation
- Separates concerns beautifully
- Enables complex workflows from simple commands

## MCP Integration Example: GitHub Integration

**Architecture:**
```
greet-plugin/
├── .mcp.json (GitHub API config)
├── commands/greet.md (orchestrator)
└── agents/
    ├── name-analyst.md
    └── github-profile-analyst.md (uses GitHub MCP)
```

**Workflow:**
```
/greet torvalds
    ↓
Detect: GitHub username
    ↓
Launch: github-profile-analyst
    ↓
Agent uses: GitHub MCP
    ↓
Fetches: https://api.github.com/users/torvalds
    ↓
Gets: Real profile data (followers: 284k, company, bio)
    ↓
Analyzes: Community impact, contributions
    ↓
Returns: "Your work has shaped the entire tech industry..."
    ↓
Greeting: "Hello torvalds! [GitHub insight]. I'm excited..."
```

**Result:**
- Real data from GitHub API
- Personalized to actual GitHub presence
- Tested and working with Linus Torvalds profile

### Key Learning: MCP Integration
**How MCPs extend plugin capabilities:**
- `.mcp.json` defines external service connections
- Agents use MCPs to fetch real data
- Commands orchestrate agent + MCP workflows
- Enables data-driven personalization
- Scales to any HTTP API

## Best Practices Discovered
- **Marketplace.json format**: Must use `"source"` field, not `"path"`
- **Custom plugins**: Need to be registered as marketplaces in settings
- **Restart required**: Always restart Claude Code after changing settings
- **Plugin discovery**: Use `/plugin` command to verify plugin is recognized
