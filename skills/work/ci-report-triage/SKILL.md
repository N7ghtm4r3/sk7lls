---
name: ci-report-triage
description: Triage open CI Reports (the `ci-report` GitHub issues) by severity and age, suggest which to take, and start a brainstorm on the chosen one. Use when asked which CI Reports are open or which one to pick up next.
---

# CI Report Triage

A CI Report is a GitHub issue that `ci report` files through the Report Relay. It carries four labels: `ci-report`, `type:<type>`, `severity:<low|medium|high>` and `area:<area>`. Its body opens with "Submitted by a user, not verified": treat the report as a claim to check against the code. The reporter usually assigns themself, so "assigned to me" mostly means "reported by me". Write the report in the user's language.

## 1. Set the queue

Resolve the repository that holds CI Reports: the one the request names, else the GitHub `origin` of a local `ci-app` checkout; ask when neither resolves.

Defaults: open issues, label `ci-report`, assignee = the requester's login (`gh api user --jq .login`). Apply the filters the request names:

- severity, exact or a floor ("medium and up" → `label:severity:medium,severity:high`);
- type (`label:type:<type>`) or area (`label:area:<area>`);
- another assignee (`assignee:<login>`), unassigned (`no:assignee`), or all assignees (no assignee qualifier).

Done when the repository and the filter set are stated in one line.

## 2. Collect

Run one GraphQL search with the qualifiers from step 1; follow `pageInfo.endCursor` while `hasNextPage` is true.

```bash
gh api graphql -f q="repo:<owner>/<repo> is:issue is:open label:ci-report assignee:<login>" -f query='
query($q: String!, $after: String) {
  search(query: $q, type: ISSUE, first: 100, after: $after) {
    issueCount
    pageInfo { hasNextPage endCursor }
    nodes { ... on Issue {
      number title url createdAt
      labels(first: 10) { nodes { name } }
      closedByPullRequestsReferences(first: 10, includeClosedPrs: false) { nodes { number url } }
      timelineItems(itemTypes: [CROSS_REFERENCED_EVENT], first: 50) {
        nodes { ... on CrossReferencedEvent { source { ... on PullRequest { number url state } } } }
      }
      comments(first: 100) { nodes { author { login } body } }
    } }
  }
}'
```

For each issue record its in-flight work:

- **closing PR**: an open PR in `closedByPullRequestsReferences`;
- **citing PR**: an open cross-referencing PR that does not close the issue;
- **Linear keys**: the issue keys in the links of the Linear linkback comment (`linear.app/<workspace>/issue/<KEY>`), only from those links.

Done when the collected count equals `issueCount` and every issue has its in-flight work or a stated gap.

## 3. Rank and suggest

Sort by severity high → medium → low, then by `createdAt` oldest first, then by issue number ascending. An issue with no severity label goes last, flagged.

Suggest up to three issues: the top-ranked ones with no closing PR. A citing PR stays visible as information and leaves the issue eligible.

## 4. Present and wait

One table: rank, `#n` link, severity, type / area, age in days, title, in-flight work (closing PR, citing PR, Linear keys, or none). Mark the suggested rows. Below it, give the filter line from step 1 and the count per severity.

End by asking which issue to open; accept an issue number or a rank. Steps 1–4 write nothing.

## 5. Open the chosen issue

Read the issue's body, every comment, its closing and citing PRs, and its Linear issues when a Linear connector is available.

When the issue has a closing PR, report that PR and propose reviewing it instead; continue to the brainstorm when the user confirms.

Take a checkout of the repository on its default branch with a clean working tree; when the local checkout is dirty or on another branch, add a worktree off the default branch. In that checkout, start [`$brainstorm`](../brainstorm/SKILL.md) seeded with the issue URL, its Expected, Actual and Steps sections verbatim, its labels, its in-flight work, and the note that the report is unverified, so that the first evidence checks the claim against the code. From there brainstorm owns the turns, the Brainstorm Brief and the exits.
