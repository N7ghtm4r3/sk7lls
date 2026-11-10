# Source Inquiry

Entry: the router selected explicit `mode: source-inquiry`. The caller
supplies a topic, source scope, existing evidence, and the agent's context
gaps. The inquiry's respondent is the source collection. Return findings
in chat; keep its working questions and evidence in context without creating
grill status, logs, wiki pages, or other durable artifacts.

## Query Rounds

1. **Map the gaps.** Turn each ambiguity, contradiction, or missing fact
   into a question whose answer could change the caller's understanding.
   Record the evidence already available, what remains unknown, and any
   prerequisite question. Questions seek what was said, intended, exemplified,
   decided, rejected, or left open in the source conversations. New choices
   for the user remain unresolved decisions.
2. **Select the frontier.** Query every material question whose prerequisites
   are supported. Keep dependent questions for a later round. A hypothesis
   may guide a search; seek evidence that could support or contradict it.
3. **Execute.** Use available read, search, and query tools on the scoped
   Granola material and contextual sources. Search with concrete terms, names,
   examples, and observed paraphrases; read the surrounding passages and
   transcripts when available.
   Follow related conversations only within the topic and source scope.
   This route performs retrieval, not messages to participants or source
   edits. When tooling exposes only an answer without its underlying passage,
   retain that answer's attribution and mark the supporting passage unverified.
4. **Reconcile and expand.** Attach findings to the questions they answer,
   with their anchors and source type. Preserve conflicting accounts and
   distinguish a later explicit revision from a merely later mention.
   Recompute the frontier, including follow-ups exposed by the answers.
   Mark a gap unresolved when relevant available sources are exhausted,
   inaccessible, or unable to answer; downstream findings retain that limit.

Repeat while an unanswered material question has a new relevant retrieval
path. A query with no matches, a repeated unsupported answer, or agreement
between summaries does not prove a fact or settle a choice. The inquiry ends
when every material gap is supported or explicitly unresolved and no
unresolved gap retains a useful retrieval path. An unavailable tool limits
the inquiry; it does not block findings already supported by the supplied
readable material.

## Return

Return to the caller:

- the enriched understanding, with source anchors for factual claims;
- which gaps were answered, including follow-up findings;
- unresolved questions and contradictions, their effect on the answer or
  proposal, and the source or access limitation behind each;
- any choices that require the user's direction.

Completion is evidence coverage of the caller's gaps, not requirements
closure. The caller decides how to present or use this context. This route
does not interview the user or start architecture, specification, or delivery.
