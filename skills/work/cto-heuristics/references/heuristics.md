# CTO Heuristic Catalog

Apply these heuristics according to their conditions and limits. Add or refine
entries through the proposal and approval process in [the skill](../SKILL.md).

## Entry format

Give each entry a stable ID such as `H001` and the approved heuristic name.
Record:

- **Behavior:** the approved decision guidance when the stated conditions hold.
- **Applies when:** the signals that make this principle relevant.
- **Reasoning:** the mechanism and tradeoff behind the preference.
- **Limits:** exceptions or counterexamples that change the decision.

Add a brief abstract example only when it clarifies an otherwise ambiguous rule.
Retain enough technical detail to test applicability without tying the principle
to the PR that supplied it.

## H001 - Enforce Responsibility Boundaries

**Behavior:** Assign each responsibility a clear owner and preserve dependency
direction through deliberate public contracts. Keep business rules independent of
presentation, transport, and coordination details. Evaluate actual imports and
execution boundaries, beyond directory names.

- **Client/server boundaries:** When a capability spans browser and server
  execution, expose distinct entrypoints and enforce allowed dependencies.
  Keep secrets, privileged operations and authoritative validation server-side.
  Both sides may remain within the same feature; no particular folder structure
  is required.

**Applies when:** Introducing or changing application layers, shared
infrastructure, product capabilities, or dependencies between owners.

**Reasoning:** Explicit ownership and dependency direction reduce hidden coupling
and prevent implementation details from spreading across the application.

**Limits:** Adapt boundaries to the application's complexity and existing
conventions. Introduce abstractions and folders when they serve a concrete
responsibility.

**Reference:** [Web Frontend Architect](../../../agnostic/frontend/web-frontend-architect/SKILL.md),
particularly Ownership and Dependency direction. Consult these sections for web
frontend changes; the detailed blueprint applies to web frontends.

## H002 - Component Ownership and Reuse

**Behavior:** Keep components close to the page or capability that owns them.
Share components when their responsibilities and dependencies are independent of
that context.

Choose UI mounting scope, service lifetime, and data durability separately. Mount
feature-specific providers only where needed. Define which data and work must
survive navigation, reload, or session termination, then assign them an owner that
satisfies that lifetime. Providers should reconnect to that owner when remounted.

Make mocks honor these lifecycle requirements without forcing broader application
scope.

**Applies when:** Placing components, providers, subscriptions, background
operations, or saved state across application boundaries.

**Reasoning:** UI unmounting should not accidentally destroy saved data or required
ongoing work. Conversely, preserving that data or work should not require mounting
an entire feature for unrelated routes or users.

**Limits:** Genuinely shared behavior may belong at application scope. In-memory
storage is sufficient when reload persistence is not required; durable storage is
necessary only when the contract requires it. Unsaved drafts may remain local
unless recovery is explicitly required.

## H003 - Reuse Established UI Contracts

**Behavior:** Build interfaces using the project's established components and
conventions. Centralize recurring presentation and interaction rules in reusable
UI abstractions, while keeping context-specific decisions with their owners.
Apply those abstractions consistently across the affected existing interfaces.

**Applies when:** Adding or revising UI, extracting shared components, or finding
repeated styling and custom implementations of capabilities already provided by
the project.

**Reasoning:** Reusing established contracts preserves consistency in appearance,
behavior, and accessibility. An abstraction provides value when its consumers
share those guarantees; moving code or renaming components alone does not achieve
this.

**Limits:** Follow the project's chosen architecture without imposing a particular
component taxonomy or directory structure. Keep isolated compositions local.
Introduce or extend abstractions when existing components cannot express the
required behavior, and avoid forcing superficially similar elements into one
contract.

**Example:** Multiple screens implement selection controls independently. Reuse
or extend the established selection primitive for focus, keyboard interaction,
and selected state, while leaving each screen responsible for its content and
selection policy.
