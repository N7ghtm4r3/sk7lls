---
name: pandoro-pr-create
description: "Create a PR or prepare its description from raw change notes, adding missing changes verified in the PR commits. Group notes by module, preserve wording, and match existing labels."
---

# Pandoro PR Create

Turn the user's raw list into a pull request whose body starts with `In this version`, followed by module headings and the corresponding notes. Add entries for relevant changes found in the PR commits that the supplied notes do not already cover. Preserve the supplied notes' content and phrasing as closely as possible. The skill name does not select a repository or require a particular source application.

## Identify the actual notes

- Separate the notes to publish from instructions, formatting demonstrations, and reference-only material. Examples supplied to explain the desired structure are not PR content or sources: do not copy their entries, module names, identifiers, or links into the PR.
- Use the actual notes as the starting content, then supplement them from the confirmed PR commit range as described below. Read repository context to identify the PR scope, additional changes, modules, and relevant labels.
- If only illustrative material was provided, ask for the actual notes before creating a PR. Do not reinterpret examples as a live request.

## Resolve the repository and branches

Use an available repository connector or CLI. Resolve the repository and any requested draft status from the user's request and current repository context.

**Both branches must be clear before proceeding.** Identify the source (head) and destination (base) branches from explicit user instructions or unambiguous session context. If either branch is missing, unclear, or has conflicting evidence, you must ask the user to specify it and wait for the answer before selecting the PR commit range, creating or updating the PR, or performing branch-related mutations. Never silently substitute the checked-out branch, upstream, repository default, or a conventional branch name for the user's unclear intent. Read-only discovery and preparation of the supplied notes may continue while waiting; elapsed time is not an answer.

## Add missing entries from commits

- Use the confirmed source and destination branches before selecting a commit range. Inspect the commits included in that PR and their changes, together with the cumulative PR diff. Use the provider's PR comparison or the equivalent source-only commit range and merge-base comparison; do not use the entire repository history, destination-only commits, or uncommitted work as PR content.
- Identify relevant changes missing from the supplied notes, including behavior, APIs, fixes, build configuration, CI, tests, and documentation when they materially describe the PR. Validate vague commit messages against the changes. Describe the resulting state; omit changes fully reverted or superseded within the PR.
- Add each missing change as a new bullet under its module using the same structure, language, and level of detail as the supplied notes. Do not create a separate commit-history section, append commit messages verbatim, or decorate entries with commit hashes and attribution.
- Deduplicate by meaning across both sources and across commits. If a supplied note already describes a change, retain that note with only the permitted language corrections and do not add another entry for it. Combine multiple commits implementing one change into one new entry. A distinct change absent from the notes still deserves its own entry even if it touches the same module or file.
- Commit-derived entries supplement the user's notes; they do not justify rewriting, replacing, or expanding those notes. Keep an internal mapping to the supporting commits or diff when needed to check coverage. Add only supported changes, without speculative benefits, implementation details, or claims that tests passed.
- If the commits contradict a supplied note in a way that changes its meaning or completion status, resolve the discrepancy with the user before publication instead of silently changing the note or publishing contradictory entries. If the commit range cannot be inspected, explain that enrichment is incomplete rather than claiming the notes cover it.

## Organize with minimal editing

- Recognize explicit module markers such as `:module` and `module:`. Move each marker into a `## module` heading and remove only that routing prefix from the bullet. Preserve canonical module names, including meaningful path separators.
- Group notes under their stated module. Infer a missing module only when the note or repository context clearly supports it. Put cross-cutting or unassigned notes under `## general`; do not invent a product module or silently put them in the first module mentioned.
- Order groups by first appearance in the input, and preserve supplied note order within each group. Append new commit-derived entries to the matching group; append any additional module groups after the supplied groups. Include only nonempty groups. Keep each distinct supplied note once; do not split, merge, expand, or drop it just to improve the prose.
- Correct spelling, grammar, punctuation, and awkward technical phrasing only as needed for a PR. Remove accidental paste escaping or HTML whitespace artifacts without changing identifiers or literal content. Use inline code for identifiers when useful.
- Preserve meaning, level of detail, technical identifiers, version numbers, qualifications, and completion status. A plan, investigation, or evaluation must not become a completed implementation. Do not turn every verb into past tense merely to resemble release notes.
- Correct an apparent technical error only when the intended correction is unambiguous and supported by available evidence. If a substantive ambiguity would change the claim, ask a targeted question instead of guessing.
- Keep the notes' language unless the user requests translation. Do not perform a wholesale rewrite or add benefits or rationale. Details absent from the notes may appear in new commit-derived entries only when supported by the inspected changes.
- Keep links that belong to actual change notes; omit links supplied only as documentation or formatting references.

The body must contain the literal opening line `In this version`, a blank line, then `##` headings with Markdown `-` bullets. Add blank lines around each heading and list. Do not add an extra summary, references section, testing claims, checklist, or suggested labels unless explicitly requested or required by the repository's PR template. For a required template, preserve this module-grouped content within its description section and fill other required fields only with supported information.

Use the user's PR title when supplied, applying only obvious language corrections. Otherwise derive a concise title from the combined notes and commit-derived entries; do not invent a release number.

## Match existing labels

Read the target repository's current label catalog, including descriptions when available. Retrieve the complete catalog or otherwise verify every candidate against it; an incomplete first page is not evidence that a label is absent.

- Select existing labels whose meanings clearly fit the combined notes and commit-derived entries, considering affected modules and the kind of change. Use the repository's exact label names, without assuming that every module has a matching label.
- Do not infer a label solely from a formatting example, a proposed future implementation, or a weak keyword overlap. Labels must describe the PR's actual scope.
- Apply the supported matches to the PR. If none fit, leave it without added labels.
- Never create, rename, or alter a repository label. If a useful label does not exist, mention it only in chat as an optional suggestion; do not put it in the PR body or pass it to the label-application operation.
- If the catalog cannot be read, do not guess label names. Continue with the prepared PR when otherwise possible and report that label matching could not be completed.

## Create and verify the PR

Once both branches are clear, check for an existing PR with the same source and target before creating another; if one exists, report its URL and update it only when the user has authorized an update.

A request to create the PR authorizes creating it and applying matching existing labels; do not add a separate confirmation step. If the user asks only for a description or preview, return the prepared text and label choices without publishing. Keep repository implementation, creating commits, branch mutations, merges, and releases outside this workflow unless covered by the user's request.

Prepare the complete title, body, branch selection, and label set before the external write. Pass multiline text through structured tool arguments or a UTF-8 body file, such as a CLI's `--body-file` option, to preserve Markdown and avoid shell interpolation.

After creation, read back the PR title, body, branches, and applied labels. If creation or label application returns an uncertain result, inspect remote state before retrying. Never blindly repeat PR creation. If verification is unavailable, stop further mutations and report what is confirmed and what remains uncertain; do not create a replacement PR. If labels fail after the PR is created, keep the existing PR and report the label failure.

Return the PR link and applied labels in chat, along with any unresolved issue or optional new-label suggestion. When supported by the host, attach the created PR to the current task. Do not claim a preview was published or a label was applied without confirmation.
