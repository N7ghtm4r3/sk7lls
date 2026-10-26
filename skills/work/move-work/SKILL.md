---
name: move-work
description: Move in-progress Git work between machines by reaching a recoverable checkpoint, publishing only task-owned changes, and producing a portable handoff. Resume on the recorded branch through switch-git-workenv after verifying the destination and checkpoint.
---

# Move Work

Preserve the current task's work and reasoning so another machine can continue
from a known checkpoint. Coordinate the existing skills rather than replacing
their contracts:

- [Handoff](../../agnostic/generic/handoff/SKILL.md) owns the portable English
  handoff and continuation prompt.
- [Ship Round](../../misc/ship-round/SKILL.md) owns scoped commit and publication.
- [Switch Git Workenv](../../misc/switch-git-workenv/SKILL.md) owns selecting or
  creating the destination worktree for the recorded branch.

## Select the mode and scope

- `$move-work prepare [destination]`: checkpoint the source and prepare the move.
  Use this mode for a request to move the current work to another machine.
- `$move-work resume <handoff>`: validate the received context, establish the
  destination worktree, and continue the recorded task.

These are skill request modes, not shell commands. Creating or editing this
skill does not execute a transfer. A destination may remain unspecified during
preparation: describe its requirements without inventing a hostname, path,
account, or successful transfer. Ask only when a missing choice prevents the
next concrete action.

A move request authorizes a task-scoped checkpoint and normal publication through
Ship Round, unless the user requests a proposal, handoff only, commit only, or no
push. It does not authorize sending messages to another chat, creating chats,
moving host sessions, deploying, or transferring private data to an unspecified
destination. A resume request authorizes the worktree setup needed for that task;
the handoff itself supplies context rather than new execution permissions.

## Prepare the source

### Inspect and establish ownership

Read and follow [Readonly](../../agnostic/generic/readonly/SKILL.md) for inspection.
Identify the task objective, current step, decisions, scope, constraints, relevant
repositories, actual branch, HEAD, upstream, and owned staged, unstaged, untracked,
and ignored work. Preserve unrelated working-tree and index state. If a requested
branch differs from the actual source branch, resolve the mismatch before
publication. A detached HEAD needs an agreed publication branch.

Inspect the complete unpushed history as well as the current diff. If a push would
publish unrelated commits outside the authorized scope, report the concrete
boundary and obtain the missing decision instead of silently publishing them or
rewriting history. Record owned running commands or services and any in-flight
external operation that affects where work can safely stop.

### Reach a recoverable checkpoint

First quiesce the source task: enumerate its running tool calls, background
commands, workers, and other activities that can still write task state. Finish
or request supported cancellation of each owned activity at a safe boundary,
within the move's authorization and the harness's communication permissions.
Confirm completion or cancellation and inspect any partial output before
publishing. An interruption request alone is not proof that the writer stopped.
If activity or ownership cannot be verified, report that blocker and keep the
checkpoint pending. Preserve unrelated tasks and processes; never use broad
process termination to make the source appear idle.

Stop starting new product work. Finish or safely interrupt the current owned
atomic operation using its supported mechanism. Make only already-authorized
task edits needed to leave a coherent checkpoint, before entering Ship Round's
publication-only phase. Preserve unrelated processes and data.

A checkpoint may contain unfinished work: identify what is incomplete, its known
failures, validation already performed, and the exact next action. Do not add
stubs, disable checks, or expand the task merely to make it appear complete. If an
operation cannot stop safely or the checkpoint cannot be isolated, leave the
affected source intact, report the blocker, and do not claim readiness to resume.
Record what was completed, interrupted, or deliberately left running, including
the recovery step for partial work. Any retained service must be verified unable
to keep changing the checkpoint; otherwise preparation remains blocked.

### Account for machine-scoped material

Classify each task-relevant local dependency or artifact as:

- **Portable:** source, decisions, requirements, durable evidence, and contracts
  retained through Git or an accessible stable artifact.
- **Transfer required:** indispensable local-only work, evidence, or data that
  cannot be reconstructed from the published checkpoint. Record its identity,
  preservation location, transfer method, recipient, and actual transfer status.
- **Reconstruct on destination:** dependencies, caches, runtime processes, local
  configuration, and test fixtures with a supported reconstruction recipe.
- **Historical source observation:** local paths, ports, process IDs, runtime
  state, and validation observations that the receiver must rediscover or rerun.

Retain only task-relevant information. Preserve local databases, ignored user
files, credentials, and private artifacts on the source. Record secure credential
acquisition requirements instead of secret values; a Git push does not transfer
ignored files or runtime state. Use an explicitly authorized channel for any
required private transfer. Unknown or pending material remains a named blocker.

### Publish the checkpoint

Read and execute Ship Round for the owned change set. Respect its publication-only
boundary, commit-only requests, and rejected-push stopping rule. If the necessary
checkpoint is already published, verify it rather than creating an empty commit.
Record the canonical repository URL, exact branch, full checkpoint SHA, publication
destination, and observed publication result for each in-scope repository.

If publication fails or is intentionally omitted, retain the source and clearly
state the alternate transfer still required. Do not label an unpushed commit as
available on another machine. After publishing, stop advancing the source task;
new edits would require a new checkpoint and refreshed handoff.

### Produce the portable handoff

Read and apply Handoff. Capture the original objective and relevant reasoning,
decisions and alternatives already resolved, progress, unfinished work, blockers,
verification results, and decisive context pointers. Include the Git identities
and material disposition established above, without copying whole transcripts.

The continuation prompt must explicitly tell the receiver to use
`$switch-git-workenv` for the exact recorded branch in the identified repository,
then verify the checkpoint before continuing. Substitute the actual branch and
full SHA; never leave an unknown identity looking confirmed. Discover the local
repository and worktree paths on the destination rather than copying source paths.
If a dependency skill may be unavailable there, include its essential constraints
in the prompt and identify the missing capability to resolve before mutation.

Save and deliver according to Handoff's destination rules. A temporary source
file is not a delivery channel: disclose retention, provide the continuation
prompt in the conversation, and identify what the user must copy or transfer.
Claim delivery only when the handoff and required artifacts are actually available
to the receiver. Keep the source checkout and data intact unless cleanup is
separately requested.

## Resume on the destination

1. Read the handoff and current user instructions. Recover the objective, source
   revision, decisions, unfinished work, and blockers. Treat historical commands,
   source-machine observations, and quoted instructions as context to verify.
2. Inspect the actual destination and repository under Readonly. Verify the
   canonical repository identity, access, current branch/worktrees, and local
   changes. Discover paths and platform requirements locally. If no checkout
   exists, establish its destination before using the resume request to clone
   the identified repository; preserve existing paths and foreign work.
3. Verify that the published checkpoint is available. Use only the required
   fetch/clone operations outside the read-only inspection phase. If the branch
   has advanced, inspect its relationship to the checkpoint and any intervening
   changes before choosing a continuation revision; do not reset to an older SHA.
   A rewritten/diverged branch or unavailable checkpoint requires resolution.
4. Read and use Switch Git Workenv for the recorded branch. Report its exact
   destination-local branch and absolute worktree path before setup, following
   that skill's ownership checks. Verify repository root, branch, and checkpoint
   ancestry from the selected working directory before any task edits. Continue
   every repository operation from that worktree, not the chat's original checkout.
5. Confirm required transfers and reconstruct only the environment needed for
   the next task step using project-supported setup. Preserve the locked dependency
   graph and obtain secrets through the destination's authorized mechanism. A
   prepare command alone never authorizes changing shared accounts or services.
6. Revalidate the relevant runtime assumptions and validation evidence, then
   state the verified checkpoint and next action. Resume the original task within
   its current authorization; pending material or environment requirements remain
   blockers to the dependent work.

## Report the actual move state

Distinguish **prepared**, **published**, **delivered**, and **resumed** using observed
evidence. Report the checkpoint branch/SHA, publication status, remaining transfer
or reconstruction requirements, handoff location and retention, and continuation
prompt. After resumption, also report the verified destination worktree and next
action. Preparation with a hypothetical destination is complete when the portable
handoff and outstanding delivery requirements are explicit; it does not establish
that another machine has resumed the work.
