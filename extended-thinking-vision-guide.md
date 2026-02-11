# Phase 2: Extended Thinking & Vision - Complete Guide

**Status**: Research Complete | **Version**: 1.0 | **Date**: 2026-02-11

## Quick Reference

### Extended Thinking (Chain-of-Thought Reasoning)

- **What**: Multi-step reasoning with hidden thinking tokens before final answer
- **Cost**: Thinking tokens counted as output tokens (same rate as normal output)
- **Budget**: 1K-32K tokens recommended (diminishing returns after 32K)
- **Latency**: Increases with thinking budget; >21K requires streaming
- **Best for**: Complex code analysis, math, research, debugging
- **Not for**: Simple Q&A, real-time chat, creative writing

### Vision (Image Analysis)

- **What**: Claude can understand and analyze images (code screenshots, diagrams, UI)
- **Formats**: JPEG, PNG, GIF, WebP (max 5MB, 8000x8000px)
- **Token cost**: ~1,590 tokens per image (1092x1092px optimal)
- **Best for**: Code reviews from screenshots, error analysis, architecture diagrams
- **Cannot do**: Generate/edit images, identify people, reliable AI detection

### Integration Strategy

**Extended Thinking + Vision** = Powerful analysis with transparent reasoning

- Use vision to extract information from screenshots
- Use extended thinking to analyze deeply
- Interleaved thinking: think → fetch tool → analyze → think again → final answer

---

## Extended Thinking Details

### When to Use Thinking vs Normal

| Task                      | Use Thinking? | Reasoning                            |
| ------------------------- | ------------- | ------------------------------------ |
| Code analysis & debugging | YES           | Multi-step improves quality          |
| Architecture review       | YES           | Complex design requires reasoning    |
| Security analysis         | YES           | Critical attention to detail         |
| Performance optimization  | YES           | Thorough analysis needed             |
| Bug investigation         | YES           | Step-by-step reasoning helps         |
| Simple API usage          | NO            | Straightforward, no reasoning needed |
| Summarization             | NO            | Direct task, no thinking required    |
| Real-time chat            | NO            | Latency unacceptable                 |

### Token Budget Guide

**Budget Sizes:**

- 1K-4K: Simple reasoning, low latency, low cost
- 4K-10K: Complex problems, medium latency (RECOMMENDED)
- 16K-32K: Deep analysis, high latency, high cost
- 32K+: Only for batch processing (exceeds HTTP timeout)

**Cost Example (Claude Opus 4.5: $25/M output tokens):**

- 10K thinking + 500 output = 10,500 tokens total = $0.2625
- 32K thinking + 1K output = 33,000 tokens total = $0.825

### Interleaved Thinking with Tools

**Pattern**: Think → Call Tool → Analyze Result → Think Again

```
1. Extended thinking: Formulate investigation strategy
2. Tool call: Fetch git history, test results
3. Extended thinking: Analyze results, identify patterns
4. Tool call: Get specific code sections
5. Extended thinking: Final diagnosis
```

This enables sophisticated multi-step analysis with reasoning at each step.

---

## Vision Details

### Supported Formats & Optimization

**Image specifications:**

- Formats: JPEG, PNG, GIF, WebP
- Max size: 5MB (API), 10MB (claude.ai)
- Max dimensions: 8000x8000px (auto-resized)
- Optimal: 1092x1092px for token efficiency

**Token calculation**: `tokens ≈ (width × height) / 750`

Examples (Claude Opus 4.5 pricing):

- 200×200px → ~54 tokens → $0.00016 per image
- 1092×1092px → ~1,590 tokens → $0.005 per image

### Vision Use Cases

1. **Code screenshots** - Analyze diffs, PR reviews, error messages
2. **Terminal output** - Parse test failures, build errors
3. **Architecture diagrams** - Understand system design
4. **UI screenshots** - Debug rendering, responsive design
5. **Documentation** - Extract and verify information

### Files API for Repeated Analysis

For images analyzed multiple times:

- Use Files API (40-50% latency reduction)
- Only pay encoding cost once
- Subsequent analyses reuse same image token representation

---

## deep-analysis-plugin: Phase 2 Deliverable

### Architecture

```
deep-analysis-plugin/
├── commands/
│   ├── deep-analyze.md       # Full analysis with thinking
│   ├── visual-review.md      # Screenshot code review
│   └── explain-code.md       # Deep explanation
├── agents/
│   ├── visual-analyzer.ts    # Vision + thinking agent
│   ├── code-analyzer.ts      # Extended thinking specialist
│   └── orchestrator.ts       # Coordinates both
├── hooks/
│   ├── format.sh            # Post-tool auto-format
│   └── protect.sh           # Pre-tool file protection
└── Documentation
```

### Three Skills to Implement

1. **`/deep-analyze`** - Complex code analysis
   - Input: Code file + problem + optional screenshot
   - Output: Analysis with thinking blocks + recommendations
   - Budget: 10K thinking tokens

2. **`/visual-review`** - Screenshot-based review
   - Input: Screenshot of code/error/UI
   - Output: Findings with reasoning visible
   - Uses: Vision + thinking

3. **`/explain-code`** - Deep code explanation
   - Input: Code file or snippet
   - Output: Detailed explanation with full reasoning
   - Budget: 12K thinking tokens minimum

### Agent Orchestration

```
Input (code/screenshot/both)
    ↓
If screenshot → Vision Agent analyzes image
If code → Thinking Agent analyzes with extended thinking
If both → Both agents run, orchestrator combines
    ↓
Interleaved thinking: Think → Fetch tools → Analyze → Think → Final
    ↓
Output: Analysis with thinking blocks + recommendations
```

---

## Decision Matrix: When to Use Each

```
Task Type                | Extended Thinking | Vision | Both  |
Code Analysis (text)     | YES              | NO     | NO    |
Code Review (screenshot) | YES              | YES    | YES   |
Debug Error              | YES              | MAYBE  | MAYBE |
Architecture Design      | YES              | YES    | YES   |
Performance Optimization | YES              | MAYBE  | MAYBE |
UI/UX Analysis          | NO               | YES    | MAYBE |
Security Review         | YES              | YES    | YES   |
Documentation Gen       | NO               | NO     | NO    |
Simple Q&A             | NO               | NO     | NO    |
```

---

## Implementation Checklist

Phase 2 Success Criteria:

- [ ] Extended thinking working with configurable budgets
- [ ] Thinking blocks visible in skill output
- [ ] Token tracking for cost optimization
- [ ] Interleaved thinking with tool use
- [ ] Vision image processing working
- [ ] Base64 encoding implemented
- [ ] Multi-image support (compare/contrast)
- [ ] Image size optimization
- [ ] `/deep-analyze` skill created
- [ ] `/visual-review` skill created
- [ ] `/explain-code` skill created
- [ ] Orchestrator agent coordinating both
- [ ] Cost analysis documented
- [ ] Real-world example workflows tested
- [ ] Comprehensive README with examples

---

## Quick Start: Python Implementation

````python
import anthropic
import base64

client = anthropic.Anthropic()

# Extended thinking + optional vision
def deep_analyze(code: str = None, image_base64: str = None,
                question: str = "", thinking_budget: int = 10000):
    content = []

    if image_base64:
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/png",
                "data": image_base64
            }
        })

    if code:
        content.append({
            "type": "text",
            "text": f"Code:\n```\n{code}\n```\n\nQuestion: {question}"
        })
    else:
        content.append({"type": "text", "text": question})

    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=max(16000, thinking_budget + 5000),
        thinking={
            "type": "enabled",
            "budget_tokens": thinking_budget
        },
        messages=[{
            "role": "user",
            "content": content
        }]
    )

    # Print thinking + final analysis
    for block in response.content:
        if block.type == "thinking":
            print(f"Thinking ({len(block.thinking)} chars):")
            print(block.thinking[:500] + "...")
        elif block.type == "text":
            print(f"Analysis:\n{block.text}")

    print(f"\nTokens: {response.usage.input_tokens} input, "
          f"{response.usage.output_tokens} output")

# Usage
deep_analyze(
    code="def fibonacci(n): return n if n <= 1 else fibonacci(n-1) + fibonacci(n-2)",
    question="Analyze time complexity and suggest optimization",
    thinking_budget=8000
)
````

---

## Key Insights

1. **Extended thinking is cost-effective for complex tasks** - Better output quality often justifies token cost
2. **Vision + thinking is powerful combination** - Visual extraction + deep reasoning
3. **Interleaved thinking enables sophisticated workflows** - Think → act → analyze → repeat
4. **Image optimization crucial** - Resizing to ~1092x1092px maximizes token efficiency
5. **Thinking doesn't work for all tasks** - Simple queries waste tokens; use judiciously

---

## Resources

- [Extended Thinking Guide](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Vision Capabilities](https://platform.claude.com/docs/en/build-with-claude/vision)
- [Extended Thinking Tips](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips)
- [Chain of Thought Prompting](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/chain-of-thought)

---

## Revision History

- **v1.0** (2026-02-11): Complete Phase 2 research and implementation guide
