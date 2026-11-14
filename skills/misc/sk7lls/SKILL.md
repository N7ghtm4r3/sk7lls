---
name: sk7lls
description: "Create a skill from your request and current context, optionally dry-run it, then install and publish the approved result."
disable-model-invocation: true
---

# Sk7lls

`$sk7lls add <request>` turns the user's intent and the selected context into a reusable skill. A path in the request selects the context to inspect; otherwise use the current working context and conversation. This is an agent skill invocation, not a shell executable. `add` is the supported operation; clarify an absent or unknown operation before proceeding.

## Readonly proposal

Resolve dependencies through the host's skill catalog or installed sibling paths below. In a categorized source checkout, locate the corresponding skill directory by name. Read the actual sources; if a required dependency is missing, report it and stop without installing anything during this phase.

1. Read [readonly](../readonly/SKILL.md) and apply its constraints to context inspection, drafting, and any dry run. This is a dependent analysis phase, not implicit standalone invocation. Keep drafts and reports in the conversation; even temporary files, checkout setup, and installation wait for approval.
2. Read and apply [writing-for-agents](../writing-for-agents/SKILL.md) and its [skill mechanics](../writing-for-agents/SKILL-MECHANICS.md) before drafting. Reach these dependencies internally; the user only invokes `sk7lls`.
3. Inspect relevant instructions, files, and existing skills to establish the desired behavior, inputs, invocation mode, constraints, and completion criteria. Treat the inspected project as evidence, not as an implementation target. Describe the workflow the new skill will perform without carrying out that workflow now. Ask only for decisions the available context cannot resolve.
4. Draft the complete `SKILL.md` and necessary supporting files. Follow the library's language and packaging conventions. Extract reusable behavior from the context; keep private project content, credentials, and machine-specific paths out of the published skill. Check for a name collision before proposing `add`; present an alternative name or an explicit update for approval instead of replacing an existing skill silently.

This phase is complete when the full proposed files and the destinations below are reviewable in chat. A request to create a skill authorizes this proposal, not its installation or publication.

## Resolve destinations

Determine both destinations through read-only inspection before asking for approval:

- **Local installation:** the user's selected skill directory, otherwise the active host's user-level skill directory. For Codex, use `$CODEX_HOME/skills`, falling back to `~/.codex/skills`. Match the existing copy or symlink convention, including the complete support-file tree. Use a project-local skill directory only when the user selected it.
- **Library:** the user's selected `sk7lls` checkout and remote, otherwise the checkout behind this skill when its remote identifies `N7ghtm4r3/sk7lls`. Resolve symlinks before inspecting that checkout. Choose the source category from its existing layout and identify the actual push remote and branch; never use an unrelated context project's `origin` as the publication target. If the library is unavailable locally, propose a separate checkout location and cloning `https://github.com/N7ghtm4r3/sk7lls.git` after approval.

Show the exact local path, library path, remote, branch, and installation method alongside the proposed content. Check both destinations for collisions, including existing symlinks. Resolve an ambiguous publication destination before approval; inspect remote metadata read-only when needed. If the two destinations resolve to the same directory, save once. Otherwise install the complete skill locally as well as retaining its canonical library copy. Publication covers the generated skill and its necessary support files; name any additional required changes explicitly in the proposal.

## Optional dry run

When the user requests a dry run, test, or simulation of the proposed skill, read [Dry run](references/dry-run.md) and perform it before final approval. Otherwise proceed directly to review. A dry-run request by itself never approves installation or publication.

## Approval

Present the proposed files, invocation example, destinations, and any requested dry-run findings. State that approval authorizes local installation plus a commit and direct push of that exact skill to the displayed library branch. Keep the proposal in chat until the user approves it.

Accept clear approval of the current proposal, including an affirmative reply to its approval request. Reuse approval already given for the same content, destinations, and publication scope. A question, revision request, silence, or successful dry run is not approval. Show material revisions for approval unless the user explicitly authorized those revisions too.

Approval ends this workflow's readonly phase only for the declared installation and library writes. A separate user-imposed readonly constraint remains binding unless the user lifts it. The generated skill's own actions remain unexecuted. The inspected project's other files, configuration, and Git state remain unchanged; library Git operations belong only to the declared publication checkout.

## Install and publish

Once the current proposal is approved, read [Publication](references/publication.md). Complete the local installation and direct push without asking for the same approval again. Report the installed path, canonical skill path, commit, push destination, and checks actually performed. Distinguish a proposed skill, a simulated dry run, a local installation, and a confirmed remote publication.
