---
name: switch-git-workenv
description: "Select or create a dedicated worktree for a requested Git branch, publish that task's changes on request, or remove its worktree only when explicitly requested and safe."
---

# Switch Git Workenv

Establish one target branch and worktree for the current task. Continue all repository work from that worktree. A later invocation can publish only this task's changes on the same branch when the user asks to commit or push.

## Inspect before changing Git state

Read and follow [readonly](../../agnostic/generic/readonly/SKILL.md) for this phase; the later worktree and publication phases use the authorization in the user's request. Read the repository root, current branch and worktree, `git status`, local and remote branch names, upstream configuration, and `git worktree list --porcelain`. Use task context and the user's request to identify the intended branch and worktree path. Do not fetch, checkout, switch, stash, reset, prune, or create anything during inspection.

Before any mutation, tell the user the **exact target branch**, **absolute worktree path**, and whether that worktree already exists or must be created. If either target is ambiguous, ask for the missing choice and keep inspecting anything independent of it. A branch name or path from the user takes precedence over a convention; do not silently choose another target.

## Enter the target worktree

- If the current worktree already has the target branch and path, use it as is.
- If the target branch is checked out in another worktree, use that worktree only when it is the requested or unambiguous target and does not belong to another active task. Do not create a second checkout of that branch or disturb work there.
- Otherwise create a separate worktree for the target branch at the selected path. Use the existing local branch when present; if only a remote branch exists, create a tracking local branch from that remote branch. If the branch is new, use the user-specified base or an unambiguous repository default. Never overwrite an existing path or branch to make creation succeed.
- If an existing target worktree contains changes from another task, preserve them and stop until the conflict is resolved. Do not use `git checkout` or `git switch` in an existing worktree to reach the target.

Use the target path as the working directory for every subsequent repository command and file operation. Do not assume that the chat's original checkout changed. Verify the repository root and branch in that working directory before edits, commits, and pushes. If the execution environment cannot operate from the target path, report that limitation rather than working in the original checkout.

Setup is complete only when the selected repository root, branch, and absolute worktree path are verified in the execution directory.

## Keep publication scoped

On a later invocation, re-inspect the target worktree and branch before continuing. If the user asks to commit or push, include only changes attributable to this task or explicitly assigned by the user. Inspect the candidate diff and preserve unrelated staged and unstaged changes, including changes from other tasks in the same worktree. Do not use broad staging, amend, force-push, rebase, or a checkout change as a shortcut.

Commit on the verified target branch. Push only that branch to its configured upstream; if it has none, establish one only when the intended remote is unambiguous. A request for commit only does not authorize a push. If the push is rejected or the target changed unexpectedly, stop and report the state rather than pulling or rewriting history automatically.

Report the active branch and worktree path after setup, and after publication report the commit and push destination. Invocation for setup alone does not authorize a commit or push.

## Remove the worktree when requested

Remove the target worktree only when the user explicitly asks for removal. First identify and report its exact branch and absolute path. Ensure it is the worktree created for this task or the one the user explicitly designated for removal, is not the primary checkout, and is not being used by another active task.

Inspect tracked, staged, unstaged, untracked, and ignored contents before removal. Finish any commit or push requested by the user, then verify that no work would be lost: the worktree is clean, relevant commits are recorded on the target branch, and no commits remain unpushed when publication was requested. If an upstream is absent, or ignored files may contain user data, establish their disposition from the user's instructions or stop and explain what remains. Never use `--force`, `rm -rf`, stash, reset, or branch deletion to make the check pass.

Use the normal `git worktree remove` operation for the verified path, then confirm that the path is gone and Git no longer lists it. Keep the branch and its commits intact. If removal fails, leave the worktree in place and report the reason; do not bypass Git's refusal. Do not remove a worktree merely because a commit or push succeeded.
