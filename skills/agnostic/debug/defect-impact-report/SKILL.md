---
name: defect-impact-report
description: "Assess defect status, blast radius, or the impact of a targeted fix through read-only inspection. Report evidence in chat."
---

# Defect Impact Report

Analyze the reported defect without changing the repository, its environment, or any external system. Deliver the report in chat and use the language of the message that invoked the skill, unless the user explicitly requests another language.

## Read-only boundary

- Inspect only the artifacts needed to understand the defect: source, configuration, history, existing tests, logs, traces, documentation, and user-provided evidence.
- Use only operations that do not modify files, repository state, dependencies, caches, services, databases, or external systems.
- Do not edit code or configuration, create patches or report files, install dependencies, run formatters or generators, execute migrations, or invoke builds and tests that may write state.
- Do not implement the proposed fix. Describe it conceptually and identify the likely change surface.
- If reliable analysis would require a mutating operation, state the limitation and the exact missing evidence instead of performing it.

## Analysis

Establish the current state from observable evidence. Separate clearly:

- **Observed:** directly supported by inspected artifacts.
- **Inferred:** a reasoned conclusion that is not directly demonstrated.
- **Unknown:** information that cannot be established read-only from the available context.

### Trace the defect

Trace the relevant execution or data path far enough to identify the trigger, affected behavior, likely cause, affected components and consumers, and existing safeguards. Compare actual and expected behavior when the expected behavior is documented or supplied; do not invent requirements.

### Assess the targeted fix

Assess a narrowly scoped fix at the level justified by the evidence. Cover the intended behavioral change, probable files or components involved, direct and indirect consumers, compatibility concerns, data or state implications, security and privacy, performance, operations and observability, and regression risk. Omit dimensions that are genuinely irrelevant.

Treat hypotheses as hypotheses. Include confidence and cite local file paths with line numbers, symbols, commits, logs, or other concrete evidence wherever available.

Finish analysis with an evidence-backed status, the justified change surface, and explicit gaps; unresolved evidence remains unknown rather than a completed diagnosis.

## Report

Make the report as short as possible while remaining actionable. Lead with the conclusion, do not repeat the request, and include only evidence and impacts that could change a decision. Prefer compact bullets, omit irrelevant dimensions and empty sections, and avoid exhaustive tours of files or execution paths.

Use this compact structure when applicable:

1. **Status:** current behavior, likely cause, and confidence.
2. **Evidence:** only the decisive observations and citations.
3. **Fix impact:** expected result, change surface, blast radius, and material risks.
4. **Gaps and validation:** only unresolved points or checks needed before applying the fix.

End with an explicit statement that no files, code, repository state, or external systems were modified. Do not imply that a fix has been verified when no permitted evidence demonstrates it.
