---
name: mkdocs-bookeping
description: "Maintain Material for MkDocs documentation or fill content gaps: ingest organization, content, and style read-only, propose revisions or additions, then implement confirmed documentation changes."
---

# MkDocs Bookeping

Ingest the existing documentation, propose concrete content changes, then implement the confirmed proposal. Fit each change into the site's existing reading flow and explain the subject at the depth its reader needs. Use the workflow below to organize the work; choose the reader-facing form from the page's purpose and established editorial conventions.

Use the user's language for the analysis and proposal commentary. Draft documentation in the language and style of the relevant existing content unless the user requests a change.

## Scope and confirmation boundary

Ingestion and proposal are read-only: leave all project files and Git state unchanged. Present proposed text and configuration excerpts in chat; do not write drafts, patches, or reports to disk before confirmation.

Before ingestion, read [the readonly skill](../readonly/SKILL.md) and apply it to the analysis portions of this workflow: inspecting documentation and code, gathering evidence, identifying content gaps, and evaluating proposed revisions. Apply the same constraints to any later re-analysis. This reference governs those analytical operations only; it does not prohibit the confirmed documentation edits or the permitted implementation validation described below. All non-documentation files remain read-only in every phase.

After confirmation, edit only the documentation content, documentation assets, and configuration dedicated exclusively to the MkDocs documentation and covered by the proposal. Identify these documentation paths during ingestion and list the intended edit targets in the proposal. All other files remain read-only throughout the workflow: application and library source code, source comments, tests, runtime or shared project configuration, build scripts, CI/CD, dependencies, and lockfiles. A code example inside a documentation page is documentation content; its executable counterpart in the codebase is not. A file's location under a documentation directory does not authorize editing executable code or shared tooling stored there.

Confirmation authorizes documentation edits only; it never expands the scope to the codebase, even to fix a documented defect, make an example work, or unblock a documentation build. If a proposed change requires editing a non-documentation file, leave that file untouched, explain the limitation, and complete the independent documentation changes. Do not commit, push, or publish as part of this workflow.

Before confirmation, use non-mutating inspection only: no builds, previews, tests, generators, formatters, or installations. A build directed to a temporary directory can still execute hooks or plugins and write elsewhere; it does not satisfy the read-only phases. Do not execute documentation examples or import project code or configuration to discover behavior. Inspect their source instead.

When static inspection cannot establish a fact, identify the missing evidence and the verification that would be needed. Do not modify implementation to make it agree with documentation. A discovered implementation defect may be reported as a separate observation; it is not authorization to fix it.

## Select independent work when useful

For substantial independent documentation batches alongside useful lead work, read [selective delegation](references/delegation.md) before assigning them. Small or tightly coupled edits stay local. Helpers are optional and require session permission and exposed tools; a serial run retains the same workflow.

## Phase 1 — Ingest the existing documentation

### Establish scope and sources

Identify the topic or change the user wants documented, the intended audience, and the relevant product version from the request and available project context. Inspect the documentation configuration and content before drafting. Follow the project's actual configuration paths, including inherited configuration and alternative documentation roots, rather than assuming every site uses a root-level `mkdocs.yml` and `docs/`.

Read the relevant MkDocs configuration, navigation sources, Markdown, assets, and existing documentation commands as text. Identify Material settings, enabled Markdown extensions, plugins, includes, and generated content only to the extent that they affect the requested documentation. Treat generated pages and included snippets as derived content: locate their maintained source when available.

If the user supplies an earlier documentation version, compare it with the current one and state which version supplies the editorial baseline and which product version is being documented. A published page may lag behind local sources; report meaningful differences rather than silently treating both as identical.

### Learn organization, substance, and style

Map the existing documentation at three levels:

- **Organization:** audience, reading order, section hierarchy, topic grouping, page boundaries, navigation labels, and cross-links. Identify what each relevant page helps its reader understand or accomplish.
- **Substance:** concepts explained, prerequisites, procedures, API behavior, examples, expected results, limitations, and troubleshooting where relevant. Record how deeply each topic is covered and what the reader is assumed to know.
- **Style and form:** language, terminology, tone, level of detail, heading patterns, paragraph structure, use of lists and tables, example conventions, and Material elements such as admonitions or tabs already used in the project.

Read each affected page in full, its section overview or parent page when present, and comparable pages that serve the same reader purpose. Follow relevant navigation and incoming and outgoing links to understand what is explained before, within, and after the affected page. For each affected page type, compare at least two existing examples when available; explain conflicts rather than elevating one inconsistent page into a rule. For a large documentation set, inventory its structure and sample other content types as needed; state the inspected scope instead of claiming exhaustive coverage.

Derive an editorial baseline from those passages: the reader's starting knowledge, the page's central question, the order in which concepts become understandable, the explanation depth, and the role of examples and reference material. Support it with concrete file and section references. Headings and directory names locate material; the passages establish how the documentation teaches it.

Ingestion is complete when every intended change has an evidenced home, a reader purpose, and an explanation of how it connects to surrounding content. Resolve placement against the maintained pages and navigation before proposing a new section or page. When access is incomplete, keep the missing structure explicit and qualify the proposal's placement.

### Establish content gaps from evidence

Compare documentation with the relevant implementation, existing tests, specifications, release notes, or user-provided requirements using read-only inspection. Inspect only what is needed to substantiate the requested content. Existing prose is evidence of editorial style, not proof that the described behavior is still correct.

Build a compact topic-to-content map connecting each relevant concept or reader task to its existing location, evidence, and coverage status: adequate, outdated, incomplete, absent, duplicated, or misplaced. Distinguish an absent topic from an existing explanation that lacks a prerequisite, constraint, example, or step. Treat uninspected or inaccessible material as unknown, not absent.

Summarize the editorial baseline and the gaps that justify changes. Preserve the established organization unless a concrete reader problem warrants an adjustment. Treat coverage categories as analysis aids: a page needs the content that serves its purpose, rather than a section for every category.

### Write a coherent explanation

Lead with the concept in the reader's domain: what it represents, the problem it addresses, and its relationship to concepts the reader already knows. Order the explanation around the reader's question and conceptual prerequisites. A conceptual page develops understanding; a procedure follows necessary action order; a reference supports lookup. Combine forms where the reader needs to move between them, without turning the agent's inspection phases or coverage map into the page's outline.

Develop reasoning in connected paragraphs, each with one purpose. Start a new paragraph when the reader must shift concepts, compare alternatives, or consider a different set of conditions. Remove repeated setup and claims before dividing dense prose into more blocks; let meaning and reading effort determine paragraph size.

Make every detail earn its place by helping the reader understand a concept, make a decision, complete a task, or avoid a relevant mistake. Keep necessary constraints and behavioral distinctions beside the claims or steps they qualify. Move supporting detail that interrupts the explanation into its owning section or reference, retaining the qualifications needed for correct use.

Use headings for meaningful shifts in subject, numbered steps for actions whose order matters, lists for scannable items, and tables for comparisons across shared attributes. Let connected prose carry reasoning. Choose Material elements for a useful reader function, such as an optional aside or alternative, rather than as decoration or a remedy for repetition.

Use the smallest accurate example that teaches the current point, retaining the context needed to understand and safely use it. Trim unrelated setup, imports, and boilerplate; keep them when they are part of what the reader needs to learn. Explain what each example demonstrates, and retain additional examples only when they teach a distinct case.

Link supporting concepts where their relationship is discussed, using the site's existing link conventions. Keep each explanation in its owning location and build on it through context and links elsewhere. Preserve local terminology and useful structure while correcting readability defects in the editorial baseline. Any claim added to connect the prose still requires evidence.

## Phase 2 — Present revisions and new content

Continue directly from ingestion to the proposal unless the user requested ingestion only. Complete the concrete, reviewable proposal before asking the user to confirm its implementation. If only analysis or a proposal was requested, deliver it without pushing for implementation. Presenting a proposal does not authorize edits; a clear confirmation of that proposal does. Reuse confirmation already given in the conversation without asking again.

Group the proposal into **existing content to update** and **content to add from scratch**. Additions can be paragraphs, examples, procedures, or sections within an existing page; create a proposed new page only when the content needs a distinct purpose or place in the reading flow. Recommend removing or merging content only when it resolves an evidenced problem.

For each proposed change, provide enough detail to review it:

- **Location:** existing file and heading or line reference, or a clearly labeled proposed path and insertion point. Mention navigation changes only when needed.
- **Reason and evidence:** the reader problem, the inspected source supporting the correction, and how the change fits the editorial baseline. For a structural change, explain why the existing location or reading order cannot serve the content. Distinguish confirmed facts from assumptions and unresolved questions.
- **Concrete content:** for a revision, identify the passage to replace or extend and provide the replacement or insertion text; for an addition, state its reader purpose and provide the new Markdown content. Include verified examples, prerequisites, or expected results when they are necessary to make it usable.

Do not substitute a list of page titles, a navigation tree, or vague instructions such as "expand this section" for actual content proposals. For a broad documentation overhaul, first provide the full content-level change map, then develop coherent batches of drafts, clearly marking what remains undrafted. If only a plan was requested, provide content-level outlines without implying that full drafts have been completed.

Draft each replacement or insertion with its surrounding paragraphs in view, including the context and transitions needed to review it as part of the page. Keep the proposal proportionate to the reader problem while supplying the complete replacement or insertion text. Apply the editorial baseline and coherent-explanation criteria above while correcting factual errors. Preserve unaffected text and existing links or anchors where possible. Call out links that would need adjustment when a proposed heading, location, or page name changes. Keep evidence references and reviewer commentary outside the proposed reader-facing prose unless they belong in the documentation itself.

When evidence is insufficient, separate the open question from the usable draft. Do not invent API signatures, configuration defaults, supported platforms, commands, or product behavior to make a proposal look complete.

## Implement the confirmed proposal

Once the user confirms, proceed with the actual documentation edits, not another plan. Apply only the confirmed items; partial confirmation authorizes only the selected subset. Routine wording and formatting adjustments within that scope do not need another approval. If new evidence requires a substantive content or scope change, complete the unaffected confirmed work and present the changed proposal for confirmation.

Recheck the affected files before editing so that intervening user changes are preserved. Update the existing passages and create the confirmed additions using the ingested style. Apply the necessary confirmed navigation, cross-link, anchor, include, and asset changes so the content remains discoverable and coherent.

For generated content, change a maintained documentation source only when it is within the confirmed scope. If the required source is application code, a source comment, or an excluded build or generator script, report that constraint instead of changing it or hand-editing generated output that would be overwritten.

### Check scope and validation

Review the resulting diff against the initial state to ensure every change made by this task is within the identified documentation paths and preserves unrelated work. Read each changed page as a whole in its intended use: learning a concept, following a procedure, or looking up a fact. Apply the coherent-explanation criteria above; check that the central question is answered and concepts arrive with the context needed to understand them. Assess paragraph boundaries as Markdown will render them: source line wrapping alone leaves one rendered paragraph. Compare the result with the ingested peers; justify intentional departures. Check headings, links, examples, and supported Material syntax. When an existing documentation toolchain is available, inspect its hooks and plugins before running a local build; run it only if its effects stay within documentation validation and scratch output, without changing any non-documentation file or tracked generated output. Do not install dependencies or alter the environment to force validation. Otherwise perform static checks and report the missing build verification. Fix documentation issues introduced by the confirmed changes within the same scope.

Report the documentation actually updated or added, the checks performed, and any remaining gaps. Confirm that this task changed only documentation files and left the rest of the codebase untouched. Do not claim a rendered or published result when only files were edited or statically checked.

## Material for MkDocs compatibility

Use Markdown constructs and Material features supported by the project's inspected configuration. Do not assume that every extension or plugin shown in upstream examples is enabled locally. Prefer an existing supported form; if a new feature is necessary, include its documentation configuration changes in the proposal and apply them only when confirmed. Dependency or tooling changes remain outside this workflow.

Respect how the site manages navigation, whether explicitly configured, inferred, or plugin-managed. MkDocs `nav` paths are relative to `docs_dir`; navigation is not necessarily a one-to-one inventory of the content. Preserve the project's link, asset, include, and generated-reference conventions. See the official [MkDocs configuration reference](https://www.mkdocs.org/user-guide/configuration/) and [Material site configuration guide](https://squidfunk.github.io/mkdocs-material/creating-your-site/) when a specific configuration question requires verification against the project's version.

During proposal review, check heading hierarchy, link targets, anchors, code fences, and consistency with enabled syntax statically. Reserve build validation for the confirmed implementation under the constraints above.

## Missing documentation and delivery

If no documentation exists, say that an existing style cannot be ingested. Derive a minimal proposed organization and editorial baseline from the available project evidence and user requirements, clearly labeling them as proposals. If only published documentation is accessible, analyze its visible content and style while identifying source configuration and file paths as unknown. Ask for missing information only when it materially blocks a reliable proposal; continue the parts supported by evidence.

Before confirmation, deliver a concise ingestion summary followed by the content revisions, new content, and any unresolved evidence or validation limits; state that no files have been changed yet. After confirmation, deliver the implementation result and validation status. Scale each response to the requested scope and omit empty categories. Do not create separate report artifacts unless requested.
