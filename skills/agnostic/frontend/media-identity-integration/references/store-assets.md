# Store artwork

This is the optional static-production phase of Brand Captures. Start only when requested and apply the shared [state boundary](brand-captures.md#preserve-the-project-and-isolate-runtime-changes), [production brief](brand-captures.md#prepare-a-production-brief), and [asset-save rules](brand-captures.md#save-only-the-authorized-assets). It can start from approved assets already available from an earlier session.

## Select one representative source

Inventory the approved captures and identity assets for the requested targets. Choose the capture that best communicates a meaningful capability and provides a useful test for the proposed composition. State which source and target it represents and why it is a suitable sample; reuse the user's choice when one exists.

Use [cinetic in reference mode](cinetic-usage.md#reference-mode) for product detail, brand, copy, typography, and composition decisions. Read the relevant sources; do not start the film workflow. Request a missing source or return to the affected capture state only when needed rather than recollecting the entire set.

Completion: a traceable approved source, a resolved production brief, and enough identity material to propose the sample.

## Propose and approve the sample

Build an actual rendered composition around the representative capture, outside the repository. Make the hierarchy, copy, background, framing, and treatment of the app's identity concrete. Use the real screenshot at adequate resolution; preserve the source file and its UI content.

Show the sample through the host's visual presentation capability. Iterate the sample according to the user's feedback before producing the full requested series. A screenshot's prior approval approves its use as input; it does not approve the new composition.

Keep a compact working record of the selected direction: supplied identity, typography roles, palette roles, framing, background treatment, spacing, copy tone, and allowed layout variation. Keep it with the disposable production work, not in the repository.

Completion: the user has explicitly approved the current sample's visual direction. Reuse approval already given for that same direction.

## Apply the direction to the requested series

Produce every requested asset for each requested target from that target's approved sources. Preserve the chosen direction while adapting layout, text fit, framing, and scale to the actual output format. Do not stretch one export across targets or substitute another target's UI.

Carry the visual rules consistently, with copy tied to what each capture actually shows. Adapt composition to the content rather than forcing every screen into identical geometry. Keep stable asset IDs and a mapping from each derived candidate to its source capture, target, version, locale, and output profile.

If a target or source is unavailable, report the uncovered item rather than silently shrinking the series. Generate only the requested output profiles; store defaults do not authorize additional formats or unrelated redesign.

Completion: the complete requested series is rendered, or each missing item is explicitly accounted for.

## Review the full gallery

Use the [interactive gallery contract](brand-captures.md#show-and-revise-interactive-galleries) for the derived images: groups or tabs by target, thumbnails, an enlarged viewer, navigation, stable IDs, and counts. Keep the sample identifiable alongside the series. When requested variants add store, locale, or device profiles, label those dimensions clearly.

Let the user keep, exclude, add, or revise candidates. Local corrections affect the relevant assets; a change to the shared direction returns to the sample iteration before propagation. Refresh the gallery after changes and preserve source links and stable IDs.

Completion: the user has reviewed the full series and settled its final selection. Sample approval alone is not final approval of every derived export.

## Export and hand off

Check the actual files for the required dimensions and format, readable text, unclipped meaningful UI, accurate copy, visual consistency, and the destination requirements recorded in the brief. Do not infer compliance from a preset name or filename.

Prepare the exact selected-asset map under `<capture-root>/prod/<version>/<target>/`, with any additional variant directories resolved in that map. Use the shared save rules to obtain or reuse authorization and persist only the selected final exports.

Keep the approved direction, original captures, final artwork, and source mapping accessible as inputs to a later video request. Completing the artwork phase does not automatically start video production or upload anything to a store.
