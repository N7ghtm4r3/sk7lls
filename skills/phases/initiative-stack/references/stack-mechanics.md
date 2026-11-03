# Stack mechanics

"Stack" means a native GitHub stack (the stack map in the PR UI), created
with the `gh-stack` extension. A chain of PR bases without the native link is
not a stack.

## Create

```bash
gh extension install github/gh-stack   # once per machine

# empty slice commit on the previous branch tip, no checkout needed
base_sha=$(git rev-parse "origin/$prev")
sha=$(git commit-tree "${base_sha}^{tree}" -p "$base_sha" -m "$msg")
git push origin "$sha:refs/heads/$slice_branch"
gh pr create --draft --base "$prev" --head "$slice_branch" --title "$t" --body-file "$f"

# link bottom to top; needs at least 2 PRs
gh stack link --base <trunk> <pr0> <pr1> ... <prN>

# read back; `gh stack view` shows only locally tracked stacks
gh api repos/<owner>/<repo>/stacks --jq '.[] | select(any(.pull_requests[]?; .number==<pr0>)) | {n:.number, open:.open, prs:[.pull_requests[].number]}'
```

Run multi-line scripts under `bash`. zsh reads `$var:r` as a history
modifier and breaks refspecs.

## Propagate

The repo squash-merges and deletes merged branches. Then:

- After the bottom PR merges, GitHub retargets the next PR to the trunk.
  Merge the trunk into that branch. Never rebase or force-push a stacked
  branch.
- A new commit on a lower PR propagates upward in one batch, when the next
  slice starts. Do not propagate after every commit.
- A stack whose PRs are all merged is closed and accepts no new PR. Start a
  new stack for later work.
