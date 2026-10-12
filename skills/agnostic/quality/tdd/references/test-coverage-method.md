# Incremental behavioral coverage

Use this method for creating or expanding test suites across frontend, backend, desktop, mobile, CLI, and libraries. Select behaviors, levels, and targets from repository evidence. This reference defines shared testing decisions; it does not activate another skill's product implementation or execution mode.

## Scope and blocked cases

Authorization to create, expand, or execute tests permits the required test-scoped sources, fixtures, helpers, and configuration within the requested scope. It does not authorize changes to production code or behavior, application wiring, library/SDK/runner implementations, production dependencies, packaging, or published artifacts.

Distinguish native test discovery, source-set registration, and test-only dependency/harness configuration from changing the runner or system under test. Reuse suitable existing infrastructure and add only missing in-scope setup. Stack-specific restrictions still apply. Do not create CI/CD processes merely because coverage is organized into waves.

Do not automatically apply upstream patches, upgrades, forks, vendoring, dependency overrides, local library replacements, or production workarounds to unblock a test. When an intervention outside scope is necessary:

1. Verify the cause with concrete evidence using authorized inspection and execution. If verification is unavailable, report the diagnosis as unconfirmed and identify the missing evidence.
2. Stop the affected case and dependent cases; continue independent work without bypassing the blocked contract.
3. Report the scenario, target, expected contract, observed result, verified cause or uncertainty, and necessary intervention.
4. Await explicit authorization for that intervention. Diagnosis and a proposed correction are separate from implementing it.

Prior explicit authorization remains valid within its scope. Do not request it again for ordinary test/fixture edits, an already selected validation scope, or a previously authorized intervention. Product implementation belongs to an explicitly authorized product slice; testing permission alone never supplies that authorization.

## Plan coverage in waves

A wave is a contained increment of coverage for related behavioral contracts. Derive its order and size from the behavior inventory, risk, dependencies, and feedback. Do not prescribe a universal number of waves, test count, or sequence.

Before implementing each wave, identify:

- behavior, added value, and source of the expected contract;
- new scenarios and existing coverage to reuse;
- actual test level and boundary exercised;
- fixture ownership, prerequisites, and dependencies on other scenarios;
- relevant targets and any required technical adaptations;
- invariants and observable expected results;
- separate criteria for implementation completion and validation completion, including the authorized validation scope.

Use descriptive wave names such as access and isolation, creation and persistence, or cancellation and cleanup when those behaviors are relevant. A wave is a planning unit, not a required directory, class, filename prefix, or artifact.

Extend the existing suite. Implement focused behavioral slices, using feedback to select the next slice. A wave inventory is not a requirement to write every test before learning from execution. In generation-only modes, review slices statically and leave execution pending.

The fixture readiness phase below is a mandatory prerequisite for implementing dependent test slices, including the first tracer bullet. It applies equally to frontend and backend; wave planning may precede it, but dependent test implementation may not.

Refactor tests and fixtures only when necessary to the requested coverage or to remove material duplication; preserve existing contracts and assertions. Resolve incorrect tests/fixtures before relying on them. A verified product RED does not require every independent test to wait, and must remain observable after any in-scope refactor. Preserve any stricter refactoring phase established by the active skill.

## Test levels and contract strength

Classify unit, component, integration, contract, and E2E tests by the boundary they actually exercise, using repository terminology. Unit tests exercise a focused behavior; component tests exercise a component through its boundary; integration tests exercise collaborating real parts; contract tests verify an interface agreement; E2E tests exercise the requested complete consumer/user path. These categories can overlap in repository vocabulary; state the actual boundary rather than renaming suites mechanically.

Direct use of a real object in an integration test does not prove its corresponding UI interaction. A mocked component pass does not prove the real end-to-end boundary. Reuse the appropriate runner and infrastructure for each level; do not export one stack's rules indiscriminately to other levels or technologies.

If a lower-level alternative is useful, explain what it proves and retain the original contract as unverified or blocked. Agree any substitution that changes the requested outcome. Never silently weaken the contract or count the alternative as fulfillment of the original case.

## Fixture responsibilities and naming

| Responsibility | Owns |
| --- | --- |
| Fixture | Initial data/resources, their ownership, setup verification, isolation, and lifecycle/cleanup |
| Factory/Builder | Construction of parameterized values or objects |
| Actions/Support | Reusable operations at the tested boundary |
| Test/Spec | Execution and assertions that verify the contract |
| Shared scenario | Reusable behavior and invariants where targets or consumers share the contract |

These are responsibilities, not mandatory class names, abstractions, suffixes, annotations, inheritance, or directories. Follow the language and repository's naming and placement conventions. Name tests by the subject/actor, behavior, and expected outcome; name helpers by what they prepare, construct, or do. Avoid wave numbers or generic helper names that conceal the contract.

A fixture may use real data, resources, and objects; it is not synonymous with a mock. It prepares initial conditions, while the system under test produces the verified result. Seed existing records when they are prerequisites for a read/access contract; do not pre-perform a mutation or compute a result that the tested action is meant to produce. Do not duplicate application logic to make the assertion pass. An action such as sign-in may be used by a fixture, but is still an action; keep ownership and cleanup identifiable without inventing separate classes for every responsibility.

Require verifiable setup, repeatable data, isolation, and cleanup on success, failure, cancellation, and timeout, including partial setup. Share invariants across targets and isolate only necessary technical differences. Where unique data prevents parallel collisions, preserve deterministic relationships and independently known expected results.

## Mandatory fixture readiness phase

Before implementing a test/spec that depends on prepared state, identities, persistence, services, sessions, platform resources, or shared lifecycle, complete this phase first. Treat readiness as a hard prerequisite, not a recommendation or work to defer until tests exist. A fixture that will probably work, an incomplete scaffold, or a promise to add cleanup later does not satisfy it.

1. Identify the required initial conditions and their lifecycle owners for the selected slice/wave and relevant targets. Inspect existing fixtures and setup hooks before creating anything. If the test only needs locally constructed values with no fixture lifecycle, state why this phase is not applicable; do not invent a fixture class or framework.
2. Reuse an existing fixture only when it meets the required contract and has applicable readiness evidence. Otherwise complete or create the smallest repository-native, test-scoped fixture before implementing dependent tests. Build for the selected contracts, not an imagined future suite. Factory and action helpers may participate without separate mandatory abstractions.
3. Verify readiness with the evidence required by the active execution mode. Check initial conditions, ownership, isolation, repeatability, and cleanup before accepting the fixture as the foundation for tests.
4. Record what is ready, its boundary/targets, the evidence, and any unresolved prerequisite. Recheck affected readiness when fixture code, setup inputs, lifecycle, or target adaptations change. Reuse applicable existing evidence; do not recreate fixtures or repeat unchanged checks for every test.

Readiness requires all of the following for the selected contract:

- Setup establishes and verifies the required state through supported interfaces, exposes the needed handles/identities/addresses, and fails clearly on missing prerequisites or invalid responses.
- Data relationships and expected values are repeatable; identities/resources are isolated between tests, runs, actors, and parallel targets where applicable.
- Every acquired resource and cleanup operation has an identifiable owner. Cleanup is safe after partial setup and repeat invocation, and accounts for success, failure, cancellation, and timeout using the repository's established lifecycle.
- The fixture prepares prerequisites only. It neither performs the behavior under test in advance nor duplicates production logic, bypasses authorization, or replaces a real boundary required by the selected test level.

When execution is authorized, use a bounded native fixture/lifecycle check or applicable prior execution to establish setup and teardown before dependent test implementation. Inspect or exercise exceptional cleanup paths through existing runner guarantees and focused checks; distinguish executed evidence from inspected guarantees and do not claim unexercised paths were runtime-validated. A small fixture readiness check is allowed during this phase; it verifies preparation/lifecycle and does not count as the dependent product scenario.

When the active mode prohibits execution, complete fixture implementation and static readiness review first. Resolve imports, registration, setup inputs, resource ownership, and all required cleanup paths by inspection. Only then generate dependent tests, reporting `static readiness reviewed; runtime readiness not executed`. This is the generation-only adaptation of the gate, not permission to execute code or claim runtime robustness.

If required evidence or an in-scope fixture capability is unavailable, mark readiness blocked and do not implement or run dependent tests yet. Report the missing condition, evidence, and necessary intervention; continue independent work. Do not bypass the gate through inline unowned setup, a second harness, a weaker test level, mocks replacing a required real system, or production/library changes. Existing verified behavioral REDs remain visible; readiness is not a requirement that the product already pass the contract being tested.

## Expectations and RED evidence

Derive expectations from the product contract and explicit user intent. Distinguish requested characterization of current behavior, verification of an established expected contract, and future cases grounded in defined requirements. Do not invent requirements to increase test counts or convert an observed defect into a GREEN expectation automatically.

A behavioral RED can be a valid testing result. Classify incorrect tests/fixtures separately from product violations, runner/library defects, bootstrap, environment, and cleanup failures. Correct tests/fixtures when they are wrong without weakening the contract. A RED never grants permission to change production or a library.

## Validation and reporting

Use repository-native commands, proportionate checks, and the validation scope already authorized. Ask only for missing scope that materially affects execution. Do not imply that selecting a wave authorizes broader execution or a new pipeline.

Distinguish planned scenarios, implemented tests, discovered/executed tests, GREEN and RED results, blocked executions, skipped/aborted cases, and assertions not reached. Count logical cases separately from executions on each target. Do not credit assertions after an earlier failure, or infer execution from source files, build success, or a runner's green exit alone.

For fixture-dependent waves, report readiness status and evidence separately from product assertions. Distinguish an applicable reused fixture, a newly completed fixture, static-only readiness, blocked readiness, and a justified non-applicable phase. A fixture check passing is not product coverage.

A wave may finish implementation and its agreed validation with verified RED results; report those results and remaining blockers, never call it fully GREEN. A bootstrap failure or undiscovered test leaves the affected behavioral validation incomplete. Generation-only work can finish implementation and static review, but runtime validation remains not executed. Wave completion does not establish exhaustive suite coverage or satisfy a broader coverage target by itself.
