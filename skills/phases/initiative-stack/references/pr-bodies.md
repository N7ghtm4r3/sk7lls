# PR bodies

Write bodies in the language of the repo's existing PRs. Append the
attribution footer the host requires.

## Skeleton

Title: `docs(<initiative>): <initiative> structure and feature split`. Change
the type to `feat` once code lands.

```markdown
## Summary
- Bottom of the <Initiative> stack: <one-line skeleton scope>.
- Now: <what is on the branch, with paths>.
- Next on this branch: <next pipeline step>.
- No feature pages and no domain entities in code here.

## Stack
0 structure (this) → 1 <slice> → 2 <slice> → … → N <slice>.

## Test plan
- [ ] <check for what is on the branch now>
```

## Slice placeholder

Title: `feat(<initiative>): <slice title>`, plus the build policy in brackets
when it applies, for example `(mock)`.

```markdown
## Summary
- Draft placeholder in the <Initiative> stack; no changes yet (one empty commit).
- Scope (from `<brief path>`): <inventory rows for this slice, as prose>.
- Depends on: <what it consumes from lower PRs>.
- Flow on this branch: slice grill → `ARCHITECTURE.md` → `SPEC.md` → `PLAN.md` → implementation → review → runbook.

## Test plan
- [ ] Defined by this PR's spec.
```

Empty commit message: `chore(<initiative>): open <slug> stack entry`. The
body says it is a placeholder and that work starts after the PR below.
