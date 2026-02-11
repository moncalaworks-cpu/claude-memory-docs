# Understanding Workflows in Claude Code

## What Are Workflows?

**Workflows** are coordinated sequences of operations that combine:
- **Commands** (user-invoked entry points)
- **Agents** (autonomous task executors)
- **MCPs** (external service connections)
- **Skills** (specialized capabilities)

**The Power**: Individual components work together to solve complex problems that no single component could handle alone.

## Workflow Architecture

### Simple Workflow
```
User Command
    ↓
Single Agent
    ↓
Result
```

### Medium Workflow
```
User Command
    ↓
Agent A → MCP → External Service
    ↓
Format Result
    ↓
User Output
```

### Complex Workflow
```
User Command
    ↓
Detect Input Type
    ↓
Branch Logic
├─ Route A: Agent + MCP₁ + MCP₂
├─ Route B: Agent + MCP₃ + Analysis
└─ Route C: Parallel Agents + Aggregation
    ↓
Combine Results
    ↓
Format Output
    ↓
User Output
```

## Workflow Types

### Type 1: Sequential Workflow
Steps execute one after another:

```
Step 1: Fetch data from API (MCP)
    ↓ (wait for completion)
Step 2: Analyze data (Agent)
    ↓ (wait for completion)
Step 3: Format results (Command)
    ↓
Output
```

**Use Case**: Dependency chain where each step needs previous results

**Example**:
```
1. Fetch GitHub issues (GitHub MCP)
2. Analyze sentiment (Agent)
3. Generate report (Command)
```

### Type 2: Parallel Workflow
Multiple steps execute simultaneously:

```
Step 1A: Fetch GitHub data ──┐
Step 1B: Fetch user bio      ├→ Step 2: Combine & analyze → Output
Step 1C: Fetch Twitter data ─┘
```

**Use Case**: Independent operations that save time when parallelized

**Example**:
```
Parallel:
- Agent A: Search GitHub repos
- Agent B: Search Docker images
- Agent C: Search npm packages
    ↓ (all complete)
Combine & rank results
```

### Type 3: Conditional Workflow
Different paths based on conditions:

```
Input
  ↓
Decision Point
  ├─ If condition A → Route A (Agent X + MCP Y)
  ├─ If condition B → Route B (Agent P + MCP Q)
  └─ If condition C → Route C (Agent M + MCP N)
  ↓
Format & Output
```

**Use Case**: Different logic for different input types

**Example**:
```
Input: user input
  ↓
Is it a GitHub username? → Use GitHub agent
Is it a regular name?    → Use Name agent
Is it an email?          → Use Email agent
```

### Type 4: Branching Workflow
Primary action spawns secondary actions:

```
Primary Agent Decision
    ↓
Creates branch decisions:
├─ "This needs Slack notification" → Slack MCP
├─ "This needs database update" → DB MCP
├─ "This needs follow-up" → Queue Agent
└─ "This needs monitoring" → Monitoring MCP
    ↓
All execute in parallel
    ↓
Primary continues with next task
```

**Use Case**: One decision triggers multiple side-effects

**Example**:
```
Agent analyzes PR
  ↓
Triggers:
- Post comment (GitHub MCP)
- Send Slack notification (Slack MCP)
- Create Jira issue (Jira MCP)
- Update database (DB MCP)
  ↓
All happen automatically
```

### Type 5: Recursive Workflow
Agent spawns new agents based on results:

```
Agent 1: Process list
  ├─ For each item: Launch Agent 2
  ├─ Agent 2: Process item
  ├─ Agent 2: If needs help → Launch Agent 3
  └─ Collect all results
    ↓
Output
```

**Use Case**: Processing collections or hierarchical data

**Example**:
```
Agent: Process 100 GitHub repos
  For each repo:
    Launch sub-agent to analyze
    If issues found → Launch reviewer agent
  Collect all analyses
  Generate summary
```

## Workflow Patterns

### Pattern 1: Command → Agent → MCP → Format

**Simplest production pattern:**

```
/command input
    ↓
Agent interprets
    ↓
Agent uses MCP
    ↓
MCP returns data
    ↓
Agent analyzes
    ↓
Command formats
    ↓
Output
```

**Your greet-plugin example:**
```
/greet torvalds
    ↓
greet.md detects: GitHub username
    ↓
Launches: github-profile-analyst
    ↓
Agent uses: GitHub MCP
    ↓
MCP returns: Profile data (followers, company, bio)
    ↓
Agent analyzes: Impact, significance
    ↓
Command formats: Greeting
    ↓
Output: "Hello torvalds! You have 284k followers..."
```

### Pattern 2: Detect → Route → Execute → Aggregate

**Decision-tree pattern:**

```
Input
    ↓
Analyze input type
    ↓
Route to appropriate handler:
├─ Type A → Agent A + MCP A
├─ Type B → Agent B + MCP B
└─ Type C → Agent C + MCP C
    ↓
Execute selected route
    ↓
Return results
```

**Example in greet-plugin:**
```
Input: "torvalds"
    ↓
Detect: Is it GitHub username? YES
    ↓
Route to: github-profile-analyst
    ↓
Execute: Fetch GitHub + analyze
    ↓
Return: GitHub greeting
```

### Pattern 3: Fetch → Analyze → Action

**Data-driven action pattern:**

```
Fetch data (via MCP)
    ↓
Analyze (via Agent)
    ↓
Determine action
    ↓
Execute action (via MCP)
    ↓
Report results
```

**Example:**
```
Fetch: Open GitHub issues (GitHub MCP)
    ↓
Analyze: Which are critical? (Agent)
    ↓
Determine: Send Slack alert if critical
    ↓
Execute: Post Slack message (Slack MCP)
    ↓
Report: "Posted 3 critical alerts"
```

### Pattern 4: Parallel Fetch → Merge → Analyze

**Data aggregation pattern:**

```
Parallel agents:
├─ Fetch GitHub stats
├─ Fetch Twitter followers
├─ Fetch LinkedIn profile
└─ Fetch website analytics
    ↓ (all complete)
Merge all data
    ↓
Analyze combined
    ↓
Generate comprehensive report
```

**Example:**
```
Person: @torvalds
    ↓
Fetch in parallel:
├─ GitHub: 284k followers
├─ Twitter: 1.2M followers
├─ LinkedIn: connections
└─ Website: traffic
    ↓
Merge: Comprehensive influence profile
    ↓
Analyze: "Most influential on GitHub, popular on Twitter"
    ↓
Report: Ranked social presence
```

### Pattern 5: Agent Decision Tree

**Complex autonomous decision making:**

```
Agent reads input
    ↓
Decision 1: Does it meet criteria X?
├─ YES → Decision 2: Is it urgent?
│        ├─ YES → Action A (send alert)
│        └─ NO  → Action B (queue)
│
└─ NO  → Decision 3: Can we improve it?
         ├─ YES → Action C (suggest changes)
         └─ NO  → Action D (skip)
    ↓
Take action & report
```

**Example:**
```
Agent analyzes PR code
    ↓
Has security issues?
├─ YES → Is it critical?
│        ├─ YES → Block merge, notify security team
│        └─ NO  → Flag for review
│
└─ NO  → Has style issues?
         ├─ YES → Suggest auto-fixes
         └─ NO  → Approve
```

## Advanced Workflow Concepts

### Error Handling in Workflows

```
Agent executes action
    ↓
Did it succeed?
├─ YES → Continue
└─ NO  → Handle error
       ├─ Retry logic
       ├─ Fallback action
       ├─ Escalate to human
       └─ Log & continue
```

### Timeout Handling

```
Launch operation with timeout
    ↓
Did it complete in time?
├─ YES → Use results
└─ NO  →
    ├─ Use cached results
    ├─ Use partial results
    └─ Use default values
```

### Result Validation

```
Agent returns results
    ↓
Validate results
    ├─ Check format
    ├─ Check completeness
    ├─ Check accuracy
    ├─ Verify against schema
    └─ Sanity check
        ↓
Valid?
├─ YES → Use results
└─ NO  → Request retry
```

### Caching & Optimization

```
Check cache: Have we seen this before?
├─ YES → Return cached result (fast!)
└─ NO  → Execute full workflow
         ├─ Run agents
         ├─ Call MCPs
         ├─ Analyze
         └─ Cache result for next time
```

## Real-World Workflow Examples

### Example 1: Automated Code Review System

```
PR submitted
    ↓
github-check MCP: Fetch PR details
    ↓
Parallel agents:
├─ Security agent: Check for vulnerabilities
├─ Quality agent: Analyze code quality
├─ Performance agent: Check for perf issues
└─ Style agent: Check code style
    ↓
Merge results
    ↓
Analyze severity
    ↓
Post comment (GitHub MCP)
    ↓
If critical issues: Assign label (GitHub MCP)
    ↓
If needs work: Post suggestions
    ↓
If looks good: Approve
```

### Example 2: Customer Support Workflow

```
Customer message arrives
    ↓
Analyze sentiment & intent (Agent)
    ↓
Is it urgent?
├─ YES → Escalate to human (Slack MCP)
└─ NO  → Generate response (Agent)
       ├─ Need external data? → Fetch from KB (MCP)
       ├─ Need to create ticket? → Jira MCP
       ├─ Need to notify team? → Slack MCP
       └─ Generate personalized response
         ↓
Send response
    ↓
Log interaction (Database MCP)
```

### Example 3: Social Media Analytics

```
User: "Analyze @torvalds"
    ↓
Parallel fetch:
├─ GitHub API: Followers, repos, activity
├─ Twitter API: Followers, engagement
├─ LinkedIn API: Connections, profile
└─ Website: Traffic, content
    ↓
Merge data
    ↓
Analyze patterns (Agent)
    ↓
Generate insights
    ↓
Create visualization
    ↓
Export report
```

### Example 4: Incident Response Workflow

```
Alert triggered
    ↓
Gather information (Agent)
├─ Query logs (Database MCP)
├─ Check metrics (Monitoring MCP)
├─ Query recent changes (GitHub MCP)
└─ Check status (Service MCP)
    ↓
Analyze root cause (Agent)
    ↓
Is it critical?
├─ YES →
│   ├─ Page on-call (PagerDuty MCP)
│   ├─ Post in Slack (Slack MCP)
│   ├─ Create incident ticket (Jira MCP)
│   └─ Collect diagnostic data
│
└─ NO → Log for later review
```

## Workflow Design Principles

### 1. Separation of Concerns
- **Commands**: User interaction & orchestration
- **Agents**: Reasoning & analysis
- **MCPs**: External service calls

### 2. Composition Over Complexity
- Build complex workflows from simple pieces
- Each piece does one thing well
- Combine pieces for power

### 3. Explicit Error Handling
- Define what happens when things fail
- Provide fallbacks
- Log and report errors

### 4. Observable & Debuggable
- Log key decisions
- Track agent execution
- Report status updates

### 5. Testable Components
- Test agents independently
- Mock MCPs for testing
- Verify command logic

### 6. Performance Optimization
- Use parallelization
- Cache results
- Lazy-load data
- Timeout long operations

## Workflow State Management

### Simple Stateless
```
Input → Process → Output
```
Best for: Simple transformations

### Stateful with Context
```
Input + Previous Context
    ↓
Process
    ↓
Update State
    ↓
Output
```
Best for: Multi-turn interactions

### Database-Backed State
```
Input
    ↓
Load from database
    ↓
Process
    ↓
Update database
    ↓
Output
```
Best for: Persistent workflows

## When to Use What Workflow Type

| Situation | Best Pattern |
|-----------|---|
| Simple transformation | Command → Output |
| Need external data | Command → Agent → MCP |
| Multiple input types | Detect → Route → Execute |
| Need multiple data sources | Parallel Fetch → Merge → Analyze |
| Complex decisions | Decision Tree Agent |
| Long processes | Sequential with checkpoints |
| Time-critical | Parallel execution |
| Uncertain results | With validation & retries |

## Your greet-plugin Workflow

Your `/greet` command implements the **Detect → Route → Execute** pattern:

```
/greet input
    ↓
Detect input type
├─ GitHub username? → Route to github-profile-analyst
└─ Regular name?    → Route to name-analyst
    ↓
Execute agent
├─ github-profile-analyst: Uses GitHub MCP
└─ name-analyst: Uses WebSearch/WebFetch
    ↓
Agent analyzes & generates insight
    ↓
Command formats greeting
    ↓
Output personalized greeting
```

This is a **production-quality workflow pattern** that demonstrates:
- ✅ Intelligent input detection
- ✅ Conditional routing
- ✅ Agent autonomy
- ✅ MCP integration
- ✅ Result formatting
- ✅ Error resilience (falls back to name analysis)
