---
name: goalify
description: "Create and activate one lean goal immediately from messy intent, then continue the user's task under it."
---

# Goalify

`goalify` generates and activates the goal in one move, immediately. Invocation
is permission to create the active goal now and continue the user's task under
it.

## Workflow

1. Read supplied handoffs, specs, issues, logs, examples, and scoped repo
   guidance. Finish with the objective, accepted constraints, and remaining
   work grounded in those sources.
2. Reduce the request to one durable objective. Finish with the outcome, proof,
   and stop conditions identified.
3. Write the smallest goal contract that can run without re-asking. Finish when
   it contains the five fields below and fits the 4,000-character limit.
4. Activate that goal immediately through the host binding below. Finish
   activation only with observable active status, then keep working under it;
   use the capability-blocker outcome below when activation cannot be verified.
5. Report only progress, blockers, and final proof relevant to that active goal.
   Finish the goal only when its required proof meets its stop condition.

## Contract

Include only:

- objective: one outcome
- context: exact paths, issues, URLs, logs, artifacts, and constraints
- workflow: terse checkpoints with named skills, tools, or phases from context
- proof: commands, scenarios, artifacts, logs, or other done evidence
- stop: done condition, early-stop blocker, and final report expectation

Keep it pointer-heavy, no secrets, no vague "make it work", and <= 4,000
characters of goal text, excluding any host command prefix.

## Host binding and completion

The required capability is a session goal that retains the contract, continues
work toward it across turns, and exposes active and terminal status. Read the
current host's tool or command documentation before activation. Invocation
authorizes this goal, not broader task permissions or replacement of an unrelated
active goal. Obey the facility's existing-goal, budget, stop and status rules.

- **Codex:** use its native `/goal` facility or an exposed native goal tool. When
  `create_goal` and `get_goal` are available, submit the contract as the objective
  and verify the returned/current state. Set a budget only when requested.
- **Claude Code:** current versions document native `/goal <condition>` and
  `/goal` status. Use them only through a documented dispatch available to the
  agent in the current session. Workspace trust and hook policy can disable this
  facility. Do not assume that the `Skill` tool can dispatch a built-in command.
- **Other hosts:** use a documented equivalent only when it provides the same
  activation, continuation and status guarantees.

Writing `/goal` in a reply, a task checklist, or an ordinary plan does not
activate a goal. Neither does launching a separate agent/CLI session activate
the current one. If activation or status inspection is unavailable, retain the
prepared contract, report the exact capability blocker and required host action,
and leave activation incomplete. Do not install hooks, schedule work or claim
an ordinary work loop is equivalent. After confirmed activation, continue the
task immediately; report completion only with its required proof.
