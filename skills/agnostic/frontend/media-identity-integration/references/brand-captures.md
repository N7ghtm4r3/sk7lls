# Brand Captures

Run the requested phase of Brand Captures. Keep the workflow reusable: derive app identity, assets, targets, versions, counts, and destinations from the actual project and user decisions rather than a particular application or machine.

## Choose the phase

- **Capture collection:** for an explicit capture request or selection of Brand Captures alone, follow the capture brief, seeding, tour, and gallery steps below.
- **Store artwork:** when requested, use approved captures to develop one representative composition, approve its style, and then produce the requested series. Follow [Store artwork](store-assets.md).
- **Store video:** when requested, ingest the approved material and execute cinetic's video workflow under the shared boundaries here. Follow [Store video](store-video.md).

These are phases of one workflow, not additional top-level menu choices. A capture-only request ends with captures. Enter a later phase directly when its inputs are already available and approved; do not repeat earlier production or require inputs to have been saved in the repository.

The state boundary and asset-save section below apply to every phase. Load the production brief only for store artwork or video.

## Preserve the project and isolate runtime changes

Treat the project, source code, configuration, Git state, real user data, and approved source assets as read-only throughout capture, composition, video production, and review. Repository writes are limited to the selected deliverable assets and exact destinations explicitly authorized in the save step.

An explicit phase request permits only the disposable work needed for that phase outside the repository: session-owned runtimes and local services, temporary build output and caches, fake fixtures and isolated app storage, capture or composition tools, session-local rendering dependencies, production projects, media, and previews. Use an existing runnable build or an unchanged temporary project copy when build or run commands would write into the source repository. Keep service endpoints and accounts isolated from real or shared data.

This is repository-readonly operation with a specific runtime exception; it is not the strict `readonly` skill. If the user separately requires strict readonly without accepting that exception, inspect existing material and explain which preparation or production action cannot run. Do not silently reinterpret that constraint.

Preserve other running sessions and pre-existing changes. Do not patch the app to add showcase UI, seed hooks, or capture support. If a required environment cannot be isolated without changing protected state, report the specific blocker and request a bounded exception or use an already authorized alternative. Global tool installation, project configuration changes, and changes to real data are outside the phase request.

## Prepare a production brief

For store artwork or video, reuse the approved capture selection, style decisions, copy, logo, palette, typography, and any approved store exports. Resolve approval from the conversation or an explicit selection record; finding a file in a folder does not establish approval. Keep source IDs and paths traceable to the target and app version they depict.

Resolve the requested target set using the scope rules below. Record the destination store or publishing channel, device or viewport variants, locale, deliverable types, and exact versus maximum counts. Reuse prior choices and ask only for missing decisions that affect the result.

Use the agreed app release as `<version>`. If it is unresolved, inspect the project's version information read-only and ask when it remains ambiguous. Check that the source assets depict that release; do not relabel older UI as a new version without confirmation.

Inspect the current official requirements for each requested store and deliverable before designing or rendering. Record the source and relevant format, size, content, duration, encoding, and audio constraints as applicable. Requirements vary by channel and device class; do not substitute one universal store preset or transfer an export between targets without validation.

Keep this brief and the asset-to-target map in the disposable production workspace. Supplied brand choices, the approved direction, truthful product representation, and destination requirements constrain the creative workflow. Identify missing sources or incompatible requirements instead of inventing product behavior.

## Establish targets and the capture brief

Inspect the actual project targets and reconcile them with the user's request and prior decisions:

- A specific target request covers only that target and its agreed device or viewport variants.
- An explicit request for all targets covers every target present in the project, including the supported device classes and operating systems in that scope. Do not reduce it to the targets convenient to run locally.
- Reuse an already agreed target list. If no target scope can be resolved, ask for it before starting the tour.

Support the project's actual platforms rather than a fixed mobile-only list: Android; iOS and iPadOS where supported; desktop on the requested macOS, Windows, and Linux targets; web; and any other implemented target explicitly included. Adapt the capture method to each environment. Shared UI code does not make a capture from one target evidence for another. Report unavailable targets as not captured, with the missing capability.

Resolve the purpose, locale, themes, device or viewport sizes, representative feature states, and exclusions from the conversation. Clarify an ambiguous requested quantity: exact count or maximum, per target or overall. State reasonable defaults for unspecified presentation choices; do not invent a mandatory count.

Keep a session record outside the repository with the agreed brief, target coverage, capture IDs, source paths, and current selection. This record is working context, not a repository deliverable.

When representative behaviors or useful focus details need discovery, use the product-inventory and screenshot references through [cinetic reference mode](cinetic-usage.md#reference-mode). This consultation guides what to capture; it does not start a film or replace the real app tour.

## Seed fictional showcase data

Prepare one small, reproducible scenario before touring the targets. Populate enough content to show the selected features with plausible names, dates, quantities, file contents, and relationships. Keep related values consistent between screens and use the same scenario across targets wherever their features match.

All seeded content must be synthetic and suitable for public presentation: no real user records, credentials, personal paths, or private documents. Use synthetic or authorized display media. Respect the selected locale, and avoid unfinished placeholders or implausible values that distract from the app.

Choose a mechanism the app already supports, such as fixtures, import, demo mode, or schema-aware seeding of isolated storage. Keep seed files, scripts, and databases outside the repository. Inspect the real data model before writing demo records; seeding must preserve valid domain relationships and supported application behavior.

Validate the seeded scenario in the running app. Historical records may be fictional, but the captured interface must be the real app rendering valid state. For transient states such as progress or completion, use a disposable operation the app actually supports. Do not fabricate functionality or paint replacement results into screenshots.

If a useful state cannot be reached without modifying the product or real data, mark it unavailable and propose another representative state. Keep the dataset or reproduction recipe accessible for additions during the session.

## Tour and capture each target

For every agreed target, prepare its isolated runtime, apply the brief, and tour meaningful feature flows. Propose captures that communicate the app's actual capabilities and respect the user's exclusions. Prefer settled states, except when an intentional transient state is part of the brief.

Capture real pixels using the platform's supported capture facilities. For still images, preserve native resolution and lossless originals. Keep device or window framing, overlays, and presentation treatments outside the originals unless explicitly requested. Do not generate replacement UI.

Give each candidate a stable target-qualified ID, a short screen or state label, and its actual dimensions. Keep IDs stable when candidates are excluded or added; append new IDs instead of renumbering the existing set. Store all candidates outside the repository.

When capture assets are intended for a particular store or publishing channel, check its current official format and size requirements for the requested device classes. Distinguish a collected candidate from a deliverable verified for those requirements.

## Show and revise interactive galleries

Show the actual candidates in the conversation through the host's interactive rendering capability. Organize the gallery by target, using separate groups or target tabs, with thumbnails, an enlarged viewer, previous/next navigation, stable IDs, and counts per target. Follow the host's preview and rendering protocol.

Render the gallery before claiming it has been shown. If the environment cannot display an interactive gallery, report the limitation and agree a fallback; a saved HTML path or a text description alone is not a displayed gallery.

Let the user keep, exclude, add, or redo candidates by their stable IDs and target. Use feedback returned by the host or explicit chat instructions; do not assume visual clicks were received as selection decisions when the host exposes no such feedback.

Update the selection after each instruction. For additions or replacements, revisit only the affected targets and states, reuse the seeded scenario, capture new candidates, and refresh the gallery. Retain excluded originals outside the repository during review. Repeat until the user has settled the selection.

Before persistence, show the final selected set and count for each target, together with any unavailable targets or unmet requested states. Selecting candidates settles the content; it does not by itself authorize repository writes.

## Save only the authorized assets

Resolve one approved capture root, proposing `brand/captures/` unless the user selected another location or an existing convention should be retained. Use the following layout within that root:

- Native captures: `<capture-root>/<target>/`.
- Approved store artwork: `<capture-root>/prod/<version>/<target>/`.
- Approved store videos: `<capture-root>/prod/<version>/<target>/video/`.

Resolve `<version>` through the production brief. Add store, locale, format, or device subdirectories only when the requested deliverables need them, and include their exact ordering in the reviewed file map. `prod` holds final approved exports, not drafts. Preserve source captures and earlier releases; a replacement must be explicitly covered by the authorization.

Distinguish operating systems and device or viewport variants so outputs cannot silently replace one another. Production output stays beneath the approved capture root; changing the root requires the user's choice.

Before writing, map every selected asset ID to an exact filename and destination, identify additions versus replacements, and disclose any collision. Present that map with the final selection so the user can authorize a concrete result. Reuse an explicit authorization already covering the current files and destinations; otherwise wait for it. A new or conflicting path needs the applicable authorization.

Once authorized, copy only the selected final assets to the approved paths. Keep seed data, helpers, production source projects, dependency trees, raw audio, licensing records, gallery HTML, archives, logs, working manifests, and reports outside the repository unless the user separately requests and authorizes those deliverables. Keep required external records accessible with the delivery. Do not modify app code, theme, configuration, or build wiring as part of an asset save.

Verify the saved images open and videos play, preserve the approved export properties, match the selected IDs and per-target counts, and satisfy the channel requirements actually checked. Compare the final repository changes with the approved file map while preserving pre-existing work. Commit, push, store upload, and publication require the user's separate instructions.

If saving is not authorized, retain the selection and return accessible preview artifacts outside the repository. Release only runtime resources started for this session, while keeping the returned artifacts accessible.

Report requested versus completed target coverage, final counts, the saved paths or preview locations, and checks actually completed. Distinguish captured, composed, rendered, approved, saved, and format-verified assets; do not claim missing coverage, repository persistence, or store publication.
