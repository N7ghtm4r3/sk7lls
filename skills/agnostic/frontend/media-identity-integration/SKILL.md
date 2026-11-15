---
name: media-identity-integration
description: "Create, customize, preview, and integrate app identity icons across platform targets, or run explicitly requested Brand Captures with seeded demo data, interactive galleries, and authorized repository asset saves. Use for launcher/app/window icons, favicons, and curated app captures."
---

# Media Identity Integration

Manage app identity through Icons and Brand Captures. Reuse the app's known identity, target inventory, selected assets, and explicit user preferences across both workflows; resolve missing context from the project without changing it.

## Select the workflow

Resolve the workflow from the latest request and conversation. When the intent is clear, continue directly with that workflow and reuse earlier decisions. When the skill is invoked alone or the intent remains ambiguous, offer this short menu in the user's language:

1. **Icons** — create, customize, preview, export, or integrate app icons.
2. **Brand Captures** — seed demo data, tour selected targets, and curate app captures through interactive galleries.

An explicit capture request or selection of Brand Captures activates that workflow. Generic branding work does not activate captures automatically. Do not repeat the menu during revisions of the same work. Ask only for unresolved inputs within the selected workflow. Selecting a workflow does not authorize every later repository write.

## Brand Captures

Read [Brand Captures](references/brand-captures.md) and follow its capture, seeding, gallery, and asset-save workflow. Its repository-readonly boundary and limited disposable-runtime exception apply independently of the icon integration permissions below. Execute only the requested workflow.

## Icons

Develop an app icon kit and import it into the actual targets without turning the task into a broader product redesign. The user can customize the colors, typography, symbol, shape, and style throughout the workflow. Existing app identity supplies defaults, not immutable design requirements.

### Honor the current scope

Use the conversation to distinguish exploration, an export-only kit, integration, and an explanation of existing placement.

- For preview-only requests, keep artwork, export helpers, archives, and validation output outside the repository. Show the actual candidates in the conversation using the available visual tools. Do not persist previews or planning documents in the repo.
- Selecting a candidate during a preview-only session does not by itself authorize repository writes. Interpret later instructions in context: a correction requested "here in preview" remains a preview correction.
- An explicit import or integration request authorizes the necessary asset and wiring changes. Reuse authorization already given; do not add another approval gate merely because this skill has multiple stages.
- A placement question calls for inspection and an explanation, not a directory move. Commit, push, and PR publication follow the user's separate instructions.

If asked to show placement before integration, first show a concrete file map with the proposed artwork and the files that would change. If that review has already happened, continue from its outcome.

### Establish the design inputs

Apply design choices in this order: the user's latest explicit choices, an existing selected kit or supplied brand brief, then the app's current identity for unspecified properties. User-selected colors, fonts, or artwork may intentionally differ from the app theme. Do not reject those choices or silently replace them with theme values.

When using the app's primary color or font as a reference or fallback, inspect the implementation before asking the user to provide values:

1. Trace the app entry point to the active theme, palette, and typography configuration. A token named `primary` in an unused preset is not evidence of the active color.
2. Resolve defaults and overrides, including light/dark modes, dynamic color, CSS variables, design-system presets, and platform font fallback where applicable.
3. If a dependency supplies the values, inspect the source or documentation for the resolved dependency version. Do not substitute a remembered framework default or sample a screenshot when the source is available.
4. Keep a small working record of the selected colors and their roles, typography, artwork source, and any deliberate overrides. Keep this outside the repo during preview.

If a value remains unresolved, identify that specific gap. Ask only for the missing choice; do not invent an exact HEX value or a concrete typeface behind an unresolved system default. A dynamically selected runtime palette does not determine one permanent launcher color: use the user's choice or a stated stable brand fallback.

An icon customization does not automatically authorize edits to global theme or font configuration. If the user also requests those changes, treat them as an explicit scope extension with their own file map.

### Develop and preserve the selected artwork

For new concepts, vary the dimensions the user wants to explore: monogram construction, typography, geometry, weight, palette, or surface treatment. Preserve the other selected properties. Distinguish a candidate's label from the literal glyph it depicts.

Use appropriate image-generation or editing capabilities when visual design work requires them. Once a candidate is selected, retain its source artwork or alpha mask. Produce platform exports from that source with controlled sizing, color, alpha, and format conversion; do not regenerate the design independently for each target. If the user requests a new color or design, revise the source and propagate that revision consistently.

Show the real exported artwork at useful small sizes and in relevant platform masks. Mark simulations as previews. Do not bake a preview's rounded frame, shadow, device mockup, or background into every deliverable. A dark UI swatch is not automatically a valid native Dark app-icon asset.

### Map destinations and allowed edits

Inspect the actual modules, source sets, resource references, SDK/toolchain versions, and existing icon pipeline. Read the relevant sections of [Target layouts and edit boundaries](references/target-layouts.md) for Android, iOS, Compose Desktop, or web. For other stacks, follow their supported configuration and current official documentation rather than transplanting the example paths.

Before writing, resolve a finite list of exact destination files and the permitted change in each. Use these categories:

| Category | Permitted change for an icon import |
| --- | --- |
| Target icon assets | Add or replace the selected artwork in the formats each target consumes. |
| Resource descriptors | Update only icon filenames, appearance slots, drawable references, or equivalent icon metadata. |
| Build or app configuration | Add only the icon paths and resource support needed by the existing toolchain. Reuse current dependency aliases and versions. |
| Runtime entry point | Add only icon resource imports and the window/application icon assignment when needed. |
| Web document or metadata | Add or update icon links and their dimensions/types in the existing head or framework metadata owner. |

These categories bound an authorized import; they are not blanket permission to edit every matching file. Prefer replacing assets behind existing references. Leave a manifest, project file, or build script unchanged when it already points to the correct resource. If the user supplied a stricter file list, honor it.

Keep theme changes, runtime font installation, UI/layout changes, splash screens, new PWA setup, dependency upgrades, CI, and unrelated cleanup outside a plain icon import. Explicit user requests may extend that scope. When extra wiring is necessary, include its exact path and purpose in the map rather than broadening the task silently.

Preserve pre-existing user changes. Do not check in export utilities, temporary previews, source-generation notes, or validation reports unless they are requested deliverables or part of the project's established asset pipeline.

### Import and verify

Prepare exports in a temporary location before copying them to their mapped destinations. Check current platform documentation for the relevant format and appearance rules; distinguish platform requirements from recommended project organization.

- Inspect real dimensions, color space, alpha, container entries, and appearance metadata, not just extensions or filenames. Verify selected colors in solid regions while allowing expected antialiasing at edges.
- Check that each native export retains the selected shape and intended clear space. Inspect actual ICO/ICNS representations and adaptive/themed variants where applicable.
- Resolve every resource reference and verify that the owning target packages it. Run the smallest relevant resource-processing, compilation, or asset-catalog checks supported by the environment.
- Compare the final diff with the allowed files and hunks. Do not repair unrelated build failures as part of the import.

Report the imported targets, important placement choices, and checks actually completed. Distinguish resource compilation from a full application build and package creation from runtime visual verification. For preview or kit-only work, return the preview or external artifacts without claiming integration occurred.
