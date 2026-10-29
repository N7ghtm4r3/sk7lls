# Review after corrections

Verify whether corrected behavior now satisfies the original cases. Run the
review autonomously in the same chat, using its context, handoff and journal.
Review includes bounded monitoring when needed; source inspection alone is not
proof that a runtime defect is resolved.

## Recover the cases and bounds

Read the relevant conversation, handoff, journal and linked evidence. Identify
the actual project/worktree, corrected revision and relevant uncommitted changes,
runtime, and cases affected by the correction or explicitly selected by the user.
Retain case identifiers, original failures, actors, starting conditions, triggers,
expected outcomes and downstream checkpoints. Derive expectations from the
original requirements or project contracts, not from the corrected code.
Preserve user reports separately from independently observed evidence.

Check records against current code and runtime. Recover discoverable setup,
inputs and driver details from the project instead of asking the user to repeat
them. Old results supply context, not fresh proof of the correction. Additional
cases remain proposals unless already in scope. Missing expectations or
inaccessible context block only affected cases.

State a compact review contract before execution: selected cases, expected
outcomes, tools/evidence, runtime and local monitoring bounds, authorized actions,
and attempt limits. Reuse applicable conversation authorization without asking
for confirmation per case or action. Review execution includes selected case
interactions and necessary bounded monitoring within those bounds; it does not
authorize unrelated effects, product repairs or wider setup changes. Missing
authorization becomes a final request while independent checks continue.

Use the existing applicable attempt budget; otherwise disclose `maxAttempts = 3`
per case for this post-fix run. Preserve earlier runs and their counts. Define
one attempt by actual case execution, not polling reads or user wait time;
set finite observation windows and never reset an exhausted budget in this run.
Stop a case on a conclusive result. Repetition of side-effecting or uncertain
actions requires applicable authorization; the attempt limit alone grants none.

## Execute and observe

Use existing project launch, readiness and verification recipes, including any
selected verifier's required coverage and evidence contract. Reuse healthy
instances and confirm the runtime includes the correction. Perform necessary
rebuilds or restarts only within the authorized session lifecycle. Record created
versus reused instances, their identifiers and shutdown methods. Missing required
coverage, readiness or runtime identity leaves affected checks blocked.

Choose tools that exercise the real affected behavior:

- For web or native UI, drive the actual interface and check its visible outcome,
  including reopening, readback or downstream state where the case requires it.
- For API, service, CLI or library behavior, use the real entry point or an
  existing consumer/test driver and check the relevant outputs and effects.
- If a targeted test covers only part of the case, retain that limited evidence
  and execute the remaining observable checkpoints separately.

Act autonomously within the review contract. Request human interaction only when
genuinely required, such as inaccessible login or approval; keep dependent checks
blocked while continuing independent ones. Associate evidence with this case,
attempt and corrected runtime. Observe every required checkpoint before deciding
whether the case is resolved.

### Add monitoring when evidence requires it

Prefer existing UI state, logs, tracing and readback. When these cannot establish
the outcome, use the Monitoring procedure in [Iterative Monitoring](../SKILL.md)
to insert the smallest removable local harness within the review's authorized
boundary. Record its location and how its executions map to case attempts; keep
harness and case budgets explicit without resetting either to continue.

Preserve the implementation's behavior and errors. Apply Monitoring mode's
non-mutating insertion checks first, then run the actual case as the separately
authorized runtime phase of this review. Harness success proves only its observed
checkpoint; independently verify the remaining UI and downstream results. If
instrumentation needs changes outside its local boundary, record the exact
proposal and block only checks requiring it. Never expand instrumentation or
repair product code silently.

## Continue independent checks and defer scope requests

A failed case is a verification result, not permission for another repair loop.
Preserve mismatches and evidence. Continue cases independent of the failure,
missing prerequisite or unapproved modification.

Collect out-of-scope needs instead of interrupting for each one: the smallest
proposed operation/change, target and effects, why it is needed, and cases it
would unlock. Do not execute proposals. If every remaining case is blocked,
finish the limited report and grouped request now; do not wait indefinitely or
mark blocked cases as passed.

## Deliver the review before closure

Maintain the external journal and compact handoff under the
[session records](../../interactive-testing/references/session-records.md)
contract. Reuse current session records and preserve original failures and
evidence. Update records progressively, including instrumentation and runtime
ownership. Case outcomes are:

- **Resolved:** fresh execution demonstrates the original expected outcome and
  every required checkpoint on the corrected runtime.
- **Still reproducible:** fresh execution demonstrates a remaining mismatch;
  identify the failed checkpoint and any partial success.
- **Not verifiable:** evidence, access, authorization or required coverage is
  missing, or the attempt is incomplete. Name the exact missing proof.

These conclusions accompany the original verifier's result and provenance.
An absent error log or passing unit test does not prove a complete UI or downstream
case. Changes to code, runtime or scenario inputs invalidate affected conclusions;
recheck within remaining bounds or report them as not verifiable.

Before scope requests or shutdown, deliver the per-case report, decisive evidence,
attempts, remaining uncertainties, updated handoff and journal paths (or their
memory-only fallback), and continuation prompt. Record instances as still active
or already stopped from actual state. Then present grouped out-of-scope proposals
for approval with the unperformed checks; when none exist, no scope approval is
needed. Await authorization before acting on proposals.

Apply [session closure](../../interactive-testing/SKILL.md#close-the-session)
after delivery: ask whether to retain session-owned instances for another round
or close them, reusing an explicit choice already given. Account for pending scope
proposals in that choice. Verify shutdown of owned instances, preserve shared or
pre-existing resources, and remove only session-owned temporary instrumentation
unless retention was requested. Update records and report cleanup separately.
Further correction/review rounds follow the user's subsequent direction rather
than starting automatically from recorded proposals.
