# Go Deep

Load for `sgranola go deep`. Understand the active context well enough to
answer a question or verify a detail: whether it was discussed, whether its
retelling is faithful, or whether the claim is supported. Use Sgranola's same
Read and Deepen mechanism, then answer in chat. A brainstorm follows only
when the user requests one. This mode writes no durable artifacts.

## Establish the Question

Start with the current conversation: the user's active objective, the claim
or detail under discussion, recent corrections, links, and attachments. A
short invocation such as "ciao sgranola go deep" inherits that context.
The repository or open document helps locate evidence; its presence alone
does not replace the conversation's subject.

State the inferred question briefly and investigate it. When no specific
claim is under discussion, reconstruct the relevant context and expose the
gaps or inconsistencies that affect the current topic. If equally plausible
subjects would lead to different research, ask one focused scope question.

## Discover the Context

Use the question's concrete names, actors, and terms to find relevant sources:

- Read supplied or referenced conversations and attachments first, checking
  original passages and surrounding exchanges when available.
- Search accessible Granola conversations for the topic and follow relevant
  meetings or threads, even when none were initially attached. Discover the
  host's actual read and query capabilities before using them.
- Consult relevant project guidance, documentation, code, or contracts when
  the question concerns current behavior or factual correctness.
- Follow references that could resolve the question or change the answer.
  Keep the source scope tied to the active objective.

Pass the scoped sources, existing evidence, and unanswered questions to the
normal source inquiry. It owns the iterative query rounds and their stopping
condition. Broader context sharpens the answer while preserving its scope.

## Check the Claim

Apply the checks relevant to the question:

- **Presence:** locate the detail in the source and identify who said it and
  in what context. An unsuccessful search means it was not found in the
  inspected material; incomplete coverage cannot prove it was never said.
- **Fidelity:** compare the current wording with the original, preserving
  conditions, exceptions, tentative language, and later explicit revisions.
  Identify the precise mismatch when a summary changes the meaning.
- **Correctness:** check the claim against the relevant authoritative
  evidence. A statement in a meeting establishes what was said; it alone
  does not establish that the described behavior or assumption is true.

Keep historical statements, observed behavior, and the agent's inferences
distinct. Preserve conflicting accounts and source limitations.

## Answer

Lead with the finding: what is supported, contradicted, not found in the
checked sources, or still uncertain. Include the decisive passages and source
anchors, the context that changes their meaning, and the coverage limits.
When wording is inaccurate, propose the smallest correction the evidence
supports. For a general context inquiry, give the relevant understanding and
its remaining gaps instead of inventing a claim to judge.

Completion requires each material question to have a supported answer or an
explicit remaining uncertainty after relevant available retrieval paths are
exhausted. Stop with the answer. Further brainstorming or requirements
discovery waits for the user's direction.
