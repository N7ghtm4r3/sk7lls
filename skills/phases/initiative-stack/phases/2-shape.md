# Phase 2: Shape

Goal: an accepted split into one walking skeleton and N vertical slices.
Run it as `brainstorm` proposal turns: one proposed shape, two or three
alternatives with their costs, evidence anchors. Use `show-me` for the stack
diagram.

## Walking skeleton (PR 0)

The skeleton is the running app with no features:

- app scaffold placed and built like the reference app;
- authentication, session, theme;
- shell, navigation frame, a home placeholder;
- the server platform layer the build policy requires;
- repo wiring: ports, aliases, env example, lint and agent scopes, CI
  workflow, runbook and its docs index link;
- the planning documents of the initiative.

Each slice adds its own pages, menu entries and domain entities. The
skeleton ships a menu with only the entries that already work.

## Slices

- Cut slices along **user-facing surfaces** over a shared model. Views of
  the same data (list, board, timeline) are surfaces of one slice family.
  An external integration is a source feeding a surface, not a slice by
  default.
- Every in-scope inventory row maps to exactly one slice. A row that fits no
  slice is a missing slice.
- Order bottom to top by dependency first, then by source priority.
  Aggregating surfaces (dashboard, overview, cross-slice search) and the
  lowest-priority slices go on top.
- A slice states what it consumes from the slices below it.

Record the slice table in the Brief:

| PR | Slug | Title | Scope (inventory IDs) | Consumes | Priority |
|---|---|---|---|---|---|

## Turn

Present the skeleton scope, the slice table and the alternatives. Stop.

Done when: the user explicitly accepts the skeleton scope and the slice
table, and the inventory has no in-scope row without a slice.
