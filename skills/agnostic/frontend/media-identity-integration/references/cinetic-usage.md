# Using cinetic

Keep cinetic as the single source of its creative guidance and video workflow. This file only defines dependency resolution, reading scope, and the boundary between consultation and execution. Do not change cinetic or vendor its instructions, scripts, templates, or presets into this skill.

## Resolve the source

Resolve `cinetic` through the host's available skill catalog first. Otherwise inspect an installed sibling named `cinetic`; in this categorized source checkout, [cinetic's canonical source](../../../video/cinetic/SKILL.md) is the fallback. Resolve symlinks and interpret relative references against the actual source file. Use the discovered root for its supporting files rather than a machine-specific absolute path.

Confirm the required source and referenced sections are readable. If they are missing, report the dependency and the affected phase; do not silently install a substitute, invent its content, or claim the dependency was used. Capture work that does not need that guidance can still proceed within its own scope.

## Reference mode

Use this mode for product-detail discovery and static store artwork. Read only the source sections needed for the current decision:

| Need | Reference within cinetic | Scope for Brand Captures |
| --- | --- | --- |
| Distinctive behavior, objects, and states to show | `references/concept-and-story.md`, Inventory before ideas | Guide the product inventory and choice of representative capture. |
| Supplied palette, typography, and logo | `references/brand-kits.md`, Colours, Fonts, and Logo | Preserve approved brand inputs; use the source guidance for their visual treatment. |
| Clear copy and fitted type | `references/copy-and-type.md`, Writing a line, supplied-brand typography, and Measuring and fitting text | Apply relevant copy and type principles to the requested static format. |
| Focus and composition | `references/product-ui.md`, Supplied screenshots and product shots; `references/craft-rules.md`, Composition and layout | Choose framing, focus, and spatial hierarchy around the real captures. |
| Consistent visible details | `references/product-ui.md`, The pause test | Review the applicable data, labeling, and readability checks on still images. |

Consult the source rather than restating those rules here. Film-specific timings, frame-size thresholds, motion, soundtrack requirements, scene quotas, and UI reconstruction instructions do not become requirements for static assets. Reference mode does not execute cinetic's scaffold, film workflow, or scripts.

Keep source screenshots intact. Derived framing and composition must preserve their proportions and truthful UI content; no invented functionality or reconstructed controls masquerading as a native capture. The user's approved brand and destination constraints remain authoritative where cinematic defaults do not fit.

## Video execution mode

Activate this mode only for an explicit request to produce the store video. Read cinetic's actual `SKILL.md` and apply its workflow, loading its dependencies when their steps need them. This is real use of cinetic, not a checklist inspired by it. Follow [Store video](store-video.md) for the input handoff, user review, target exports, and delivery boundaries.

Run its scaffolding, production, rendering, and checks in a disposable project outside the inspected repository and outside the cinetic installation. Its own scaffolding may create runtime working copies there; do not maintain a duplicate implementation in this skill. Keep mutable project history and caches within that session or another explicitly authorized location.

Pass approved brand and style inputs through cinetic's supplied-brand workflow. Apply the requested store constraints and product-fidelity requirements when resolving its defaults. Distinguish its cinematic quality checks from destination-format checks; do not falsify or suppress a failing result to claim compliance. If a required action cannot fit the agreed boundaries, explain the concrete incompatibility before proceeding with that action.

The user may request further iterations after cinetic's internal review round. Internal time plans, default variants, and review counts do not authorize extra repository writes or limit an explicit user revision request.
