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

The blueprint defines responsibility owners and dependency direction. Product names,
directory names, web framework, API clients, and state or coordination tools are adaptable.
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
   Apply the ownership rules below. Complete when each in-scope responsibility has an owner
   and every rendered page has its own template mapping.
3. **Fit the structure.** Show the smallest useful target tree, its responsibility assignments,
   and the direction of its public dependencies. For existing code, include current location
   to target location mappings. Name use cases independently of their current machines,
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

These paths illustrate a web application. Adapt route filenames and mounting conventions
to the web framework; adapt product names to the product. Preserve equivalent existing
directory names and map them to these roles. Each directory earns its place through real
content. Keep related files together when an extra folder adds only navigation.

```text
src/
  app/
    layout.tsx
    <route>/page.tsx
  root/
    providers/
    shell/
  page-templates/
    <SpecificPageTemplate>/
      index.tsx
      components/
  features/
    <product-capability>/
      index.ts
      server.ts
      model/
      operations/
      components/
      integrations/
  entities/
  modules/
  server/
  ui/
```

`app/`, `layout.tsx`, `page.tsx`, and `server.ts` are illustrative conventions. A client-rendered
web app uses its router's equivalent entrypoints; server-only entries exist where the
rendering model or server work requires them. Use the same responsibility boundaries with
the framework's own components, lifecycle, and file conventions.

## Ownership

### Routes and page templates

**Routes are framework adapters**, comparable to controllers. They handle URL inputs,
parameters, metadata, redirects, session access, and framework loading or error behavior.
They may call permitted operations in their rendering context and provide results to their
page template.
Routes apply policies owned by the domain; server and API boundaries enforce access to
protected data and operations. Use the framework's native shapes: layouts compose, and
access checks are plain calls at the top of each page that use the framework's interrupts,
never wrappers that take the page as a render callback (see
[Web authentication boundaries](references/authentication.md)).

**Each rendered page has one dedicated page template**, comparable to its view. Give the
template a dedicated folder with room for page-specific components. A route that only
redirects or returns a technical response needs no artificial view. Distinct pages retain
distinct templates even when they use the same feature.

Templates own the page's visual composition. Keep complex page-specific forms and sections
there; put reusable product-capability presentation with its feature and visual primitives
with `ui`. Use props, children, or slots where the framework supports them. Templates consume
public feature contracts; external SDK calls and integration internals stay behind their
owners. Page composition is separate from the shared layout, runtime construction, and
use-case coordination.

For example, a creation page and a detail page each have their own template while both
consume the same product capability. Adding pages alone is not evidence for adding features.

### Root, layouts, and shell

**Root is application assembly.** It connects configuration, concrete dependencies,
providers, and runtime. **Shell is persistent presentation** such as header, sidebar,
navigation, and the content frame. Framework layouts mount the appropriate assembly and
shell through wrappers suited to the framework's rendering model.

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
- **Integrations** own calls to external systems, SDK bindings, transport contracts,
  loaders, and mappings into the data needed by operations. Keep capability-specific
  details here; put genuinely common technical mechanisms in `modules` and server-only
  infrastructure in the server boundary. Existing functions can be sufficient seams;
  introduce ports, repositories, factories, or services when a concrete need earns them.

Expose deliberate public contracts for consumers. Where browser and server execution differ,
provide appropriate entrypoints that preserve that boundary. Keep mock adapters and fixtures
separate from pure rules; temporary implementations do not define the final product domains.

### Entities, modules, server, and UI

- **Entities** own data representations shared across capabilities, associated data-level
  controls, and optional bindings. Isolate SDK bindings from the data definition. Give each
  rule one owner across entities and features; keep a capability's private records local
  until sharing is real.
- **Modules** own genuinely common app-local technical capabilities, such as session
  mechanics, runtime support, data sources, and form foundations. Their contracts accept
  required data or configuration; root supplies feature-specific wiring. Product policy
  stays with its product owner.
- **Server** owns server-only infrastructure and credentials, including shared server
  runtime and session mechanics. Feature-owned server operations remain with the feature,
  behind the framework's server boundary. A static browser app may need no local server
  directory.
- **UI** owns visual primitives and theme, independent of session, runtime, and product
  concepts. A product-aware picker belongs to its entity or feature owner.

## Dependency direction

Check the actual imports and execution boundaries, not just folder names:

- Routes and templates consume public feature contracts. Routes may call server operations
  and policies before passing allowed data into templates.
- Root and layouts assemble features, modules, shell, and runtime. Features and modules
  remain independent of root, routes, and templates.
- Operations use model rules and integrations. Integrations may use domain types; model
  stays independent of integration and coordination machinery.
- Integrations remain independent of presentation and coordinator runtime.
- Modules remain independent of features. Supply product-specific dependencies through
  assembly rather than importing higher-level capabilities into common infrastructure.
- Cross-owner dependencies use intentional public entrypoints and remain one-way and
  acyclic. For peer features, establish a genuine consumer relationship through a public
  contract or compose them above both owners; keep shared invariants with one honest owner.
- Keep server-only code out of browser imports and bundles. UI visibility reflects policy;
  the trusted server or API enforces protected operations.

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
concrete content, affected imports follow the blueprint, and browser/server and runtime
lifetimes remain intentional. Use the narrowest relevant type, lint, build, or dependency
checks already supported by the project. For component changes, also verify conformance to
the selected system's tokens, component APIs, composition conventions, and accessibility
contracts using existing project checks and representative states where applicable. Verify
affected user flows and test changed rules or coordination where behavior changed; a file
move alone does not require a new test suite.
Report validation results, unresolved decisions, and deferred scope. Update project
documentation when requested or required by local instructions.
