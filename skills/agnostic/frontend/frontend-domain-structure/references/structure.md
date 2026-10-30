# Frontend Domain Structure Reference

## Goal

Give each frontend behavior one stable owner in one fixed layer model. The layer names and their order
are the same in every project. This reference defines the architecture contract; see
[Lint Rules](#lint-rules) for enforcement and version gaps.

## Layers

The layer root is `src/` when it exists, else the package root. These layers sit under the layer root,
from top to bottom:

| Layer | Owns |
| --- | --- |
| `app/` or `routes/` | Route files the framework requires. They only connect Composition exports. |
| `composition/` | Application assembly, global providers, routing, shells, pages and source selection. |
| `features/` | One user-facing capability with its own workflow, policy, state and providers. |
| `kernel/` | Entity contracts, ports, CRUD/query behavior, entity providers and entity views. |
| `modules/` | Agnostic app-local capabilities such as forms, session mechanics, theme and navigation guards. |
| `integrations/` | Third-party SDK bindings, client setup and external library adapters. |
| `ui/` | Visual primitives and design-system components. |

Each layer imports only lower layers; it can import any lower layer, not only the next one.
Domain-owned `api/` and `simulated/` sources follow the additional restrictions below.
The rules govern imports between folders under the layer root, written as relative paths or an `@/`
alias. Package imports, such as `next/navigation`, are outside these local import rules.

The layer root holds only these layer folders and `server/`. Any other top-level folder under the layer
root is an error. Test and story files follow the same rules, with only the explicit test exceptions
under Data Sources and Public Entrypoints. The local lint model applies to packages whose layer root
contains `app/` or `routes/`; a package without a route layer still needs architectural review.

## Route Layer

The route layer imports only `composition/`. Root files `proxy.ts`, `middleware.ts` and
`instrumentation.ts` belong to the route layer. A route file reads framework inputs, connects the
Composition export for its page or shell, and returns the result. Product policy and data reads belong
to their invariant owners. Required framework layout files remain thin Composition adapters;
layout implementations live under `composition/routing/shells/<name>/`.

## Composition

Composition owns application assembly and source selection:

- `composition/providers/` mounts global root providers only, such as the app runtime, query client,
  session and toaster. Its index re-exports the provider tree implemented in a separate file.
- `composition/proxy/` supplies request-bound framework adapter exports when needed.
- `composition/routing/access/` assembles request gating using the access feature's contracts.
- `composition/routing/shells/<name>/` holds one layout implementation per folder. It connects the
  chosen sources to feature-owned providers and assembles the persistent presentation.
- `composition/routing/pages/<page>/` holds one rendered page: a re-export-only `index.ts`, a
  `route.tsx` adapter for the framework's page contract, and its template. Add page-local
  `components/` or `hooks/` only when needed.

A **Surface** is one part of the app that a distinct user group sees through its own shell.
Represent its shell under `routing/shells/`; features stay flat rather than nesting under a Surface.
The routing index re-exports page and shell folders through their indexes. A page export gives the
framework route everything that page needs, so the route file only connects it.

A Feature never imports another Feature. When two features work together, the nearest Composition
owner holds both and connects them through props, slots or callbacks. Shell parts features consume
(a navigation registry, header slot, toast or assistant channel) are Modules; shell assembly is
Composition. Product-aware sidebar content stays with the capability whose policy it presents.

## Features

A Feature owns a coherent user-visible capability: its workflow, policy, state, providers and reusable
presentation. It may combine several Kernel entities; logic spanning entities belongs here.
A feature can also own a data source when that data has no shared entity owner. Keep its contract and
port with the capability and its implementations in `api/` or `simulated/`.

A feature receives required dependencies as inputs. Composition chooses implementations and wires
them into its providers or operations. Page count, individual forms and operations alone do not
establish independent capabilities. Apply the domain-worthiness classifier before splitting one.

## Kernel

Each `kernel/<entity>/` owns a repository-like entity boundary: contract, port, CRUD/query operations,
entity invariants, providers and entity views such as pickers or badges. It can contain semantic
subpaths when the entity has distinct responsibilities. A Kernel never imports another Kernel.
Cross-entity coordination belongs in a Feature; entity ownership alone does not make a workflow
part of Kernel. Entity views use their owner's contracts and remain independent of feature policy.

## Data Sources

Keep data source implementations with the entity or capability that owns their contract:

- `kernel/<entity>/api/` and `features/<capability>/api/` implement real data access.
- `kernel/<entity>/simulated/` and `features/<capability>/simulated/` implement fake sources.

Only Composition and tests consume these source subpaths; other code in the owning domain also
receives the selected source as an input. Imports between implementation files inside one source
remain internal. The sources may depend on their own domain's contracts and on permitted lower layers. Other
production consumers receive a selected implementation through inputs; the domain root index never
re-exports sources to bypass this restriction. Sources normalize transport DTOs into owner-defined contracts. Simulated sources satisfy the same
contract and required lifetime as real sources. Use `simulated/` instead of `mock*` source folders. There is no
separate top-level simulated layer or `integrations/simulated/` tier.

## Integrations

An Integration binds a third-party system or library: an SDK runtime, telemetry client, document
renderer or external client setup. Domain-specific CRUD, access decisions and fake entity stores
belong to their Feature or Kernel owner. For example, SDK server-runtime construction stays with
its SDK Integration, while session reads and request gates stay with the access feature's API source.

## Server

`server/` sits outside the layers; `effect-backend-structure` governs Effect server internals.
Only `kernel/*/api/`, `features/*/api/` and `app/api/` may import `server/`, through server public
entrypoints. `app/api/` handlers import only `server/`. Integration adapters bind their external
SDKs without reaching into local server internals. Keep credentials, privileged operations and
authoritative access checks in trusted server execution. Separate browser-safe and server-only
entrypoints within allowed source subpaths; a folder name alone does not enforce that boundary.

## UI

`ui/` holds visual primitives and design-system components. In a monorepo, only the shared UI package
(for example `packages/ui`) holds them, and an app-local `ui/` folder is an error. A monorepo has
`pnpm-workspace.yaml` or `package.json` `workspaces` at or above the package root. In a single-package
repository, `src/ui/` is the lowest layer. Entity views stay in Kernel; other product presentation
stays with its Feature, while agnostic capabilities stay in Modules.

## Shared Packages

A capability or primitive with real consumers in more than one application belongs to a shared package.
Code that two Surfaces of one app use stays in the app's Feature, Kernel or Module owner. Keep
app-specific widgets and workflows in the app that owns them. Within a shared package, apply the same
domain-worthiness test; shared code is still organized by responsibility. Package-tier naming follows
the project's package architecture rather than creating app-local layers automatically.

## Domains and Public Entrypoints

A domain is the first folder under a layer, for example `features/checkout/`, `kernel/order/`,
`modules/navigation/` or `integrations/payments/`. Composition's routing pages and shells also expose
folder indexes. Cross-domain imports target a deliberate public entrypoint: a domain or public
semantic subpath's `index.ts` or `index.tsx`; `ui/` is exempt. Within one domain, semantic subpaths
may import each other, subject to the source restrictions and acyclic dependencies.

An index file only re-exports. Put executable implementation in a named file, including provider
construction and page composition. Production code never imports its own folder's index, whether
through `./index`, a directory import or an alias; tests may import it to exercise the public contract.
Export only the contracts, views, operations and types the owner intentionally offers. Cross-domain
deep imports and cycles are errors. Lazy loading, re-export chains and aliases preserve these
boundaries. Use one domain name with subpaths rather than repeating the domain as a name prefix.

## Invariant Owner Classifier

Start with the **invariant owner**: the smallest stable domain responsible for the behavior, its rules,
and the changes that must remain coherent. A route name, visual region, file type or reuse count alone
does not establish ownership.

1. Read the Layers table from top to bottom and distinguish application assembly, capability policy,
   entity contracts, agnostic mechanics and third-party bindings.
2. Code with real consumers across applications follows Shared Packages.
3. A detail with no independent invariant stays with its current owner.

Prefer the narrowest honest owner. Longer data or service lifetime is a separate decision from UI
mounting scope; it does not by itself promote a feature into Modules or a global provider.

## Domain-Worthiness Classifier

Before creating a feature, kernel, module, integration, package or nested domain, **scan the siblings**.
Look for the same invariant owner, product language, workflow, change cadence and consumers. Extend
or rename an existing owner when it already covers the responsibility.

A new domain is worthy when it gives a coherent responsibility a stable name and at least one real
boundary: independent policy, lifecycle, state, workflow, consumer contract or reuse scope. File count
is not the classifier. Keep implementation with its current owner when a proposed split is only
navigational. Reject cosmetic micro-feature or micro-module splits named after a panel, button, page
fragment or temporary layout. Keep a one-file folder folded into its owner until the folder expresses
a deliberate public or semantic boundary.

## Recursive Semantic Internals

Apply ownership recursively at every directory and package depth. Within a domain or shared package,
group by semantic responsibility before adding technical folders. Introduce `components/`, `hooks/`,
`model/` or `operations/` only where related internals benefit from that secondary grouping.
For example, a billing feature may contain `invoices/` and `payment-methods/`. Each semantic subpath
follows the same ownership, public-boundary and acyclic-dependency rules. Kernel `views/` is a valid
entity-owned presentation boundary; a flat technical bucket is not a substitute for semantic ownership.

## Lint Rules

This table is the authority for the `frontend-layers` contract. HI distributes the plugin as the
`react-frontend-layers` lint asset in the `react` Pack. Check the installed plugin's actual rules before
claiming enforcement: older releases may implement the previous model. Report missing coverage and
check those boundaries manually until the local plugin or upstream release supports them.

| Rule | Error when |
| --- | --- |
| `layer-order` | An import targets a higher layer, or a file outside `kernel/*/api/`, `features/*/api/` and `app/api/` imports `server/`. |
| `route-imports` | A route-layer file imports a folder other than `composition/`, or an `app/api/` handler imports a folder other than `server/`. |
| `no-peer-feature` | A file in `features/<a>/` imports `features/<b>/`. |
| `public-entrypoint` | A cross-domain import bypasses a domain or public subpath index; `ui/` is exempt. |
| `no-prototype-folder` | A production folder uses `*prototype*` or `mock*` to stand in for a domain owner or a `simulated/` source. |
| `known-top-level` | A top-level folder under the layer root is not `app`, `routes`, `composition`, `features`, `kernel`, `modules`, `integrations`, `ui` or `server`. |
| `ui-placement` | An app-local `ui/` folder exists in a monorepo. |

The plugin update must also cover peer-Kernel imports, Composition/test-only source imports (including
re-export bypasses), re-export-only indexes, production self-index imports and layout placement.
These are required checks, not claims that a released plugin already provides rule IDs for them.
