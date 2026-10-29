---
name: interactive-testing
description: "Guide interactive workflow tests with complete cases and immediate monitoring when requested. Offer step-by-step guidance on request and keep session records outside the project."
---

# Interactive Testing

Help the user verify actual workflows by presenting one complete case at a time and preserving the evidence. When monitoring is requested, arm observation before presenting the case and keep observing while the user fills and submits. Use per-step confirmation only when the user asks for it. Derive scenarios, startup commands, and any instrumentation from the actual project.

## Compose the skills and preserve authorization

Read and follow [readonly](../readonly/SKILL.md) before context analysis and scenario preparation. Read and follow [iterative-monitoring](../iterative-monitoring/SKILL.md) only when the user requests monitoring and its authorized scope requires local instrumentation. Resolve their available locations if this collection has moved. If a required skill is unavailable, report the missing dependency and stop the affected phase.

Read [original skill integration](references/original-skill-integration.md) before resolving the original `verify-behavior`, `create-verification-skill`, `update-verification-skill`, or `handoff` skill. Load each source only when its named branch fires; record the exact identity and dependencies. Interactive Testing retains its authorization, confirmations, optional monitoring, records, and session conclusions.

When preparing or updating a continuation, use the original `handoff` skill with those caller rules. Write the handoff and continuation prompt in English unless another artifact language was requested. Reading a dependency activates no implementation or delivery workflow.

Analysis remains read-only. It does not create a handoff file, run the application, or insert instrumentation. Its phase-local readonly constraint ends when proceeding to an authorized session. A separate readonly restriction imposed by the user remains binding until explicitly lifted.

Monitoring is optional and requires a user request. A request to start testing, select a scenario, or preserve results is not a request for monitoring. Reuse an applicable monitoring request already given in the conversation. Do not automatically enable monitoring because evidence is missing or instrumentation would be useful.

Instrumentation must stay within iterative-monitoring's declared local boundary. This workflow separately permits the startup and runtime operations necessary for the authorized testing scenario, plus mandatory progressive session records outside the project. These permissions do not expand the instrumentation boundary or authorize product fixes.

Request activation only when it has not already been authorized. First make the proposed session concrete: identify the target, instrumentation, startup operations, expected runtime writes, evidence source, and handoff destination. Reuse authorization already provided for those operations; do not request it again for each command or attempt. Invoking this skill for analysis alone does not authorize activation.

## Choose the interaction mode

Choose how cases are selected separately from how the user performs each case:

- **Guided cases:** the default. Choose a grounded starting case and natural order from the inspected workflows. Introduce only the current case; do not require the user to choose from the full inventory. Preserve alternate and unfavorable paths rather than choosing an order intended to pass.
- **Case selection:** when the user asks for a list or wants to choose, present the reference cases and accept a case or ordered subset.

In either mode, give the current case's complete instructions, including values, the user-triggered submit action and expected outcome. Do not insert routine confirmation pauses between navigation, filling and submission. If the user explicitly requests **step-by-step guidance**, give one operational step at a time and await their confirmation before the next step. Honor later changes to this preference.

Default to guided cases when the user has not chosen a mode. Ask only when an unresolved choice affects which workflow to test. Record case selection, interaction cadence and agreed order in the handoff; a mode change neither erases evidence nor confirms pending actions.

## Analyze and prepare reference scenarios

Inspect only the relevant code, existing execution commands, configuration, tests, logs, and documentation. Start from the user or consumer goal in the request, then trace how the actual project supports it across entry points, related actions, state transitions, and resulting effects. Distinguish inspected facts from inferred runtime behavior.

Use the resolved original `verify-behavior` Select procedure to connect each requested check to project coverage. Finish selection with a cited executable path or an exact gap/blocker per check. Writing verifier references or helpers requires separate authorization for those paths; analysis may retain a proposed change in memory. Missing coverage stays blocked until the original creator/updater supplies its required proof.

Identify meaningful workflows, not a collection of isolated control checks. Each main scenario must connect an actor's starting conditions to a practical outcome through related actions and consequences. For a UI, API, CLI, service, or library, trace the corresponding real usage flow rather than assuming a browser journey. Anchor the scenario to the relevant implementation paths or project contracts.

Follow the outcome far enough to establish what makes it useful to the actor. Where the inspected workflow supports them, include later readback, reopening, persisted state, downstream effects, role or actor handoffs, authorization boundaries, and recovery after a failure. Do not require all of these for every scenario or invent features to make it complex. Complexity comes from meaningful dependencies and state changes, not an arbitrary number of clicks or steps.

Treat field validation, button behavior, input variants, and error branches as checkpoints or variants within their parent workflow. Do not present "save an ordinary value", "save a special value", and "leave a field empty" as an adequate workflow inventory by themselves. A narrowly scoped standalone check is appropriate only when the user explicitly requests that narrow behavior; retain its real workflow context and state its limited coverage.

If the accessible context exposes only an isolated snippet or toy fixture and cannot establish the requested effective workflow, explain what is missing and ask for the relevant codebase or workflow context. Do not fabricate a larger product flow, add mock functionality, or broaden implementation just to supply impressive-looking cases. An explicitly requested mock may represent a proposed workflow, but must remain labelled simulated and cannot prove that a real codebase supports it.

Prepare a concise inventory of candidate workflows before executing one. Give each a stable identifier, actor and practical goal, relevant starting conditions, connected reference steps and state transitions, final outcome or exploratory question, observable checkpoints, and supporting implementation pointers. Present the inventory for case-selection mode; in guided mode retain it as session reference and introduce only the current workflow. Include normal paths, alternate paths, validation, and error conditions only where the request or inspected code supports them. These are references for possible flows, not an executable suite or proof that they pass.

Derive expected behavior from the user's requirements and authoritative project contracts. Keep current implementation behavior separate: a known defect is not a new expected outcome. Where no requirement establishes an expectation, label the scenario exploratory and the expectation unknown. Do not invent acceptance criteria, choose only favorable data or branches, change expectations to match results, or modify the implementation to make a scenario pass.

In case-selection mode let the user choose a scenario or an ordered subset, honoring choices already made. In guided mode use the grounded order without forcing a case-selection question; the user may redirect it. Introduce the next scenario only after the current one is concluded or the user redirects. Leave other scenarios pending; do not execute them on the user's behalf. Do not prepare the runtime or insert instrumentation merely to produce the inventory.

## Establish the selected scenario

For the selected scenario, explain its purpose and define a compact contract in chat before the first action:

- the actor's goal, requested behavior, and affected workflow paths; a local insertion point only if monitoring was requested;
- the initial state, environment, data, and prerequisites;
- the connected reference flow, state transitions, final outcome, and complete sequence the user will perform (or the first action in explicitly requested step-by-step guidance);
- the expected observations and acceptance predicate when established, or the explicit exploratory questions when not;
- the evidence source and how evidence will be associated with each action;
- what starts and completes one attempt, and the finite attempt limit;
- whether monitoring was requested, its authorized scope if enabled, and the startup or execution operations needed;
- the result to retain, handoff destination, and relevant cleanup.

For an evaluable verify/reproduce scenario, include the selected original
verification skill's proof identities and observation obligations in this
contract. An exploratory scenario retains explicit unknown expectations instead.

When monitoring is requested, use `maxAttempts = 3` when unspecified, and disclose it. Define any scenario repetition limit separately where needed. Count attempts at the agreed scenario boundary, not instructional steps, arbitrary log lines, internal callbacks, or tool reads. When one user action invokes the monitored snippet repeatedly, explain how the snippet's bounded observation relates to the scenario count before activation. Do not reset an exhausted count merely to continue the same session.

Ask only for details that prevent a reliable scenario or safe activation. If the project is unavailable, give a provisional contract based on supplied evidence and identify what remains unknown; do not invent commands or claim the scenario is ready.

## Prepare the authorized session

If monitoring was requested, prefer existing observability and insert a harness through iterative-monitoring only when the available evidence cannot evaluate the contract. Verify the insertion using that skill's permitted checks before starting the runtime session. Otherwise proceed with user observations and evidence already supplied; record monitoring as not requested. Do not start instrumented monitoring, log streaming, or polling without the request.

Use the project's existing build, launch, and service commands as needed to make the agreed scenario runnable. Authorization to start the session covers its identified startup operations and their necessary runtime outputs, such as build artifacts, caches, logs, and temporary runtime state. Report these effects in the plan. Runtime execution is a separate authorized phase, not a readonly check under iterative-monitoring.

Startup permission does not authorize source or configuration edits, dependency installation or upgrades, migrations, provisioning, unrelated fixtures, or changes to shared infrastructure. If an uncovered prerequisite blocks startup, report the smallest additional operation needed and obtain authorization for it rather than adapting the project. Do not require additional permission for operations already covered by the user's instructions.

Confirm readiness from actual evidence before inviting the user to act. Reuse healthy existing processes where appropriate. Record which runtime instances the session starts and which it reuses, with identifiers and the targeted shutdown method for session-owned instances. Keep secrets out of command output and the handoff. Do not execute the user's scenario for them unless they explicitly ask for that action.

Before Drive, follow the selected app's Launch and Doctor. Apply original verification and any authorized maintenance recipes through the interaction cadence below. Retain maintenance readiness separately from the requested workflow result.

## Arm monitoring before presenting the case

Apply this section only when monitoring has been requested for the session. Reuse that authorization for subsequent selected cases; do not ask the user to enable monitoring again after they fill the form.

Before inviting the user to act, identify the target case and collect its baseline, relevant identifiers and observation cursor or start time. Start the observer and verify its first read or ready signal. When the host supports a concurrent listener or polling process, verify that it remains alive before presenting the case. Keep generated monitoring state outside the project; instrumentation still follows iterative-monitoring's separate boundary.

If the tools support only sequential observations, take the baseline first, present the case in commentary, and continue bounded polling in the same active turn without waiting for another user message. Do not end the turn immediately after giving instructions and imply that polling continues in the background. State any capability gap plainly instead of claiming an observer is active.

Set a finite wait for the user to start and a separate settlement window once an attempt is observed. Choose intervals that let the user fill the case without busy polling. Waiting for entry or reading an unchanged screen does not consume an attempt. If the idle window ends, preserve the pending case and report that observation has paused; never mark an unstarted case failed. Resume observation under the existing monitoring authorization when the user returns.

## Present the case and observe its outcome

After readiness and, when requested, observer activation, present the complete current case: its goal, initial conditions, all needed values, the user-triggered actions and expected outcome. Make clear that the user performs the actions and, when requested, the agent monitors the result. Do not wait for a separate "filled", "ready" or "done" message before observing a case already issued.

Without monitoring authorization, let the user perform the complete case and report the outcome; do not silently begin polling. Keep requested monitoring running while the user fills, submits and waits. Use correlated UI state, logs or readback to establish actual execution and completion. A user report is needed only for evidence the agent cannot independently access or when step-by-step guidance was explicitly selected. In that cadence, await confirmation after each issued step while keeping any requested monitoring armed.

Pause when a consequential choice, missing authorization, unavailable prerequisite or inaccessible observation prevents safe continuation. Directly observed events can establish behavior; they cannot grant permission, confirm an unobserved action or replace a required human decision. Do not submit or retry on the user's behalf unless explicitly authorized.

After each meaningful action or observed transition, refresh the journal and handoff. Complete all applicable downstream checks before concluding the case, then present the next case in the agreed order; do not require a redundant confirmation of an independently established outcome. Preserve unexpected behavior before asking for missing information or choosing another branch. A failed result never authorizes a repair or a silent change to a passing path.

Associate each observation with its scenario, step, attempt if applicable, and relevant execution. Use existing identifiers or bounded observation windows where possible. Do not attribute unrelated background events or stale output to the user's action. If association is uncertain, record that uncertainty.

Keep the user's confirmation separate from evidence independently observed by the agent. If a UI result is only reported by the user, label it accordingly; do not claim direct inspection. Record disagreements without replacing either source. If monitoring was not requested or tools cannot access required evidence, state what remains unverified rather than enabling instrumentation automatically. Lack of requested monitoring is not a scenario failure.

Assess each completed workflow against its established expectations and final outcome, or record findings without pass/fail for an exploratory scenario. A successful field check, button response, or intermediate operation does not establish the workflow's downstream effects. Keep the handoff current after every meaningful action, observation or confirmed step, not only after completing an attempt or scenario. Distinguish:

- **Observed:** evidence demonstrates the required behavior; state the evidence source.
- **Not observed:** an evaluable attempt completed without the required behavior.
- **Not verifiable:** missing, ambiguous, or inaccessible evidence prevents a conclusion.
- **Interrupted:** the user stops or an environment problem prevents completion.

Retain the original verification skill's result, failed/blocked checks and
evidence provenance alongside these caller observation labels. Keep coverage
maintenance outcomes separate from verification of the original scenario.

Waiting for the user is not a failed attempt. An observation window bounds how long the agent watches; it is not a product deadline. An unfinished attempt at that boundary is not verifiable unless the contract requires completion within that deadline. Keep its state and avoid indefinite waiting or polling.

Stop local monitoring after all required outcome checks succeed, the observation budget or attempt limit is exhausted, the user interrupts, repetition would be unsafe, or evidence becomes unavailable. A harness or intermediate operation succeeding does not establish the complete workflow: observe later checkpoints independently, or request only the evidence that remains inaccessible. Stop only the observer, never ordinary application behavior from inside a harness. Prefer observing user-triggered executions. Never automatically retry a side-effecting or uncertain operation. A failed result or newly discovered bug does not authorize repair.

## Preserve progressive records outside the project

Read [session records](references/session-records.md) before creating records, maintaining the handoff, or resuming a session. Analysis notes stay in memory under readonly. Authorized sessions initialize external records before the first operational instruction and refresh them after every confirmed step and meaningful observation. Records remain mandatory without monitoring.

## Close the session

After the last case in the agreed round is concluded, ask once whether to close the runtime instances started for testing or keep them available for another round. Reuse an explicit choice already given. Acceptance of all test results alone does not choose between shutdown and another round. While the choice is pending, record that closure is awaiting the user and retain the runtime; monitoring still follows its bounded stopping rules.

If the user chooses another round, retain the required session-owned instances and instrumentation, record what remains active, and await the next case without continuing observation beyond its budget. Keep the session available to resume rather than reporting cleanup as complete.

On closure, stop session-owned observers and shut down only runtime instances created for this session, using their recorded identifiers and shutdown methods. Preserve pre-existing or shared instances and anything the user explicitly asked to keep running. Verify shutdown from actual process or service state; report any instance still active or whose shutdown cannot be verified. Remove session-owned temporary instrumentation within its local boundary when testing is finished unless retention was requested; preserve intervening user changes and report cleanup that cannot be performed safely. Do not delete the handoff or indiscriminately remove runtime outputs.

Refresh the handoff after cleanup or the decision to retain the runtime with the stopping reason, scenario outcomes, pending scenarios, unconfirmed steps, unfinished work, the user's closure choice, and the final state of session-owned instances.

Return a concise result in the user's language: what was verified and by whom, decisive evidence, attempt count, discovered bugs or uncertainties, remaining checks, cleanup status, and the absolute handoff and journal paths or memory-only limitation. Provide a short English continuation prompt tailored to the receiving task, unless another artifact language was explicitly requested. Describe any scenario-state changes actually observed. Never infer that a bug was fixed or that unexecuted checks passed.
