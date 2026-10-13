### 11. Mandatory Summary First

For any frontend journey test implementation turn, the reporting order is a hard contract:

1. Write a block that starts exactly with `Mandatory summary`.
2. Only after that block, ask the final validation gate or send the final answer.
3. Never send a final answer, validation-gate question, or short "done" message before this block exists in the same assistant message.

The `Mandatory summary` block must contain, in this order:

- `Changed files:` with the changed spec file or files.
- `Implemented journeys:` with one brief bullet per implemented journey and no fixed bullet-count limit. Each bullet must name the actor/role, the visible workflow/page, and the invariant proved or documented.
- `Iterative validation:` with the exact narrow command and pass/fail result, or a clear note that no narrow run was possible.

Required template:

```text
Mandatory summary
Changed files: <path>
Implemented journeys:
- <role> <visible workflow/page>, proving/documenting <invariant>.
Iterative validation: <command> -> <pass/fail or blocker>.
```

Before sending any final answer or validation-gate question, perform this self-check:

- Does the message start its status/reporting content with `Mandatory summary`?
- Are file(s), journey bullet(s), and iterative validation present?
- Is `Implementation ready` after the summary block, not before it?

If any answer is "no", rewrite the message before sending. This rule exists because short final messages are easy to produce accidentally; do not rely on memory or implication.

### 12. Validation Gate

Use authorized narrow frontend/E2E commands while iterating. Before final response, reuse the user's selected validation scope while it remains applicable, including choices from earlier turns; ask only if the choice is missing. Honor an explicit request for no execution. Do not present a narrow iterative run as final validation.

Final gate choices:

- **Current spec gate**: run only the new or changed frontend/E2E spec for the relevant browser/project.
- **Domain gate**: run all frontend/E2E specs for the affected domain, such as auth, projects, members, or dashboard.
- **Full E2E gate**: run the full frontend/E2E suite across configured projects/browsers.

Before asking for the final validation scope, briefly summarize what changed and what narrow iterative validation has already run. Keep it concise, but include enough context for the user to choose the gate intelligently: the new/changed spec file, the user journey covered, the main invariant proved or documented, and the narrow command result if one was run.

Mandatory summary-before-options rule:

- Do not show the final validation options until after the exact `Mandatory summary` block has been written in the same message.
- The `Mandatory summary` block must appear before the sentence that starts `Implementation ready`.
- If the exact block is missing, the validation question is not complete and must be rewritten before sending.

Then use this exact final validation question unless there is a strong reason to adapt wording. The question must explain that `1`, `2`, and `3` are selectable validation scopes, so the user never has to ask what the numbers mean:

```text
Implementation ready. Choose the final validation gate by replying with 1, 2, or 3:
1. Current spec gate: rerun only the new or modified test file/spec. This is the fastest check.
2. Domain gate: run all frontend/E2E suites for the affected domain, such as dashboards, clients, or tasks.
3. Full E2E gate: run the entire configured frontend/E2E suite. This is the most comprehensive and slowest check.
```

Mandatory stop rule:

- If a validation choice is missing, ask after implementation and narrow iteration are done, before starting a costly domain/full command and before sending the final answer. Do not repeat an applicable prior choice for each wave.
- Do not send a final answer for frontend journey test implementation work until one of these is true:
  - the user has explicitly chosen **Current spec gate**, **Domain gate**, or **Full E2E gate**;
  - the user explicitly asked for no test execution;
  - the validation command is technically impossible to run, and the blocker plus exact command are reported.
- If the user chooses the current spec gate, report it as targeted validation rather than full E2E confidence.
- If a broader gate is skipped by user choice, say that plainly in the final report.

Use the repo's actual commands. Common examples:

```bash
npx playwright test tests/e2e/projects.spec.ts --project=chromium
pnpm playwright test e2e/auth --project=chromium
pnpm cypress run --spec cypress/e2e/projects.cy.ts
pnpm test:e2e
```

If the suite requires a dev server, database, Docker, test credentials, or seeded services, use the repository's documented setup. Do not weaken the test by skipping auth, persistence, or network boundaries unless the user explicitly asks for a mocked-only pass.

When reporting validation, include:

- command run
- pass/fail result
- number of tests and browser/project when available
- real backend/service artifact and runtime entrypoint used for cross-boundary journeys
- confirmation that the final diff contains no test- or harness-driven production source or runtime-behavior changes
- CI-compatibility evidence: non-interactive command, external inputs, exit-code behavior, and guaranteed cleanup, without claiming a pipeline was created when it was not requested
- whether traces/screenshots/videos were produced
- any skipped broader gate or environmental blocker
- per-wave implementation and validation status, logical cases separate from target/browser executions, and planned, implemented, discovered/executed, GREEN/RED, blocked, and unreached assertions
- fixture readiness status and evidence before dependent journeys, including reused fixtures or a justified non-applicable phase

## Final Test Documentation

After integrating or changing frontend journey tests, explain them as user-story documentation.

Mandatory final-report rule:

- Start final reports with `Mandatory summary`, using the exact structure from section 11.
- Do not send a final answer after frontend journey test work unless it includes the mini summary of tested flows.
- Do not replace the mini summary with only file names, commands, or a generic "added E2E tests" sentence.
- Keep the answer concise if needed, but preserve three distinct parts: mini summary, changed test files/implementation notes, and validation result or skipped gate.
- If the user interrupts or asks for a shorter answer, still include at least one bullet per implemented journey, naming the actor, visible workflow, and invariant proved/documented.

Start with a mini summary of the tested flows inside `Mandatory summary` before listing implementation details. Use one brief bullet per implemented journey, and phrase each bullet as a user-visible journey plus the invariant it proves or documents. If a test documents current broken or unsafe behavior, include that in the mini summary instead of burying it later.

Group by domain or journey. For each meaningful test or grouped slice, include:

- test name or concise paraphrase
- users/roles involved
- pages/domains crossed
- setup that matters
- expected visible result
- side effect, isolation rule, or security behavior proved

Prefer this shape:

```text
Mini summary
- owner invites PM into Alpha Rollout and PM sees the project after login, proving invitation persistence and role handoff.
- unrelated PM deep-links to Alpha Rollout and is blocked without project data leakage, proving cross-project isolation.

Projects / Members
- owner invites PM into Alpha Rollout: owner starts from project settings, sends an invitation, PM logs in with a separate browser context, sees Alpha Rollout in the project switcher, and cannot access billing settings.
- unrelated PM cannot open Alpha Rollout by URL: seeds another project, logs in as an unrelated PM, deep-links to Alpha Rollout, and proves the app shows forbidden navigation without leaking project data.
```

When tests document unsafe current behavior, say that plainly:

```text
Reports
- documents current direct-link exposure: PM opens another PM's report URL and currently sees 200/visible report content. Residual risk: this is not an authorization guarantee.
```

Do not summarize as "added E2E tests for auth and projects." Name the story, roles, UI, data setup, and invariant.
