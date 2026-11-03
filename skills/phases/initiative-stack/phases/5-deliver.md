# Phase 5: Deliver

Goal: each PR goes through the same pipeline on its own branch, from the
bottom of the stack up.

## Skeleton

1. Run `requirements-phase` on the closed skeleton grill. It writes
   `ARCHITECTURE.md` and `SPEC.md` in the skeleton's spec folder. The
   initiative-level architecture (shared shell, navigation catalog, platform
   layer) lives there, and every slice reads it.
2. Carry the grill `Technical debt` section into the spec.
3. Run `implement-spec`. Refresh the skeleton body with `pr-update` at each
   milestone. Mark it ready for review when the spec's checks pass.

## Each slice

Start a slice only after the PR below it is complete. Then:

1. Propagate the lower branch into the slice branch, following
   [stack mechanics](../references/stack-mechanics.md).
2. Run `requirements-grill` for the slice. Seed it with the skeleton
   decisions, the moved questions that target this PR, and the inventory
   rows in its scope. Work at module level. Reopen a skeleton decision only
   with new evidence, as a new superseding decision.
3. Run `requirements-phase`, then `implement-spec`, in the slice's spec
   folder.
4. Replace the placeholder body with the real one through `pr-update`.

## Turn

Report per PR: phase reached, open decisions, stack readback. Stop after
each PR, before starting the next.

Done when: the skeleton is merged, and each started slice has a closed
grill, an agent-ready spec, and a stack that still reads back in table
order.
