# Understanding Claude Code Agents

## What Are Agents?

Agents are autonomous subprocess instances that:
- Run independently with their own context
- Have specialized roles and capabilities
- Execute complex multi-step tasks
- Can operate in parallel
- Report results back to main conversation

**Key difference from Skills:**
- **Skills**: Direct, focused operations (user invokes `/commit`)
- **Agents**: Autonomous, complex problem-solving (launched by Claude or user)

## Agent Types

### 1. **general-purpose** Agent
- Best for: Research, flexible reasoning, complex analysis
- Tools: All available tools
- Use case: "Analyze this codebase for patterns"

### 2. **Bash** Agent
- Best for: Terminal operations, git commands, CI/CD
- Tools: Bash command execution
- Use case: "Run tests and report results"

### 3. **Explore** Agent
- Best for: Fast pattern matching, codebase navigation
- Tools: File discovery, grep, glob
- Optimized for: Quick searches across large codebases
- Use case: "Find all React components matching pattern"

### 4. **Plan** Agent
- Best for: Architecture design, implementation strategy
- Tools: File reading, exploration, analysis
- Use case: "Design a JWT auth implementation"

## How Agents Work

### 1. Invocation
Launched via Task tool:
```python
Task(
  subagent_type="Explore",
  description: "Search for API endpoints",
  prompt: "Find all files containing @app.route decorators"
)
```

### 2. Execution
- Agent runs independently
- Maintains its own context
- Can use assigned tools
- Operates isolated from main conversation

### 3. Reporting
- Agent completes task
- Returns results to main conversation
- Main thread can use results for next steps

### 4. Resumption
Agents can be resumed later:
```python
Task(
  resume: "agent-id-from-previous-run",
  prompt: "Continue searching for X"
)
```

## Agent vs. Direct Approach

### When to Use Agents
✅ Complex multi-step tasks (3+ steps)
✅ Parallel independent operations
✅ Tasks that would clutter main context
✅ Specialized analysis (Explore, Plan)
✅ Long-running operations
✅ When you want isolation from main conversation

### When NOT to Use Agents
❌ Simple single-step operations
❌ Results needed immediately for follow-up
❌ Task is straightforward enough for main thread
❌ Need real-time interaction with user

## Real-World Agent Workflows

### Workflow 1: Parallel Code Reviews
```
Main thread:
1. Launch 4 review agents in parallel (CLAUDE.md, bugs, history, comments)
2. Each agent independently analyzes different aspect
3. Results aggregated
4. Confidence scoring applied
5. Final report generated
```

### Workflow 2: Codebase Exploration
```
Main thread:
1. Launch Explore agent to search codebase
2. Agent finds matching files/patterns
3. Returns list of candidates
4. Main thread analyzes results
5. Launches specialized agents on relevant files
```

### Workflow 3: Implementation Planning
```
User: "Help me implement authentication"
1. Launch Plan agent to design architecture
2. Agent produces implementation plan
3. Main thread presents plan to user
4. User approves/modifies
5. Launch Bash agent to generate scaffolding
```

## Agent Tool Access

Agents have restricted tool sets based on type:

**general-purpose:**
- Read, Edit, Write, Glob, Grep, Bash, WebFetch, WebSearch
- All tools available

**Explore:**
- Glob, Grep, Read (optimized for fast searches)
- Fast for large codebases

**Bash:**
- Bash only
- For terminal/system operations

**Plan:**
- Read, Glob, Grep, WebFetch
- For architecture analysis

## Agent Capabilities

### Context Preservation
- Each agent maintains conversation context
- Can reference previous turns
- Can be resumed with full history

### Parallelization
- Multiple agents launch simultaneously
- No blocking - run in parallel
- Results consolidated in main thread

### Specialization
- Different types for different tasks
- Optimized tool sets per type
- Faster execution for specialized tasks

### Error Handling
- Agents handle their own errors
- Can retry/continue operations
- Report failures to main thread

## Key Insights About Agents

1. **Composable**: Chain multiple agents for complex workflows
2. **Autonomous**: Run independently without user intervention
3. **Specialized**: Different types for different problem domains
4. **Efficient**: Parallel execution saves time
5. **Isolated**: Don't clutter main conversation context
6. **Resumable**: Can continue from previous state

## Practical Example: /code-review Plugin

The code-review plugin demonstrates agents perfectly:

```
1. Launch Haiku agent → Check PR eligibility
2. Launch Haiku agent → Find CLAUDE.md files
3. Launch Haiku agent → Summarize PR changes
4. Launch 4 parallel Sonnet agents:
   - Agent A: CLAUDE.md compliance check
   - Agent B: Bug detection
   - Agent C: Git history analysis
   - Agent D: Code comment analysis
5. Launch parallel Haiku agents → Confidence scoring
6. Filter issues by confidence
7. Post final review comment
```

This showcases:
- ✅ Parallel execution (4 agents simultaneously)
- ✅ Specialized roles (compliance, bugs, history)
- ✅ Sequential + parallel combination
- ✅ Result aggregation and filtering
