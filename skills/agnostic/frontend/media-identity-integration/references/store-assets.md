# Store artwork

This is the shared stills workflow for store screenshots and banners within Brand Captures. Start only when requested and apply the shared [state boundary](brand-captures.md#preserve-the-project-and-isolate-runtime-changes), [locale reconnaissance and selection](brand-captures.md#discover-and-select-locales), [production brief](brand-captures.md#prepare-a-production-brief), and [asset-save rules](brand-captures.md#save-only-the-authorized-assets). It can start from approved assets already available from an earlier session.

## Select the requested stills type

Resolve `screenshots` or `banners` from the explicit request and established context. A request for one type runs only that type. If a generic artwork request leaves the type unresolved, ask which type to produce before composing a sample.

When both types are explicitly requested, complete them sequentially: run the full sample, approval, series, final review, and handoff cycle for one type before starting the other. Follow the requested order, or state the chosen order before starting. Each type has its own sample and final selection approval. Reuse identity, selected locales and targets, source assets, and applicable preferences across cycles. Starting another type requires an explicit request that covers it; the initial request may already cover both.

Use the following type-specific inputs and review criteria within the same workflow:

| Type | Source material | Composition | Verification focus |
| --- | --- | --- | --- |
| Screenshots | Approved real app captures matching the locale, target, and selected device category, plus identity assets. | Present a screen or capability with supporting promotional copy. | Faithful, readable UI; accurate copy; meaningful content remains visible. |
| Banners | Approved identity assets, the agreed message, and available authorized imagery. App captures are optional. | Communicate the message within the requested banner placement and format. | Hierarchy, text and branding legibility, cropping, and any channel safe-area constraints. |

For banners, resolve the publishing channel or placement, dimensions or aspect ratio, message, and any required branding or call to action in the production brief. Check the destination's current requirements through the shared brief. A banner composition without app UI can proceed from its identity and message inputs without collecting screenshots.

For screenshots, inherit the [required and optional selection](brand-captures.md#select-required-and-optional-store-screenshots) established before capture collection. Check approved-source coverage against that selection before choosing the sample. On direct entry with existing images, resolve the selection first, reuse matching approved captures, and acquire and review only missing captures through the capture workflow before composition. Report unavailable combinations explicitly.

Completion: the current type, requested output profiles, source requirements, and any sequence for an explicitly requested second type are resolved.

## Select one representative source

Inventory the approved sources required by the current type for the selected locales and targets. Choose a representative source set and output profile that communicate the intended capability or message and provide a useful test for the proposed composition. State the source, type, locale, and target represented by the sample; reuse the user's choice when one exists.

Use [cinetic in reference mode](cinetic-usage.md#reference-mode) for product detail, brand, copy, typography, and composition decisions. Read the relevant sources; do not start the film workflow. Request a missing source or return to the affected capture state only when needed rather than recollecting the entire set.

Completion: traceable approved sources appropriate to the current type, a resolved production brief, and enough identity material to propose the sample.

## Propose and approve the sample

Build an actual rendered composition for the current type from the representative sources, outside the repository. Make the hierarchy, copy, background, framing, and treatment of the app's identity concrete. Preserve the source files; when the composition uses app UI, use a real capture at adequate resolution and retain its UI content.

Show the sample through the host's visual presentation capability. Iterate the sample according to the user's feedback before producing the full requested series. A source asset's prior approval approves its use as input; it does not approve the new composition.

Keep a compact working record of the current type's selected direction: supplied identity, typography roles, palette roles, framing, background treatment, spacing, copy tone, and allowed layout variation. Keep it with the disposable production work, not in the repository.

Completion: the user has explicitly approved the current type's sample and visual direction. Reuse approval already given for that same sample and direction; it does not approve translations or localized exports that have not been reviewed.

## Apply the direction to the requested series

Produce every requested asset of the current type for each selected locale and target combination from matching approved sources. Localize promotional copy and keep titles, other visible text, and any captured UI consistent with the selected locale. Preserve the chosen direction while adapting layout, text fit, framing, and scale to the actual output format. Do not stretch one export across targets or substitute another target's or locale's UI.

Carry the visual rules consistently, with copy tied to the approved message and actual product capabilities. Adapt composition to the content rather than forcing every asset into identical geometry. Keep stable asset IDs and a mapping from each derived candidate to its source assets, type, target, version, locale, and output profile.

If a locale, target, or source is unavailable, report the uncovered combination rather than silently shrinking the series. Generate only the requested output profiles; store defaults do not authorize additional formats or unrelated redesign.

Completion: the complete requested series for the current type is rendered, or each missing item is explicitly accounted for.

## Review the full gallery

Use the [interactive gallery contract](brand-captures.md#show-and-revise-interactive-galleries) for the derived images: groups or tabs by locale and target, thumbnails, an enlarged viewer, navigation, stable IDs, and counts. Keep the sample identifiable alongside the series. Label asset types and any requested store or device profiles clearly.

Let the user keep, exclude, add, or revise candidates. Local corrections affect the relevant assets; a change to the shared direction returns to the sample iteration before propagation. Refresh the gallery after changes and preserve source links and stable IDs.

Completion: the user has reviewed the current type's actual localized artworks and explicitly approved the final selection for the covered locales and targets. One approval can cover the entire displayed selection for that type; reuse valid approval for unchanged assets. Sample approval alone is not final approval of every derived export.

## Export and hand off

Check the actual files for the required dimensions and format, readable text, accurate copy, visual consistency, the current type's verification criteria, and the destination requirements recorded in the brief. Do not infer compliance from a preset name or filename.

Prepare the exact selected-asset map using the current type's final layout (store screenshot or banner) in the shared save rules, with any additional variant directories resolved in that map. Use the shared save rules to obtain or reuse authorization and persist only the selected final exports. Explicitly requested intermediate saves follow the same shared draft rules for the current type.

Keep the approved direction, source assets, final artwork, and source mapping accessible as inputs to later requested production. Completing the artwork phase does not automatically start video production or upload anything to a store.
