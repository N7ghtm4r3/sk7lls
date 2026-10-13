## Post-Integration Validation Choice

After adding or changing a route test suite, use the final validation scope already selected by the user, including a choice from an earlier turn that still applies. Do not automatically run the full route/integration suite with coverage. Use authorized narrow commands while iterating; ask for the final scope only if it has not been selected:

- **Complete gate**: run the repository's full route/integration suite with coverage and validate the target route file in the coverage table. This is slower but gives the strongest signal and avoids claiming exhaustive coverage from a narrow run.
- **Current-suite gate**: run only the newly added or changed route test file, optionally with narrow coverage if useful. This is faster and appropriate when the user wants a quick feedback loop, but the final report must say that the complete route/integration coverage gate was intentionally skipped.

Mandatory stop rule:

- If the choice is missing, ask after implementation and narrow iteration are done, before starting the costly final command and before sending the final answer. Do not repeat the question per wave when an applicable choice exists.
- Do not send a final answer for route-test implementation work until one of these is true:
  - the user has explicitly chosen **complete gate** or **current-suite gate** within the current task's scope;
  - the user explicitly asked for no test execution;
  - the validation command is technically impossible to run, and the blocker plus exact command are reported.
- A successful narrow/iterative test run is not a final validation choice. It is only a development signal.
- An unselected narrow run does not supply the user's final validation choice. Ask only if that choice is still missing.
- If the user already explicitly requested either full validation or quick/current validation and the choice still applies, follow it without asking again and state the chosen final gate.

Use this exact final validation question unless there is a strong reason to adapt wording:

```text
Implementation ready. Which final validation gate should I run?
1. Complete gate: the full route/integration suite with coverage.
2. Current-suite gate: only this suite/route test, for faster validation.
```

Do not run the final complete coverage gate against only the newly added or changed test file. Targeted coverage runs can overwrite or reset the shared coverage dashboard and make unrelated route rows look like zero coverage. If the user chooses the current-suite gate, report it as targeted validation rather than complete route coverage.

Expected workflow:

1. Run the current route test file while iterating.
2. Classify failures, correct erroneous tests/fixtures without weakening contracts, retain verified product REDs, and review the inventory against the route.
3. Mandatory stop: ask the user to choose **complete gate** or **current-suite gate**, unless they already specified the scope or explicitly asked for no tests.
4. If they choose complete gate, run the repository's full route/integration coverage command with no target-file filter.
5. Locate the target route file in the coverage table.
6. Check statements, lines, functions, and branches.
7. For requested exhaustive whole-route coverage, inspect gaps below 100% statements, lines, or functions and add missing meaningful tests.
8. For that same exhaustive objective, inspect uncovered branches and add meaningful tests or report unreachable, defensive, or redundant branches with evidence.
9. Repeat only within the authorized validation scope while actionable in-scope gaps remain. Stop affected/dependent cases on verified product or infrastructure blockers; report residual gaps instead of forcing GREEN or endlessly rerunning coverage.
10. If any metric remains below 100%, inspect the exact uncovered lines/branches and do one of the following:
   - add another real HTTP/integration test that covers it;
   - if it is unreachable because current code throws or returns earlier, report it as unreachable with the exact upstream reason;
   - if it is dead defensive code, report it as dead defensive code and leave production code unchanged.
11. Do not call the route exhaustive when it remains below 100% unless the final report explicitly says "exhaustive except for unreachable/defensive lines X-Y" and explains why those lines cannot be reached through the public route.

When reporting a complete gate result, include the target route's coverage row, not only the global `All files` row. When reporting a current-suite gate result, include the exact targeted command, say that full route/integration coverage was skipped by user choice, and include a compact result table for the single test file that was run. Use the same coverage-table shape whenever coverage is available: `File | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s`. If the selected current-suite gate did not collect coverage, still include that table shape with `N/A` values and add a short line with the targeted test result count and duration. This makes the targeted gate auditable instead of relying on a vague "green" summary.

Example report:

```text
dashboard.ts | 100% statements | 94.73% branches | 100% funcs | 100% lines
Remaining branch: defensive fallback on engagementRate ?? 0, unreachable after engagementRate !== null filter.
```

## Validation

Run the repository's existing test command within the authorized scope. If Docker, Testcontainers, local network, or database access requires additional permission, request only the missing permission rather than weakening the test; reuse existing authorization.

For route test work, obtain a missing final validation choice or reuse the applicable prior choice. Do not present a current-suite run as complete validation; state the chosen scope clearly. If the complete command is unavailable, state the blocker and leave the exact full command for the user.

Before final response checklist:

```text
[ ] I ran any narrow test commands needed for iteration.
[ ] I asked the mandatory final validation question, unless the user already chose a gate or explicitly asked for no tests.
[ ] I ran the chosen final gate, or reported why it could not run.
[ ] I did not describe a narrow iterative run as complete validation.
```

Report:

- command run
- pass/fail result
- number of tests/files
- route-specific coverage if relevant
- whether the target route reached 100% meaningful coverage
- any remaining meaningful gaps
- a documentation-style list of the tests that were integrated and what each one proves
- per-wave implementation and validation status, with logical cases separate from per-target executions; planned, implemented, discovered/executed, GREEN/RED, blocked, and assertions not reached
- fixture readiness status and evidence before dependent tests, including reused fixtures or a justified non-applicable phase

If tests cannot be run, state why and provide the exact command the user should run.

## Final Test Documentation

After integrating or changing route tests, explain the new/changed tests as documentation, not as a vague summary.

This final documentation is mandatory for every route-test task. Do not compress it into a one-line summary even when the implementation is small. The final response may stay concise overall, but it must still include an endpoint-by-endpoint test inventory that names the behavior, setup, expected status, and assertion/side effect for each meaningful test or grouped validation slice.

Group the explanation by endpoint or behavior area. For each test, include:

- the test name or a concise paraphrase
- the route/method it exercises
- the setup that matters, such as auth role, ownership, fixture rows, external mock, or malformed input
- the expected HTTP status
- the specific response fields, side effects, isolation rule, external request, or security behavior it proves

Prefer this shape:

```text
POST /api/chat
- rejects unauthenticated chat requests: sends a valid-looking message without cookies and proves the route returns 401 without reaching the AI client.
- streams AI deltas: mocks an SSE upstream with valid chunks, malformed JSON, empty deltas, and [DONE]; proves only real content deltas and the final done event are emitted.
```

When tests document unsafe current behavior, say that plainly:

```text
GET /api/analytics/:clientId/report
- documents current cross-owner access: logs in as a manager and requests another manager's client report; proves the route currently returns 200. Residual risk: this is not an authorization guarantee.
```

Do not just say "added tests for auth, validation, and happy path." Name what was actually tested and why it matters.
