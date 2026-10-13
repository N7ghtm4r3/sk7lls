---
name: iterative-monitoring
description: "Monitor a user-identified snippet with a finite local harness when bounded observation of meaningful scenario outcomes is requested."
---

# Iterative Monitoring

Add the smallest harness that can observe the indicated snippet and decide whether the behavior requested by the user occurred. Keep the implementation native to the scenario's existing language and conventions; do not introduce a language, framework, dependency, service, or repository-wide abstraction merely to implement monitoring.

## Select meaningful cases and checkpoints

Inspect the target and its relevant callers, state transitions, and observable outputs before proposing cases. Prefer cases that establish a requested outcome or distinguish consequential behavior: a completed operation, a relevant failure path, or consistency between the operation and its visible result. Keep these cases within the requested scenario and the local monitoring boundary.

Present each case as a meaningful trigger and observable outcome. Group prerequisite actions and routine implementation details into that case instead of turning every click, field assignment, helper call, or intermediate value into a separate checkpoint. Add a checkpoint only when its evidence changes the conclusion or helps locate a failure relevant to the required behavior. Prefer cases with distinct conclusions over variations that exercise the same behavior.

Derive selectors, field names, representative inputs, setup steps, and other minor mechanics from inspected evidence. Do not ask the user to supply discoverable details or narrate them individually; expose them when they affect the outcome, remain uncertain, or explain a failure. This reduces the detail presented to the user, not the depth of analysis. Ask only when an unresolved choice changes the required behavior, success predicate, authorization, or local boundary; do not invent a product expectation to fill that gap.

For example, when monitoring a save that should update a grid, use a case such as “save a changed item and observe the updated value on the corresponding row.” Locating the row and selecting the editable field are derived mechanics, not separate cases. If row selection itself is the reported defect, it becomes the meaningful outcome instead. Observe only evidence available within the authorized boundary; a broader case does not authorize additional UI actions, writes, or retries.

## Establish the monitoring contract

Derive and state these values from the request and inspected code before editing:

- the exact snippet or insertion point and the narrow local boundary that contains it;
- the required behavior and an observable success predicate;
- a finite `maxAttempts`; use `3` when the user does not provide one, and disclose that default;
- what constitutes one attempt;
- the result the user wants to receive and its format, if specified.

Infer values from the request and inspected evidence when the scenario makes them unambiguous. State the contract concisely in terms of the selected case, its outcome, the local boundary, and the attempt limit; keep derived mechanics in the analysis unless they materially affect the contract. If the target or success predicate cannot be identified reliably, ask for that missing detail instead of editing a broader area.

## Preserve the mutation boundary

Treat all state as read-only except for the harness and the strictly necessary wiring inside the established local boundary. The harness insertion is the sole authorized modification.

- Inspect other files and systems only to understand the target.
- Do not fix, refactor, reformat, adapt, or clean up the monitored snippet or surrounding implementation.
- Do not alter unrelated files, tests, configuration, dependencies, lockfiles, generated artifacts, services, databases, or external resources.
- Do not create a reusable shared abstraction when a local wrapper, callback, block, or adjacent helper is sufficient.
- Preserve pre-existing user changes and the snippet's return values, exceptions, ordering, timing, and externally visible behavior except where bounded repetition was explicitly requested.

If the harness cannot be added within this boundary, stop and explain the smallest additional modification that would be required. Do not make it implicitly.

## Implement bounded observation

Use the scenario's natural control and error-handling constructs. Keep the harness removable and visibly local. It must:

- count attempts from a clearly defined starting point;
- never exceed `maxAttempts`;
- evaluate the success predicate from observable evidence;
- terminate immediately on success;
- retain enough information to explain the last observation or failure;
- terminate with an explicit exhausted state when the limit is reached;
- avoid logging secrets, credentials, tokens, or unnecessarily large payloads.

### Observe or retry

Distinguish observation from retry. Prefer observing executions that the program already performs. Re-execute the snippet only when the user asked for retries or repeated execution is known to be safe and idempotent. Never introduce active retries for a side-effecting or uncertain operation without explicit authorization. Do not swallow, translate, or delay existing errors unless that behavior is part of the requested monitoring contract.

Timing, polling intervals, backoff, cancellation, and concurrency controls are optional and should be added only when the scenario requires them. Any wait or retry policy must remain bounded by the same attempt limit and preserve the local scope.

## Verify without expanding scope

After insertion, inspect the edited region and verify the attempt bound, success exit, exhausted exit, and output path. Run only targeted checks that are known to be non-mutating. If meaningful verification would write caches, artifacts, runtime state, or external state, do not run it; report what remains unverified and name the exact check the user may authorize separately.

Do not change the monitored code to make verification pass. A failed observation is a monitoring result, not permission to repair the scenario.

Verification is complete when the local diff and permitted checks account for the attempt bound, success/exhausted exits, and output path; separately identify any unperformed runtime check.

## Return the result

Honor any output content or format requested by the user. Otherwise return a concise result containing:

- the required behavior being checked;
- whether it was observed, not observed, or could not be verified;
- attempts used and `maxAttempts`;
- the final relevant observation or error;
- the stopping reason: success, limit exhausted, unsafe repetition, or unavailable evidence;
- the exact local harness modification and any verification not performed.

Separate observed facts from inferences when the distinction matters. Confirm that no changes were made outside the declared local boundary.

Report outcomes by meaningful case. Include intermediate mechanics only when needed to explain the evidence, a failure, or a verification limitation; do not return a chronological list of every action or inspected detail.
