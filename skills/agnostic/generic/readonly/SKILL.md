---
name: readonly
description: Analyze the actual state of a codebase, system, or scenario using only non-mutating inspection, then answer the user's request normally. Use when the user explicitly invokes $readonly to prohibit all local and external changes during the task.
---

# Readonly

Treat this skill as an operating constraint, not as an output format.

Investigate the real scenario using the available evidence and the minimum relevant read-only inspection. Base conclusions on what is actually observed; distinguish facts, inferences, and unknowns whenever that distinction matters. Do not substitute a generic answer for inspection when the requested evidence is accessible.

Do not alter any state. This includes files, source code, configuration, Git state, dependencies, lockfiles, caches, generated artifacts, processes, services, databases, cloud resources, accounts, tickets, messages, browser or application data, and other external systems. Do not create patches or report files. Do not run commands, tests, builds, formatters, generators, package managers, migrations, or application flows unless they are known to be non-mutating in the current environment.

Prefer commands and tools whose operation is inherently read-only. Before using an operation that may have side effects, choose a read-only alternative. If the evidence required for a reliable conclusion can only be obtained by changing state, do not perform that operation: explain the limitation and identify the missing evidence or the mutating verification that would be needed.

Respond directly to the user's request using the normal format, language, and level of detail appropriate to that request. Do not impose a fixed report structure and do not produce an artifact unless doing so is itself read-only and the user explicitly requested it. State concisely that no changes were made when that confirmation is useful.
