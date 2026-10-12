---
name: give-me-prompt
description: Turn an existing analysis or work discussion into a plain-language recap followed by a self-contained agent prompt for resuming investigation, implementing a change, or fixing an issue. Use when the user wants a bookmark, handoff, or copyable continuation prompt, including after $readonly analysis. Do not use for unrelated prompt writing or to execute the proposed work.
---

# Give Me Prompt

Create a conversational bookmark that another agent can use without the original conversation. Write in the user's language. By default, explain what was analyzed in plain language first, then provide one copyable prompt for the requested next step. Honor a request for only the recap or only the prompt.

## Recover the useful context

Use the available conversation and supplied analysis as the primary source. Preserve the original objective, accepted decisions, latest corrections, relevant constraints, observed results, and unfinished work. Omit abandoned approaches unless they explain a constraint that still matters.

Distinguish verified findings from hypotheses, proposals, and unknowns. Keep performed changes and completed checks separate from suggested changes and checks that have not run. Do not turn a suspected cause into an established diagnosis or a recommendation into a user-approved decision.

Do not restart or extend the investigation just to produce the bookmark. Use narrowly scoped, non-mutating inspection only when needed to resolve an essential reference. If the earlier analysis is unavailable, say so; build on the available evidence and make recovering the missing context the next step. Ask only when missing information prevents a useful handoff.

## Select the next task

Follow the user's intended continuation: further investigation, implementation, correction, or another specified action. A generic request such as "give me a prompt" after an analysis means resume from the first unresolved point under the existing constraints; it does not authorize implementation.

When the source analysis used `$readonly`, distinguish the constraints of that analysis from the intended future task:

- For continued analysis, preserve the read-only constraint explicitly in the generated prompt: no local or external state changes, including tests, builds, or commands with side effects. Restate the constraint so the prompt works even where `$readonly` is unavailable.
- When the user asks for a prompt to implement or fix the analyzed issue, describe that future change and its scope. Do not carry over a read-only constraint that would contradict the requested implementation. Producing this prompt does not execute it or authorize changes in the current task.
- Preserve other applicable limits and exclusions. Do not add commits, pushes, deployments, messages, or unrelated cleanup unless requested.

## Deliver the bookmark

Start with a short, human-readable recap: what was examined, what the evidence shows, what remains unresolved, and what the next step should accomplish. Scale the detail to the analysis; avoid a chronological transcript or an unexplained list of files.

Then put the agent prompt in a single fenced `text` block. Write direct instructions to the receiving agent, not advice to the user about writing a prompt. Include only the context needed to continue effectively:

- The concrete objective and intended action, plus the relevant repository, component, or scenario.
- Established findings and decisions, with useful file paths, symbols, commands, or source references when known. Include essential evidence inside the prompt rather than relying on a link or the preceding recap. Do not invent locations, line numbers, or results.
- Current work status, applicable constraints, and uncertainties the agent must verify. Mark historical observations as such when their freshness matters.
- The next meaningful action, remaining work, and an observable completion condition. For implementation, describe the desired behavior and relevant validation; for investigation, specify the question and evidence needed to resolve it. Include only checks compatible with the task's permissions.

Make the prompt understandable when pasted into a new conversation: replace phrases such as "as discussed above" with the actual context. Ask the receiving agent to check that relevant evidence still applies before acting, without repeating the entire completed analysis. Do not include an instruction to invoke `$give-me-prompt` again unless that is itself the user's intended task.

Deliver in chat and stop after the requested recap and prompt. Do not run the prompt, create a new task, save files, or change local or external state as part of generating the bookmark.
