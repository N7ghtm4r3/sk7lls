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

**Reference:** [Web Frontend Architect](../../web-frontend-architect/SKILL.md),
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

- **Before extracting:** Check the underlying component library for an existing
  component that already provides the capability. A shared abstraction composes
  that component (layout, sizing, defaults) rather than rebuilding it from
  lower-level primitives.

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

## H004 - Authority Comes From the Trusted Source

**Behavior:** A contract that decides rights resolves the principal and its
authority itself, from verified context. The rights in scope are identity,
roles, scope, ownership and visibility. It never takes them as input from the
caller. Callers receive the decision and pass it on instead of reconstructing
it.

Simulations of such a contract (mocks, stubs, prototypes) keep that shape. They
replace only the source behind the contract, and they do not move the decision
to a less trusted side or widen its inputs. Going live then swaps the source
without changing callers.

**Applies when:** Designing or simulating access checks, permission lookups,
command handlers that record an actor, or data sources that restrict what a
caller sees.

**Reasoning:** An authority-bearing input turns every caller into a potential
confused deputy, and types do not catch a value from the wrong origin. A
simulation built on a weaker shape gets copied as the pattern. Later it must be
found and rebuilt instead of swapped.

**Limits:**

- Explicit, authorized delegation may take a target principal; the actor still
  comes from the trusted context.
- Pure policy functions over an already-resolved decision are fine.
- General untrusted-input handling and client/server placement belong to H001.

## H005 - Conform to the Adopted Structure

**Behavior:** When a project has adopted a structure model (layers, domain
folders, page and shell folders, reserved subpaths), place every new or moved
file according to that model, including its rules on folder contents and
grouping, not only its dependency rules. Review each placement against the
documented model: which owner and layer the file belongs to, whether its
folder may hold it, and whether semantic subdomains come before technical
folders. A passing structural linter proves only the rules it implements, so
check the remaining rules explicitly. When existing code already diverges,
follow the model for new code instead of copying the drift, and record the
drift separately.

**Applies when:** Planning file paths, adding pages, features, entities or
shared components, moving code, or reviewing a change in a project with a
documented structure model.

**Reasoning:** A consistent tree makes ownership discoverable and lets the
next contributor place code without guessing. Every misplaced file becomes the
example the next change copies, so structure decays one plausible exception at
a time, and a green linter makes that decay invisible.

**Limits:** The model's intent wins over its example tree: keep
project-native names where they express the same responsibility. A local
convention adopted on purpose is fine when it is recorded. Fixing existing
drift belongs to a planned migration, not to every unrelated change. Encode in
tooling the rules that are mechanical, and keep judgment-based ones (whether a
subdomain is meaningful) in review.

**Example:** A layered frontend states that a page folder holds only its
entry, route and template, and that a domain groups subdomains before
technical folders. A change that adds tab components beside the template, or
`components/<topic>/` folders next to flat `operations/`, passes an import
linter but breaks the adopted tree. The review flags it, and the fix moves the
files.
