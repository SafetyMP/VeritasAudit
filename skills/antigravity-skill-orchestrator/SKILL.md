---
name: antigravity-skill-orchestrator
description: "A meta-skill that understands task requirements, dynamically selects appropriate skills, tracks successful skill combinations using agent-memory-mcp, and prevents skill overuse for simple tasks."
category: meta
risk: safe
source: community
tags: "[orchestration, meta-skill, agent-memory, task-evaluation]"
date_added: "2026-03-13"
---

# antigravity-skill-orchestrator

## Overview

The `skill-orchestrator` is a meta-skill designed to enhance the AI agent's ability to tackle complex problems. It acts as an intelligent coordinator that first evaluates the complexity of a user's request. Based on that evaluation, it determines if specialized skills are needed. If they are, it selects the right combination of skills, explicitly tracks these combinations using `@agent-memory-mcp` for future reference, and guides the agent through the execution process. Crucially, it includes strict guardrails to prevent the unnecessary use of specialized skills for simple tasks that can be solved with baseline capabilities.

## When to Use This Skill

- Use when tackling a complex, multi-step problem that likely requires multiple domains of expertise.
- Use when you are unsure which specific skills are best suited for a given user request, and need to discover them from the broader ecosystem.
- Use when the user explicitly asks to "orchestrate", "combine skills", or "use the best tools for the job" on a significant task.
- Use when you want to look up previously successful combinations of skills for a specific type of problem.

## Core Concepts

### Task Evaluation Guardrails
Not every task requires a specialized skill. For straightforward issues (e.g., small CSS fixes, simple script writing, renaming a variable), **DO NOT USE** specialized skills. Over-engineering simple tasks wastes tokens and time. 

Additionally, the orchestrator is strictly forbidden from creating new skills. Its sole purpose is to combine and use existing skills provided by the community or present in the current environment.

Before invoking any skills, evaluate the task:
1. **Is the task simple/contained?** Solve it directly using the agent's ordinary file editing, search, and terminal capabilities available in the current environment.
2. **Is the task complex/multi-domain?** Only then should you proceed to orchestrate skills.

### Skill Selection & Combinations
When a task is deemed complex, identify the necessary domains (e.g., frontend, database, deployment). Search available skills in the current environment to find the most relevant ones. If the required skills are not found locally, consult the master skill catalog.

### Master Skill Catalog & JIT Risk-Tier Index

The Antigravity ecosystem maintains a master catalog of highly curated skills at `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md`. All skills in the catalog and your local index are classified into Risk Tiers 1-4.

Before compiling or executing a multi-skill task plan, the JIT router MUST classify each selected playbook:
- **Tier 1 (Low):** Prompt optimizing, DDD design (`context-window-management`, `prompt-caching`). No warnings.
- **Tier 2 (Medium):** Local code, schema, and environment setups (`devcontainer-setup`, `mise-configurator`). Logs warnings.
- **Tier 3 (High):** Spawning parallel workers, dynamic scaffolding (`orchestrate-batch-refactor`, `skill-creator`). **Requires developer confirm.**
- **Tier 4 (Critical):** Destructive system alterations (`protect-mcp-governance`, `agentic-actions-auditor`). **Requires cryptographic receipt.**

If a plan requires Tier 3 or Tier 4 skills, the orchestrator MUST alert the developer in chat and wait for confirmation before JIT execution starts.

### Memory Integration (`@agent-memory-mcp`)
To build institutional knowledge, the orchestrator relies on the `agent-memory-mcp` skill to record and retrieve successful skill combinations.

## Step-by-Step Guide

### 1. Task Evaluation & Guardrail Check
[Triggered when facing a new user request that might need skills]
1. Read the user's request.
2. Ask yourself: "Can I solve this efficiently with just basic file editing and terminal commands?"
3. If YES: Proceed without invoking specialized skills. Stop the orchestration here.
4. If NO: Proceed to step 2.

### 2. Audit Context Drift & Dynamic Rate Limits
[Triggered if the task is complex]
1. **Context Drift Pre-check:** Read `.memory/drift-status.json` to verify context freshness. If any directories in your target scope are listed as drifted, execute `bash scripts/ham-drift-watcher.sh` or perform a targeted context update to prevent compiling with stale metadata.
2. **API Rate-Limit Pre-check:** Inspect the LLM provider headers (e.g. `x-ratelimit-remaining-tokens`) from the last turn. If remaining limits are under 25%, automatically reduce worker spawner concurrency (`max_concurrency`) to `1` to avoid HTTP 429 rate limit exceptions.
3. Use the `memory_search` tool provided by `agent-memory-mcp` to search for similar past tasks.
   - Example query: `memory_search({ query: "skill combination for react native and firebase", type: "skill_combination" })`
4. If a working combination exists, read the details using `memory_read`.
5. If no relevant memory exists, proceed to Step 3.

### 3. Discover & Select Skills (Lazy Index Lookup)
[Triggered if no past knowledge covers this task]
1. Analyze the core requirements (e.g., "needs a React UI, a Node.js backend, and a PostgreSQL database").
2. Query the locally available skills index (names and one-sentence descriptions only). **DO NOT** read the full `SKILL.md` files yet.
3. If local skills are insufficient, fetch the catalog names/descriptions from the master catalog at `https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/CATALOG.md`.
4. Match query intents and select the minimal set of required skill names. **Do not over-select.**

### 4. Lazy JIT Loading & Execution
[Triggered when executing a specific sub-task in the plan]
1. During the execution wave, only load the full `SKILL.md` file for the **single active skill** currently being executed (e.g. call `view_file` on `tdd-orchestrator/SKILL.md`).
2. When the sub-task finishes, discard that skill's system instructions before moving to the next sub-task to prevent context window token competition.
3. Maintain this sliding execution window to keep overall metadata overhead under 1,000 tokens per turn.

### 4. Apply Skills and Track the Combination
[Triggered after executing the task using the selected skills]
1. Assume the task was completed successfully using a new combination of skills (e.g., `@react-patterns` + `@nodejs-backend-patterns` + `@postgresql`).
2. Record this combination for future use using `memory_write` from `agent-memory-mcp`.
   - Ensure the type is `skill_combination`.
   - Provide a descriptive key and content detailing why these skills worked well together.

## Examples

### Example 1: Handling a Simple Task (The Guardrail in Action)
**User Request:** "Change the color of the submit button in `index.css` to blue."
**Action:** The skill orchestrator evaluates the task. It determines this is a "simple/contained" task. It **does not** invoke specialized skills. It directly edits `index.css`.

### Example 2: Recording a New Skill Combination
```javascript
// Using the agent-memory-mcp tool after successfully building a complex feature
memory_write({ 
  key: "combination-ecommerce-checkout", 
  type: "skill_combination", 
  content: "For e-commerce checkouts, using @stripe-integration combined with @react-state-management and @postgresql effectively handles the full flow from UI state to payment processing to order recording.",
  tags: ["ecommerce", "checkout", "stripe", "react"]
})
```

### Example 3: Retrieving a Combination
```javascript
// At the start of a new e-commerce task
memory_search({ 
  query: "ecommerce checkout", 
  type: "skill_combination" 
})
// Returns the key "combination-ecommerce-checkout", which you then read:
memory_read({ key: "combination-ecommerce-checkout" })
```

## Best Practices

- ✅ **Do:** Always evaluate task complexity *before* looking for skills.
- ✅ **Do:** Keep the number of orchestrated skills as small as possible.
- ✅ **Do:** Use highly descriptive keys when running `memory_write` so they are easy to search later.
- ❌ **Don't:** Use this skill for simple bug fixes or UI tweaks.
- ❌ **Don't:** Combine skills that have overlapping and conflicting instructions without a clear plan to resolve the conflict.
- ❌ **Don't:** Attempt to construct, generate, or create new skills. Only combine what is available.

## Related Skills

- `@agent-memory-mcp` - Essential for this skill to function. Provides the persistent storage for skill combinations.

## Limitations
- Use this skill only when the task clearly matches the scope described above.
- Do not treat the output as a substitute for environment-specific validation, testing, or expert review.
- Stop and ask for clarification if required inputs, permissions, safety boundaries, or success criteria are missing.
