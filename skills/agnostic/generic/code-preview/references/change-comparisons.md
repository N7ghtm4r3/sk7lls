# Change Comparisons

Use this mode when the user requests a diff, before/after comparison, GitHub-style
preview, or side-by-side view. Keep the parent skill's implementation approval
boundary: displaying or revising a proposal does not apply it.

## Establish the compared versions

Use the supplied code or the actual inspected file as Before and the proposed
implementation as After. Identify the file or declaration and relevant revision
when known. If there is no real baseline, label the comparison as illustrative;
ask for the missing original only when it prevents an accurate requested review.

Show the exact edit that would be applied, preserving existing comments and
documentation and honoring implementation preferences. Put teaching explanations
outside the compared code. Include enough unchanged context to understand the
change; label omissions instead of presenting an abbreviated comparison as a
complete patch. Never execute the compared code just to display it.

## Select a format from verified capabilities

Check the current harness's exposed tools, capability descriptions, or documented
renderer before promising a layout. A product name, installed editor, or generic
Git review pane alone does not establish support for an unapplied proposal.
Keep this selection portable: use capabilities exposed in the current session,
without assuming a particular vendor, tool name, command, or markup extension.

Choose in this order, honoring an explicitly requested unified view:

1. **Native split comparison.** Use an available documented viewer that accepts
   the intended Before and After versions without applying the proposal. Verify
   that it can actually show both columns at once. A viewer limited to existing
   Git changes is useful only when those changes are the requested comparison;
   never edit, stage, or commit files to make a proposal appear there.
2. **Rendered split comparison.** If a supported in-conversation renderer can
   display code in two aligned columns, use it for the requested rendered
   comparison. Label it as a rendered example rather than a native editor when
   that distinction matters. Follow the renderer's available instructions and
   verify the actual layout. If it requires a presentation-only artifact, the
   render request authorizes that minimal output in a task-owned location outside
   the product checkout. This presentation action is separate from read-only
   context inspection and does not authorize writing proposed source files.
3. **Unified diff.** If split support is missing, uncertain, fails, or cannot fit
   the available display, use one fenced `diff` block. Briefly identify the
   fallback when a split view was requested. Do not install integrations, change
   persistent settings, or keep retrying unsupported rendering to obtain a split.

## Display the selected comparison

In a split view, show Before on the left and After on the right, align unchanged
lines, and leave gaps for insertions or removals. Highlight removals red and
additions green where the renderer supports those colors, with change markers
or accessible labels as well. Both columns must be visible simultaneously at
the displayed width. Two vertically stacked snippets or a Markdown table are
not a split code viewer; use the unified fallback instead.

In a unified view, use `-` for removals, `+` for additions, and unchanged context
lines. Include file headers and hunk ranges when presenting a complete patch;
use `/dev/null` for an absent side when relevant. Color highlighting depends on
the renderer, so preserve the markers and never promise particular colors when
their rendering is unverified. Keep the output readable as plain text.

Report the behavior being changed and any validation limitations in surrounding
prose. A rendered comparison proves the presentation, not that the proposed code
has passed tests. Return to the parent skill's approval flow before implementation.
