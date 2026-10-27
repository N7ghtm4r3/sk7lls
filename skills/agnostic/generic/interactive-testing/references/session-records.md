## Preserve observations and a compact handoff outside the project

The handoff is mandatory throughout an authorized session, including sessions without monitoring. Keep analysis notes in conversation memory while readonly applies. Once the session is authorized, initialize its records before the first operational instruction and refresh them progressively; do not wait for a separate request to save results. Keep a progressive `observations.md` journal in a unique external session directory. Resolve paths from the actual environment; do not repurpose environment variables.

Choose the journal parent from an explicit external destination already selected by the user, otherwise the current host's documented external user-state location, otherwise the operating system's temporary directory. For Codex, retain `${CODEX_HOME}/interactive-testing/`, or `~/.codex/interactive-testing/` when `CODEX_HOME` is unset; these are Codex bindings, not defaults for other hosts. Verify another host's actual location rather than renaming `.codex` or writing into managed task, memory, or configuration files. Disclose temporary retention and transfer needs. If no permitted writable location passes the external-path checks below, use the memory-only fallback.

Use the shared handoff skill to maintain a compact `handoff.md` in a unique directory under the operating system's temporary directory by default. Honor an already agreed external destination, or a user-requested persistent destination. Include the receiving task and a provable next action or the exact missing proof, current scenario outcomes and attempt counts, concise verified findings, exact blockers and explicit unknowns. Identify the project by its stable repository or project identity, revision when known, and repository-relative paths. Link to the journal and relevant evidence instead of embedding their full bodies, retaining the decisive facts in the handoff. Mark local-only evidence that needs transfer and runtime observations that need rediscovery; local save paths are delivery details, not portable project references. Each context pointer must identify its artifact or session and explain what must be rechecked for freshness.

Before writing either artifact, verify that the resolved destination, including symlink resolution, is outside the project and its worktrees. If a default falls inside them, choose another external user-state or temporary directory and disclose it. Never put session artifacts in the project, modify ignore rules for them, or overwrite another session's files. Disclose temporary handoff retention and keep the durable journal sufficient to reconstruct it. If persistence is unavailable, maintain and refresh the complete handoff in memory and explain the persistence limitation; do not silently omit it.

Record progressively in the journal after preparation and each meaningful action, observation, finding, or interruption, and refresh the compact handoff at the same checkpoints:

- session identity, stable project identity and revision when known, interaction mode, reference scenario inventory, agreed or guided order, user selections, and authorized operations;
- scenario contract, complete case instructions or requested step-by-step cadence, current action, any genuinely required confirmation, and expected versus actual outcomes;
- attempts used and remaining where applicable, and monitoring requested/not requested with its current state;
- observer readiness and baseline/correlation cursor before case presentation, polling capability, user-action wait and settlement windows, and any pause or stopping reason;
- user-reported verification and independently observed evidence, with provenance;
- bugs or anomalies, their reproduction steps, supporting evidence, and whether they are confirmed or suspected;
- open questions, blocked or unperformed checks, and the next useful step;
- instrumentation locations, session-created processes, runtime outputs, and their current cleanup status.

Retain enough evidence to resume without copying secrets or unnecessarily large payloads. Preserve earlier journal results when adding findings; correct mistaken conclusions explicitly. Do not create issue tickets, send messages, or turn the handoff into an implementation task unless requested.

On resumption, read the handoff and its relevant journal entries, resolve the context pointers, and recheck relevant project and runtime state read-only before acting. An old handoff documents prior authorization and observations; it is not fresh permission to restart services, replay side effects, or overwrite changed code. Reuse authorization that remains applicable in the current user conversation and ask only for uncovered operations.
