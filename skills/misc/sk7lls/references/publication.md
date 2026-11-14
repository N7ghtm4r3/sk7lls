# Publication

Use this phase only for the approved skill content and destinations. It authorizes the declared skill directories and the library's necessary Git operations; it does not execute the workflow described by the proposed skill.

## Recheck and save

1. Recheck the library's identity, branch, upstream, `HEAD`, staged and unstaged changes, and both destination paths. For `fix`, compare the files being updated at each destination with the base content reviewed for approval; reconcile intervening edits before applying the correction. If a separate checkout was approved, create it now from the approved remote. Inspect applicable repository instructions before writing. Preserve unrelated files and staged work. If another change now conflicts with the approved files or the push would include unrelated unpublished commits, stop and explain the conflict before publishing.
2. Write the approved files under the library's selected skill directory. For `fix`, apply the approved edits in place, preserving unchanged files; perform only the deletions or renames included in the proposal. Verify frontmatter, invocation policy, supporting references, and packaging using applicable non-destructive checks. Run code-bearing checks only when their actual effects fit the approved scope. An unexpected validation failure is not permission to execute or modify the inspected project.
3. Install or update the same complete skill in the approved local directory. Use the established copy or symlink convention, avoiding duplicate writes when both paths resolve to the same destination. Approval of `fix` authorizes updating the identified installation, including the explicitly reviewed reconciliation of local differences; it does not authorize replacing a different skill or unrelated local edits. Preserve any other pre-existing skill or broken link until its replacement is explicitly authorized. Verify the local `SKILL.md` and required support files are readable and match the approved result at that destination.

Before committing, both the canonical files and the local installation must be verified. If validation requires a material content change, return the revised proposal for approval; avoid repeated approval for unchanged content and mechanical packaging corrections.

## Commit and direct push

1. Review the exact diff and whitespace checks. Stage only the approved files by explicit paths. Create a commit containing only those changes while preserving unrelated staged and unstaged work. Never use a catch-all stage, overwrite unrelated files, or reset or stash someone else's work to simplify publication.
2. Verify the commit's paths and content, then push it normally to the approved library remote and branch. This flow uses a direct push, without a pull request, CLI synchronization, or baseline release. If branch protection requires a pull request or a push is rejected, report the blocker; do not bypass protection, force-push, or change the agreed publication flow automatically.
3. Confirm the pushed commit is present on the destination branch using remote readback. If publication fails or cannot be verified, report the exact completed stages: canonical save, local installation, commit, and push confirmation. Preserve the installed files and commit so an authorized retry can continue without recreating them. Reuse existing approval for the same publication; reconcile intervening remote changes before retrying and obtain approval for any material change of scope.

Completion requires a usable local skill and a confirmed publication of the approved content. Return their locations, commit, push destination, and real validation results. Any dry-run result remains a simulation with its previously stated limits.
