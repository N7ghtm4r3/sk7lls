---
name: sk7lls
description: "Create or fix a skill from context and chat evidence, optionally dry-run it, then install and publish the approved changes."
disable-model-invocation: true
---

# Sk7lls

Use these agent skill invocations in chat:

- `$sk7lls add <request>` creates a skill from the user's intent and selected context.
- `$sk7lls fix [skill name or path] [request]` corrects an existing skill using evidence collected or identified in the conversation by the user and the agent. Infer an omitted target only when the conversation identifies one unambiguously.

A context path selects what to inspect; otherwise use the current working context and conversation. For `fix`, distinguish the target skill path from any project supplied as evidence. These are agent invocations, not shell executables. Clarify an absent or unknown operation before proceeding.

## Readonly proposal

Resolve dependencies through the host's skill catalog or installed sibling paths below. In a categorized source checkout, locate the corresponding skill directory by name. Read the actual sources; if a required dependency is missing, report it and stop without installing anything during this phase.

1. Read [readonly](../readonly/SKILL.md) and apply its constraints to context inspection, drafting, and any dry run. This is a dependent analysis phase, not implicit standalone invocation. Keep drafts and reports in the conversation; even temporary files, checkout setup, and installation wait for approval.
2. Read and apply [writing-for-agents](../writing-for-agents/SKILL.md) and its [skill mechanics](../writing-for-agents/SKILL-MECHANICS.md) before drafting. Reach these dependencies internally; the user only invokes `sk7lls`.
3. Inspect relevant instructions, files, and existing skills to establish the desired behavior, inputs, invocation mode, constraints, and completion criteria. Treat the inspected project as evidence, not as an implementation target. Describe the workflow the proposed skill will perform without carrying out that workflow now. Ask only for decisions the available context cannot resolve.
4. For `add`, draft the complete `SKILL.md` and necessary supporting files. Check for a name collision and propose an alternative name or offer `fix` for the existing skill instead of silently replacing it. For `fix`, read [Evidence-based correction](references/fix.md) and prepare the supported correction to the identified skill.

Follow the library's language and packaging conventions. Extract reusable behavior from the context; keep private project content, credentials, and machine-specific paths out of the published skill.

This phase is complete when the full proposed files and the destinations below are reviewable in chat. A request to create or fix a skill authorizes this proposal, not its installation or publication. If the evidence supports no skill change, explain that result and finish without installation, commit, or push.

## Resolve destinations

Determine both destinations through read-only inspection before asking for approval:

- **Local installation:** for `fix`, retain the identified installation unless the user chooses another destination. Otherwise use the user's selected skill directory or the active host's user-level skill directory. For Codex, use `$CODEX_HOME/skills`, falling back to `~/.codex/skills`. Match the existing copy or symlink convention, including the complete support-file tree. Use a project-local skill directory only when the user selected it.
- **Library:** the user's selected `sk7lls` checkout and remote, otherwise the checkout behind this skill when its remote identifies `N7ghtm4r3/sk7lls`. Resolve symlinks before inspecting that checkout. Choose the source category from its existing layout and identify the actual push remote and branch; never use an unrelated context project's `origin` as the publication target. If the library is unavailable locally, propose a separate checkout location and cloning `https://github.com/N7ghtm4r3/sk7lls.git` after approval.

For `fix`, retain the existing canonical source path and compare its content with the selected installation before proposing changes. If the skill has no source in the library, make the proposed import explicit; do not replace a similarly named library skill by inference. Show any divergence between local and canonical versions and the proposed reconciliation. The approval covers the exact base content and resulting edits at each destination.

Show the exact local path, library path, remote, branch, and installation method alongside the proposed content. Check both destinations for collisions, including existing symlinks. Resolve an ambiguous publication destination before approval; inspect remote metadata read-only when needed. If the two destinations resolve to the same directory, save once. Otherwise install the complete skill locally as well as retaining its canonical library copy. Publication covers the proposed skill and its necessary support files; name any additional required changes explicitly in the proposal.

## Optional dry run

When the user requests a dry run, test, or simulation of the proposed skill, read [Dry run](references/dry-run.md) and perform it before final approval. Otherwise proceed directly to review. A dry-run request by itself never approves installation or publication.

## Approval

Present the proposed files, invocation example, destinations, and any requested dry-run findings. For `fix`, include the evidence-to-change explanation and an exact diff in chat, with every affected file and any deletion or rename identified. State that approval authorizes local installation or update plus a commit and direct push of those exact changes to the displayed library branch. Keep the proposal in chat until the user approves it.

Accept clear approval of the current proposal, including an affirmative reply to its approval request. Reuse approval already given for the same content, destinations, and publication scope. A question, revision request, silence, or successful dry run is not approval. Show material revisions for approval unless the user explicitly authorized those revisions too.

Approval ends this workflow's readonly phase only for the declared installation and library writes. A separate user-imposed readonly constraint remains binding unless the user lifts it. The proposed skill's own actions remain unexecuted. The inspected project's other files, configuration, and Git state remain unchanged; library Git operations belong only to the declared publication checkout.

## Install and publish

Once the current proposal is approved, read [Publication](references/publication.md). Complete the local installation and direct push without asking for the same approval again. Report the installed path, canonical skill path, commit, push destination, and checks actually performed. Distinguish a proposed skill, a simulated dry run, a local installation, and a confirmed remote publication.
