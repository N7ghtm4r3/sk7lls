---
name: sgranola
description: Read Granola material and grill its sources internally to develop an idea. Use sgranola go deep to check whether a detail was discussed, represented faithfully, or supported by the current task's sources; return findings in chat.
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

Every run, Go Deep included, deepens the context through this skill's
[Source Inquiry](references/source-inquiry.md): an internal grilling of the
sources. A complete Read does not replace it. Supply:

- the topic and supplied source scope;
- the reconstructed context and its evidence anchors;
- each ambiguity, contradiction, missing fact, or summary-derived claim
  already noticed that could change the answer or proposal, and why it
  matters; the inquiry's design tree finds the rest.

This is an internal inquiry: the agent formulates questions and executes
queries against Granola and the scoped material. It resolves its own
understanding before answering the user. Query results
can open further dependent questions; let the inquiry follow them.

Merge the returned findings, source limitations, contradictions, and remaining
unknowns into the context. If query tools are unavailable or still fail
after the inquiry's retry, use readable attachments and carry the unsearched
gaps forward explicitly; a failed query is a reported limitation, never a
checked source. The context
is ready when every material gap has supporting evidence or is explicitly
unresolved after the available relevant sources have been checked. A new
product decision remains open for the user's discussion.

## Propose

For default delivery or an explicit brainstorm request, use the Frame and
Turn sections of [Brainstorm](../brainstorm/SKILL.md) as a read-only proposal
rubric. Sgranola owns this in-chat synthesis; consulting that reference does
not start the original skill's durable workflow. Use the bounded topic,
operators, evidence, stated preferences, historical decisions, rejected
alternatives and their reasons, contradictions, and remaining unknowns. The
inquiry's open questions become the proposal's forks, each with a default.

Present its complete proposal turn in chat. Carry source anchors into the
proposal and place uncertainties beside the claims they affect. Historical
choices are evidence about the conversation; the user can revise them.
Proposed defaults remain proposals until the user steers.

For this proposal path, completion requires the source inquiry to be
complete or explicitly limited, and the proposal to contain its shape,
alternatives,
evidence, open forks, view, and invitation to react. Stop there. The user's
next direction chooses further discussion, more research, requirements
discovery, or another path; it does not follow automatically from the
generated proposal. When the user chooses a brainstorm or a grilling
together, the inquiry's open questions are its starting input.

Sgranola's inquiry and proposal contracts live in this skill. Original skills
are read-only references; invoking their full workflows is a separate next
step chosen by the user, under their existing contracts.
