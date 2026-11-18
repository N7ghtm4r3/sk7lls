---
name: uxui-guide-assistant
description: "Create interactive UI proposals faithful to an app, using synthetic data, and save the approved version as readable HTML referencing local assets."
disable-model-invocation: true
---

# UX/UI Guide Assistant

Inspect the requested section, propose its UX/UI, and iterate through
interactive previews. Preserve the app's visual identity and reuse relevant
approved proposals. Save only the final version the user confirms.

## Scope and dependencies

Use this workflow when explicitly invoked. Establish the requested section,
its UX objective, and the relevant project from the conversation. Ask only
for information that prevents a useful proposal.

Read [readonly](../readonly/SKILL.md) as the inspection constraint and
[show-me](../show-me/SKILL.md) for rendered presentation. Resolve dependencies
through the host's skill catalog or installed sibling directories. In a
categorized source checkout, locate each skill by name. If a required
dependency is unavailable, report it before proceeding.

Keep inspection and iteration read-only. Build previews in memory through
the host's presentation tools. File creation, including temporary files,
waits for the save approval described below.

## Inspect the evidence

Select the applicable starting point:

- Existing section: inspect its visible UI, source, components, and assets.
- New section in an existing app: inspect related sections, shared
  components, and the app's design system.
- New project: use the user's objectives and references. Propose missing
  visual decisions explicitly instead of presenting them as established.

For every request, inspect relevant existing files under
`brand/uxui/proposal/` when available. Read saved HTML as source before
executing any embedded code. Recover the relevant design choices,
interaction patterns, tokens, and safe assets.

Observe the live section only through operations compatible with readonly.
When observation would require launching, building, installing, changing
settings, or running application flows, use accessible source and supplied
captures instead. Explain the missing evidence.

Keep these distinctions visible where they affect the proposal:

- Observed implementation.
- Previously approved proposal.
- User-provided requirement or reference.
- Inferred or newly proposed behavior.

An approved proposal records design intent; it does not prove that the app
implements it. Surface material conflicts between the app, saved proposals,
and current instructions. Ask about unresolved choices that would change
the result.

Proceed once the section, usable evidence, inherited decisions, and
material unknowns are identified.

## Preserve the visual identity

Derive the actual design system before producing the first preview:

- Component families, variants, and interaction conventions.
- Semantic colors and applicable themes.
- Font families, actual font assets, weights, sizes, and line heights.
- Spacing, density, shapes, elevation, icons, and other design assets.
- Relevant responsive behavior and component states.

Use the project's actual font files and required weights when available.
Verify that the intended fonts load rather than silently using fallbacks.

Keep inherited design decisions unless the user requests their revision.
For missing resources, disclose the approximation and its visual impact.

Use show-me as the presentation surface. Explanatory chrome can follow the
host theme; the product preview should preserve the app's identity within
the renderer's capabilities. Report restrictions that prevent fidelity.

Identify whether the preview uses actual components or reconstructs their
appearance and behavior in another rendering technology.

## Use synthetic content everywhere

All application data in previews and saved proposals must be synthetic.
Create independent fixtures for names, accounts, avatars, events, messages,
locations, identifiers, amounts, and other domain content.

Interface labels and design resources may be authentic when safe to reuse.
Inspect real references only as needed to understand structure and design.
Reconstruct their layout with synthetic content rather than embedding raw
screenshots or copied records.

Apply this requirement to the entire artifact, including visible content,
hidden DOM, scripts, fixtures, comments, metadata, URLs, SVG content, and
embedded or linked assets. Remove personal or sensitive metadata from
reused assets.
When an asset cannot be verified, use a synthetic replacement and disclose
the resulting fidelity limitation.

Keep interactions local to the preview's memory. Use no application APIs,
authenticated resources, analytics, remote personal images, or persistent
browser storage.

Before each presentation and save, inspect the complete payload for real
application data, sensitive content, and external requests. Check reused
proposals and assets again; previous approval is not a privacy guarantee.

Complete this check before rendering or persisting the artifact.

## Build and iterate on an interactive preview

Implement the interactions needed to evaluate the requested section.
Examples include tabs, filters, expanded content, dialogs, form validation,
and transitions between relevant states.

Connect controls to meaningful changes in synthetic state. Clearly mark
controls or flows outside the proposal's scope. Keep the preview isolated
from the real application.

Use semantic controls, accessible labels, keyboard operation, and visible
focus. Include realistic synthetic edge cases when they affect the design,
such as long labels, empty results, or validation errors.

Verify layout at relevant viewport sizes and exercise the proposed
interactions in the isolated preview using readonly-compatible tools.
Check font loading, clipping, console errors, and state changes. Distinguish
verified behavior from behavior that the available tools could not test.

Render through show-me and explain the important UX decisions briefly.
When no compatible interactive presentation surface exists, explain the
limitation and keep the draft in chat until an appropriate next step is
authorized. Do not claim that a static view is an interactive preview.

Use feedback to revise the same proposal. Preserve accepted decisions
unless the user changes them. Keep intermediate versions in the
conversation rather than writing draft files to the repository.

## Prepare the final artifact

Prepare one readable HTML file that preserves the reviewed preview and its
interactions. Keep CSS, JavaScript, and the proposal record inline. Reference
existing project fonts and binary assets through paths relative to the HTML
file. Reuse the actual files and weights; keep asset dependencies local and
preserve the repository layout instead of duplicating or encoding them.

The default saved HTML contains no Base64 fonts or binary asset payloads.
If the user explicitly requests a standalone single-file export, explain
the size and readability tradeoff and include embedding in the approved
packaging scope. If additional asset files are needed, name their paths
before approval; approval of the HTML alone does not authorize them.

A renderer that requires embedded resources may receive an adapted copy
in memory. Keep that transport adaptation out of the saved HTML. Verify
relative paths from the saved file's directory and check font loading where
supported. Disclose when the renderer cannot resolve local assets; do not
silently substitute fallback fonts or claim the file is standalone.

Include a small inert JSON record in a script element with
`type="application/json"` and `id="uxui-proposal"`. Record:

- Section name and the proposal's scope.
- Relevant visual choices and safe design references.
- Local font and asset dependencies and the required directory layout.
- Decisions agreed during iteration.
- Implemented interactions and synthetic scenarios.
- Known approximations and unverified behavior.

Use sanitized repository-relative references where useful. Apply the
synthetic-content requirement to this record as well.

This record and its referenced resources let later proposals recover prior
decisions without depending on conversation history.

Resolve the destination inside the selected repository:

`brand/uxui/proposal/<section-name>.html`

Use the user's explicit section name, otherwise derive it from the request.
Normalize it to a safe filename and show the result. Reuse an existing
filename for the same section when appropriate. Resolve ambiguous sections
or collisions before requesting approval.

Show the final preview, exact destination, and whether saving will create
or replace the file. Present the saved form with its relative asset
references and proposal record before approval. State its local dependencies
and list any additional asset files that saving would create or replace.

## Confirm and save

Accept explicit confirmation of the final version and destination.
A revision request, general praise, or approval of an earlier version does
not authorize saving a different artifact.

The confirmation authorizes only the named HTML file, any explicitly listed
asset files, and their containing directories when necessary. If the user
has separately imposed readonly, obtain clear authorization for these
limited writes.

Reuse approval already given for the same version and destination.
Material revisions or a changed destination require renewed confirmation.

Before saving, recheck the target for intervening changes. Preserve
unrelated work and resolve any conflict affecting the approved replacement.

Write the approved HTML and only the additional asset files explicitly
included in its approval. Preserve existing project assets. Keep drafts,
reports, and application-code changes outside this save operation.

Verify that the saved bytes match the reviewed saved form, local asset
references resolve, and the complete artifact retains the synthetic-content
guarantee. Recheck font loading, rendering, and relevant interactions where
supported, reporting any verification limitation.

Report the saved path and checks actually performed. Implementation,
commits, pushes, and deployment require separate user instructions.

## Completion

A preview iteration is complete when the interactive proposal is rendered,
its fidelity and verification limits are clear, and the synthetic-content
check has passed.

A save is complete when the confirmed version exists as the single HTML
file at the agreed path, with its approved asset dependencies, interactions,
and reusable design context preserved.

On later requests, return to evidence inspection and consult the relevant
saved proposals alongside the current app and user instructions.
