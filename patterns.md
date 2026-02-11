# Patterns & Best Practices

Architectural patterns and best practices discovered while learning Claude features.

## Context Management Patterns

### When to Use Agents vs Direct Tool Calls
**Use Agents when:**
- Task requires 3+ independent sub-tasks (parallelization benefit)
- Task is complex and would clutter main conversation context
- Need specialized agent type (Explore for codebase search, Plan for architecture)
- Want to run task in background while continuing other work

**Use Direct Tools when:**
- Simple, single-step operations (reading files, editing)
- Results needed immediately for follow-up work
- Task is straightforward enough for main conversation

### Context Window Optimization
- System automatically compresses prior messages as needed
- Don't worry about context limits—they're managed automatically
- Use auto-memory for information that needs to persist across sessions
- Keep MEMORY.md under 200 lines (auto-loaded limit)

## Skill Development Patterns

### Recognizing When to Create Custom Skills
- Task appears frequently across projects
- Domain-specific logic that's reusable
- Benefits from being invoked via slash command
- Can operate independently of main conversation

### Skill Integration Patterns
- Skills provide specialized expertise
- Best for focused, well-defined tasks
- Reduces cognitive load vs general instructions
- Enables composable workflows

## Agent Orchestration Patterns

### Multi-Agent Workflows
1. Launch multiple agents in parallel for independent tasks
2. Agents operate autonomously with their own context
3. Results consolidated back to main conversation
4. Can reference agent outputs for subsequent work

### Agent Type Selection
- **Explore**: Fast pattern matching, codebase navigation
- **Bash**: Terminal operations, git commands, CI/CD
- **Plan**: Architecture design, implementation strategy
- **general-purpose**: Research, code search, multi-step reasoning

## Memory Patterns

### What to Save in Auto-Memory
- Stable patterns confirmed across multiple interactions
- Key architectural decisions and file locations
- User preferences for workflow and tools
- Solutions to recurring problems

### What NOT to Save
- Session-specific context (current task, temporary state)
- Incomplete information (verify against docs first)
- Information that duplicates existing CLAUDE.md
- Unverified conclusions

## Project Context Patterns

### Building Effective Project Understanding
1. Start with CLAUDE.md for high-level structure
2. Use Explore agent for pattern discovery
3. Read key architecture files to understand data flow
4. Build mental model of component interactions
5. Save learnings in auto-memory for future sessions

## Debugging Patterns
(To be updated as issues are encountered and solved)

## Performance Patterns
(To be updated with optimization techniques discovered)
