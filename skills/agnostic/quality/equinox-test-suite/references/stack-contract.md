# Equinox Parikshan stack contract

Re-inspect plugin source after every Parikshan version change. The behavior below describes the verified suite topology and known version-sensitive boundaries; it is not a permanent API promise.

## Layout adapted to the repository

Keep the existing test source-set boundaries. The following names and suffixes illustrate responsibilities; follow repository naming and placement rather than imposing these filenames or an `e2e` directory:

```text
existing-frontend-module/
├── build.gradle.kts
└── src/
    ├── commonTest/kotlin/.../e2e/
    │   ├── *E2ETest.kt
    │   ├── E2ESupport.kt
    │   └── ApiFixture.kt
    └── desktopTest/kotlin/.../e2e/
        └── <host actual only when unavoidable>.kt

existing-backend-module/
├── build.gradle.kts
└── src/test/.../e2e/
    └── RealE2EServer.kt
```

Do not create journey-only Docker Compose, Makefile, shell, Nginx, SQL, Karma, JavaScript, a separate Gradle module, a target-provisioning task, or any other workaround. Keep shared behavior in tests, real backend lifecycle in the existing Kotlin fixture, and only dependencies/finalizers/configuration in Gradle.

Apply the shared method referenced by the base skills. Here an API fixture owns verified prerequisite data and cleanup; factories construct inputs; support/actions perform reusable public API or semantic UI operations; specs assert the contract; shared scenarios preserve cross-target invariants. These responsibilities do not require separate classes. Fixture setup must not precompute the behavior the journey claims to prove. Wave names describe related contracts, not required source directories.

## Shared journey contract

- Use one `e2eTest` specification per meaningful user contract.
- Keep actions reusable but user-level: register, sign in, logout, open customer/project/release, navigate, relaunch.
- Use semantic selectors. Add `.first()` or `.last()` only after understanding duplicated semantics.
- Assert visible state after transitions; use bounded retry only for a reproduced runner/platform race.
- Generate unique actor identities and domain names per target/run.
- Use public authenticated APIs for prerequisite graphs and strict response validation.
- Seed at least one visible and one excluded object when proving access or isolation.
- Do not call platform-specific early return persistence coverage; report the platform limitation.

## Real backend lifecycle

The backend harness must:

1. launch the real Spring application from production classes;
2. use the established MariaDB Testcontainer service connection;
3. isolate preferences and runtime files;
4. own its PID/log and reject an already occupied fixed port, or own a propagated dynamic port;
5. wait for a deterministic readiness marker;
6. show captured logs on startup failure;
7. make `start` replace only its own stale process;
8. make `stop` safe after partial startup;
9. let Testcontainers/Ryuk and Spring shutdown clean up database/runtime state.

The Gradle application task may depend on an existing `JavaExec` start task and finalize with its existing stop task. Reuse those lifecycle adapters; this example does not authorize adding tasks or a parallel backend launcher.

## Minimal Gradle boundary

Prefer:

```text
Parikshan plugin
├── owns target application build/start/stop
├── owns target test discovery/execution
└── generates the unified report

Official e2eTest task
├── dependsOn real backend start
└── finalizedBy real backend stop
```

Do not add custom Desktop JARs, launchers, aggregate tasks, scripts, modules, target-provisioning tasks, or `doFirst`/`doLast` hooks. If the installed plugin cannot perform the required work, stop and report the library/environment blocker. Resolve plugin-created tasks lazily and use declared providers; do not scan output directories or require artifacts during task-graph calculation.

## Target lifecycle

### Desktop

- Let Parikshan package and start the configured normal desktop application.
- Classify inability to reach the application socket as bootstrap/runner failure.
- Prefer resetting through visible session state over repeated relaunch calls under load.

### Wasm

- Let Parikshan generate boot sources/assets and host the browser bundle.
- Verify browser startup and executed test count, not only webpack success.
- Treat storage-clearing relaunch semantics honestly; do not claim persistence when the runner intentionally clears storage.

### iOS Simulator

- Let Parikshan resolve, build, install, and launch the generated iOS host.
- An explicit iOS target/device can boot an available shutdown simulator.
- Depending on plugin version, a default all-target run may skip iOS if no simulator is already booted and no explicit device is selected.
- Parikshan 0.0.6 can encode this skip as a successful target result; require explicit execution/test counts rather than trusting only the Gradle outcome.
- Require simulator selection plus terminal test counts before claiming coverage.
- Do not retain old KVC/text-input patches after the updated runner succeeds without them.

Example:

```bash
./gradlew :composeApp:e2eTest \
  --targets=ios \
  --ios-device='iPhone 17 Pro' \
  --no-daemon
```

### Android

- Verify whether the installed Parikshan version can provision/start an AVD. Version 0.0.6 requires a ready ADB device and does not start an emulator.
- When multiple devices exist, select the serial explicitly.
- Require the Android emulator/device to be provisioned externally until Parikshan owns AVD startup.
- Do not add a Gradle task or repository script to start, wait for, or stop the emulator.
- Do not claim Android coverage until Parikshan logs test execution and terminal counts for every discovered test.

Example:

```bash
adb devices -l
./gradlew :composeApp:e2eTest \
  --targets=android \
  --android-device=emulator-5554 \
  --no-daemon
```

## Upgrade audit

Apply this audit for an explicitly authorized Parikshan update. Diagnosis of a testing blocker alone does not authorize updating or patching Parikshan, an SDK, or the runner.

Search after every Parikshan update:

```bash
rg -n "Parikshan|0\.0\.|isAndroid|isIos|isWasm|relaunchApp|doFirst|doLast|emulator" \
  --glob '*.kt' --glob '*.kts'
```

Audit:

- Android emulator bootstrap task;
- Android host-side activity relaunch actual;
- relaunch retries and refresh branches;
- Wasm storage branches;
- iOS drag/input compatibility code;
- platform-specific assertion exclusions.

For each item, identify the old limitation, prove the updated native behavior, remove equivalent in-scope workaround code, and validate the narrow journey within authorized execution. Compare full per-target counts when that broader gate is selected; otherwise report the validation limit.

## Completion and failure classification

A target is covered only after:

1. preflight succeeds;
2. its application host starts;
3. expected test classes are discovered;
4. every test starts;
5. terminal counts are emitted.

Example of a complete but red run:

```text
[DESKTOP] FAILED - 5/16 tests passed (11 failed).
[WASM] SUCCESS - All 16 tests passed.
[IOS] SUCCESS - All 16 tests passed.
[ANDROID] SUCCESS - All 16 tests passed.
```

Classify before editing:

| Class | Evidence | Response |
| --- | --- | --- |
| Product | App reaches the surface but violates the intended visible contract | Keep the journey RED; stop affected/dependent cases, report evidence, and require explicit authorization for the product intervention |
| Test | Selector, fixture, or assertion contradicts the established intended contract or requested characterization | Correct the smallest test boundary without weakening the contract |
| Runner/library | Socket loss, deadlock, input failure, or orchestration defect | Reproduce within authorized execution; verify cause, report the necessary intervention, and await explicit authorization before any patch/update/replacement |
| Environment | Missing Docker, SDK, AVD, simulator, browser, port, or dependency | Report prerequisite; do not count coverage |
| Bootstrap | App builds but never becomes ready for Parikshan | Inspect launch/readiness logs |
| Cleanup | Backend, container, mapping, or process survives terminal execution | Correct in-scope fixture ownership; if runner/product changes are needed, report and stop affected cases pending authorization |

Never hide infrastructure/bootstrap failures with skips or broad retries.

Continue independent cases without bypassing the blocked contract. Reuse existing intervention and validation authorization within its scope. A wave may finish its agreed validation with verified behavioral REDs, but blocked/unreached assertions remain identified; completed execution is not proof that every invariant passed.

## Validation checklist

```text
[ ] Route tests use real Spring security/routing/persistence and MariaDB.
[ ] Frontend journeys use the real packaged app and real backend.
[ ] Shared journeys remain in commonTest.
[ ] Gradle contains only required plugin/configuration/lifecycle wiring.
[ ] Backend readiness and cleanup work on success and failure.
[ ] Every claimed target actually executes all discovered tests.
[ ] Product/test failures remain visible and produce a non-zero exit code.
[ ] Unified report is generated after the multi-target run.
[ ] Terminal per-target counts are retained because a later/narrower run can overwrite the report.
[ ] Configuration cache stores/reuses successfully where enabled.
[ ] No production file or runtime behavior was changed.
[ ] No parallel harness, module, script, custom Gradle task/hook, or repository workaround exists.
```
