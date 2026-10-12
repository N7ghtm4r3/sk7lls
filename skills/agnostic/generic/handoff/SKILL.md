---
name: handoff
description: Compact the current work into a portable English handoff and continuation prompt for another agent or environment, preserving evidence, scope, and remaining work.
---

# Handoff

Write a compact handoff and a self-contained continuation prompt in English,
even when the conversation uses another language, unless the user explicitly
requests a different artifact language. Preserve exact identifiers, commands,
and quotations when their original spelling matters.
Tailor the next action to the user's requested receiving task.

The handoff must work for a receiving agent on a different machine or checkout.
Keep the actual task and its constraints specific; portability does not mean
replacing useful project context with a generic summary. Do not assume shared
conversation history, local files, installed skills, or running processes.

## Preserve the continuation contract

Retain only what the receiving task needs:

- the objective, expected outcome, scope, user decisions, and authorization limits;
- completed changes and verified findings, distinguished from user reports and inferences;
- remaining work, blockers, explicit unknowns, and unconfirmed actions;
- decisive evidence and the relevant plans, issues, commits, diffs, or artifacts;
- a concrete next action, or the exact missing evidence needed to choose one.

Reference large artifacts rather than copying their bodies, but retain enough
decisive facts for the handoff to remain useful if optional local evidence is
unavailable. Include only relevant skill pointers and summarize any essential
constraint that would otherwise exist solely in an unavailable skill. Redact
secrets and unnecessary personal data.

## Use portable context pointers

Identify a repository by its canonical URL or other stable project identity,
the relevant branch and commit when known, and repository-relative file paths.
Use stable document IDs or accessible URLs for non-repository artifacts. If an
identity or revision is unknown, say so rather than inventing it. For each
required pointer, state what it proves and what must be rechecked for freshness.

Do not use source-machine absolute paths, usernames, home directories, temporary
directories, process IDs, ports, or localhost URLs as authoritative references
or receiving-environment instructions. If relevant, label them as historical
session observations. Give the receiver a discovery instruction based on the
project's configuration and contracts instead of assuming those values persist.
Describe a command's working directory relative to the discovered project root.

For required evidence or uncommitted changes available only locally, identify
the artifact, summarize its relevant content, and state exactly what must be
transferred or recovered. Never imply that another machine can access it or
that committed work has been pushed when that has not been verified.

## Save and deliver

Honor the agreed destination; otherwise save in a unique directory under the
current operating system's temporary directory, outside the workspace. The
save location is a delivery detail, not a dependency of the handoff's content.
Disclose temporary retention and never overwrite another session's artifacts.

Before delivering, check that the receiver can locate the project, distinguish
completed work from pending work, identify missing transfers, and take the next
action without assuming the source machine's state. Runtime observations must
be revalidated, and prior authorization remains subject to the receiving task's
current scope and permissions.

Return the actual absolute save path for the current user and the English
continuation prompt. The user-facing explanation may use the user's language.
