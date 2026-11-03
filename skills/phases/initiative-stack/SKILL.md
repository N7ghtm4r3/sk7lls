---
name: initiative-stack
description: Turn one initiative into a walking skeleton PR plus a native stack of vertical slice PRs, from source intake to the skeleton grill and per-slice delivery.
disable-model-invocation: true
---

# Initiative Stack

Orchestrate an initiative too large for one PR. The result is a **walking
skeleton** PR at the bottom of a native GitHub stack and one draft **vertical
slice** PR per feature above it. Each PR later runs its own grill, spec and
code. This skill owns the split, the stack and the routing of decisions
between PRs. The named skills own everything else. Respond in the user's
language.

## Inputs

Ask for any missing input before Phase 1.

- **Initiative**: name and one-line outcome.
- **Sources**: meeting notes, documents, screenshots, reference products,
  links.
- **Reference app**: an existing app in the repo whose structure and
  conventions the skeleton follows, or none.
- **Build policy**: for example mock-first frontend with a real backend
  contract. The policy applies to every slice.
- **Trunk and branch prefix**: read from repo guidance; ask only when it is
  absent.

## Phases

Run one phase at a time. Load only the current phase file. Every phase ends
on a **turn**: you present the result, then stop until the user accepts or
corrects it. A correction reopens the same phase. It never skips ahead.

| # | Phase | File | Completion criterion |
|---|---|---|---|
| 1 | Intake | [phases/1-intake.md](phases/1-intake.md) | Requirement inventory has no orphan rows and every source was read |
| 2 | Shape | [phases/2-shape.md](phases/2-shape.md) | User accepts the skeleton scope and the slice table |
| 3 | Stack | [phases/3-stack.md](phases/3-stack.md) | Native stack readback order matches the slice table |
| 4 | Skeleton grill | [phases/4-skeleton-grill.md](phases/4-skeleton-grill.md) | Skeleton grill closed; every moved question names its target PR |
| 5 | Deliver | [phases/5-deliver.md](phases/5-deliver.md) | Skeleton merged; each slice started only after the PR below it |

## Resume

Recompute the phase from evidence, never from transcript memory:

1. No Brainstorm Brief with a requirement inventory → Phase 1.
2. Brief without an accepted slice table → Phase 2.
3. Accepted slice table, no native stack → Phase 3.
4. Stack exists, skeleton grill not closed → Phase 4.
5. Skeleton grill closed → Phase 5.

## Skills used

| Need | Skill |
|---|---|
| Worktree for the skeleton branch | `switch-git-workenv` |
| Proposal turns and the Brainstorm Brief | `brainstorm` |
| Visual explanation of a split or stack | `show-me` |
| Durable decision interview | `requirements-grill` |
| Architecture, spec, backlog, plan | `requirements-phase` |
| Code from an agent-ready spec | `implement-spec` |
| PR description refresh | `pr-update` |

Native stack commands and the propagation rules live in
[references/stack-mechanics.md](references/stack-mechanics.md). PR body
templates live in [references/pr-bodies.md](references/pr-bodies.md).
