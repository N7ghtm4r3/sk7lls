## Selective subagent use

Use subagents only when the session permits delegation, suitable tools are exposed, and substantial, independent documentation tasks can run alongside useful work by the lead agent. Handle small edits, a short page, or tightly coupled content directly. Parallelism is a means to improve writing and turnaround, not a required stage.

Start with one helper. Add a second only when another independent batch justifies the extra context and coordination; use at most two helpers per request unless the user asks for more. Reuse those helpers for focused follow-ups instead of spawning replacements for each phase or page. Do not allow nested delegation. If subagents are unavailable or prohibited, complete the same workflow locally.

The lead agent establishes the scope, content map, and editorial baseline once. Share a compact brief containing the assigned topic, audience, language, terminology and style conventions, relevant file references or short excerpts, evidence already established, open questions, and expected output. Pass only the context needed for that assignment, rather than the entire conversation. Helpers inspect any additional sources needed to substantiate their own content; do not ask each helper to repeat repository-wide ingestion.

Choose a bounded assignment that avoids overlapping work:

- **Analysis:** verify coverage or behavior for one independent topic, returning concise findings, source references, and unresolved gaps under [readonly](../../readonly/SKILL.md).
- **Proposal writing:** draft a coherent section or related group of sections from the shared baseline, returning proposed Markdown and essential evidence without writing files before confirmation. Avoid one agent per paragraph or multiple competing drafts of the same content unless requested.
- **Confirmed implementation:** assign disjoint documentation files from the confirmed proposal. Specify exactly which files the helper may edit; keep shared navigation, configuration, and final integration with the lead agent. When assignments would touch the same file, have helpers return text for the lead to integrate instead.

Every assignment must state the current phase, confirmation status, and documentation-only boundary. Delegation does not authorize edits before confirmation or changes to any non-documentation file. Keep shared context in messages during analysis rather than creating coordination files.

The lead agent remains responsible for factual consistency, a uniform editorial voice, removing duplication, and connecting sections. Inspect delegated output and its supporting evidence, integrate it, and perform the combined validation once after integration. Delegate a focused review only when a concrete uncertainty warrants it; do not add an automatic reviewer or repeated review-and-rewrite cycles. Prefer a narrow follow-up on the affected passage over regenerating a complete draft. Do not duplicate a helper's active assignment locally.
