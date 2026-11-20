---
name: discovery-ui-mismatch
description: "Find where one app section departs from the UI, components and libraries the rest of the app uses, then discuss each mismatch through visual previews."
disable-model-invocation: true
---

# Discovery UI Mismatch

Compare one **target section** with the rest of its app. Find each
**mismatch**: a place where the target departs from a **reference pattern**
that the rest of the app already uses. Then walk the user through the
mismatches with visual previews and agree how to proceed with each one.

This workflow discovers and discusses. Applying the decisions is separate
work that needs its own instruction.

## Dependencies

Read [readonly](../readonly/SKILL.md) and apply it to every step. Read
[show-me](../show-me/SKILL.md) for the discussion step. Resolve them through
the host's skill catalog or installed sibling directories; in a categorized
source checkout, locate each skill by name. If one is unavailable, report it
and stop.

## 1. Fix the scope

Establish from the conversation the target section, the app it belongs to,
and the shared UI layers it can draw on: design-system package, shared
component library, app-local shared modules. Ask only when the target is
ambiguous. A user hint that "something is off" is a lead, not evidence.

## 2. Sweep the app

Read the target's source, then every sibling section of the same app and the
shared layers. For each dimension, record how the target does it and how the
siblings do it:

- **Page structure:** headers, tabs and view switchers, toolbars, card
  containers, detail panels and drawers.
- **Component reuse:** hand-written markup where a shared component exists;
  a different library for the same job (charts, tables, selects, dates).
- **Interaction:** row and card click targets, navigation, filters, search,
  URL state, dialogs and their footers, confirmations.
- **States:** loading, empty, error and retry, disabled and busy.
- **Content and tokens:** labels, casing, number, date and currency formats,
  spacing, colors, icons.

Classify what you find:

- **Reference pattern:** shared by two or more sibling sections, or provided
  by a shared layer.
- **Competing pattern:** siblings solve the same job in different ways. This
  is a choice for the user.
- **Deliberate divergence:** the target differs for a domain reason. State
  the reason.

For a broad app, give this dimension list to a readonly explore agent, then
recheck every reported finding yourself in the files. Only verified findings
reach the user. Observe the running app only when readonly permits it;
otherwise compare source and say that the live UI was not observed.

The sweep is complete when every dimension is checked for the target and
every kept mismatch cites a target location and at least one reference
location.

## 3. Report the mismatch list

Number the mismatches. For each, give one line on what differs, the target
`file:line`, the reference `file:line`, and its impact:

- **Visible:** the user sees or feels it (layout, click targets, states).
- **Structural:** same look, built by hand or with another library where the
  shared one exists.

List visible mismatches first, then structural ones, then competing patterns
and deliberate divergences. When a user request would duplicate a view or
pattern that already exists, say so with the evidence and offer the
alternative. Close with at most four questions: which mismatches to handle,
and a choice for each competing pattern.

## 4. Discuss with previews

Take the selected mismatches one at a time, or as a small group when one
decision settles them all. For each, render through show-me a side-by-side
view: **target now | reference in the app | proposed target**. Use the app's
real component look and labels with synthetic records. Add a short
conclusion and one question: adopt the reference, adapt it, keep the target,
or defer. Record the decision in chat, then move to the next mismatch. A
mismatch whose fix depends on an open decision waits for that decision.

## Completion

Discovery is complete when the verified, numbered list with locations is in
chat and no state has changed. Discussion is complete when every selected
mismatch has a rendered preview and a recorded decision. Hand the decision
list back as the input for the implementation the user requests next.
