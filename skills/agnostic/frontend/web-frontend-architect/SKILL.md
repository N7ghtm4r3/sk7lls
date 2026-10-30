---
name: web-frontend-architect
description: >-
  Structure web frontends using a responsibility-based architecture blueprint.
  Use for an architectural overview, initial frontend setup, or implementing a requested
  development wave within that structure across web frameworks.
---

# Web Frontend Architect

Apply this blueprint to the product's capabilities, entities, pages and rendering model.
Read [Frontend Domain Structure](../frontend-domain-structure/SKILL.md) and its agnostic
reference for every invocation; also read its React addendum for React scopes. They are
the single source of truth for layers, ownership classification, public entrypoints,
dependency direction and lint rules. This skill adds page mapping, authentication,
design-system selection and the architecture delivery workflow within that model.

Product names, frameworks, SDKs and coordination tools are adaptable; the canonical layer
names and dependency rules remain fixed. XState, React Query, Effect, hooks and actions
are implementation choices inside those boundaries. Visual direction is a separate input.

## Apply the blueprint

1. **Establish scope.** Read local instructions, accepted product and architecture decisions,
   existing code and relevant documentation. Identify whether the request is an overview,
   proposal, initial implementation or later wave. Preserve product terminology and the
   project's review and delivery process. When a newly accepted structure reverses recorded
   decisions, identify the superseded decisions and record their replacements through the
   project's decision workflow before application delivery. Ask only about unknowns that
   change ownership, behavior or scope. For components, establish the two inputs under
   Design system and component composition. Complete when the scope, accepted structure
   and material unknowns are explicit.
2. **Identify owners.** Inventory pages, layouts, providers, policies, operations, entity
   contracts, data sources, third-party bindings and their consumers. Classify capability
   policy as Features, entity repositories and views as Kernel, agnostic mechanics as
   Modules, external bindings as Integrations and assembly as Composition. Inspect mixed
   folders file by file; a generic bridge or existing name does not establish one owner.
   Complete when each responsibility has an owner and each rendered page has a template.
3. **Fit the structure.** Show the smallest useful target tree and public dependencies.
   For existing code, map in-scope files from current to target owners. Keep unresolved
   placements explicit rather than assigning whole folders by their current names.
   Name use cases independently of machines, hooks, fixtures or SDKs. Complete when each
   boundary has concrete content and resolves an in-scope ownership problem.
4. **Trace a flow.** Follow a real use case through route inputs, Composition access gating,
   feature policy and coordination, applicable Kernel contracts, the selected source,
   trusted server checks, outcome and presentation. Show where Composition supplies sources
   to entity or feature providers. Resolve required failure, retry, concurrency and lifetime
   behavior; choose UI mounting, service lifetime and data durability separately. Complete
   when the flow fits without hidden business logic in routes or source selection in views.
5. **Deliver the requested mode.** Overview and proposal requests return the tree, mappings,
   flow and open decisions without editing application files. Implement when requested:
   make the smallest coherent change, preserve agreed behavior and validate under Completion.

For staged work, identify affected owners, reused contracts and deferred work in each wave.
Create only the boundaries needed by that wave while preserving the full model's dependency
direction. Follow existing plan and documentation conventions; a separate blueprint document
is not required. Skill changes do not themselves authorize application migrations, publishing
or changes to a separate lint-plugin repository.

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

This tree illustrates a single-package web app. Use the framework's required route filenames
and lifecycle conventions while keeping implementation behind Composition exports. Every
folder earns its place through actual content; monorepos follow the canonical shared-package
and UI placement rules.

```text
src/
  app/                              # or routes/: required framework adapters only
    layout.tsx                      # when the framework requires it
    <route>/page.tsx
  composition/
    providers/
      index.ts                      # re-exports RootProviders
      RootProviders.tsx             # global runtime, query client, session, toaster
    proxy/
    routing/
      index.ts                      # re-exports page/shell folder indexes
      access/
      shells/<name>/
        index.ts
        layout.tsx                  # assembles feature providers + selected sources
      pages/<page>/
        index.ts                    # re-exports only
        route.tsx                   # Composition's framework page contract
        template.tsx
        components/                 # when page-local responsibilities need them
        hooks/
  features/<capability>/
    index.ts
    model/
    operations/
    providers/
    components/
    api/                            # capability-owned source, if needed
    simulated/
  kernel/<entity>/
    index.ts
    contract.ts
    port.ts
    providers/
    views/                          # entity pickers, badges
    api/
    simulated/
  modules/<agnostic-capability>/
  integrations/<third-party>/
  server/
  ui/
```

A client-rendered app uses its router's equivalent entries. `route.tsx` inside Composition
supplies the page contract exported to the framework route; it is separate from an HTTP
route handler. Required framework `layout.tsx` files connect shell exports; layout
implementations belong under `composition/routing/shells/<name>/`. Index files only
re-export named implementations, including provider trees.

## Ownership

### Routes, pages and shells

Routes are framework adapters, comparable to controllers. They read framework inputs and
connect page, layout, metadata or loader exports through Composition public entrypoints.
Product policy and data reads remain behind those contracts. API handlers follow the
canonical server exception.

Each rendered page has one dedicated template under `composition/routing/pages/<page>/`.
Distinct pages keep distinct templates even when they consume the same feature; a redirect
or technical response needs no artificial view. Templates own visual composition and
page-specific forms, sections and hooks. Reusable capability presentation stays with its
Feature; entity views stay with Kernel; visual primitives stay at the canonical UI location.
Adding pages alone is not evidence for adding features.

Shells own persistent presentation such as headers, navigation and the content frame.
A shell assembles feature-owned providers with chosen dependencies. Global root providers
alone live in `composition/providers/`; feature providers remain with their feature and
entity providers with their Kernel owner. Keep construction and source selection out of
page templates. Preserve server rendering when only a nested provider needs browser execution.

Mount providers only where their consumers need them. Define which data and work must
survive navigation, reload or session changes and give them a suitable owner; remounting
reconnects to that owner. Simulated sources honor the same contract without forcing a
feature into the global provider tree. Reuse runtime and caches already supplied by the SDK.

### Features and Kernel

A Feature owns a coherent product capability: policy, workflow, operations, providers and
reusable presentation. It receives its dependencies as inputs and can coordinate several
Kernel entities. Features never import peer Features; Composition connects cooperating ones.
Choose feature granularity from product language, policy, state and change boundaries,
using the canonical sibling scan before creating another owner.

Kernel owns repository-like entity boundaries: contracts, ports, CRUD/query operations,
entity invariants, providers and views. Kernels never import peer Kernels; logic involving
multiple entities belongs in a Feature. Entity-specific pickers and badges can live in
`views/` without becoming a generic UI or capability workflow.

Keep pure rules independent of the router, view lifecycle, coordinator, fixtures, SDK and
transport DTOs. Give operations product-intent names and expose their inputs and outcomes
independently of private machines or hooks. Semantic subpaths can keep related responsibilities
under one domain; repeated name prefixes and one feature per operation obscure ownership.

### Sources, Integrations and server

The owner of a data contract also owns its `api/` and `simulated/` implementations: Kernel
for an entity repository, Feature for capability-specific data without a shared entity.
Only Composition and tests import these source subpaths. Composition supplies the selected
implementation through a port or existing deliberate contract; consumers use that contract.
Domain root indexes do not re-export sources. Use existing functions as seams where sufficient.

Integrations hold third-party SDK and library bindings, including client and server runtime
construction. Split mixed bridges by responsibility: session reads and gates belong to the
access feature's API source; entity projections belong to that entity's Kernel API source;
SDK runtime construction stays with its Integration. Inspect actual files before deciding.

Only canonical API source subpaths and `app/api/` import local `server/` public entrypoints.
Keep server-only code and credentials out of browser bundles; enforce protected reads and
operations at their trusted server or API boundary. Browser and server entrypoints remain
separate even when they belong to the same domain.

### Modules, shared packages and UI

Modules own agnostic app-local mechanics such as forms, navigation guards, session support,
instance helpers and theme. They accept required configuration; Composition supplies
product-specific wiring. Product policy stays with Features and entity contracts with Kernel.
A longer lifetime or a second consumer alone does not make product behavior agnostic.

Use shared packages when real consumers span applications. Keep genuinely shared entity
contracts with their entity owner rather than creating a separate `entities/` layer.
UI owns visual primitives and theme tokens independent of product, session and runtime
concepts. A product-aware picker belongs to its Feature or Kernel owner.

## Dependency direction

Apply the canonical dependency and lint rules, including public semantic-subpath indexes,
re-export-only indexes, self-index restrictions, and Composition/test-only source imports.
Trace actual imports and re-exports; filenames alone do not prove a boundary. Tests have
only the exceptions stated in the canonical reference.

For authentication or protected routes, read
[Web authentication boundaries](references/authentication.md). Composition applies
feature-owned policies through public contracts; trusted boundaries enforce them. Access
checks use plain calls and framework interrupts in the protected Composition page or loader.

## Completion

An overview or proposal is complete when every in-scope responsibility has an owner, pages
map to templates, the tree and public dependencies agree and the traced flow exposes material
unknowns. Include file-by-file migration mappings and superseded decisions when applicable.
For component scope, identify the design system and composition standard and show how
components fit both that standard and their responsibility owners.

An implementation wave is complete when requested behavior works, new boundaries have real
content, imports and re-exports follow the canonical model and browser/server and runtime
lifetimes remain intentional. Run the narrowest supported type, lint, build and dependency
checks. Confirm which rules the installed plugin actually enforces; manually inspect missing
coverage and report it until the plugin is updated. A passing older plugin does not prove
conformance to the new model.

For component changes, check system tokens, APIs, composition and accessibility contracts
using existing checks and representative states. Verify affected flows and test changed
rules or coordination when behavior changed; moving files alone needs no new test suite.
Report validation, unresolved placements, enforcement gaps and deferred scope. Update project
documentation when requested or required by local instructions.
