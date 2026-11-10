---
name: sgranola
description: Read Granola material and query context gaps to develop an idea. Use sgranola go deep to check whether a detail was discussed, represented faithfully, or supported by the current task's sources; return findings in chat.
---

# Sgranola

Read the relevant sources and deepen the evidence through an internal source
inquiry. Default delivery develops an idea through a brainstorm; Go Deep
answers a contextual question or checks a claim. The user chooses what follows.
Keep the whole run in chat; the skill produces no durable artifacts.

## Entry

Default entry starts from the supplied conversations and attachments and uses
Read, Deepen, and Propose below. For `sgranola go deep`, follow
[Go Deep](references/go-deep.md) to infer the detail or contextual question to
investigate, including when no Granola material was attached. Use the same
Read and Deepen steps with that source scope, then return the findings through
Go Deep's answer contract. Propose runs only if the user also asks to develop
a shape or brainstorm.

## Read

Identify the supplied material and any sources selected by Go Deep, and the
topic they concern. Use the host's available Granola or document tools to
read their contents, including transcripts when available. Discover actual
capabilities from the environment rather than assuming tool names or APIs.

Reconstruct the problem, operators, examples, constraints, proposals,
alternatives, explicit decisions, and unresolved points. Keep source anchors
with the relevant claims: conversation title or identifier, date, speaker,
and passage or timestamp where available. Distinguish original statements,
meeting summaries, query-generated answers, and the agent's interpretations.

Reading is complete when every scoped item is read or marked inaccessible,
and the agent can name what is understood and which gaps could change the
answer or proposal. If nothing substantive is accessible, request the minimum
source or access needed before proceeding.

## Deepen

When context gaps remain, invoke `$requirements-grill` with explicit
`mode: source-inquiry`, following its
[source-inquiry route](../requirements-grill/phases/router.md#source-inquiry).
Supply:

- the topic and supplied source scope;
- the reconstructed context and its evidence anchors;
- each ambiguity, contradiction, or missing fact that could change the
  answer or proposal, and why it matters.

This is an internal inquiry: the agent formulates questions and executes
queries against Granola and the scoped material. It resolves its own
understanding before answering the user. Query results
can open further dependent questions; let the inquiry follow them.

Merge the returned findings, source limitations, contradictions, and remaining
unknowns into the context. If query tools are unavailable, use readable
attachments and carry the unsearchable gaps forward explicitly. The context
is ready when every material gap has supporting evidence or is explicitly
unresolved after the available relevant sources have been checked. A new
product decision remains open for the user's discussion.

## Propose

For default delivery or an explicit brainstorm request, invoke `$brainstorm`
with explicit `mode: chat-only`, using its
[delivery contract](../brainstorm/SKILL.md#delivery). Supply the bounded topic,
operators, evidence, stated preferences, historical decisions, rejected
alternatives and their reasons, contradictions, and remaining unknowns.

Present its complete proposal turn in chat. Carry source anchors into the
proposal and place uncertainties beside the claims they affect. Historical
choices are evidence about the conversation; the user can revise them.
Proposed defaults remain proposals until the user steers.

For this proposal path, completion requires the source inquiry to be
unnecessary, complete, or
explicitly limited, and the brainstorm to contain its shape, alternatives,
evidence, open forks, view, and invitation to react. Stop there. The user's
next direction chooses further discussion, more research, requirements
discovery, or another path; it does not follow automatically from the
generated proposal.
