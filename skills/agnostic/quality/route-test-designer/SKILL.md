---
name: route-test-designer
description: "Design, implement, expand, review, or explain backend route/API tests for endpoint coverage, authorization, validation, side effects, and edge cases; test-drive route features or fixes only with product authorization."
---

# Route Test Designer + TDD

## Core Rule

Before implementing coverage, read the shared [incremental coverage method](../tdd/references/test-coverage-method.md) for waves, fixture responsibilities and naming, test levels, scope boundaries, and validation status. Reading that reference does not activate product implementation or another skill's execution mode.

Use one integrated route-testing flow:

- For existing route behavior or test-only work, derive scenarios from repository evidence and expectations from the established product contract and user intent, not from a generic role matrix or a guessed API contract.
- For explicitly authorized new route behavior or product fixes, use test-driven development: write one failing route/API test, implement the smallest authorized production slice to pass, then repeat. Creating a regression test alone does not authorize that production slice.

Tests should verify behavior through public interfaces, not implementation details. Prefer real HTTP flows through the API harness. A good route test reads like a specification: "PM cannot update another PM's client" or "refresh stores partial provider metrics and falls back for failures."

Be exhaustive for the selected behavioral contracts. When whole-route coverage is requested, every meaningful way the route can return a different status, shape, data set, side effect, or security posture must be tested or explicitly identified as unreachable, defensive, blocked, or residual risk. Do not expand a bounded wave into unsolicited whole-route work or describe a suite as exhaustive merely because coverage percentages are high.

Never modify production code only to make coverage easier or reach 100%. Do not refactor, simplify, remove defensive branches, export internals, change serializers, change auth behavior, or otherwise adapt production code for coverage unless the user explicitly asks for a production fix or new behavior. If 100% cannot be reached through tests alone, document the exact unreachable line/branch and why.

Test-only work must also preserve libraries, SDKs, runner implementations, production dependencies, packaging, and application wiring. Keep verified behavioral REDs visible. Stop only the affected and dependent cases when an out-of-scope intervention is needed, report evidence and the necessary intervention, and continue independent coverage. Use existing explicit authorization within its scope.

Before writing tests:

1. Read the target route handler.
2. Read the router mounting file to confirm the full URL path.
3. Read auth middleware and shared helpers used by the route.
4. Read schemas/tables/services touched by the route.
5. Inspect existing tests and reuse their harness, lifecycle, naming, and data setup patterns.
6. Decide the mode:
   - **Coverage mode**: verify established contracts without changing production. Characterize current behavior only when requested; do not encode defects as GREEN expectations automatically.
   - **TDD feature/fix mode**: write one failing test for defined desired behavior, then change production minimally only within explicit product authorization. Otherwise retain the RED as testing evidence.

## Route-Aware TDD Flow

Use this flow when the user asks for TDD, a bug fix, new route behavior, or a changed route contract. Also use the same vertical rhythm when adding route coverage: one behavior slice at a time, with coverage checks after meaningful batches.

### 1. Route Reconnaissance

Complete the inspection checklist in Core Rule before testing; include current behavior for surprising or unsafe branches.

Read first, then test:

- target route handler
- router mounting file and full URL path
- auth middleware and user/session serialization
- schema/table/service definitions
- existing tests and harness conventions
- current behavior for surprising or unsafe branches

For test-only tasks, this reconnaissance identifies the actual boundary and evidence for expected contracts. For feature/fix tasks, it defines the current baseline and the smallest authorized public behavior that should change.

### 2. Scenario Inventory

Build a scenario inventory before editing tests. Keep it behavior-oriented, not implementation-oriented:

- **Auth**: anonymous, authenticated allowed role, authenticated disallowed role, ownership/cross-owner cases.
- **Input**: required fields, type coercion, invalid IDs, invalid dates/ranges, unknown enum/filter/status values, empty or whitespace-only strings.
- **Data states**: no rows, one included row, one excluded row, mixed included/excluded rows, null optional values, duplicate/conflict rows.
- **Side effects**: inserted/updated/deleted rows, no-op behavior, idempotency, external calls, and absence of side effects on failures.
- **Response contract**: exact stable body, dynamic fields, ordering guarantees or lack of ordering, and absence/presence of sensitive fields.

In TDD feature/fix mode, mark which inventory items are desired new behavior and which are current behavior that must remain stable.

Group related contracts into waves using the shared method. Define each wave's new coverage, reused tests, fixtures, prerequisites, HTTP boundary, relevant targets, and implementation/validation criteria before editing. Keep requested whole-route exhaustiveness separate from completion of an individual wave.

Before implementing any fixture-dependent route test, complete the shared method's mandatory fixture readiness phase. Verify the required auth/data/persistence setup and owned cleanup first, reusing applicable evidence. The first tracer bullet is subject to this gate too; blocked readiness stops dependent test implementation and execution, not independent coverage.

### 3. Vertical Red-Green Slices

Do not write all tests first and then all implementation. That horizontal slicing creates tests for imagined behavior and makes the suite brittle.

Use vertical slices:

```text
RED:   In TDD mode, write one route/API test for one public behavior -> prove it fails for the expected reason. Existing-contract coverage may already pass.
GREEN: Implement the smallest route/schema/service change only for an explicitly authorized product slice. In test-only work, correct erroneous tests/fixtures and retain verified product REDs.
CHECK: Use authorized narrow iteration. Before final validation, reuse the selected gate or ask for a missing choice as described below.
NEXT:  Use what you learned to choose the next behavior.
```

Rules:

- One behavior at a time.
- One failing test at a time in TDD feature/fix mode.
- Do not anticipate future tests with speculative production code.
- Keep tests focused on observable HTTP behavior and durable side effects.
- Resolve incorrect tests/fixtures before refactoring. Do not refactor production while its TDD slice is red.
- Refactor test helpers only when necessary, preserving earlier contracts and verified product REDs; validate the affected tests within the agreed scope.

### 4. Tracer Bullet First

For new endpoints or large route changes, start with a tracer bullet: one end-to-end route test that proves the request can travel through auth, routing, validation, handler logic, persistence/external client if relevant, and response serialization.

Examples:

- `POST /api/reports` creates the minimal valid report for an authorized user.
- `PATCH /api/clients/:id` rejects a cross-owner manager before any database write.
- `GET /api/dashboard/kpis` returns zero values for an authenticated user with no data.

After the tracer bullet is executed and classified, add independent edge cases and branches one at a time. A verified product RED blocks dependent cases, not unrelated coverage.

### 5. Existing Behavior vs Desired Behavior

Be explicit about which behavior is being tested:

- **Requested characterization**: document current behavior when the user asks for it. Name unsafe behavior honestly and report residual risk; a pass is not an authorization guarantee.
- **Expected contract coverage**: assert established product invariants even if current code violates them. Preserve and report the verified RED without changing production in test-only work.
- **Desired behavior TDD**: use defined new requirements or bug-fix intent. Implement the production fix only when explicitly authorized, separately from test/fixture work.
- **Ambiguous behavior**: report the observed result and missing contract evidence; clarify the expectation rather than inventing a requirement or making the observed behavior GREEN by default.

Examples:

```ts
it("documents that managers can currently access unassigned reports", async () => {
  // current behavior documentation: passing test, residual risk in final report
});
```

```ts
it("prevents managers from accessing reports owned by another manager", async () => {
  // expected isolation contract: retain RED unless a product fix is authorized
});
```

### 6. Per-Cycle Checklist

Before moving to the next slice:

```text
[ ] Test describes public route behavior, not implementation.
[ ] Test uses HTTP/harness flow unless there is a strong reason not to.
[ ] Test fails for the expected reason before production changes in TDD mode.
[ ] No production/library change occurred without explicit authorization; authorized product code is minimal.
[ ] Important response fields and side effects are asserted.
[ ] No speculative branches or unrelated refactors were added.
```

## Scenario Selection

Cover each behavior branch that can change the HTTP result or response body.

Always consider:

- unauthenticated access
- authorized happy path
- authorization branches by role or ownership
- cross-role attempts to read or mutate someone else's data, even when the route currently allows it
- validation failures
- malformed-but-parseable inputs such as whitespace strings, invalid dates, unknown enum values, empty arrays, and negative or zero numbers
- empty-state responses
- not-found paths
- conflict paths
- forbidden paths
- boundary values for dates, ranges, pagination, filters, and statuses
- null/optional fields when the route treats them specially
- cross-tenant or cross-owner isolation
- side effects in the database or external storage when relevant
- external service success, partial success, non-OK responses, thrown errors, and request metadata such as URL, method, headers, and body
- sensitive data leakage when a route spreads database rows into responses

Do not test every possible role automatically. Test a role only when the route distinguishes it or when it represents a distinct authorization branch.

Example decision:

```ts
if (req.user.role === "admin") {
  // branch A
} else {
  // branch B
}
```

Test `admin` and one representative non-admin role, usually the role most natural for the scenario. Do not add redundant tests for every non-admin role unless the route or product requirement treats them differently.

Example decision:

```ts
if (["admin", "pm"].includes(req.user.role)) {
  // branch A
} else if (req.user.role === "client") {
  // branch B
} else {
  // branch C
}
```

Test `admin` or `pm` as appropriate, `client`, and one representative role for the final branch.

## Repository Pattern

Follow the current test harness pattern. Do not import runtime modules that require environment variables before the harness initializes them.

Follow repository-native naming, runner, and lifecycle conventions. The following TypeScript structure illustrates environment initialization before runtime imports when the repository requires it; its module names, types, hooks, and layout are not universal requirements:

```ts
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import {
  resetApiTestData,
  startApiTestHarness,
  stopApiTestHarness,
} from "../../infra/test-harness";

type DbModule = typeof import("@workspace/db");

let harness: Awaited<ReturnType<typeof startApiTestHarness>>;
let dbModule: DbModule;

beforeAll(async () => {
  harness = await startApiTestHarness();
  dbModule = await import("@workspace/db");
});

beforeEach(async () => {
  await resetApiTestData();
});

afterAll(async () => {
  await stopApiTestHarness();
});
```

Rules:

- Where runtime imports depend on environment initialization, initialize the existing harness first; keep type-only imports separate when the language supports them.
- Prefer real HTTP flows through `harness.api` over direct handler calls.
- Prefer real login/session flows over fabricating auth state.
- Add route-specific reset helpers only for tables the tests create.
- Keep test data minimal but intentional.

## Test Data Design

Build fixtures that prove inclusion and exclusion.

For aggregation or list endpoints, create:

- data that should be included
- data that should be excluded by ownership, role, status, date, or filter
- null/optional values if the route has explicit null handling
- boundary values for inclusive/exclusive comparisons

Expected values must come from the intended contract, or from current behavior for requested characterization. If the contract counts all accessible rows for one KPI but only in-range rows for another, make that distinction visible in setup and assertions. A surprising observed result alone is not an expected value.

When the actual behavior appears unsafe or surprising, do one of these explicitly:

- If the user asked to preserve current behavior, write a test that documents it and name the test honestly, for example `documents that managers can currently access unassigned reports`.
- If the route violates an established security/product invariant, assert that invariant and retain the verified RED; permission to test it is not permission to fix the route.
- In the final report, call out any documented unsafe behavior as residual risk. Do not let a passing test suite make it sound safe.

For sensitive data, inspect the source table fields. If the route returns a spread object such as `{ ...user }` or `{ ...client }`, assert either:

- sensitive fields are absent, when the route intentionally serializes public data; or
- sensitive fields are present only in requested characterization of that exposure, and report it as a security gap. Otherwise assert their required absence and retain any verified RED.

## Assertions

Assert more than status codes.

For each meaningful test, verify:

- status code
- response shape
- important response values
- absence of sensitive fields
- database side effects when the endpoint writes data
- isolation from inaccessible data when authorization filters apply

Use exact body assertions when the response is stable. Use partial assertions only when the route returns dynamic fields.

Do not rely on accidental database order unless the route has an explicit `orderBy`. If the route does not order rows, either sort the response in the assertion by a stable key or assert set membership with `expect.arrayContaining`.

Examples:

```ts
expect(body).toEqual({
  activeCount: 1,
  totalCount: 3,
});
```

```ts
expect(body.user.id).toEqual(expect.any(String));
expect(body.user).not.toHaveProperty("passwordHash");
```

## Coverage Interpretation

Coverage is a diagnostic, not the source of truth.

After running coverage:

- Ensure the target route file appears in the report.
- Check uncovered lines and branches against the route implementation.
- Add meaningful tests for executable behavior gaps within the requested scope; identify broader gaps separately.
- When exhaustive whole-route coverage is requested, continue inspecting gaps against the requested contract and agreed validation scope; completing one wave does not complete that broader objective.
- Avoid artificial tests that only exercise impossible states through direct handler calls unless the user explicitly asks for implementation-agnostic coverage tricks. Prefer real HTTP flows. Do not change production code to make a branch testable.

For requested exhaustive whole-route coverage, the goal is 100% statements, lines, functions, and branches for the target route file, or exact evidence for unreachable/defensive gaps. Report meaningful blocked or unverified contracts separately; percentages alone do not prove them. Partial waves or narrower requested scopes need not meet the whole-route goal. Do not perform production refactors as part of coverage work unless separately authorized.

Use this language precisely:

- **Exhaustive for current behavior**: all meaningful executable branches, data states, authorization attempts, side effects, and response risks have tests.
- **Well-covered**: major behavior branches are tested, with named residual gaps.
- **Partial**: only happy paths and a few failures are tested.

If a route has known security gaps that tests merely document, never call it "safe" or "fully hardened"; call it "exhaustively documented for current behavior" and list the gaps.

## Validate and document the integrated tests

Read [validation and reporting](references/validation-and-reporting.md) before selecting, reusing, or executing the final gate, asking its question, or returning an implementation result. It owns prior-choice reuse, execution exceptions, coverage-table requirements, and endpoint-by-endpoint documentation. Narrow iterative execution does not supply a missing final-gate choice.
