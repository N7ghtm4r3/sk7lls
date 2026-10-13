---
name: readonly
description: "Inspect a codebase, system, or scenario without changing local or external state, and answer normally."
disable-model-invocation: true
---

# Readonly

Treat this skill as an operating constraint, not as an output format.

## Invocation

Standalone use is explicit-only. Select the actual skill source through the host's documented syntax or an exact file request. `agents/openai.yaml` is an OpenAI adapter; hosts supporting `disable-model-invocation` use the frontmatter policy. If a host cannot enforce explicit-only discovery, use explicit file selection outside automatic discovery and report that setup limitation. A dependent workflow may read these constraints for its named analysis phase; reading them grants no setup or later-write authorization.

## Inspect the scenario

Investigate the real scenario using the available evidence and the minimum relevant read-only inspection. Base conclusions on what is actually observed; distinguish facts, inferences, and unknowns whenever that distinction matters. Do not substitute a generic answer for inspection when the requested evidence is accessible.

## Preserve the state boundary

Do not alter any state. This includes files, source code, configuration, Git state, dependencies, lockfiles, caches, generated artifacts, processes, services, databases, cloud resources, accounts, tickets, messages, browser or application data, and other external systems. Do not create patches or report files. Do not run commands, tests, builds, formatters, generators, package managers, migrations, or application flows unless they are known to be non-mutating in the current environment.

Prefer commands and tools whose operation is inherently read-only. Before using an operation that may have side effects, choose a read-only alternative. If the evidence required for a reliable conclusion can only be obtained by changing state, do not perform that operation: explain the limitation and identify the missing evidence or the mutating verification that would be needed.

## Answer from the available evidence

Respond directly to the user's request using the normal format, language, and level of detail appropriate to that request. Do not impose a fixed report structure and do not produce an artifact unless doing so is itself read-only and the user explicitly requested it. State concisely that no changes were made when that confirmation is useful.
