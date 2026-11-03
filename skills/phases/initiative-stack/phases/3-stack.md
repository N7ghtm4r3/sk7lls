# Phase 3: Stack

Goal: every PR from the slice table exists as a draft in one native GitHub
stack, so the whole initiative is visible before any code.

Creating PRs is an outward action. Confirm with the user before the first
push unless they already asked for the stack in this conversation.

## Steps

1. Open the skeleton branch in its own worktree with `switch-git-workenv`.
   When the commit gate needs installed dependencies, install them following
   machine guidance.
2. Commit the Brainstorm Brief on the skeleton branch, push, and open the
   skeleton PR as a draft against the trunk.
3. For each slice, bottom to top: create one empty commit on the tip of the
   previous branch, push it as the slice branch, and open a draft PR whose
   base is the previous branch. The empty commit lets GitHub open the PR
   without invented files. Commands are in
   [stack mechanics](../references/stack-mechanics.md).
4. Write bodies from [PR bodies](../references/pr-bodies.md). Each slice
   body carries its scope from the slice table, what it consumes, and the
   per-branch flow.
5. Link all PRs bottom to top into one native stack. Read it back through
   the API.
6. Link the PRs to the conversation when the host supports it.

## Adding a slice later

Add it only on top: base is the current top branch. Then extend the native
stack, update the stack line in the skeleton body, and record the addition
as a decision in the skeleton grill.

## Turn

Present the PR numbers, their bases, and the readback. Stop.

Done when: the API readback lists the PRs in slice-table order, the stack is
open, and every PR except the skeleton is a draft with exactly one empty
commit.
