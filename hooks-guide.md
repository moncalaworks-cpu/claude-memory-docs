# Hooks: Automation Middleware for Claude Code

**Learning Notes from Official Documentation** | v1.0 | 2026-02-11

---

## What Are Hooks?

Hooks are **user-defined shell commands that execute at specific points in Claude Code's lifecycle**. They provide **deterministic control** over Claude's behavior—ensuring certain actions always happen rather than relying on the LLM to choose.

**Key Distinction**:
- Hooks = deterministic automation (always enforce rules)
- Skills = giving Claude additional instructions and choices
- Agents = autonomous subprocess instances
- MCPs = external data/tool integration

---

## Why Hooks Matter

Hooks solve **three core problems**:

1. **Enforce Project Rules**: Block risky operations (no edits to `.env`, `package-lock.json`)
2. **Automate Repetitive Tasks**: Auto-format code, run tests, send notifications
3. **Integrate with Tools**: Connect Claude Code to existing workflows, CI/CD, build systems

---

## Hook Lifecycle Events

Hooks fire at **11 lifecycle points**. Most important ones:

| Event | When | Use Case |
|-------|------|----------|
| `SessionStart` | Session begins or resumes | Inject context, remind of conventions |
| `UserPromptSubmit` | Before Claude processes input | Validate/modify user prompts |
| `PreToolUse` | **Before** tool executes (can block!) | Protect files, validate commands |
| `PostToolUse` | **After** tool succeeds | Format code, log operations |
| `PostToolUseFailure` | After tool fails | Error recovery, cleanup |
| `PermissionRequest` | Permission dialog appears | Auto-approve/deny based on rules |
| `Notification` | Claude needs attention | Send notifications to desktop |
| `PreCompact` | Before context compaction | Prepare for summarization |
| `SessionEnd` | Session terminates | Cleanup, archive logs |
| `SubagentStart/Stop` | Subagent lifecycle | Monitor autonomous work |
| `Stop` | Claude finishes responding | Verify all tasks complete |

---

## Three Types of Hooks

### 1. Command Hooks (Most Common)
**Type**: `"type": "command"`
**Runs**: Shell command on stdin/stdout/exit codes

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "npx prettier --write $(jq -r '.tool_input.file_path')"
          }
        ]
      }
    ]
  }
}
```

### 2. Prompt-Based Hooks (For Judgment)
**Type**: `"type": "prompt"`
**Runs**: Claude Haiku to make yes/no decision

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Are all requested tasks complete?"
          }
        ]
      }
    ]
  }
}
```

### 3. Agent-Based Hooks (For Complex Verification)
**Type**: `"type": "agent"`
**Runs**: Subagent with tool access for verification

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "agent",
            "prompt": "Verify tests pass. Run test suite and check results.",
            "timeout": 120
          }
        ]
      }
    ]
  }
}
```

---

## How Hooks Communicate

### Input (JSON on stdin)

Every hook receives event data as JSON:

```json
{
  "session_id": "abc123",
  "cwd": "/Users/sarah/myproject",
  "hook_event_name": "PreToolUse",
  "tool_name": "Bash",
  "tool_input": {
    "command": "npm test"
  }
}
```

### Output (Exit Code + stdout/stderr)

| Exit Code | Meaning | Output |
|-----------|---------|--------|
| `0` | ✅ Allow action | stdout added to Claude's context (if applicable) |
| `2` | ❌ Block action | stderr becomes Claude's feedback |
| Other | ✅ Allow action | stderr logged (verbose mode only) |

**Example: Block with feedback**
```bash
#!/bin/bash
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

if echo "$COMMAND" | grep -q "drop table"; then
  echo "Blocked: dropping tables not allowed" >&2
  exit 2
fi

exit 0
```

### Advanced: Structured JSON Output

Exit 0 with JSON object for more control:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "Use rg instead of grep"
  }
}
```

**Options for PreToolUse**:
- `"allow"` - proceed without prompt
- `"deny"` - cancel and send reason to Claude
- `"ask"` - show normal permission prompt

---

## Matchers: Filter When Hooks Fire

Matchers are **regex patterns** that narrow when a hook runs:

```json
{
  "matcher": "Edit|Write",  // Only after file edits
  "matcher": "Bash",         // Only Bash commands
  "matcher": "mcp__github__.*"  // Only GitHub MCP tools
}
```

### Matcher Field by Event

| Event | Matches On | Example |
|-------|-----------|---------|
| `PreToolUse`, `PostToolUse` | tool name | `"Bash"`, `"Edit\|Write"`, `"mcp__.*"` |
| `SessionStart` | how started | `"startup"`, `"resume"`, `"compact"` |
| `Notification` | notification type | `"permission_prompt"`, `"idle_prompt"` |
| `SubagentStart` | agent type | `"Bash"`, `"Explore"`, `"Plan"` |
| No matcher | Fires on every occurrence | Leave empty |

---

## Configuration Scope

Where you add hooks determines scope:

| Location | Scope | Shareable |
|----------|-------|-----------|
| `~/.claude/settings.json` | All projects | No (local only) |
| `.claude/settings.json` | This project | Yes (commit to repo) |
| `.claude/settings.local.json` | This project | No (gitignored) |
| Plugin `hooks/hooks.json` | When plugin enabled | Yes |
| Managed policies | Organization-wide | Yes (admin-controlled) |

---

## 4 Common Patterns (Ready to Use)

### Pattern 1: Desktop Notifications

**Event**: `Notification`
**Use**: Get alerted when Claude needs attention

**macOS**:
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "osascript -e 'display notification \"Claude Code needs your attention\" with title \"Claude Code\"'"
          }
        ]
      }
    ]
  }
}
```

**Linux**:
```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "notify-send 'Claude Code' 'Claude Code needs your attention'"
          }
        ]
      }
    ]
  }
}
```

### Pattern 2: Auto-Format After Edits

**Event**: `PostToolUse` (After `Edit` or `Write`)
**Use**: Keep code formatting consistent

Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "jq -r '.tool_input.file_path' | xargs npx prettier --write"
          }
        ]
      }
    ]
  }
}
```

**How it works**:
1. Fires after any `Edit` or `Write` tool
2. Uses `jq` to extract `file_path` from JSON
3. Passes to `prettier --write` for formatting

### Pattern 3: Block Protected Files

**Event**: `PreToolUse` (Before `Edit` or `Write`)
**Use**: Prevent accidental modifications to sensitive files

Create `.claude/hooks/protect-files.sh`:
```bash
#!/bin/bash
INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

PROTECTED_PATTERNS=(".env" "package-lock.json" ".git/")

for pattern in "${PROTECTED_PATTERNS[@]}"; do
  if [[ "$FILE_PATH" == *"$pattern"* ]]; then
    echo "Blocked: $FILE_PATH matches protected pattern '$pattern'" >&2
    exit 2
  fi
done

exit 0
```

Make executable:
```bash
chmod +x .claude/hooks/protect-files.sh
```

Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/protect-files.sh"
          }
        ]
      }
    ]
  }
}
```

### Pattern 4: Context Injection After Compaction

**Event**: `SessionStart` with `"compact"` matcher
**Use**: Re-inject critical context when conversation is summarized

Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "echo 'Reminder: use Bun, not npm. Run bun test before committing.'"
          }
        ]
      }
    ]
  }
}
```

The output is automatically added to Claude's context.

---

## Interactive Hook Setup

Use the `/hooks` slash command for interactive menu:

```
Type: /hooks
↓
Shows all available events
↓
Select event (e.g., "Notification")
↓
Select matcher pattern
↓
Add command
↓
Choose storage location (user or project)
↓
Test the hook
```

**Setup is immediate** - no restart needed. But if you edit settings files manually, reload with `/hooks` menu.

---

## Common Issues & Solutions

### Hook Not Firing
- ✅ Run `/hooks` and verify hook appears
- ✅ Check matcher is case-sensitive and exact
- ✅ Verify you're triggering the right event
- ✅ For `PermissionRequest` in headless mode, use `PreToolUse` instead

### Hook Error in Output
- ✅ Test script manually: `echo '{"tool_name":"Bash"...}' | ./hook.sh`
- ✅ Verify script is executable: `chmod +x ./hook.sh`
- ✅ Install jq if missing: `brew install jq`
- ✅ Use absolute paths or `$CLAUDE_PROJECT_DIR`

### `/hooks` Shows No Hooks
- ✅ Restart session or open `/hooks` to reload
- ✅ Check JSON syntax (no comments, no trailing commas)
- ✅ Verify file location: `.claude/settings.json` or `~/.claude/settings.json`

### Stop Hook Runs Forever
- ✅ Check `stop_hook_active` field in JSON input
- ✅ Exit early if already triggered to prevent infinite loop

### JSON Validation Failed
- ✅ Shell profile may echo unconditionally
- ✅ Wrap echo statements with: `if [[ $- == *i* ]]; then echo "..."; fi`

---

## Limitations to Know

1. **No direct tool/skill calls**: Can't trigger `/skills` or `/commands` from hooks
2. **Default timeout**: 10 minutes (configurable per hook)
3. **PostToolUse can't undo**: Action already happened
4. **Stop hook fires on every response**: Not just task completion (check `stop_hook_active` field)
5. **PermissionRequest unavailable in headless mode**: Use `PreToolUse` instead

---

## Key Concepts Summary

| Concept | Definition |
|---------|-----------|
| **Event** | Lifecycle point where hook fires (PreToolUse, PostToolUse, etc.) |
| **Matcher** | Regex pattern filtering when hook runs on that event |
| **Command Hook** | Runs shell command with stdin/stdout/exit codes |
| **Prompt Hook** | Uses Claude Haiku for yes/no decision |
| **Agent Hook** | Uses subagent with tools for complex verification |
| **Stdin** | Event data as JSON passed to hook script |
| **Exit Code** | Hook output: 0=allow, 2=block, other=allow but log |
| **Scope** | Where hook applies: user, project, or organization |

---

## Next Steps (Phase 1)

You now understand:
- ✅ What hooks are and why they matter
- ✅ All 11 lifecycle events
- ✅ 3 hook types (command, prompt, agent)
- ✅ Input/output communication (JSON, exit codes)
- ✅ Matchers for filtering
- ✅ 4 common patterns (notifications, formatting, protection, context)
- ✅ Configuration scopes
- ✅ Troubleshooting common issues

**Ready for**: Building `hooks-plugin` with 3 demonstrations

---

## Resources

- **Official Hooks Guide**: https://code.claude.com/docs/en/hooks-guide.md
- **Full Reference**: https://code.claude.com/docs/en/hooks (schemas, async hooks, MCP tool hooks)
- **Example Repository**: https://github.com/anthropics/claude-code/blob/main/examples/hooks/

---

## Revision History

- **v1.0** (2026-02-11): Complete learning notes from official documentation

