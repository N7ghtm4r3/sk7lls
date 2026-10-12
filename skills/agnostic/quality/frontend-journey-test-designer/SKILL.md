---
name: frontend-journey-test-designer
description: Design and implement realistic complex frontend journey and browser end-to-end tests, regardless of runner. Use when Codex is asked to create, expand, review, or explain UI/E2E tests that cover multi-user workflows, shared frontend surfaces, auth/session behavior, projects/workspaces/tenants, role-based frontend access, cross-domain product flows, regression journeys, or user-story-driven frontend coverage with tools such as Playwright, Cypress, browser-mode test runners, or equivalent harnesses.
---

# Frontend Journey Test Designer

## Core Rule

Before implementing coverage, read the shared [incremental coverage method](../tdd/references/test-coverage-method.md) for waves, fixture responsibilities and naming, test levels, scope boundaries, and validation status. Reading that reference does not activate product implementation or another skill's execution mode.

Use one integrated journey-testing flow:

- Derive tests from actual product behavior, routing, auth, shared frontend components, and existing frontend test conventions.
- Prefer realistic user stories over synthetic role matrices. A strong test reads like: "admin invites a PM, PM creates a project, client can see the shared dashboard but cannot edit project settings."
- Cover multiple roles only when they represent distinct user intent, permissions, or UI state. Do not test every role mechanically.
- For role-sensitive domains, the first tracer-bullet journey must exercise the meaningful role handoff when supported by the product: the initiating actor who creates or shares the data, the authorized recipient/owner who consumes or mutates it, and at least one excluded role/user who must not see or change it.
- When those actors have different user intents, split them into separate tests with explicit names, for example creator success, authorized recipient mutation, and excluded user isolation. Do not hide distinct role contracts inside one long "does everything" test unless the product behavior is truly collaborative in one live session.
- This split is mandatory, not stylistic: if one role creates/submits/uploads and another role reviews/approves/mutates the result, create at least two separate frontend journey tests. The creator test must stop at the creator's observable contract and any creator-side isolation/persistence. The reviewer/recipient test must start from fixture/API-created setup or a focused prerequisite and cover the reviewer/recipient contract separately. A handoff tracer may prove data crosses the boundary, but it must not absorb both actors' full workflows into one combined test.
- Test through the browser or frontend harness with public user interactions: navigation, visible UI, forms, network boundaries, persistence, and session changes.
- Keep frontend assertions user-observable first. Inspect storage, network, database, or API state only when needed to prove side effects, isolation, or security boundaries.

Be exhaustive for the target journey, not random. "Good coverage" means the suite proves meaningful auth branches, role-specific UI states, shared components, domain transitions, data isolation, failure states, and persistence outcomes for the selected stories.

For test, fixture, seed, or harness work, never modify production source code or production runtime behavior in either the frontend or backend. This is mandatory. Do not add test-only selectors, endpoints, branches, flags, authentication bypasses, dependency-injection seams, exposed internals, or alternate application wiring to production code.
Preserve library, SDK, and runner implementations, production dependencies, packaging, and published artifacts too. If a journey requires an out-of-scope intervention, keep its verified RED visible, report evidence and the necessary intervention, and stop that case plus dependent cases pending explicit authorization. Continue independent coverage. Prior explicit authorization remains valid within its scope; never hide a product or library modification inside test/harness work.

## Real System Fidelity

Treat a frontend journey that crosses a backend or service boundary as end-to-end only when it uses the real deployable system built from production sources.

- Build and run the backend or service through its normal production build artifact and supported runtime entrypoint.
- Use isolated infrastructure, external configuration, deterministic seed data, and cleanup to make the real system safe and repeatable for tests.
- Do not create an alternate test backend, mock server, fake repository layer, intercepted response set, or duplicated implementation of production behavior merely to make a journey pass.
- Do not add test-only endpoints, branches, authentication bypasses, or application wiring to production code. Perform setup externally or through supported public interfaces.
- Prefer existing project orchestration. Keep service startup and teardown separate from the frontend test implementation unless the repository already establishes another convention.
- Provision data through public APIs or supported external data-loading mechanisms. Fixtures may describe data, but must not replace the backend behavior the journey claims to exercise.
- If the real system cannot be built, started, reached, or seeded, report that as an environment blocker. Do not present a mocked or in-memory pass as end-to-end validation.
- Use mocked boundaries only when the user explicitly requests a component or contract test, or when the repository clearly classifies that suite as lower-level coverage. Label the result accordingly and do not call it an E2E journey.

Apply these rules without assuming a particular language, framework, database, container runtime, test runner, or deployment platform.

## Mandatory Local and CI-Compatible Journey Harness

Every cross-boundary frontend journey suite must use a harness that operates the real system locally and is directly reusable by CI. CI compatibility is mandatory even when the current request covers local execution only. Harness discovery is mandatory before any harness design or implementation.

- If a suitable harness already exists anywhere in the repository, use it. Do not recreate, replace, fork, shadow, or build a parallel harness.
- If the existing harness is incomplete or not CI-compatible, extend it minimally within its established test-scoped architecture and conventions. Do not introduce a second orchestration path.
- Create a new harness only after repository inspection establishes that no reusable harness exists, and record that finding before editing.

Only when no harness exists, create the smallest harness that satisfies this lifecycle:

```text
build real artifacts
start isolated dependencies and real services
wait for readiness
apply deterministic seed data
provide reachable runtime addresses
run journeys
always clean up
```

Keep the lifecycle contract technology-agnostic, but implement each operation with the actual build tools, runtimes, services, and infrastructure used by the repository.

- Discover the repository's existing harnesses, technologies, and supported commands before designing anything; do not impose a preferred stack.
- Keep the harness limited to process and infrastructure orchestration. It must not implement business rules, API behavior, authorization decisions, persistence behavior, or frontend state.
- Build the same production artifacts that the real system normally runs. Do not create a test-specific backend implementation or compile production sources through alternate behavior-changing paths.
- Keep harness code and configuration in test-scoped or external orchestration locations. Test-only build configuration must not alter production artifacts, dependencies, packaging, startup behavior, or runtime configuration.
- Inject addresses and infrastructure configuration through the repository's supported external configuration mechanisms. Do not hardcode environment-specific addresses into journey specifications.
- Make readiness, seed, isolation, failure propagation, and cleanup explicit and deterministic.
- Expose non-interactive commands with reliable exit codes so a CI runner can execute the same build, start, readiness, seed, journey, and cleanup lifecycle without rewriting it.
- Accept environment-specific addresses, ports, credentials, paths, and secrets through supported external inputs. Never depend on a developer's absolute paths, shell profile, saved session, IDE, GUI, keychain, or manually running process.
- Make cleanup run on success, failure, cancellation, and timeout. Avoid prompts and hidden local state.
- Keep local and CI execution on the same harness and lifecycle. CI may supply different external configuration, but must not require a parallel harness or different journey implementation.
- Do not create or edit a CI pipeline unless the user requests it. Still verify and report that the produced harness interface is suitable for headless CI execution.
- If the harness cannot operate the real system without changing production code, stop and report the missing production capability as a blocker. Do not work around it by simulating the system or modifying production from the test layer.

Before writing tests:

1. Read existing frontend/E2E test configuration, fixtures, setup projects, and auth/session-state patterns.
2. Read the target pages/routes/components and any shared layout, nav, guard, or form components they use.
3. Read auth/session code and role/permission definitions.
4. Read API routes, schemas, seed helpers, factories, and existing test data lifecycle used by the frontend flow.
5. Read the real backend/service build, startup, readiness, configuration, data-seeding, and cleanup path before designing a cross-boundary journey.
6. Read existing CI configuration and runner constraints when present, solely to preserve compatibility; do not modify the pipeline unless requested.
7. Inspect existing E2E tests and reuse naming, page objects, fixtures, selectors, retries, and cleanup patterns.
8. Define the production boundary before editing: list production files and runtime behavior that the test/harness work must not change, plus the test-scoped or external locations it may change.
9. If the requested journey is not already concrete, ask for a brief flow description and the product domains it crosses before editing tests.
10. Decide the mode:
   - **Coverage mode**: verify established frontend contracts without product changes. Characterize current behavior when requested; do not automatically make an observed defect a GREEN expectation.
   - **TDD product/fix mode**: write one failing journey slice for desired behavior. Implement production changes only as an explicitly authorized, separate product slice; never as part of fixture or harness setup.

## Journey-Aware TDD Flow

Use this flow when the user asks for frontend journey tests, browser/E2E coverage, a bug fix, a regression test, a changed UX contract, or realistic multi-user UI scenarios.

### 1. Frontend Reconnaissance

Read first, then test:

- test runner config, projects/browsers, baseURL, storage/session states, global setup, trace/video/screenshot policy when available
- real backend/service artifact, supported startup command, readiness signal, isolated dependencies, configuration inputs, seed path, and cleanup path
- route/page files, protected route guards, shared layouts, nav, dialogs, tables, forms, toasts, and error boundaries
- auth login/logout/session refresh behavior
- role and permission model
- API contracts called by the UI
- test factories, seed/reset helpers, and existing fixtures
- accessibility names and stable selectors already used by the suite

Prefer `getByRole`, `getByLabel`, `getByText` for user-facing controls. Use `data-testid` only if it is already an established local convention or accessibility locators are genuinely unstable.

### 2. User Story Inventory

Build a behavior-oriented inventory before editing tests. Include only stories a real user could plausibly perform.

If the user did not already provide them, ask these two short intake questions before choosing or implementing a complex journey:

- What is the flow in one or two sentences?
- Which domains does it cross, such as auth, customers/clients, projects, tasks, analytics, billing, notifications, or portal?

Always consider:

- **Personas and roles**: anonymous visitor, invited user, admin/owner, PM/operator, client/customer, read-only user, suspended/inactive user when supported.
- **Auth lifecycle**: login, logout, expired session, session switching between users, forbidden navigation, redirect-after-login, direct deep links.
- **Shared UI surfaces**: app shell, navigation, project switcher, search, filters, tables, empty states, modals, forms, toasts, breadcrumbs, sidebars, pagination, settings panels.
- **Domain journeys**: auth -> project/workspace -> dashboard/reporting; project -> members -> permissions; client/customer -> shared content; notification/email link -> protected resource.
- **Data states**: no data, one owned item, one inaccessible item, mixed visible/hidden data, archived/deleted/disabled items, validation conflicts, stale state after mutation.
- **Failure states**: API validation error, 401/403/404, network failure, slow response/loading state, optimistic update rollback, duplicate submission prevention.
- **Security and isolation**: cross-tenant/project access, hidden actions, disabled controls, direct URL attempts, sensitive field leakage in visible UI or downloadable content.
- **Persistence**: reload after mutation, new tab/session, role switch, local storage/session storage only when user-observable behavior depends on it.

For each candidate story, mark:

- primary user intent
- roles involved
- domains crossed
- shared UI surfaces touched
- expected visible result
- side effect or isolation rule to prove
- whether it documents current behavior or asserts desired behavior

Group related stories into waves using the shared method. Identify new and reused coverage, UI boundary, fixture ownership, prerequisites, target/browser differences, invariants, and separate implementation/validation criteria. Keep actor-specific contracts distinct inside each wave.

Before implementing any fixture-dependent journey, complete the shared method's mandatory fixture readiness phase. Verify prerequisite identities/data, sessions, reachable services, and owned cleanup for the relevant targets first, reusing applicable evidence. This applies to the first tracer bullet as well; do not write dependent journeys against unready fixtures or defer lifecycle ownership until after implementation.

### 3. Scenario Selection

Select scenarios by risk and product meaning:

- Start with one tracer-bullet journey that crosses routing, auth, data setup, UI interaction, API persistence, and final visible state.
- Add role and ownership branches where the UI or backend permissions differ.
- Add one representative negative path for each distinct failure mode, not one per field unless validation behavior differs.
- Add shared-component coverage through realistic flows that use the component, instead of testing the component in isolation through an E2E runner.
- Cover cross-domain transitions when they are common user workflows, such as creating a project and then seeing it in analytics, members, or client-facing areas.
- Put cross-domain journey tests in the repository's flow/complex-flow area when one exists, and use filenames plus `describe`/`it` names that state the business behavior, actors, and visible outcome.

Avoid absurd scenarios. Do not write tests where users perform nonsensical actions only to touch code. If a branch is technically possible but not a meaningful user story, explain a lower-level test or residual gap. A lower-level test does not fulfill a requested UI contract; agree any substitution that changes the requested outcome.

### 4. Vertical Red-Green Slices

Do not design every complex flow and then implement all tests at once.

Use vertical slices:

```text
RED:   Write one frontend journey test for one public user journey -> prove it fails for the expected reason in TDD mode.
GREEN: Implement the smallest authorized change at the correct boundary -> prove the test passes. Test/harness work may change only test-scoped or external orchestration artifacts.
CHECK: Run a narrow test command for the changed spec/project/browser.
NEXT:  Use what you learned to choose the next behavior.
```

Rules:

- One journey or branch at a time.
- One failing test at a time in TDD product/fix mode.
- Keep tests deterministic: wait for user-visible states or specific network responses, not arbitrary timeouts.
- Prefer isolated setup through factories/API helpers over UI setup unless the setup itself is the behavior under test.
- Correct erroneous tests/fixtures without weakening the intended contract; retain verified product REDs rather than forcing GREEN through product or library changes.
- Do not refactor production while its authorized TDD slice is red. Refactor page objects or fixtures only when necessary or when removing material duplication, preserving earlier assertions and verified product REDs.

### 5. Tracer Bullet First

For a new area or large E2E suite, start with one realistic end-to-end tracer bullet.

Examples:

- `admin creates a project, assigns a PM, and the PM sees it in the project switcher after login`.
- `client follows an invitation link, completes onboarding, and lands on the shared project dashboard with edit controls hidden`.
- `PM updates project status from the dashboard and the change persists after reload and appears in the project list`.
- `owner removes a member and the removed user is redirected away from the project on refresh`.

After the tracer bullet is executed and classified, add independent branches for permissions, validation, empty states, and failure handling. Stop dependent cases when a missing product or runner capability blocks them.

### 6. Multi-User Session Pattern

Use separate browser contexts for distinct users when the story involves two active identities.

Prefer this shape when it matches the repo:

```ts
test("owner invites a PM who can access the project but not billing", async ({ browser }) => {
  const ownerContext = await browser.newContext({ storageState: ownerState });
  try {
    const pmContext = await browser.newContext({ storageState: pmState });
    try {
      const ownerPage = await ownerContext.newPage();
      const pmPage = await pmContext.newPage();

      // owner performs setup visible through the UI or API-backed fixture
      // PM verifies the resulting access and forbidden surfaces
    } finally {
      await pmContext.close();
    }
  } finally {
    await ownerContext.close();
  }
});
```

Rules:

- Do not switch users in the same page by overwriting cookies unless the existing suite intentionally does that.
- Use storage state only when it comes from trusted setup. Prefer real login helpers when auth behavior is part of the story.
- When testing direct-link authorization, navigate as the disallowed user to the protected URL and assert redirect/403/hidden data.
- When testing collaboration, prove both sides: initiator sees the side effect, recipient sees allowed state, unrelated user does not see it.

### 7. Test Data Design

Build fixtures that prove inclusion and exclusion.

For complex frontend journeys, create:

- one item the active user should see
- one item the active user must not see
- one item with a different status/project/tenant when filters or tabs matter
- a minimal related domain object, such as project, member, client, report, notification, or billing setting
- realistic names that make failures readable, such as `Alpha Rollout`, `Archived Client Portal`, `External Client Viewer`

Keep setup minimal but intentional. Avoid huge seeds that make assertions ambiguous. Clean up through the repo's existing reset strategy.

If a flow spans multiple domains, make that visible in fixture names and assertions:

```text
Project: "Alpha Rollout"
Client: "Northstar Client"
Report: "June KPI Review"
Excluded project: "Other Tenant Migration"
```

### 8. Assertions

Assert more than "page loaded".

For each meaningful test, verify:

- final URL or route state when it matters
- visible heading, row, card, tab, dialog, toast, or form state
- enabled/disabled/hidden actions by role
- response to forbidden direct navigation
- mutation side effects after reload or second session
- inaccessible data absence
- important network failure or validation messages
- absence of sensitive UI fields or controls

Prefer exact assertions for stable UI. Use partial or regex assertions for dynamic copy, timestamps, IDs, or localized content. Do not rely on list order unless the UI explicitly sorts.

Good examples:

```ts
await expect(page.getByRole("heading", { name: "Alpha Rollout" })).toBeVisible();
await expect(page.getByRole("button", { name: "Invite member" })).toBeHidden();
await expect(page.getByText("Other Tenant Migration")).toHaveCount(0);
```

Avoid:

```ts
await page.waitForTimeout(1000);
expect(await page.locator(".card").count()).toBeGreaterThan(0);
```

### 9. Existing Behavior vs Desired Behavior

Be explicit about what the test proves:

- **Requested characterization**: document current behavior when the user asks for it. Name unsafe or confusing behavior honestly and report the risk; a pass does not prove the expected contract is correct.
- **Expected contract coverage**: assert established UI, access, persistence, and isolation contracts. Retain verified product REDs without changing production or converting the observed defect into a GREEN expectation.
- **Desired behavior TDD**: use when the user asked for a bug fix, security hardening, or UX/product change. Write a failing frontend journey test for the desired invariant, then treat any production modification as a separately authorized product slice.
- **Ambiguous behavior**: report observations and missing contract evidence; clarify the expected behavior rather than inventing requirements or automatically characterizing a defect as correct.

Name tests honestly:

```ts
test("documents that PMs can currently open another PM's shared report by URL", async ({ page }) => {
  // current behavior documentation; report as residual risk
});
```

```ts
test("prevents PMs from opening reports from another project by direct URL", async ({ page }) => {
  // expected isolation contract; retain RED unless a product fix is authorized
});
```

### 10. Page Objects and Helpers

Follow the existing suite style. If no style exists:

- Keep simple flows inline until duplication becomes painful.
- Extract only stable, user-level actions: `loginAs`, `createProject`, `openProject`, `inviteMember`, `expectForbidden`.
- Do not build page objects that mirror every DOM element.
- Keep selectors close to the behavior they prove.
- Keep helpers role-aware when they create sessions or storage state.

Prefer helper names that read as user actions:

```ts
await projects.createViaApi({ ownerId, name: "Alpha Rollout" });
await loginAs(page, users.pm);
await openProject(page, "Alpha Rollout");
```

### 11. Mandatory Summary First

For any frontend journey test implementation turn, the reporting order is a hard contract:

1. Write a block that starts exactly with `Mandatory summary`.
2. Only after that block, ask the final validation gate or send the final answer.
3. Never send a final answer, validation-gate question, or short "done" message before this block exists in the same assistant message.

The `Mandatory summary` block must contain, in this order:

- `Changed files:` with the changed spec file or files.
- `Implemented journeys:` with 1-3 bullets. Each bullet must name the actor/role, the visible workflow/page, and the invariant proved or documented.
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

Start with a mini summary of the tested flows inside `Mandatory summary` before listing implementation details. Keep it short, 2-5 bullets, and phrase each bullet as a user-visible journey plus the invariant it proves or documents. If a test documents current broken or unsafe behavior, include that in the mini summary instead of burying it later.

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
