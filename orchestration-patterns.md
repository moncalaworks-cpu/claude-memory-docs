# Phase 3: Orchestration Patterns Learnings

**Status**: Complete (2026-02-11)
**Plugin**: team-orchestration-plugin
**Version**: 3.0.0

## Key Pattern: Automatic Delegation

### Definition

Automatic delegation means commands programmatically launch specialized agents in multi-phase workflows instead of requiring manual Task invocation.

### vs Manual Orchestration (greet-plugin)

| Aspect              | Manual                             | Automatic                     |
| ------------------- | ---------------------------------- | ----------------------------- |
| **User Experience** | "Run task A, then run task B"      | "Research this feature"       |
| **Coordination**    | Explicit in command text           | Implicit in coordinator agent |
| **Phases**          | Single phase (gather → synthesize) | Multiple phases (1→2→3→4)     |
| **Agents**          | 3 fixed agents                     | 7+ specialized agents         |
| **Dependencies**    | Manual specification               | Enforced by coordinator       |
| **Code clarity**    | Command instructions dense         | Command description clean     |

## Multi-Phase Workflow Pattern

### Structure

```
Phase 1: Discovery (Parallel)
  ├─ Agent A (researcher) - parallel
  └─ Agent B (analyst) - parallel
  → Phase 1 Summary

Phase 2: Design (Sequential, uses Phase 1)
  └─ Agent C (architect) - sequential
  → Phase 2 Summary

Phase 3: Review (Parallel, uses Phase 2)
  ├─ Agent D (reviewer 1) - parallel
  ├─ Agent E (reviewer 2) - parallel
  └─ Agent F (reviewer 3) - parallel
  → Phase 3 Summary

Phase 4: Synthesis (Sequential, uses all phases)
  └─ Agent G (synthesizer) - sequential
  → Final Recommendation
```

### Key Principles

1. **Parallel within phases**: Agents can run simultaneously when independent
2. **Sequential between phases**: Each phase must complete before next
3. **Data flow**: Phase N summary becomes input to Phase N+1
4. **Dependencies**: Explicit in coordinator logic, not scattered in commands

## Coordinator Pattern

### What It Does

The coordinator agent manages the entire workflow by:

1. Launching agents in correct order
2. Collecting results
3. Creating phase summaries
4. Passing summaries to next phase
5. Handling phase transitions

### Why It's Useful

**Before (Manual)**:

```
Command says: "Do this, then do that, then combine results"
Everything scattered in command text
Hard to modify workflow
```

**After (Coordinator)**:

```
Coordinator logic in dedicated agent
Clear phase transitions
Easy to add phases (just update coordinator + agent)
Reusable across commands
```

### Coordination Patterns

#### Pattern 1: Parallel Discovery

```
Start:   Launch 2 agents simultaneously
Wait:    For both to complete
Summary: Combine findings
Output:  Phase 1 Summary
```

Use when: Multiple independent analyses are needed upfront

#### Pattern 2: Sequential with Dependencies

```
Start:   Wait for Phase N complete
Input:   Use Phase N Summary
Launch:  Next agent
Output:  Phase N+1 Summary
```

Use when: Later work depends on earlier findings

#### Pattern 3: Parallel Reviews

```
Start:   Launch 3+ agents simultaneously
Input:   Each gets one option to review
Wait:    For all to complete
Summary: Combine reviews
Output:  Phase N Summary
```

Use when: Multiple options need independent evaluation

## Role-Based Specialization

### Design Principle

Each agent has **one clear responsibility**:

| Agent       | Role               | Responsibility                  |
| ----------- | ------------------ | ------------------------------- |
| Researcher  | Discovery          | Find existing features and code |
| Analyst     | Pattern Extraction | Identify design patterns        |
| Architect   | Design             | Create architecture options     |
| Reviewer    | Critique           | Evaluate one design option      |
| Synthesizer | Synthesis          | Create final recommendation     |
| Coordinator | Orchestration      | Manage workflow phases          |

### Benefits

1. **Clear focus**: Each agent knows what to do
2. **Easy to test**: Single responsibility easy to verify
3. **Reusable**: Agents can be used in different workflows
4. **Maintainable**: Changes to one agent don't affect others
5. **Scalable**: Easy to add agents for new roles

## Parallel vs Sequential Execution

### Parallel Execution

**When to use**:

- Agents are independent
- Speed is important
- Results can be combined afterward

**Example**: 3 reviewers critique 3 different options simultaneously

**Cost**: Faster wall-clock time, same token usage

### Sequential Execution

**When to use**:

- Later work depends on earlier results
- Order matters
- Results feed into next phase

**Example**: Architect must complete before reviewers can evaluate designs

**Cost**: Slower wall-clock time, but enforces dependencies

## Data Flow Between Phases

### Phase Summary Structure

Each phase produces a summary with:

1. **Phase findings**: What was discovered/analyzed/designed/reviewed
2. **Key insights**: Critical information for next phase
3. **Context**: Background needed for next agent

### Example: Phase 1 → Phase 2

```
Phase 1 Summary:
- Discovered features: [5-10 files with roles]
- Established patterns: [Design patterns in use]
- Integration points: [Where new code should connect]
- Constraints: [Technical limitations]

Phase 2 Architect receives:
- Same data as Phase 1 Summary
- Plus: Original feature request
- Task: Design 3 approaches following patterns, respecting constraints
```

### Coordinator's Job

1. Collect output from Phase 1 agents
2. Extract key information
3. Format as Phase 1 Summary
4. Pass to Phase 2 agent
5. Repeat for each phase

## Two-Command Pattern

### Full Research Workflow

```
/research-feature [feature description]
```

**Phases**: 1 (discovery) → 2 (design) → 3 (review) → 4 (synthesis)
**Agents**: 7 total
**Time**: 30-45 minutes
**Use**: When you need complete analysis with multiple options

**Outputs**:

- Phase 1: Discoveries + Patterns
- Phase 2: 3 architecture options
- Phase 3: Reviews of each option
- Phase 4: Final recommendation

### Simplified Review Workflow

```
/review-architecture [architecture name]
```

**Phases**: 1 (discovery) → 2 (synthesis/review)
**Agents**: 3 total
**Time**: 15-20 minutes
**Use**: When you have architecture to review

**Outputs**:

- Phase 1: Context + Patterns
- Phase 2: Architecture assessment

### Decision Framework

**Use `/research-feature` when:**

- ✅ Designing something new
- ✅ You need multiple options
- ✅ You want detailed analysis
- ✅ You want implementation roadmap

**Use `/review-architecture` when:**

- ✅ You have architecture to review
- ✅ You need quick assessment
- ✅ You have time constraints

## Cost & Performance

### Token Usage

Estimated tokens per full workflow (7 agents):

| Phase     | Agents | Est. Tokens  | Est. Cost       |
| --------- | ------ | ------------ | --------------- |
| Phase 1   | 2      | 4K-6K        | ~$0.04-0.06     |
| Phase 2   | 1      | 3K-5K        | ~$0.03-0.05     |
| Phase 3   | 3      | 6K           | ~$0.06          |
| Phase 4   | 1      | 2K-4K        | ~$0.02-0.04     |
| **Total** | **7**  | **~17K-24K** | **~$0.15-0.25** |

### Execution Time

```
Phase 1: 5-10 min   (parallel)
Phase 2: 10-15 min  (sequential)
Phase 3: 10-15 min  (parallel)
Phase 4: 5 min      (sequential)
────────────────────────────
Total:  30-45 min
```

Parallel execution within phases significantly reduces wall-clock time compared to sequential.

## Extension Patterns

### Adding a New Phase

1. Create specialist agent(s)
2. Update coordinator with new phase logic
3. Update command documentation
4. Test workflow

### Adding Agent to Existing Phase

1. Create new agent
2. Add to parallel launch section in coordinator
3. Update phase summary to include new agent output
4. Test

### Creating New Command

1. Design phase structure
2. Plan agent roles
3. Document in command markdown
4. Update coordinator if needed

## Common Mistakes to Avoid

### ❌ Mistake 1: Agent without Clear Role

```
Bad: Agent that both researches AND reviews AND synthesizes
Good: Separate agents for each role
```

### ❌ Mistake 2: Skipped Phase Summary

```
Bad: Phase 1 completes but no summary created
Good: Always create summary to pass to Phase 2
```

### ❌ Mistake 3: Missing Dependencies

```
Bad: Phase 2 agent expects Phase 1 summary but coordinator doesn't pass it
Good: Explicitly document data flow between phases
```

### ❌ Mistake 4: Wrong Model for Agent

```
Bad: Sonnet for fast reviews (wastes tokens)
Good: Haiku for fast reviews, Sonnet for complex analysis
```

### ❌ Mistake 5: Phase vs Command Confusion

```
Bad: One phase per command instead of multi-phase workflows
Good: Phases within commands, separate commands for different needs
```

## What We Built

### team-orchestration-plugin v3.0.0

**Files**: 14 files, 3,264 lines of code/docs

**Agents**:

- coordinator: Orchestration engine (250 lines)
- codebase-researcher: Discovery specialist (180 lines)
- pattern-analyst: Pattern extraction (180 lines)
- architect: Design specialist (200 lines)
- reviewer: Quality critic (200 lines)
- synthesizer: Report generation (350 lines)

**Commands**:

- research-feature: 4-phase workflow (400 lines)
- review-architecture: 2-phase workflow (300 lines)

**Documentation**:

- README: 400 lines with diagrams
- CONTRIBUTING: 200 lines on extension
- Plugin files: plugin.json, manifest, MCP config
- LICENSE: MIT

## Learning Outcomes

After Phase 3, you understand:

1. ✅ **Automatic delegation**: Building self-orchestrating workflows
2. ✅ **Multi-phase design**: Coordinating phases with dependencies
3. ✅ **Parallel patterns**: When/how to parallelize work
4. ✅ **Coordinator pattern**: Separating orchestration from execution
5. ✅ **Role-based design**: Focused specialist agents
6. ✅ **Data flow**: Message passing between phases
7. ✅ **Practical orchestration**: Real-world workflow design

## Comparison: greet-plugin → team-orchestration-plugin

### greet-plugin (Manual Orchestration)

- 3 agents in parallel gather
- Command instructs what to do
- Results synthesized by coordinator agent
- Simple, straightforward
- Good for: 2-3 data sources, single phase

### team-orchestration-plugin (Automatic Delegation)

- 7 agents across 4 phases
- Coordinator automatically orchestrates
- Built-in phase dependencies
- Complex workflows
- Good for: Multi-phase analysis, sophisticated workflows

## Phase 3 Success Metrics

✅ **Plugin Created**: team-orchestration-plugin with full infrastructure
✅ **Agents Built**: 6 specialized agents with clear roles
✅ **Commands Built**: 2 workflows (4-phase and 2-phase)
✅ **Documentation**: 2,600+ lines of specs and guides
✅ **Patterns Demonstrated**: Parallel, sequential, coordinator patterns
✅ **Tested**: Full plugin enabled in settings.json
✅ **Committed**: Full plugin history in Git

## Next Phase: Phase 4

**Focus**: Production Integration (Headless/CI/CD)

Will explore:

- Integrating Claude Code into CI/CD pipelines
- Headless automation
- GitHub Actions workflows
- Real-world deployment patterns

---

**Created**: 2026-02-11
**Phase**: 3 (Complete)
**Status**: Ready for Phase 4
