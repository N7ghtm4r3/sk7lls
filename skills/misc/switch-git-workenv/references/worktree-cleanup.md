# Worktree Cleanup

Use `$switch-git-workenv clean-worktrees [repository]` only when the user requests
cleanup. The optional repository selects the scope; otherwise use the current
task's repository. Resolve an ambiguous repository before removing anything.
This is a skill request mode, not a shell command. Editing the cleanup skill is
not a request to execute cleanup.

## Inspect the selected repository

Read and follow [Readonly](../../readonly/SKILL.md) during
inspection. Determine the repository, its primary checkout, the current execution
directory, and linked worktrees from `git worktree list --porcelain`. Limit the
inventory to that repository. Discover host-managed worktree identities and
available task/session activity through read-only host tools when available.

For each candidate, inspect its absolute path, branch or detached HEAD, lock and
prunable state, ownership, and activity. Read its staged, unstaged, untracked, and
ignored contents and the relevant branch/upstream history. Do not expose secret
file contents while checking whether ignored files need preservation.

## Establish eligibility

Remove a worktree only when all of the following hold:

- **Unused and inactive:** available task/session state establishes that its
  owner has finished or released the checkout, and no active task, command,
  service, or other known consumer still uses it. Explicit user confirmation
  that a checkout is no longer used can resolve uncertain ownership. Clean Git
  status, a merged branch, age, or no visible terminal alone is insufficient.
  Unknown ownership or activity means skip, not assume inactivity.
- **Unprotected checkout:** it is neither the primary checkout nor the current
  execution worktree, and is not pinned, shared, locked, or protected by its host.
  Skip checkouts with initialized submodules or embedded repositories when safe
  removal cannot be established through the supported lifecycle.
- **No work lost:** staged and unstaged changes and untracked work are absent.
  Ignored contents are either absent or known disposable generated outputs;
  credentials, local configuration, user data, and uncertain files keep the
  checkout ineligible until their disposition is explicitly established.
- **History preserved:** retain the branch and its commits. For detached HEAD,
  establish that its commits are reachable from a retained branch or remote
  reference. Skip unpublished work or a missing upstream unless the user has
  explicitly established how that history should be retained. Cleanup does not
  authorize committing, pushing, or deleting branches.
- **Supported removal:** an appropriate removal operation is available. For
  app-managed worktrees, use the host's supported archive/removal lifecycle so
  its registry and attachments remain consistent. If that lifecycle cannot
  manage the candidate within the current task's permissions, skip it.

Record each candidate as eligible or skipped with evidence and a reason. Report
missing paths and stale/prunable registrations separately; they do not establish
that another checkout is safe to remove.

## Present the inventory and request confirmation

A cleanup request authorizes inspection and a removal proposal only. Before any
mutation, present a table covering all discovered worktrees, including protected
and skipped ones. Include these columns:

| Worktree (absolute path) | Branch or detached HEAD | Ownership and activity | Git and ignored-content state | Proposed action and reason |
| --- | --- | --- | --- | --- |

Distinguish verified inactive, active, and unknown activity. State whether each
checkout is eligible for removal/archive, protected, or skipped, and explain why.
Include stale/missing registrations with their status rather than treating them
as removable checkouts. Summarize the exact eligible set and request confirmation
of those rows. The user may approve a subset.

Wait for explicit approval after the table is shown. The initial cleanup request,
silence, or a request to change the procedure is not confirmation. If no candidate
qualifies, explain that no removal is proposed. Leave uncertain candidates intact
and identify the evidence or preservation decision needed to reconsider them.

## Remove only confirmed candidates

Restrict removal to eligible rows the user approved. Newly discovered candidates
or material changes to a proposed action require an updated table and confirmation
before they can be included. Approval does not bypass the eligibility checks.

Immediately before each confirmed removal, recheck ownership/activity, protection state,
contents, and HEAD. Skip a candidate if its state changed or any check fails.
Never stop another task or process to make a checkout eligible.

For app-managed worktrees, use the supported archive/removal operation. For
ordinary Git worktrees, use `git worktree remove -- <absolute-path>`. Keep branch
references intact. Preserve Git's and the host's refusal conditions: do not use
force, recursive filesystem deletion, unlocking, stash, reset, or broad pruning
to bypass them. If removal fails, report the reason and continue only with other
independently verified candidates.

Confirm each removed path is gone and no longer appears as an active worktree
in Git and, where applicable, the host registry. A host archive may retain a
recoverable snapshot or archived attachment; report that outcome accurately.
Summarize removed/archived paths and branches, skipped candidates with reasons,
and verification failures. If nothing qualifies, report that no worktrees were
removed. Cleanup never includes archiving chats or publishing repository changes.
