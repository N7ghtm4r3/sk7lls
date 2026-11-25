# Source Inquiry

Entry: Sgranola's Deepen step runs this inquiry on every invocation, in a
subagent, and supplies a topic, source scope, existing evidence, and the
agent's known context gaps. The inquiry is the subagent's whole task; its
work ends at Return. The inquiry is an internal grilling: read
[grilling](../../grilling/SKILL.md) as a read-only rubric and apply its
design tree, frontier, and rounds with the source collection as respondent.
The agent asks every question and answers it from the sources; the user
receives no question round. A decision the sources leave to the user stays
an open question for the caller. The original requirements workflow stays
separate. Return findings and the coverage ledger to the caller; keep the
full tree and its evidence in context without creating grill status, logs,
wiki pages, or other durable artifacts.

## Query Rounds

1. **Build the design tree.** Branch the topic from the reconstructed
   context: problem, operators, examples, constraints, proposals, decisions,
   rejected alternatives, and open points. Under each branch, turn every
   ambiguity, contradiction, missing fact, and summary-derived claim into a
   question whose answer could change the caller's understanding. A
   summary-derived claim (a figure, an attribution, a decision, a cause)
   stays a question until its original passage confirms it. Record the
   evidence already available, what remains unknown, and any prerequisite
   question. Questions seek what was said, intended, exemplified, decided,
   rejected, or left open in the source conversations. New choices for the
   user remain unresolved decisions. A question that read-only inspection
   can settle is a retrieval question, and the agent answers it; a check that
   needs a write or an outward-facing action stays unresolved with the
   proposed experiment.
2. **Select the frontier.** Query every material question whose prerequisites
   are supported. Keep dependent questions for a later round. A hypothesis
   may guide a search; seek evidence that could support or contradict it.
3. **Execute.** Run every retrieval path that can answer a frontier
   question:
   - the scoped conversations, their transcripts and transcript search, and
     the related conversations that searches surface, including those
     sharing a folder or series with them;
   - the natural-language query tool, as below;
   - for claims about current behavior, usage, or state, the system's own
     records: code, documentation, issue tracker, backlog, and read-only API
     queries. Design documents record intent; current usage needs these
     records.

   Search with concrete terms, names, examples, and observed paraphrases;
   read the surrounding passages. A path whose tool the host lacks is
   recorded as unavailable in the ledger.
   Each round also sends its open questions to the natural-language query
   tool, which reaches content that titles, summaries, and keyword search
   miss. Host guidance that ranks it as a last resort orders it after search
   and reads; it still runs. Its budget can be scarce and shared across
   sessions, so combine the round's questions into one query, most material
   first. A retryable failure, such as a rate limit or timeout, keeps that
   path open: finish the other retrieval, then retry once before returning.
   Follow related conversations only within the topic and source scope.
   This route performs retrieval, not messages to participants or source
   edits. When tooling exposes only an answer without its underlying passage,
   retain that answer's attribution and mark the supporting passage unverified.
4. **Reconcile and expand.** Attach findings to the questions they answer,
   with their anchors, source type, and confidence: stated, inferred, or
   unresolved. Preserve conflicting accounts and
   distinguish a later explicit revision from a merely later mention.
   Recompute the frontier, including follow-ups exposed by the answers.
   Mark a gap unresolved when relevant available sources are exhausted,
   inaccessible, or unable to answer; downstream findings retain that limit.

Repeat while an unanswered material question has a new relevant retrieval
path. A query with no matches, a repeated unsupported answer, or agreement
between summaries does not prove a fact or settle a choice. The inquiry ends
when the frontier is empty: every branch of the tree visited, every material
question supported or explicitly unresolved, and no unresolved gap retains a
useful retrieval path: the coverage ledger has no open row. An unavailable
tool limits the inquiry; it does not block findings already supported by the
supplied readable material.

## Coverage Ledger

The ledger makes the inquiry checkable. Keep it compact, one line per row:

- **Questions:** each material question of the design tree, with its status
  (answered: stated or inferred; unresolved; left to the user), its anchor,
  and the paths that answered it or failed to.
- **Paths:** each retrieval path from Execute, with its outcome: run, failed
  (reason, with an offer to rerun), unavailable in this host, or out of
  scope (reason).

A row is open while it names an available path not yet run, or an item
fetched only in part. Before returning, read the ledger; an open row sends
the inquiry back to Execute.

## Return

Return to the caller:

- the coverage ledger;
- the enriched understanding, with source anchors for factual claims;
- which gaps were answered, including follow-up findings;
- unresolved questions and contradictions, their effect on the answer or
  proposal, and the source or access limitation behind each;
- the open questions: each decision the sources leave to the user, and each
  question only the user can settle, written as a question with its evidence
  and a recommended answer. They are the input for the brainstorm's forks or
  for a later grilling with the user.

Completion is evidence coverage of the caller's gaps, not requirements
closure. The caller decides how to present or use this context. This route
does not interview the user or start architecture, specification, or delivery.
