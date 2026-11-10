---
name: mock-philophy
description: Build or review functional frontend mocks with explicit state machines, replaceable simulated actors, coherent local data and frontend domain boundaries. Use when delivering frontend behavior before backend integration, across products and frameworks.
---

# Mock Philosophy

Build the frontend behavior that the product needs, with simulated dependencies behind stable
contracts. The UI and its state transitions remain usable when a real data source replaces the
simulation. This skill applies across projects; product names, routes, providers and SDKs come from
the consuming project.

Read [Frontend Domain Structure](../frontend-domain-structure/SKILL.md) and its agnostic reference
before placing code. Read its React addendum for React code. Those documents own layer placement,
domain classification, public entrypoints and dependency rules; this skill adds simulation behavior.

## Frontend boundary

- Implement the requested UI, state machines, frontend contracts, simulated sources and Composition
  wiring. Keep external reads and writes simulated for the behavior being mocked.
- Do not implement backend services, HTTP handlers, server actions, database schemas, connectors,
  external automations or infrastructure to make the mock work. A missing backend operation is a
  frontend contract with a simulated implementation, not a dependency that blocks UI delivery.
- Preserve existing real integrations only where the accepted task explicitly keeps them real.
  Their presence does not authorize integrating the mocked behavior. Never silently fall back to
  a live source when a simulated actor is missing or fails.
- Use the project's frontend stack and existing runtime. Do not adopt a template's backend, SDK,
  package layout or dependencies just to reproduce its frontend patterns.
- When a request includes backend delivery as well, apply this skill to the frontend simulation
  portion; keep the separately authorized backend work explicit.

## Own contracts and select sources

Place entity contracts and repository behavior with their Entity; place a capability's coordination
and policy with its Feature. Scan existing owners before creating another domain. Contracts describe
product inputs, outputs and failures without inventing future transport endpoints or backend DTOs.

Put seeds, in-memory repositories, fake runtimes and simulated effects in the owning domain's
`simulated/` subpath. Only Composition and tests select a source. Consumers receive the selected
contract or actor as an input; domain root indexes do not re-export their sources. Do not introduce
a top-level mock layer, `mock*` application folders or a separate implementation of the same UI.

Keep the operation contract independent of its implementation. Replacing a simulated source should
change the source and its Composition binding, without rewriting the feature's views or transitions
when the contract is unchanged. Do not build speculative live adapters as part of the mock.

## Model behavior with state machines

1. Identify the user intent, allowed states, events, guards, transitions and observable outcomes.
   Name them in the project's product vocabulary. Represent a multi-step or asynchronous lifecycle
   explicitly instead of coordinating independent loading, success and error flags.
2. Keep transition rules and guards deterministic. Delegate asynchronous work and other side effects
   to replaceable actors or the existing state-machine library's equivalent effect boundary.
3. Have views send events and render state. Avoid hidden transitions in event-handler Promise chains,
   effects or timers that bypass the machine. Plain navigation and trivial synchronous view state
   need no separate actor or machine.
4. Keep drafts, selections and operation status in flow state. Store shared records in the owning
   repository or data cache; do not maintain competing record copies in each machine or component.
5. Specify which events are accepted while work is pending. Prevent duplicate submissions and stale
   completions from producing invalid transitions or overwriting newer state. Model cancellation,
   retries and optimistic rollback when the requested flow requires them.
6. Connect success and failure to observable UI behavior. A completion message follows the actor's
   outcome; clicking a button alone never proves that an operation succeeded.

Use the project's established state-machine implementation. For XState with Effect, read
[the stack mapping](references/xstate-effect.md); its SDK APIs apply only when that stack is used.

## Make simulations coherent and reproducible

- A successful write changes the simulated source and updates or invalidates the affected cached
  reads. Lists, details, counters and subsequent actions observe the same result.
- Preserve the contract's validation and typed failures. Make required empty, pending, success and
  error scenarios selectable or injectable. Use controllable pacing rather than random failures or
  arbitrary delays in views; tests should be able to complete without wall-clock sleeps.
- Define source lifetime separately from provider mounting: what survives navigation, remount,
  reload and session changes? Honor existing requirements. When unspecified, use a session-local
  in-memory source that survives route navigation and resets on reload, and state that assumption.
  Persistent browser storage requires an actual persistence requirement.
- Keep fixture relationships and identifiers consistent. Inject time or identifier generation when
  a scenario depends on them. Re-entering a page must not silently reseed a still-live repository.
- Put scenario controls in the simulation or test harness. Add them to product UI only when requested.

## Verify the behavior and boundary

Drive the machine with controlled actors and assert observable transitions and outcomes. Cover the
required success and failure paths, including duplicate events or stale results where they matter.
At the narrowest useful UI seam, prove that a completed operation changes the relevant displayed
data and that a failed operation leaves a recoverable state. Verify the agreed navigation lifetime.

Run the relevant types and frontend-layer checks; inspect uncovered import rules manually when the
installed lint plugin lacks them. Review the diff for backend changes, live source fallbacks and
direct simulation imports outside Composition or tests. Report what is simulated, any explicitly
retained real dependency, the chosen lifetime and validation performed. Do not claim backend
integration or server-enforced permissions from a successful frontend simulation.
