# Claude Plugin Template (Based on greet-plugin)

**Status**: Production-ready template | **Version**: 1.0 | **Established**: 2026-02-11

This document standardizes the plugin structure used in greet-plugin, ensuring consistency across all future plugins.

---

## Directory Structure

```
~/.claude/plugins/my-plugins/[PLUGIN-NAME]/
├── plugin.json                 # Plugin metadata (required)
├── README.md                   # User-facing documentation
├── CONTRIBUTING.md             # Contribution guidelines
├── DEPLOYMENT.md               # Setup and deployment instructions
├── DEPLOYMENT_CHECKLIST.md     # Verification checklist
├── LICENSE                     # MIT License
├── SOURCES_TRACKING.md         # Feature documentation (if applicable)
├── commands/
│   ├── [command-1].md         # Command definition (YAML frontmatter + instructions)
│   └── [command-2].md         # Can have multiple commands
├── agents/
│   ├── [agent-1].md           # Agent definition (YAML frontmatter + system prompt)
│   ├── [agent-2].md           # Multiple agents for modularity
│   └── [agent-3].md
├── hooks/                      # (Optional) If using hooks
│   ├── hooks.json             # Hook configuration
│   └── [hook-script].sh       # Hook shell scripts
└── .claude-plugin/
    └── plugin.json            # Alternate plugin manifest (auto-managed)
```

---

## Core Files

### 1. `plugin.json` (Required)

**Purpose**: Plugin metadata and identification

```json
{
  "name": "[plugin-name]",
  "description": "[One-line description of what the plugin does]",
  "author": {
    "name": "Claude Learning Project",
    "email": "learn@example.com"
  }
}
```

**Example** (greet-plugin):
```json
{
  "name": "greet-plugin",
  "description": "A simple greeting plugin to learn how plugins work",
  "author": {
    "name": "Claude Learning Project",
    "email": "learn@example.com"
  }
}
```

---

### 2. `commands/[command-name].md` (Required)

**Purpose**: Define slash commands available to users

**Format**: YAML frontmatter + Markdown instructions

```markdown
---
description: [One-line description of command]
argument-hint: [Example: <name>, <file-path>, etc.]
allowed-tools: [List of tools or [] for none]
---

# [Command Name]

[Description of what the command does]

## User Arguments

The user provided: $ARGUMENTS

## Workflow Overview

[Explain the high-level process]

## Instructions

### STEP 1: [First step]
[Detailed instructions]

### STEP 2: [Second step]
[Detailed instructions]

...

## Output Format

[Describe expected output format]

## Error Handling & Resilience

[How to handle failures, fallbacks, etc.]

## [Component Used - e.g., "Agents Used"]

- **agent-name**: Description
- **another-agent**: Description
```

**Key Features**:
- `$ARGUMENTS` variable for user input
- Numbered steps with clear instructions
- Error handling explicitly documented
- Lists agents/MCPs/tools used
- Handles edge cases and fallbacks

**Example** (greet-plugin):
- See: `/Users/kenshinzato/.claude/plugins/my-plugins/greet-plugin/commands/greet.md`
- 144 lines of detailed workflow, error handling, parallelization notes

---

### 3. `agents/[agent-name].md` (If using agents)

**Purpose**: Define autonomous subagents with specific roles

**Format**: YAML frontmatter + Markdown system prompt

```markdown
---
name: [agent-name]
description: [One-line description of agent's role]
model: haiku  # or sonnet for complex work
tools: [WebFetch, WebSearch, Bash, etc.]
---

# [Agent Name]

[2-3 sentence description of the agent's purpose]

## Your Capabilities

You can:
- [Capability 1]
- [Capability 2]
- [Capability 3]

## How You Work

When given [input type], you should:

1. **[Phase 1]**
   - [What to do]
   - [Why it matters]

2. **[Phase 2]**
   - [What to do]
   - [Why it matters]

3. **[Phase 3]**
   - [What to do]
   - [Why it matters]

## Example Analysis

**Input**: "[Example input]"

**Analysis**:
- [Key observation 1]
- [Key observation 2]
- [Observation]: "[Concluding insight]"

## Output Format

Return your analysis with explicit status:

**Status**: [SUCCESS or UNAVAILABLE]
**Insight**: [Your response or fallback]

Examples:

**SUCCESS case:**
**Status**: SUCCESS
**Insight**: "[Your insightful response]"

**UNAVAILABLE case:**
**Status**: UNAVAILABLE
**Insight**: "[Fallback message]"

## Your Goal

[Concise statement of what the agent should accomplish]
```

**Key Features**:
- YAML frontmatter with `name`, `description`, `model`, `tools`
- Clear role definition
- Explicit SUCCESS/UNAVAILABLE status in output
- Examples showing expected output format
- Capabilities and workflow clearly documented

**Example** (greet-plugin):
- `name-analyst.md`: Analyzes names and etymology
- `github-profile-analyst.md`: Fetches and analyzes GitHub profiles
- `combined-profile-analyst.md`: Synthesizes both data sources

---

### 4. Documentation Files

#### `README.md`
- Installation instructions
- Quick start guide
- Examples of usage
- Troubleshooting section
- Links to other docs

**Length**: 300-400 lines for production plugins

#### `CONTRIBUTING.md`
- Code standards
- How to extend the plugin
- Testing guidelines
- PR process

#### `DEPLOYMENT.md`
- Step-by-step setup instructions
- Configuration required
- Verification steps
- Troubleshooting

#### `DEPLOYMENT_CHECKLIST.md`
- Checkbox items for verification
- Pre-deployment checklist
- Post-deployment validation

#### `LICENSE`
- MIT License (standard for learning projects)

#### `SOURCES_TRACKING.md` (Optional, as needed)
- Documents special features
- Tracks data integration points
- Explains complex behaviors

---

## Implementation Patterns from greet-plugin

### Pattern 1: Multi-Agent Composition
**Use when**: Single command needs multiple specialized analyses

```
User Input
    ↓
Command receives: $ARGUMENTS
    ↓
Parallel Execution:
├─ Agent A: Analyzes aspect 1
├─ Agent B: Analyzes aspect 2
└─ Agent C: Analyzes aspect 3
    ↓
Synthesis Agent: Combines all outputs
    ↓
Final Output: Unified result
```

**Example**: greet-plugin invokes 3 agents in parallel:
1. GitHub profile analyst
2. Name analyst
3. Combined profile analyst (synthesizer)

### Pattern 2: Explicit Status Tracking
**Use when**: Graceful degradation needed

Each agent returns:
```
**Status**: SUCCESS or UNAVAILABLE
**Insight**: [The actual result or fallback]
```

This allows:
- Fallback handling when agents fail
- Source tracking (which data was available)
- Transparent error messages

### Pattern 3: Modular Error Handling
**Use when**: Multiple components can fail independently

Document explicit handling for:
```
If Component A fails:
- [What happens]
- [How to recover]

If Component B fails:
- [What happens]
- [How to recover]

If both fail:
- [Fallback behavior]
```

Example (greet-plugin):
```
If GitHub MCP fails:
- Continue with name analysis
- Update sources list
- No error shown to user

If name analysis fails:
- Use GitHub data only
- Update sources list

If both fail:
- Show basic greeting
- Indicate "fallback" source
```

### Pattern 4: User-Facing Workflow Documentation
**Use when**: Complex multi-step process

In the command file, show:
1. Step-by-step instructions
2. Visual workflow diagram (ASCII art)
3. Parallelization benefits (if applicable)
4. MCP integrations used

---

## File Checklist for New Plugin

When creating a new plugin, include:

**Essential**:
- ✅ `plugin.json` with name, description, author
- ✅ `commands/[command].md` with YAML frontmatter and instructions
- ✅ `README.md` (300+ lines)
- ✅ `LICENSE` (MIT)

**Recommended**:
- ✅ `CONTRIBUTING.md` with standards
- ✅ `DEPLOYMENT.md` with setup steps
- ✅ `agents/[agent].md` if using agents
- ✅ `hooks/hooks.json` if using hooks

**Optional but Valuable**:
- ✅ `DEPLOYMENT_CHECKLIST.md` for verification
- ✅ `SOURCES_TRACKING.md` for complex features
- ✅ `.gitignore` and `.git/` for version control

---

## Plugin Metadata Standards

### Name Convention
- Kebab-case: `my-plugin-name`
- Lowercase letters and hyphens only
- Suffix with `-plugin` for clarity

### Description
- One-line summary
- What it does, not how
- Example: "Sends personalized greetings with GitHub insights"

### Author
```json
{
  "name": "Claude Learning Project",
  "email": "learn@example.com"
}
```

---

## Plugin Structure Best Practices

### 1. **Modularity**
- Each command file is self-contained
- Each agent has a single, clear responsibility
- Workflows show how pieces connect

### 2. **Documentation**
- Frontmatter provides quick overview
- Body provides detailed instructions
- Examples show expected inputs/outputs
- Error cases explicitly documented

### 3. **User Experience**
- Clear argument hints (`argument-hint: <input>`)
- Explicit status returns (SUCCESS/UNAVAILABLE)
- Graceful fallbacks (no silent failures)
- Readable output formatting

### 4. **Maintainability**
- Commands reference agents by name
- Agents don't depend on each other
- Tools listed in YAML frontmatter
- Model selection in YAML (haiku vs sonnet)

### 5. **Extensibility**
- New commands can reuse existing agents
- New agents can be invoked by commands
- Hooks can extend without modifying commands
- Clear extension points documented

---

## MCP Integration Pattern

If using MCPs (like GitHub):

**In command file**:
```markdown
## MCP Integration

This workflow uses:
- **GitHub MCP**: [description]
- **Other MCP**: [description]
```

**In agent file**:
```markdown
---
tools: [WebFetch, WebSearch, mcp__github__search_repositories]
---
```

**In error handling**:
```
If MCP fails:
- [Graceful degradation]
- [What user sees]
- [How to recover]
```

---

## Testing Plugin Locally

Before deployment:

1. **Verify structure**
   ```bash
   ls -la ~/.claude/plugins/my-plugins/[plugin-name]/
   ```

2. **Check JSON syntax**
   ```bash
   jq . ~/.claude/plugins/my-plugins/[plugin-name]/plugin.json
   ```

3. **Enable plugin** in `~/.claude/settings.json`:
   ```json
   {
     "enabledPlugins": {
       "[plugin-name]": true
     }
   }
   ```

4. **Restart Claude Code**

5. **Test command**
   ```
   /[command-name] test-argument
   ```

---

## Next Steps: Applying to hooks-plugin

When building `hooks-plugin`, follow this template:

```
hooks-plugin/
├── plugin.json
├── README.md (document hook examples)
├── CONTRIBUTING.md
├── DEPLOYMENT.md
├── LICENSE
├── commands/
│   ├── hook-demo-1.md  (Auto-format hook)
│   ├── hook-demo-2.md  (Context injection hook)
│   └── hook-demo-3.md  (Protective block hook)
├── hooks/
│   ├── hooks.json
│   ├── format-files.sh
│   └── protect-files.sh
└── .claude-plugin/
    └── plugin.json
```

---

## Revision History

- **v1.0** (2026-02-11): Established based on greet-plugin structure

