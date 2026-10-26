# Prioritized Analysis

Apply P0-P3 to confirmed findings produced by a PR analysis. A heuristic identifies
a decision to examine; it carries no permanent priority. The same heuristic may
produce different priorities or no finding in different changes.

## Establish a finding before ranking it

For each candidate, identify the applicable heuristic and its conditions, the
code location, supporting evidence, activation conditions, and concrete consequence.
Distinguish observed facts from inferences. Verify the relevant surrounding
contracts before attributing a regression to the PR.

Keep reasonable alternatives and improvements without demonstrated problems under
Suggestions / Tradeoffs. Put missing decisive evidence under Open Questions.
These categories do not receive a forced priority. A mismatch with an architectural
preference, component placement, or naming convention alone is insufficient to
establish a defect or a blocking priority.

## Assign priority from impact and urgency

Consider what happens, the conditions that trigger it, who or what is affected,
the available workaround, and how urgently correction is needed. Give a concise
reason for the assigned priority; avoid numerical scoring that implies unsupported
precision. Keep confidence separate: uncertainty is not a reason to disguise a
potentially serious problem as a low-priority confirmed finding.

| Priority | Meaning | Decision criterion |
| --- | --- | --- |
| P0 - Critical | Immediate intervention | Demonstrated severe, immediate harm such as data loss, compromise, or widespread unavailability. Reserve for clear blockers supported by the available evidence, without speculative triggering assumptions. |
| P1 - High | Correct before integrating or releasing the affected change | A significant regression or unacceptable risk in an important path under realistic, evidenced activation conditions. State the affected users or operation. |
| P2 - Normal | Plan a correction | A concrete but contained problem, or a demonstrated maintenance cost, whose correction can reasonably be scheduled. Explain the consequence and why immediate intervention is unnecessary. |
| P3 - Low | Lower-urgency correction | A substantiated issue with limited impact. Optional polishing or an equally valid design alternative remains a suggestion rather than a P3 finding. |

State material assumptions and applicability limits. Use a focused question or a
conditional risk observation when the evidence does not support a confirmed finding.
Escalation and merge/release decisions remain recommendations; assigning a priority
does not authorize changing code, publishing comments, or taking external action.

## Present the analysis

Start with a short summary of the change and assessment, including confirmed
finding counts by priority when there are findings. Present findings from P0
through P3, ordering equally ranked findings by their concrete impact.

For each finding, provide:

- **Title:** `[P1] Specific actionable finding title`, using the actual priority.
- **Location:** a precise file and relevant lines, linked when the current source
  is accessible. Use a description instead of invented line numbers when needed.
- **Heuristic:** the applicable catalog ID and name.
- **Evidence and consequence:** what the code does, when the issue occurs, and
  why it matters to the affected behavior or maintenance work.
- **Priority rationale:** why that impact and urgency justify this P level.
- **Suggested change:** the smallest coherent correction, described in prose.

Consolidate observations that share one underlying issue and correction rather
than reporting duplicate findings under several heuristics. Keep Suggestions /
Tradeoffs and Open Questions separate and omit empty sections. A useful review
may contain no findings; do not manufacture a P level to fill the report.

Identify the reviewed revision and inspection limits. For a simulated run, label
the input and its assumptions as illustrative. Distinguish reasoning from executed
verification. An absence of findings is limited to the inspected scope and
applicable catalog, rather than a guarantee that the entire PR is correct.
