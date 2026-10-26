---
name: web-frontend-architect
description: >-
  Structure web frontends using a responsibility-based architecture blueprint.
  Use for an architectural overview, initial frontend setup, or implementing a requested
  development wave within that structure across web frameworks.
---

# Web Frontend Architect

This skill is the reusable architecture blueprint for a web frontend. Apply it to the
product's capabilities, screens, rendering model, and existing conventions.

Read [Frontend Domain Structure](../frontend-domain-structure/SKILL.md) and its agnostic
reference for every invocation; also read its React addendum for React scopes. They are
the single source of truth for layers, ownership classification, public entrypoints,
dependency direction, and lint rules. This skill adds page mapping, authentication,
design-system selection, and the architecture delivery workflow within that model.

Product names, web framework, API clients, and state or coordination tools are adaptable;
the upstream layer names and dependency rules remain fixed.
XState, React Query, Effect, hooks, and actions are implementation choices within these
boundaries. Architecture design here concerns application structure; visual direction is
a separate product input.

## Apply the blueprint

1. **Establish scope.** Read local instructions, accepted product decisions, existing code,
   and relevant project documentation. Identify whether the request is an overview,
   a structure proposal, initial implementation, or a later implementation wave.
   Preserve product terminology. Ask only about unknowns that change ownership, behavior,
   or the requested scope. For component work, establish the design system and component
   composition standard under Design system and component composition below. Complete when
   the scope and material unknowns are explicit, including those standards before proposing
   or implementing affected components.
2. **Identify owners.** Inventory the relevant pages, layouts, providers, rules, use cases,
   integrations, and their consumers. In a new app, derive these from accepted requirements;
   in an existing app, distinguish intended responsibilities from current placement.
   Apply the canonical layer model and the ownership guidance below. Complete when each in-scope responsibility has an owner
   and every rendered page has its own template mapping.
3. **Fit the structure.** Show the smallest useful target tree, its responsibility assignments,
   and the direction of its public dependencies. For existing code, include current location
   to target location mappings for the files in scope; leave unrelated code for later work.
   Name use cases independently of their current machines,
   hooks, mocks, or SDKs. Complete when each proposed boundary has a concrete purpose and
   the structure resolves the in-scope ownership problems.
4. **Trace a flow.** Follow at least one real in-scope use case through route inputs,
   applicable access controls, rules, integration, outcome, and presentation. Identify
   relevant failure, retry, concurrency, or lifetime decisions that the requirements leave
   open. Complete when the flow fits the proposed boundaries without hidden business logic
   in the page composition or transport adapter.
5. **Deliver the requested mode.** Overview and proposal requests return the relevant tree,
   mappings, flow, and unresolved decisions without editing application files. Implement
   when requested: make the smallest coherent change for that scope, preserve agreed
   behavior, and validate as described under Completion.

Use this skill as the architectural index throughout staged work. For each wave, identify
the affected owners, existing contracts it reuses, and work deliberately deferred. Create
only the boundaries needed by that wave while preserving the direction of the full blueprint.
Follow the project's existing plan and documentation conventions when they apply; a separate
blueprint document is not required to use this skill.

## Design system and component composition

For work that proposes, creates, or changes components, establish two separate inputs:
the design system or component library, and the component composition standard. Read
explicit project guidance and reuse choices already established by the user. A library
dependency or existing folder shape alone does not establish the composition standard.

If either input is unspecified or conflicting, ask which design system and composition
standard to follow before designing or implementing the affected components. For example:
"Which design system or component library should these components follow, and should
composition use Atomic Design, an existing project convention, or another standard?"
Ask only for unresolved choices. An explicit choice to use no formal hierarchy is valid;
Atomic Design is an option, not an automatic default. Continue independent architectural
inspection while awaiting the answer.

Inspect the selected system's documentation and nearby components before extending it.
Reuse its components, semantic tokens, variants, and composition APIs. Follow its spacing,
typography, color, iconography, interaction, and accessibility contracts. Compose existing
primitives before introducing new ones. When a missing component is needed, implement it
using the selected system's conventions rather than introducing a parallel component style.

Apply the selected composition methodology where it helps express real responsibilities.
With Atomic Design, compose primitives into meaningful groups and sections using the
project's definitions of atoms, molecules, and organisms. Create only the levels needed
by actual components; preserve equivalent existing names and locations. Its templates
and pages describe composition levels, while this blueprint's page templates retain
their dedicated page ownership.

Composition levels do not replace architectural ownership. An organism with product rules
still belongs to its feature or page owner; a molecule is not automatically shared UI.
Place components according to Ownership below and keep common visual primitives independent
of product concepts. Explain how the selected standard maps to those owners when proposing
structure changes.

## Reference structure

These paths illustrate the canonical model for a single-package web application. Adapt
route filenames and mounting conventions to the framework and product names to the product.
Map existing directories into these layers when they are in scope. Each directory earns
its place through real content; keep related files together when an extra folder adds only
navigation. For monorepos, follow the canonical shared-package and UI placement rules.

```text
src/
  app/
    layout.tsx
    <route>/page.tsx
  composition/
    providers/
      index.tsx
    <surface>/
      index.ts
      shell/
      pages/
        <SpecificPageTemplate>/
          index.tsx
          components/
  features/
    <product-capability>/
      index.ts
      model/
      operations/
      components/
  modules/
  integrations/
    <external-system>/
      index.ts
  server/
  ui/
```

`layout.tsx` and `page.tsx` are illustrative framework conventions. A client-rendered
web app uses its router's equivalent entrypoints; server-only entries exist where the
rendering model or server work requires them. Use the same responsibility boundaries with
the framework's own components, lifecycle, and file conventions.

## Ownership

### Routes and page templates

**Routes are framework adapters**, comparable to controllers. They read framework inputs
and connect the page, layout, metadata, or loader exports supplied by Composition through
its public entrypoints. Product policy and data reads stay behind that composition
contract; routes do not import Features or Modules directly. API handlers follow the
canonical server exception.

Composition applies domain-owned policies through permitted feature contracts; trusted
server and API boundaries enforce access to protected data and operations. Use the
framework's native shapes: layouts compose, and access checks are plain calls at the top
of the protected Composition page or loader that use the framework's interrupts,
never wrappers that take the page as a render callback (see
[Web authentication boundaries](references/authentication.md)).

**Each rendered page has one dedicated page template**, comparable to its view. Give the
template a dedicated folder under its Surface's `composition/<surface>/pages/`, with room
for page-specific components. A route that only
redirects or returns a technical response needs no artificial view. Distinct pages retain
distinct templates even when they use the same feature.

Templates own the page's visual composition. Keep complex page-specific forms and sections
there; put reusable product-capability presentation with its feature and visual primitives
at the canonical UI location. Use props, children, or slots where the framework supports them. Templates consume
public feature contracts; external SDK calls and integration internals stay behind their
owners. Page composition is separate from the shared layout, runtime construction, and
use-case coordination.

For example, a creation page and a detail page each have their own template while both
consume the same product capability. Adding pages alone is not evidence for adding features.

### Composition, layouts, and shell

**Composition owns application assembly.** It connects configuration, concrete dependencies,
providers, and runtime. App-wide providers live in `composition/providers/`. **Shell is
persistent presentation** such as header, sidebar, navigation, and the content frame,
assembled in `composition/<surface>/shell/`. Framework layouts connect the appropriate
Composition exports. Shared shell capabilities consumed by Features belong to Modules.

Choose mount boundaries deliberately: state and caches may persist between routes, while
a change of user, session, or product context may require renewal. Reuse infrastructure
already supplied by the application or SDK. Keep construction out of page templates;
preserve server rendering where only a nested provider needs browser execution.

### Features

**A feature owns a coherent product capability**: its concepts, rules, operations, and
reusable presentation. Determine granularity from policy, product language, workflow,
consumers, and what must change together. Inspect existing siblings before introducing
another owner. Extend an existing capability when it already owns the responsibility;
introduce a distinct capability when it has a real independent responsibility.

Pages, forms, individual operations, visual panels, and file counts do not by themselves
establish a feature. Apply the same ownership test recursively within a large capability.
Use technical subfolders only where they help organize actual content.

Within a feature:

- **Model** owns product invariants: validity, permissions, visibility, calculations,
  transformations, and business state rules. Express these with ordinary functions and
  types independent of the router, UI framework, coordinator, fixtures, SDK, and transport
  DTOs. Form defaults and display messages belong to presentation; transport normalization
  belongs to integration.
- **Operations** own use cases: their sequence, policy application, integration calls,
  and outcomes. Give them product-intent names. A state machine, hook, or action can
  implement coordination; public operation inputs and outcomes belong with the use case,
  so consumers remain independent of that implementation's private types.
- **Components** own reusable presentation of the capability, including the presentation
  lifecycle or bindings it needs. Keep components used only by one page with that template
  unless they independently express a capability-owned responsibility.

External calls, SDK bindings, transport contracts, and mappings live in the canonical
`integrations/` layer rather than a feature-local integration folder. Operations consume
its deliberate public contracts; model rules remain independent of transport and SDKs.
Existing functions can be sufficient seams; introduce ports, repositories, factories,
or services when a concrete need earns them.

Expose deliberate public contracts for consumers. Where browser and server execution differ,
provide appropriate entrypoints that preserve that boundary and the canonical import rules.
Keep mock adapters and fixtures in Integrations, selected only by Composition or tests;
temporary implementations do not define the final product domains.

### Shared data, modules, server, and UI

- **Shared data** follows the canonical invariant-owner classifier. Keep a capability's
  private records local; place genuinely shared app-local data contracts in their honest
  Module owner, or in a shared package when real consumers span applications. Keep SDK
  bindings in Integrations. A separate top-level `entities/` layer is not part of this model.
- **Modules** own genuinely common app-local technical capabilities, such as session
  mechanics, runtime support, data sources, and form foundations. Their contracts accept
  required data or configuration; Composition supplies feature-specific wiring. Product policy
  stays with its product owner.
- **Server** owns server-only infrastructure and credentials. Integrations access its public
  entrypoints; API handlers follow the canonical exception. Features reach server behavior
  through Integration contracts. A static browser app may need no local server directory.
- **UI** owns visual primitives and theme, independent of session, runtime, and product
  concepts, in the single-package UI layer or the monorepo's shared UI package. A
  product-aware picker belongs to its Feature or Module owner.

## Dependency direction

Use the dependency and Lint Rules in the canonical
[Frontend Domain Structure reference](../frontend-domain-structure/references/structure.md).
Check actual imports and execution boundaries against those rules, including test and
story files. Compose cooperating Features in Composition through props, slots, or callbacks;
Features do not import peer Features. Keep server-only code out of browser bundles and
enforce protected operations at the trusted server or API boundary.

For an app with authentication or protected routes, read
[Web authentication boundaries](references/authentication.md) before proposing route groups,
session wiring, or authentication screens.

## Completion

An overview or proposal is complete when every in-scope responsibility has an owner, rendered
pages map to their templates, the target tree and public dependencies agree, and the traced
flow exposes material unknowns. Include migration mappings when existing code is affected.
For component-related scope, identify the established design system and composition standard
and show how the proposed components fit both that standard and their responsibility owners.

An implementation wave is complete when its requested behavior works, each new boundary has
concrete content, affected imports pass the canonical layer rules, and browser/server and runtime
lifetimes remain intentional. Use the narrowest relevant type, lint, build, or dependency
checks already supported by the project. For component changes, also verify conformance to
the selected system's tokens, component APIs, composition conventions, and accessibility
contracts using existing project checks and representative states where applicable. Verify
affected user flows and test changed rules or coordination where behavior changed; a file
move alone does not require a new test suite.
Report validation results, unresolved decisions, and deferred scope. Update project
documentation when requested or required by local instructions.
