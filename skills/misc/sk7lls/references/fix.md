# Evidence-based correction

Use the conversation as the starting evidence for correcting the selected skill. Follow the parent workflow's `readonly` and `writing-for-agents` requirements throughout diagnosis and proposal.

## Identify the target and failure

1. Resolve the named skill or path, or the single target established in the conversation. Ask a focused question if several targets remain plausible. Read its actual `SKILL.md`, invocation metadata, and the references or scripts implicated by the evidence. Reading the target is inspection, not invocation of its workflow.
2. Gather relevant user reports, agent observations, tool outputs, examples, and expected behavior already present or explicitly referenced in chat. Reuse accessible evidence instead of asking the user to repeat it. Attribute each claim: distinguish a user-reported outcome, an observed tool result, and an agent's hypothesis. An earlier agent conclusion is not independent confirmation. If a referenced artifact is inaccessible, identify the missing evidence without inventing its contents.
3. Establish the triggering request, expected behavior, observed behavior, and the skill version or instruction implicated when known. Compare the selected local installation and canonical source as required by the parent workflow. Evidence from an older version may explain a failure already corrected in the current source; account for that before proposing another edit.
4. Locate the instruction, context pointer, dependency, or completion criterion that explains the mismatch. Distinguish a skill defect from an agent ignoring clear instructions or an environment lacking a required capability. Use read-only inspection to resolve conflicting evidence where possible. If a material uncertainty prevents a supported correction, explain it and request the specific missing fact. If the existing skill already covers the behavior and no gap is supported, report a no-change result.

Diagnosis is complete when the correction has a traceable basis in the available evidence and a specific expected behavior, or when the reason no change can be justified is clear. Live reproduction is optional and must stay within `readonly`; proposing a correction does not require claiming the failure was reproduced.

## Propose the correction

Make the smallest coherent change that addresses the supported cause. Refine the authoritative instruction or pointer where it lives; use `writing-for-agents` to remove ambiguity, duplication, and misplaced reference. Preserve the skill's identity, invocation mode, supported use cases, and unrelated behavior unless the requested correction specifically changes them. Keep lessons reusable rather than embedding a private incident transcript or accumulating rules for hypothetical failures.

For every proposed change, connect the reported or observed evidence to the instruction gap, the edit, and the expected behavioral difference. Make residual uncertainty visible. Present the exact diff and complete resulting changed files through the parent workflow's approval step; keep unchanged support files intact. A proposed source fix must also explain how the selected local installation will receive it.

When a dry run is requested, carry the reported failing scenario and the expected behavior into [Dry run](dry-run.md). Otherwise return to the parent's destination and approval steps without running the target skill.
