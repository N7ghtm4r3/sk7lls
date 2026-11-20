# Brand Captures

Run the requested phase of Brand Captures. Keep the workflow reusable: derive app identity, assets, targets, versions, counts, and destinations from the actual project and user decisions rather than a particular application or machine.

## Choose the phase

- **Capture collection:** for an explicit capture request or selection of Brand Captures alone, follow the capture brief, seeding, tour, and gallery steps below.
- **Store artwork:** for requested screenshots or banners, use the [shared stills workflow](store-assets.md) with sources appropriate to the selected type. Its type-selection rules govern which production runs and the sequence when both types are requested.
- **Store video:** when requested, ingest the approved material and execute cinetic's video workflow under the shared boundaries here. Follow [Store video](store-video.md).

These are phases of one workflow, not additional top-level menu choices. A capture-only request ends with captures. Enter a later phase directly when its inputs are already available and approved; do not repeat earlier production or require inputs to have been saved in the repository.

The state boundary, locale reconnaissance and selection, release resolution, [destination requirements check](#verify-destination-requirements), and asset-save section below apply to every phase. Load the production brief only for store artwork or video.

## Preserve the project and isolate runtime changes

Treat the project, source code, configuration, Git state, real user data, and approved source assets as read-only throughout capture, composition, video production, and review. Repository writes are limited to the selected deliverable assets and exact destinations explicitly authorized in the save step.

An explicit phase request permits only the disposable work needed for that phase outside the repository: session-owned runtimes and local services, temporary build output and caches, fake fixtures and isolated app storage, capture or composition tools, session-local rendering dependencies, production projects, media, and previews. Use an existing runnable build or an unchanged temporary project copy when build or run commands would write into the source repository. Keep service endpoints and accounts isolated from real or shared data.

This is repository-readonly operation with a specific runtime exception; it is not the strict `readonly` skill. If the user separately requires strict readonly without accepting that exception, inspect existing material and explain which preparation or production action cannot run. Do not silently reinterpret that constraint.

Preserve other running sessions and pre-existing changes. Do not patch the app to add showcase UI, seed hooks, or capture support. If a required environment cannot be isolated without changing protected state, report the specific blocker and request a bounded exception or use an already authorized alternative. Global tool installation, project configuration changes, and changes to real data are outside the phase request.

## Discover and select locales

Before preparing a capture or production brief, resolve and read the `readonly` skill through the host's catalog or installed skills; in a categorized source checkout, locate its directory by name. Apply its constraints to this reconnaissance as a dependent inspection phase. Inspect existing files without launching the app, generating translations, or writing records. Reuse applicable findings already established for the requested targets and release.

Inspect the app's i18n configuration, translation catalogs or resource directories, default language, fallback behavior, and locale-selection wiring for the requested targets. Trace dependency-supplied language lists when needed. Distinguish declared locales, available translations, and unresolved support; a resource directory or generic dependency list alone does not establish complete app support.

Present the discovered locales and any target-specific gaps in the conversation, then ask which locales the user wants to produce. Reuse an explicit selection already covering the current scope; discovering several locales does not select them all. If a requested locale lacks the necessary UI or source material, report that gap before production and resolve an alternative with the user. Preserve the actual source language; painting translated UI into a capture or relabeling another locale does not establish support.

Completion: the selected locales and target combinations are explicit, their source support is traceable, and unresolved combinations are identified. This ends the bounded readonly reconnaissance; subsequent work follows the shared runtime and save boundaries. Record the agreed locale codes, such as `it` or `en`, in the phase's external working record when that phase begins.

## Resolve the release

Use the agreed app release as `<version>` for captures, store artwork, and videos. Resolve it in the capture or production brief, reusing a prior decision. If it is unresolved, inspect the project's version information read-only and ask only when it remains ambiguous.

Record each target's actual source build version separately from the agreed release. Check that the captured UI or source assets represent that release; confirm a differing source-to-release mapping instead of silently relabeling it.

## Verify destination requirements

On the first Brand Captures invocation in each session, resolve the requested media types, stores or publishing channels, and exact placements from the conversation and project. Perform this internal, read-only check before capture, composition, or video production; sequential research is sufficient. Ask only for missing decisions that change the deliverable. For capture collection without a publishing destination, retain native capture requirements and leave store compatibility unverified.

Consult current official documentation for each requested destination and media type. Record an output profile per applicable store or channel, placement, target, and device class, with the source URL and check date. Distinguish mandatory rules from recommendations and record availability conditions. Include the relevant dimensions, aspect ratio, safe areas, crop behavior, format, color and alpha, file size, counts, content restrictions, and video delivery method, duration, encoding, frame rate, and audio constraints. Research only the requested media types.

Map each requested artifact to an actual supported placement. Shared creative direction does not establish export compatibility: reuse a file across destinations only after checking it against every applicable profile. If official sources are unavailable, conflicting, or do not establish a suitable placement, report the affected profile and resolve the gap before producing that deliverable.

Reuse verified profiles during iterations of the same work. Recheck affected profiles when scope changes or evidence indicates changed requirements; verify current official sources again at the first invocation of a new session. Keep the findings in the phase's external working record and surface only decisions, differences, or blockers relevant to the user.

Completion: every requested output profile has current official evidence and applicable constraints sufficient to guide production and final file validation. Start only production covered by resolved profiles, explicitly accounting for blocked combinations. Captures without a publishing destination remain native source material.

## Select required and optional store screenshots

For captures intended for store screenshots, complete this step after destination verification and before the capture brief, seeding, or tour. Artwork production inherits the result; direct entry with existing captures still requires this selection and a source-coverage check before composition. Skip this step for native captures without a store destination and for requests limited to banners or videos.

Use the verified official sources and read-only evidence of the app's supported devices to identify the applicable screenshot categories for each requested store, including tablet and foldable categories where relevant. Discover categories beyond those already named by the user or represented in available captures. Resolve conditional requirements against actual app support; report unresolved conditions instead of classifying them as optional.

Show a concise matrix with only the store, screenshot or device category, and mandatory or optional status. Treat store recommendations as optional, with a short note when useful. Keep dimensions, formats, counts, and other technical constraints in the verified output profiles.

Include applicable mandatory categories in the capture scope. When optional categories are available and the choice is unresolved, ask which the user wants to add; reuse explicit choices covering the current stores and categories. Optional categories enter the scope only on explicit request; asking for all targets does not select every optional store screenshot. If the user deliberately excludes a mandatory category, report the resulting incomplete store coverage. Carry the selected categories into capture planning, review, and the approved-source handoff to artwork production.

Completion: the matrix has been shown, applicable mandatory categories and any explicitly requested optional categories are mapped to verified profiles, and exclusions or unresolved combinations are identified before capture planning begins.

## Prepare a production brief

For store artwork or video, reuse the available approved inputs: capture selections, style decisions, copy, logo, palette, typography, and store exports. Resolve approval from the conversation or an explicit selection record; finding a file in a folder does not establish approval. Keep source IDs and paths traceable to the locale, target, and app version they depict.

Resolve the requested target set using the scope rules below and carry forward the selected locales. Record the destination store or publishing channel, device or viewport variants, requested locale and target combinations, deliverable types, and exact versus maximum counts. Reuse prior choices and ask only for missing decisions that affect the result.

Apply the [verified destination profiles](#verify-destination-requirements) to the brief and map each planned export to its profile. For screenshot artwork, inherit the [selected store screenshot categories](#select-required-and-optional-store-screenshots) and their approved captures. Resolve any uncovered destination or placement through that check before designing or rendering.

Keep this brief and the asset-to-target map in the disposable production workspace. Supplied brand choices, the approved direction, truthful product representation, and destination requirements constrain the creative workflow. Identify missing sources or incompatible requirements instead of inventing product behavior.

## Establish targets and the capture brief

Inspect the actual project targets and reconcile them with the user's request and prior decisions:

- A specific target request covers only that target and its agreed device or viewport variants.
- An explicit request for all targets covers every target present in the project, including the supported device classes and operating systems in that scope. For store screenshots, determine the capture categories through the [required and optional selection](#select-required-and-optional-store-screenshots). Do not reduce coverage to the targets convenient to run locally.
- Reuse an already agreed target list. If no target scope can be resolved, ask for it before starting the tour.

Support the project's actual platforms rather than a fixed mobile-only list: Android; iOS and iPadOS where supported; desktop on the requested macOS, Windows, and Linux targets; web; and any other implemented target explicitly included. Adapt the capture method to each environment. Shared UI code does not make a capture from one target evidence for another. Report unavailable targets as not captured, with the missing capability.

Carry forward the selected locales and resolve the purpose, themes, device or viewport sizes, representative feature states, and exclusions from the conversation. For store screenshots, derive the required captures and device or viewport sizes from the selected screenshot categories and their verified profiles. Clarify an ambiguous requested quantity: exact count or maximum, per locale and target or overall. State reasonable defaults for unspecified presentation choices; do not invent a mandatory count.

Keep a session record outside the repository with the agreed brief, release, per-target source build versions, locale and target coverage, capture IDs, source paths, and current selection. This record is working context, not a repository deliverable.

When representative behaviors or useful focus details need discovery, use the product-inventory and screenshot references through [cinetic reference mode](cinetic-usage.md#reference-mode). This consultation guides what to capture; it does not start a film or replace the real app tour.

## Seed fictional showcase data

Prepare one small, reproducible scenario before touring the targets. Populate enough content to show the selected features with plausible names, dates, quantities, file contents, and relationships. Keep related values consistent between screens and use the same scenario across targets wherever their features match.

All seeded content must be synthetic and suitable for public presentation: no real user records, credentials, personal paths, or private documents. Use synthetic or authorized display media. Respect the selected locale, and avoid unfinished placeholders or implausible values that distract from the app.

Choose a mechanism the app already supports, such as fixtures, import, demo mode, or schema-aware seeding of isolated storage. Keep seed files, scripts, and databases outside the repository. Inspect the real data model before writing demo records; seeding must preserve valid domain relationships and supported application behavior.

Validate the seeded scenario in the running app. Historical records may be fictional, but the captured interface must be the real app rendering valid state. For transient states such as progress or completion, use a disposable operation the app actually supports. Do not fabricate functionality or paint replacement results into screenshots.

If a useful state cannot be reached without modifying the product or real data, mark it unavailable and propose another representative state. Keep the dataset or reproduction recipe accessible for additions during the session.

## Tour and capture each target

For every agreed locale and target combination, prepare its isolated runtime, select the app locale through supported behavior, apply the brief, and tour meaningful feature flows. Check the actual rendered language and report fallback or untranslated UI. Propose captures that communicate the app's actual capabilities and respect the user's exclusions. Prefer settled states, except when an intentional transient state is part of the brief.

Capture real pixels using the platform's supported capture facilities. For still images, preserve native resolution and lossless originals. Keep device or window framing, overlays, and presentation treatments outside the originals unless explicitly requested. Do not generate replacement UI.

Give each candidate a stable locale- and target-qualified ID, a short screen or state label, its actual device or viewport category, and dimensions. Keep IDs stable when candidates are excluded or added; append new IDs instead of renumbering the existing set. Store all candidates outside the repository.

For captures intended for a store or publishing channel, apply the [verified destination profiles](#verify-destination-requirements) when choosing capture dimensions and framing. Distinguish a collected candidate from a deliverable verified for those requirements.

## Show and revise interactive galleries

Show the actual candidates in the conversation through the host's interactive rendering capability. Organize the gallery by locale and target, using separate groups or tabs, with thumbnails, an enlarged viewer, previous/next navigation, stable IDs, and counts for each combination. Follow the host's preview and rendering protocol.

Render the gallery before claiming it has been shown. If the environment cannot display an interactive gallery, report the limitation and agree a fallback; a saved HTML path or a text description alone is not a displayed gallery.

Let the user keep, exclude, add, or redo candidates by their stable IDs, locale, and target. Use feedback returned by the host or explicit chat instructions; do not assume visual clicks were received as selection decisions when the host exposes no such feedback.

Update the selection after each instruction. For additions or replacements, revisit only the affected locales, targets, and states, reuse the seeded scenario, capture new candidates, and refresh the gallery. Retain excluded originals outside the repository during review. Repeat until the user has settled the selection.

Before final persistence, show the final selected set and count for each locale and target combination, together with any unavailable combinations or unmet requested states. Selecting candidates settles the content; it does not by itself authorize repository writes.

## Save only the authorized assets

Use the [shared brand root](../SKILL.md#brand-root-and-shared-icon). Place these localized deliverables beneath the agreed locale code. The following destinations are relative to `<brand-root>/<locale>/`:

| Asset | Final approved destination | Explicitly requested draft destination |
| --- | --- | --- |
| Native capture | `captures/<version>/<target>/` | Keep unselected captures in the external workspace. |
| Store screenshot | `artworks/<version>/<target>/stills/screenshots/` | `artworks/drafts/<version>/<target>/stills/screenshots/` |
| Banner | `artworks/<version>/<target>/stills/banners/` | `artworks/drafts/<version>/<target>/stills/banners/` |
| Video | `artworks/<version>/<target>/videos/` | `artworks/drafts/<version>/<target>/videos/` |

Use the [resolved release](#resolve-the-release) as `<version>`. Add optional variant or state subdirectories beneath the relevant media directory (`screenshots`, `banners`, or `videos`); add store, format, or device distinctions only when needed and resolve their exact ordering in the reviewed file map. For example, a native capture can use `brand/it/captures/1.0.0/ios/01-history.png`, and a final screenshot can use `brand/it/artworks/1.0.0/ios/stills/screenshots/light/01-history.png`. Preserve source captures and earlier releases; a replacement must be explicitly covered by the authorization. This layout defines destinations, not permission to produce additional asset types.

Draft persistence is an optional checkpoint during composition or review, available only when the user explicitly asks to save intermediate states or candidate versions. Identify each retained state or candidate with a stable filename or subdirectory. Saving a draft does not approve final delivery or complete the current phase. A later final save follows the final-export review and authorization rules.

Distinguish locales, operating systems, and device or viewport variants so outputs cannot silently replace one another. Resolve any user-selected destination override explicitly in the reviewed file map; choosing a capture directory does not change the artwork destination.

Before writing, map every selected asset ID to an exact filename and destination, identify additions versus replacements, and disclose any collision. Present that map with the selected assets and their locale, target, and final or draft status so the user can authorize a concrete result. Reuse an explicit authorization already covering the current files and destinations; otherwise wait for it. A new or conflicting path needs the applicable authorization.

Once authorized, copy only the selected assets to the approved paths for their asset type and review status. Keep seed data, helpers, production source projects, dependency trees, raw audio, licensing records, gallery HTML, archives, logs, working manifests, and reports outside the repository unless the user separately requests and authorizes those deliverables. Keep required external records accessible with the delivery. Do not modify app code, theme, configuration, or build wiring as part of an asset save.

Verify the saved images open and videos play, preserve the reviewed export properties, match the selected IDs and counts per locale and target, and satisfy their verified destination profiles where applicable. For drafts, report pending review or format checks without claiming final-export readiness. Compare the final repository changes with the approved file map while preserving pre-existing work. Commit, push, store upload, and publication require the user's separate instructions.

If saving is not authorized, retain the selection and return accessible preview artifacts outside the repository. Release only runtime resources started for this session, while keeping the returned artifacts accessible.

Report requested versus completed locale and target coverage, counts, the saved paths or preview locations, and checks actually completed. Distinguish captured, composed, rendered, saved as draft, approved, saved as final, and format-verified assets; do not claim missing coverage, repository persistence, or store publication.
