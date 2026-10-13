---
name: code-preview
description: "Preview code in chat when the user requests an explained programming example or wants to review a change before applying it. Implement only an approved preview."
---

# Code Preview

Show concrete, reviewable code in chat before making an optional implementation. Write the surrounding explanation in the user's language. A preview can be the complete deliverable; an educational example does not imply a request to change a project.

## Prepare the preview

### Inspect the context

Use the conversation and supplied code first. Whenever context analysis is needed, use `readonly`: read and follow its available `SKILL.md` before inspection (in this collection: [../readonly/SKILL.md](../readonly/SKILL.md)). If it is unavailable, explain the missing dependency and stop the context analysis rather than silently replacing the required skill.

Under `readonly`, inspect only the files and repository instructions needed to match the project's language, APIs, conventions, and integration point. If there is no project, provide a self-contained example and state material assumptions. Ask for missing information only when it prevents a useful, accurate preview.

Keep preparation read-only: do not edit files, save the snippet, install dependencies, or run commands with side effects before implementation is authorized. Do not execute user-supplied code merely to display it. Clearly distinguish code reasoned about from code actually validated.

### Present the reviewable code

Present the proposed snippet in a fenced code block with the appropriate language tag. Identify its purpose and, when known, the target file or declaration. Include enough context to understand the behavior and integration without dumping unrelated files. Prefer a complete usable snippet; if abbreviations are necessary, mark them in prose and do not present the snippet as ready to apply.

For a documented example, combine concise comments on the relevant code sections with prose about behavior, inputs, outputs, assumptions, and tradeoffs. Include a small usage example or expected result when it makes the behavior clearer. Describe a visual result in prose unless the user also requests a rendered preview.

## Comments and docstrings

In chat previews, include short explanatory comments by default on the meaningful sections of the snippet, including usage examples when useful. Explain the purpose or a non-obvious decision rather than narrating every line. Use the language's valid comment syntax, including JSX comment syntax inside JSX. Omit these comments when the user requests an uncommented preview.

In implemented code, omit newly added explanatory comments by default, including in tests. Preview comments are teaching aids and do not imply that they should be copied into files. Before implementation, remove these comments from the code being applied while preserving the reviewed behavior.

- Add explanatory comments to implemented code only when the user explicitly requests them for the implementation. A request for comments in the preview alone does not change the implementation default.
- Add docstrings, KDoc, Javadoc, or equivalent embedded API documentation only when the user explicitly requests that form of documentation. A request for an explained or documented example alone means explanation in chat, not embedded documentation.
- Treat these as separate preferences: requesting comments does not automatically request docstrings, and requesting docstrings does not automatically request explanatory comments.
- Apply each explicit preference for its stated scope: preview, implementation, or both. Carry it into subsequent revisions within that scope. Do not ask the user repeatedly about an already stated preference.
- Preserve existing comments and docstrings in files being edited; the default does not authorize their removal. Retain required license notices, interpreter directives, and functional tool directives. If adding a directive is necessary, explain its purpose in prose.

## Approval and revisions

If the user has asked only for a preview or an example, deliver it in chat and stop. When eventual implementation is intended, state briefly that the shown change is ready to apply after approval. Do not treat silence, a question, or a request to revise the preview as approval.

Accept explicit approval of the shown change, such as "implement it", "apply it", or "approved, proceed". An unambiguous affirmative reply also counts when it directly answers a pending request to apply that exact preview. Reuse approval already given for the same reviewed change; do not introduce repeated confirmation steps. Follow explicit instructions to proceed without another approval when the user has already authorized that workflow.

When the user requests a revision, show the revised preview before applying it unless their instruction also explicitly authorizes the revised implementation. Approval of one snippet does not authorize unrelated edits or additional features.

## Implement the approved change

Use `readonly` for the inspection needed to recheck relevant files before editing and account for intervening changes. The read-only analysis phase of this workflow ends when proceeding to an approved implementation; a separate read-only restriction imposed by the user remains binding until they explicitly lift it.

Apply the reviewed behavior to the agreed target, omitting the preview's explanatory comments and all new docstrings unless requested for implementation. Preserve existing documentation and the user's scoped preferences. Removing teaching comments does not require another approval. Small mechanical adaptations to current code are acceptable; if new evidence requires a material change in behavior or scope, show the updated proposal and obtain approval for that change.

If the target project or file is unknown, request that information before writing rather than choosing an arbitrary destination. A chat-only example can remain an example until the user supplies a target.

Perform proportionate verification after implementation and run required repository checks. Report what changed, where it was applied, what was verified, and any remaining limitation. Do not claim that a chat preview passed tests. Approval to apply code does not also authorize a commit, push, publication, or deployment.
