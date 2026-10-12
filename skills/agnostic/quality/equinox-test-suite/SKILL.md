---
name: equinox-test-suite
description: Design, implement, migrate, review, diagnose, and validate Equinox backend route tests and Compose Multiplatform end-to-end journeys using Spring Boot, MariaDB Testcontainers, Kotlin, Parikshan, and Gradle Kotlin DSL. Use for HTTP integration tests, authorization and persistence coverage, shared Desktop/Wasm/iOS/Android journeys, real-backend fixtures, Parikshan upgrades, target lifecycle failures, Gradle E2E orchestration, and determining whether the complete suite ran even when product tests failed.
---

# Equinox Test Suite

## Compose the base skills

Apply `route-test-designer` to backend route/API tests and `frontend-journey-test-designer` to frontend journeys. Apply both when a regression crosses UI, HTTP, security, persistence, and MariaDB.

Read every applicable base skill completely. Preserve its product boundary, TDD, validation-gate, and reporting rules. If a base skill is unavailable, state that and retain the equivalent constraints here.

Use the base skills' shared wave and fixture method; do not duplicate it with a fixed Equinox wave sequence. Adapt wave prerequisites and targets to the existing Spring/Compose/Parikshan boundary, share invariants across targets, and keep logical cases separate from target executions. Read the [shared method](../tdd/references/test-coverage-method.md) directly if an applicable base skill is unavailable.

Enforce its mandatory fixture readiness phase before fixture-dependent backend route tests and frontend journeys. Establish real backend readiness, verified prerequisite data/identities, target isolation, and owned cleanup through the existing allowed lifecycle before dependent implementation. Reuse applicable evidence; missing capabilities block dependent cases and do not authorize a bridge or library change.

Read [references/stack-contract.md](references/stack-contract.md) before changing Parikshan, target lifecycle, backend orchestration, fixtures, or Gradle wiring.

## Preserve the compact boundary

- Treat every constraint in this skill as mandatory. Do not weaken one to complete the request or make a suite pass.
- Reuse the repository's official Parikshan `e2eTest` task. Do not create a second runner or aggregate task.
- Keep shared journeys, user actions, and API fixtures in Kotlin test source sets.
- Run the real Compose application against the real Spring Boot application and disposable MariaDB.
- Never modify production source sets, dependencies, application wiring, or runtime behavior as test work. Preserve SDK/library/runner implementations, packaging, and published artifacts too. A verified product defect remains RED; implementing its fix belongs to separately authorized product work.
- Do not add test-only routes, fake repositories, auth bypasses, flags, hardcoded responses, alternate application wiring, or mounted screens.
- Do not add Gradle modules, build-logic modules, wrapper scripts, Docker Compose, Makefile, shell, Nginx, SQL, Karma, JavaScript, or parallel harness files for the suite.
- Do not add Gradle tasks, `doFirst`/`doLast` hooks, shell execution, or process-launch logic to compensate for missing Parikshan/AGP behavior.
- Permit only plugin configuration and minimal `dependsOn`/`finalizedBy` wiring for an existing real backend lifecycle.

An out-of-scope requirement blocks only the affected and dependent cases. Report the scenario, target, expected contract, observed result, concrete cause or missing evidence, and necessary intervention; continue independent coverage. Prior explicit authorization stays valid within its scope. Do not require a new chat or repeated approval for an already authorized intervention.

Delete obsolete harness files only when authorized and after proving they have no production or shared consumers.

## Select the scope

Accept one scope:

- `backend-only`;
- `frontend-only`;
- `full-stack`;
- `harness-only`;
- `review-only`.

If scope is absent and implementation would cross backend/frontend boundaries, ask which scope applies. Do not infer `full-stack` from repository structure. `frontend-only` may run the real backend as a dependency but must not change backend production or route tests. `full-stack` means test coverage on both sides; it never authorizes production changes.

## Discover before editing

Inspect:

1. Repository instructions, dirty state, Gradle modules, version catalog, KMP targets, and configuration-cache settings.
2. Existing route tests, E2E specs, shared helpers, platform actuals, fixtures, Parikshan version/configuration, exact task names, and unified report.
3. Spring Boot startup, readiness, Testcontainers configuration, authentication, roles, ownership, persistence, and cleanup.
4. Compose routes, semantics, repositories, session storage, and target launchers.
5. CI constraints only to preserve compatibility; do not edit pipelines unless requested.
6. Every comment or helper tied to a specific Parikshan version before upgrading it.

Inspect the installed plugin source/API when target lifecycle matters. Do not infer current Parikshan behavior from documentation, task names, or previous runs.

## Implement backend route tests

Exercise the complete boundary:

```text
HTTP client
-> Spring routing/security/validation
-> controller/service/repository
-> MariaDB Testcontainer
```

Use the real Spring context, HTTP client, security chain, and MariaDB persistence. Cover anonymous, allowed, and forbidden access; roles; owner and cross-owner isolation; validation; missing/conflicting data; serialization; durable side effects; rejected-write absence; and sensitive-field absence.

Do not replace MariaDB with H2 when persistence is part of the contract. Mock only genuinely external systems outside the tested boundary.

## Implement frontend journeys

Exercise:

```text
Parikshan host test
-> real packaged Compose application
-> real frontend state/repositories
-> real HTTP
-> real Spring Boot runtime
-> security/controller/service/repository
-> disposable MariaDB
```

- Put reusable specs and user-level actions in `commonTest`.
- Put unavoidable host JVM/process code or platform actuals in the established test source set; do not create a new module.
- Use `e2eTest(config = ...)` and the suite's shared timeout.
- Interact through public semantics and assert visible state after meaningful transitions.
- Prefer API fixtures only for prerequisites; keep the behavior under test in the UI.
- Generate unique actor and domain data per run and target so parallel execution cannot collide.
- Prove visible and excluded records for ownership/tenant isolation.
- Keep relaunch and persistence in dedicated journeys instead of using relaunch as routine cleanup.
- Preserve a failure of an established or defined desired contract when it exposes a product defect. Product work requires its own explicit authorization outside the testing slice.

Use platform branches only for genuine platform capability or documented runner semantics. Never silently skip the core invariant merely to make one target green.

## Own one real backend lifecycle

Reuse the existing backend lifecycle. It must:

1. start the real Spring application from production sources;
2. use disposable MariaDB through the established Testcontainers configuration;
3. isolate runtime preferences, ports, credentials, PIDs, and logs;
4. wait for an explicit readiness signal and surface logs on failure;
5. support idempotent start and safe stop after partial startup;
6. clean up on success, assertion failure, startup failure, cancellation, and timeout.

Seed through public authenticated APIs. The fixture may orchestrate and verify setup but must not reproduce application behavior.

Minimal Gradle relationships such as the following are acceptable:

```kotlin
tasks.withType<E2ETestTask>().configureEach {
    if (name == "e2eTest") {
        dependsOn(":backend:startE2EServer")
        finalizedBy(":backend:stopE2EServer")
    }
}
```

Do not add a parallel backend launcher when these tasks already exist.

## Keep Gradle clean

Allow only:

- the pinned Parikshan plugin and required test dependencies;
- source-set and extension configuration required by the plugin;
- `dependsOn` for the existing real backend lifecycle;
- `finalizedBy` for guaranteed cleanup;
- target/device inputs and bounded task timeout.

Do not add orchestration modules, wrapper scripts, duplicate tasks, shell pipelines, custom archives, target-provisioning tasks, or any `doFirst`/`doLast` workaround.

If the installed library lacks a required lifecycle capability:

1. prove the gap from plugin source and an actual run;
2. propose the necessary upstream/library intervention with evidence; do not apply a patch, upgrade, fork, vendoring, override, or local replacement under testing authorization;
3. use an already-provisioned external prerequisite when available without changing the repository;
4. otherwise stop and report the environment/library blocker;
5. never implement a repository bridge, even as a temporary workaround.

Use an actual run only within authorized execution. If unavailable, identify the unverified part instead of presenting a suspected gap as proven. Await explicit authorization for a library intervention; continue independent waves where possible.

## Upgrade Parikshan deliberately

Enter this workflow only when the Parikshan update itself is explicitly authorized. A request to create or execute tests does not authorize an update. Existing update authorization remains valid within its version/scope; do not request it again.

1. Inspect the new task API and runtime behavior.
2. Search for old version comments, platform branches, host controls, and Gradle bridges.
3. Remove each workaround only after proving the library now owns the same contract.
4. Run the narrow affected journey/target within authorized execution.
5. Use the agreed final gate; for complete cross-platform validation, run the official suite and compare per-target discovered/executed counts. Report any broader validation not performed.
6. Classify regressions as product, test, runner, bootstrap, environment, or cleanup failures.

Do not retain old compatibility logic reflexively or turn it into permanent architecture.

## Validate execution, not appearances

Run a narrow slice while iterating:

```bash
./gradlew :composeApp:e2eTest \
  --targets=desktop \
  --tests='fully.qualified.TestClass' \
  --no-daemon
```

Run the affected platform when lifecycle or platform behavior changed:

```bash
./gradlew :composeApp:e2eTest --targets=android --no-daemon
```

When the selected final gate covers the complete cross-platform suite, use only the official aggregate task. For an already selected narrower gate, report its limits without widening it or asking again:

```bash
./gradlew :composeApp:e2eTest --no-daemon
```

A full execution does not require every assertion to pass. It requires every selected target to start, discover the expected tests, execute all of them, and report terminal counts. Keep Gradle's non-zero exit code when product or test failures exist.

Never call these successful coverage:

- `No ready Android device/emulator connected`;
- an iOS target skipped because no simulator was selected/booted;
- app bootstrap/readiness failure;
- zero tests discovered;
- an early runner crash.

Continue monitoring after the first target failure until the global summary and unified report are produced.

## Report precisely

Report:

- exact commands and elapsed time;
- backend artifact/runtime, readiness, MariaDB lifecycle, and cleanup;
- every requested target and its discovered, passed, failed, skipped, and aborted counts;
- whether each target actually started and reached a terminal result;
- infrastructure failures separately from product/test failures;
- unified report path and configuration-cache result;
- a retained terminal-summary/log artifact when later runs can overwrite the unified report;
- target-specific exclusions, external prerequisites, and skipped broader gates;
- confirmation that test work did not change production behavior.
- per-wave implementation and agreed validation status, including planned/implemented cases, per-target discovery/execution, verified REDs, blockers, and assertions not reached.

A pass on one target proves only that target. A complete red suite is valid execution evidence; a skipped green-looking target is not.

## Finish with hygiene

Run:

```bash
git diff --check
git status --short
```

Confirm no parallel harness, script, module, custom Gradle task/hook, swallowed failure, test-driven production change, or library workaround remains.
