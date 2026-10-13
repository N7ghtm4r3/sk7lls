---
name: ship-round
description: "Publish the current work round through Git when asked to deploy, commit, or ship it. Commit only owned changes and push by default; honor commit-only requests."
---

# Ship Round

Commit exactly the changes produced by the current round of work. Treat the invocation as authorization to commit and push that change set; if the user says commit only, do not push.

## Mandatory non-modification boundary

This is a publication-only skill. The following boundary is mandatory and overrides convenience or cleanup:

- Do not edit, create, delete, rename, move, format, generate, restore, or otherwise alter any source file or repository content while executing this skill.
- Do not fix code, update documentation, regenerate artifacts, apply formatting, run autofixers, update dependencies, or perform any other implementation work, even if inspection reveals a problem.
- Use only read-only inspection plus the minimum Git index, commit, and push operations required for the owned round changes.
- Files and hunks outside the owned round set must remain byte-for-byte unchanged, with their staged and unstaged state preserved exactly.
- If the round cannot be isolated without modifying unrelated files or their index state, stop and report the blocker. Never alter those files as a workaround.

## Establish ownership

- Locate the repository and record the current branch, `HEAD`, upstream, `git status --short`, staged diff, and unstaged diff before changing the index.
- Derive the owned change set from the current round's actual actions: patches applied, files created, formatter output intentionally caused, and changes explicitly assigned to this agent. Git status alone does not establish ownership.
- Exclude changes that predate the round or belong to the user or another agent. Preserve their working-tree and index state.
- When a file contains both owned and foreign changes, include only the owned hunks. If hunk ownership cannot be established reliably, exclude that hunk and report it rather than guessing.
- Never broaden the set with `git add .`, `git add -A`, a directory-wide pathspec, or an equivalent catch-all.

## Commit the round

Inspect the exact candidate diff, then use the least invasive Git mechanism that keeps unrelated staged and unstaged work intact:

- For paths wholly owned by the round with no foreign hunks, prefer a path-limited commit that ignores unrelated staged paths, such as `git commit --only -- <exact-paths>`.
- For mixed-ownership files, stage or commit an exact patch containing only owned hunks. Use an isolated temporary index when needed. Do not reset, stash, discard, or rewrite unrelated work to simplify the commit.
- Quote pathspecs safely and pass `--` before paths.
- Re-check the candidate immediately before committing. If `HEAD` or any candidate path changed unexpectedly during preparation, recompute ownership and the patch before proceeding.
- Write a concise commit message that describes the round's completed change. Do not create an empty commit.

## Verify the owned commit

After committing, verify the new commit with `git show --stat --oneline HEAD` and `git diff HEAD^ HEAD -- <committed-paths>`. Confirm that every committed path or hunk belongs to the round and that unrelated staged and unstaged changes remain present.

## Push by default

Push the new commit unless the user explicitly requested commit-only mode.

- Push the current branch to its configured upstream.
- If no upstream exists and a single intended remote is unambiguous, establish it with a normal non-force push such as `git push -u origin HEAD`.
- Never force-push, change branches, rebase, amend an existing commit, or push to an ambiguous remote without explicit user direction.
- If the push is rejected, report the rejection and stop. Do not pull, merge, rebase, or retry by rewriting history unless the user asks.

Report the commit hash, subject, committed paths, and push destination. In commit-only mode, explicitly state that no push was performed. Also identify any uncertain or foreign changes deliberately left out.
