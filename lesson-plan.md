# Claude Features Learning: Lesson Plan v2.0

**Generated**: 2026-02-11 | **Status**: ACTIVE | **Current Phase**: Phase 1 - Hooks Exploration

---

## Overview

This lesson plan captures a strategic curriculum for mastering Claude features, organized by priority and learning path. Based on comprehensive analysis by claude-code-guide agent (2026-02-11).

### Current Progress
- **Mastered**: Skills & Plugins, Agents, MCPs, Workflows, Context/Memory
- **Next**: Phase 1 - Hooks (automation middleware)
- **Timeline**: ~2 week learning sprint per phase

---

## Phase 1: Hooks & Automation (THIS WEEK)

**Goal**: Master automation middleware for production-grade plugins

### What are Hooks?
Automation hooks intercept and modify ANY Claude Code operation:
- Pre-command hooks (before user action)
- Post-tool hooks (after tool execution)
- Conditional rules with matcher patterns
- Async operations (run tests after changes)

### Learning Objectives
- [ ] Understand hook lifecycle and events
- [ ] Create pre-command guardrails (block edits to protected files)
- [ ] Implement post-tool formatting hooks
- [ ] Build async hooks for background operations
- [ ] Document hook patterns and best practices

### Implementation Plan

**Task 1: Learn Hooks Fundamentals**
- Read: https://code.claude.com/docs/en/hooks-guide.md
- Create: `/Users/kenshinzato/.claude/projects/-Users-kenshinzato-repos-ClaudeTwo/memory/hooks-guide.md` (learning notes)
- Time: ~30 mins

**Task 2: Create hooks-plugin (3 demonstrations)**
- Location: `~/.claude/plugins/my-plugins/hooks-plugin/`
- Example 1: Auto-format hook (post-edit, JSON/YAML formatting)
- Example 2: Context injection hook (pre-command, auto-load CLAUDE.md)
- Example 3: Protective block hook (block edits to sensitive files)
- Time: ~2-3 hours

**Task 3: Document Patterns**
- Create: `/Users/kenshinzato/.claude/projects/-Users-kenshinzato-repos-ClaudeTwo/memory/hooks-patterns.md`
- Cover: When to use hooks, common patterns, performance considerations
- Time: ~30 mins

### Success Criteria
- [ ] hooks-plugin created with 3 working examples
- [ ] All hooks tested and documented
- [ ] Learning notes added to memory
- [ ] Ready to integrate into greet-plugin v1.2.0

### Resources
- Official Docs: https://code.claude.com/docs/en/hooks-guide.md
- Examples: Will be documented in hooks-patterns.md

---

## Phase 2: Extended Thinking & Vision (NEXT 2 WEEKS)

**Goal**: Master advanced reasoning and perception capabilities

### Learning Objectives
- [ ] Understand extended thinking mode (chain-of-thought reasoning)
- [ ] Implement thinking in existing agents
- [ ] Explore vision capabilities (image analysis)
- [ ] Learn cost/benefit trade-offs (thinking tokens)
- [ ] Build a deep-analysis-plugin demonstrating both

### Implementation Plan

**Task 1: Extended Thinking Deep Dive**
- Experiment with thinking in `combined-profile` agent
- Measure: thinking token usage vs quality improvement
- Document: findings in memory

**Task 2: Vision Integration**
- Create agent for screenshot/diagram analysis
- Test with sample images
- Document: use cases and limitations

**Task 3: Cost Analysis**
- Compare token costs: normal vs thinking mode
- Create decision matrix: when to use thinking
- Document in patterns.md

### Success Criteria
- [ ] thinking-mode agent created and tested
- [ ] Vision capabilities demonstrated
- [ ] Cost analysis documented
- [ ] deep-analysis-plugin ready

---

## Phase 3: Advanced Orchestration (FOLLOWING WEEK)

**Goal**: Master sophisticated multi-agent patterns

### What's the Difference?
| Pattern | Your Current | Subagents | Teams |
|---------|-------------|-----------|-------|
| Launch | Manual (Task tool) | Automatic delegation | Coordinator + teammates |
| Isolation | Shared context | Isolated contexts | Isolated by role |
| Parallelism | Manual launch | Auto-parallel | True parallel orchestration |
| Communication | Return values | Result synthesis | Message passing |

### Learning Objectives
- [ ] Understand subagents (automatic delegation)
- [ ] Understand agent teams (coordinator pattern)
- [ ] Know when to use each pattern
- [ ] Refactor greet-plugin to use subagents OR create team-orchestration-plugin
- [ ] Document orchestration decision matrix

### Implementation Plan

**Task 1: Subagents Exploration**
- Create subagent example
- Compare to your current agent pattern
- Document differences

**Task 2: Agent Teams**
- Build team-orchestration-plugin with:
  - Coordinator agent
  - 2-3 teammate agents
  - Message passing pattern
- Time: ~3-4 hours

**Task 3: Decision Framework**
- Create: orchestration-patterns.md
- Document: when to use each approach
- Include: pros/cons and use cases

### Success Criteria
- [ ] Both subagents and teams demonstrated
- [ ] greet-plugin or new plugin refactored
- [ ] Decision framework documented

---

## Phase 4: Production Integration (MONTH 2)

**Goal**: Deploy Claude Code to production systems

### 4A: Headless Mode & CI/CD (Priority)

**Objectives**
- [ ] Understand headless mode (no interactive prompts)
- [ ] Integrate with GitHub Actions
- [ ] Test automated workflows
- [ ] Document CI/CD patterns

**Implementation**
- Create GitHub Action that runs greet-plugin in headless mode
- Add to your project repo
- Document in DEPLOYMENT.md v2

### 4B: Web Platform & Multi-Environment

**Objectives**
- [ ] Test Claude Code web platform
- [ ] Understand platform differences (browser, cloud, CLI)
- [ ] Move tasks between environments
- [ ] Document platform capabilities

### 4C: Permissions & Security Hardening

**Objectives**
- [ ] Deep dive on fine-grained permissions
- [ ] Implement sandboxing rules
- [ ] Document security policies
- [ ] Create permission matrix for plugins

**Implementation**
- Create: security.md with policies
- Create: permission-rules.md with examples
- Test: all edge cases

---

## Phase 5: Advanced Features (BACKLOG)

**Lower Priority** - Explore as time permits

### 5A: Structured Outputs (API Feature)
- Type-safe agent responses
- JSON schema validation
- When to use vs when overkill

### 5B: Prompt Caching
- Cost optimization technique
- Identify cache candidates in your agents
- Measure savings

### 5C: MCP Tool Search
- Handle large MCP tool sets efficiently
- Optimize GitHub MCP integration

### 5D: Claude Code Analytics
- Team usage insights
- Performance metrics
- Impact tracking

---

## Learning Resources by Feature

### Phase 1: Hooks
- [ ] Official Hooks Guide: https://code.claude.com/docs/en/hooks-guide.md
- [ ] Memory: `/memory/hooks-guide.md` (to be created)
- [ ] Memory: `/memory/hooks-patterns.md` (to be created)

### Phase 2: Thinking & Vision
- [ ] Extended Thinking Docs: https://code.claude.com/docs/en/extended-thinking.md
- [ ] Vision Guide: https://code.claude.com/docs/en/vision.md
- [ ] Memory: Updates to `patterns.md`

### Phase 3: Orchestration
- [ ] Subagents Guide: https://code.claude.com/docs/en/subagents.md
- [ ] Agent Teams: https://code.claude.com/docs/en/agent-teams.md
- [ ] Memory: `orchestration-patterns.md` (to be created)

### Phase 4: Production
- [ ] Headless Mode: https://code.claude.com/docs/en/headless-mode.md
- [ ] CI/CD Integration: https://code.claude.com/docs/en/ci-cd.md
- [ ] Permissions Guide: https://code.claude.com/docs/en/permissions.md

---

## Success Metrics by Phase

| Phase | Key Deliverable | Success Criteria |
|-------|-----------------|------------------|
| 1 | hooks-plugin | 3 working hooks demonstrated |
| 2 | deep-analysis-plugin | Thinking + Vision integrated |
| 3 | team-orchestration-plugin | Subagents + Teams demonstrated |
| 4 | CI/CD pipeline | GitHub Action workflow live |
| 5 | Backlog features | As time/interest permits |

---

## Memory Updates Required

- [ ] Update MEMORY.md: Add "## Learning Path (v2.0)" section
- [ ] Create: `/memory/hooks-guide.md` (Phase 1)
- [ ] Create: `/memory/hooks-patterns.md` (Phase 1)
- [ ] Create: `/memory/orchestration-patterns.md` (Phase 3)
- [ ] Create: `/memory/security.md` (Phase 4)
- [ ] Link all new files from MEMORY.md index

---

## Decision Matrix: What to Build Next?

**Option A: Build hooks-plugin (Recommended)**
- Effort: Medium (2-3 hrs)
- Impact: High (automation for future plugins)
- Learning: Deep understanding of middleware patterns
- **→ Choose this to maximize impact on existing greet-plugin**

**Option B: Explore extended thinking**
- Effort: Low (experimentation)
- Impact: Medium (enhances existing agents)
- Learning: Advanced reasoning patterns
- **→ Choose this for quick reasoning upgrades**

**Option C: Build subagents example**
- Effort: Medium (refactoring)
- Impact: Medium (cleaner orchestration)
- Learning: When/how to delegate
- **→ Choose this to improve agent architecture**

**Option D: Add GitHub Actions integration**
- Effort: Medium (workflow setup)
- Impact: High (production deployment)
- Learning: Headless mode and CI/CD
- **→ Choose this to enable deployment**

---

## Next Action

**Recommended**: Start Phase 1 (Hooks) this week
1. Read hooks documentation (~30 mins)
2. Create learning notes in memory (~30 mins)
3. Build hooks-plugin with 3 examples (~2-3 hours)
4. Document patterns and best practices (~30 mins)

**By end of week**: hooks-plugin complete, memory updated, ready for Phase 2

---

## Phase 1 Completion Report (2026-02-11)

✅ **COMPLETE & VALIDATED**

**Achievements:**
- ✅ Learned hooks concepts (11 events, 3 types, 4 patterns)
- ✅ Built production-grade hooks-plugin with 3 working patterns
- ✅ PreToolUse hook successfully blocks .env file edits
- ✅ Established plugin template from greet-plugin structure
- ✅ Comprehensive documentation in memory
- ✅ Security best practices implemented

**Key Discovery:**
- Hooks require Claude Code restart to activate fully
- Once activated, hooks work reliably for blocking operations

**Ready for Phase 2:** ✅ YES

---

## Revision History

- **v2.1** (2026-02-11): Phase 1 completion report. PreToolUse hook validated and working. Ready for Phase 2.
- **v2.0** (2026-02-11): Created comprehensive lesson plan based on claude-code-guide analysis. Organized into 5 phases with clear objectives and success criteria.
- **v1.0** (conceptual): Initial feature gap analysis

