---
name: agv-architect-pipeline
description: Design or implement GitHub Actions pipelines for Gradle projects using Axion versioning, Vanniktech Maven Publish, and GitHub CLI. Use for single-module or multimodule build gates, release channels, publication, and optional documentation deployment with native tasks and minimal Gradle configuration.
---

# AGV Architect Pipeline

Compose GitHub Actions, Gradle, Axion, Vanniktech, and `gh` around the repository's release contract. Keep orchestration visible in workflows and release behavior in supported plugin APIs.

## Compose the required skills

Resolve these skills through the available skill catalog and read their full instructions before designing the pipeline:

- `$architect-pipeline` owns discovery, the stage graph, release identity, failure and recovery decisions, and delivery. Apply its security baseline.
- `$audit-cicd-security` owns security criteria and the final read-only audit. Read its full GitHub Actions reference relative to that skill's directory.
- `$simplify` reviews the design before implementation and the changed configuration before the final audit.

Report a missing dependency instead of claiming its criteria were applied.

This specialization replaces two generic `architect-pipeline` defaults: Axion owns version calculation instead of workflow run numbers or version substitutions; the editing boundary includes the minimal Gradle configuration described below. Its permission and external-action boundaries still apply. Reuse authorization already given for the current task; pipeline implementation does not itself authorize remote publication or settings changes.

## Editing boundary

Change workflows, directly relevant pipeline documentation, and only the Gradle configuration needed to connect the selected plugins:

- Apply/configure Axion and Vanniktech through their public DSL and existing plugin-management or catalog conventions.
- Bind project and publication versions to Axion. Configure tag namespaces, release branches, native incrementers, signing, publication targets, and environment-backed credential providers as needed.
- A small callback at a documented plugin extension point is configuration when it composes the plugin's version APIs; it must not become another versioning implementation.

Use tasks supplied by Gradle or the applied plugins. Do not add custom tasks, task actions, release hooks, task-graph rewiring, convention plugins, `buildSrc`, init scripts, helper scripts, or local actions to implement the pipeline. Preserve unrelated existing build logic. Production code, tests, application dependencies, lockfiles, and toolchain upgrades remain outside scope. Keep secrets out of Gradle files.

The same boundary applies to generated or temporary helpers: keep necessary glue directly in workflow steps, without writing executable scripts elsewhere. Temporary non-secret data such as release notes belongs in runner temporary storage. If the requested behavior cannot fit this boundary, identify the unsupported requirement and propose a native alternative.

## Workflow

### 1. Discover the release shape

Establish whether the request is design, implementation, or both. Follow `architect-pipeline` discovery without executing repository-controlled code. Identify the wrapper and plugin versions, native task owners, required artifacts and consumers, publication coordinates, branch/tag history, versions already published to Central, internal dependencies, runners, existing workflows, and documentation commands if relevant.

When investigating a reported failure, identify its run, attempt, job, commit, and workflow revision before comparing it with current code. Check live job and step states; pasted logs from an earlier run do not establish a regression in a later commit. Separate queue time, setup, task execution, and remote publication waiting when explaining duration.

Classify the project by what is released, not directory count. A publication unit is a Gradle project released under one version; its platform variants do not make it multimodule:

- **Single module:** one publication unit and one version authority. Use direct jobs and explicit task paths; no module matrix or aggregate release identity is needed.
- **Multimodule:** several publication units. Read [references/multimodule.md](references/multimodule.md) before choosing shared or independent versions and execution boundaries.

Read [references/native-capabilities.md](references/native-capabilities.md) and verify the required APIs against official documentation or source for the installed versions. Preserve those versions unless an upgrade is separately requested.

Done when every publication unit has a known task owner, version source, target, and dependency relationship, and the allowed file set is explicit.

### 2. Design and simplify

Draw the job graph and resolve the decisions required by `architect-pipeline`. Name the stable/prerelease branches, tag grammar, release intent, notes source, retry policy, artifact strategy, and success condition at each destination. Use Axion's branch configuration for channel rules. Preserve established conventions; do not import branch names, module names, initial versions, runners, or documentation tooling from another repository.

Before introducing or changing versioning, or reconciling existing release history, present a compact table in chat. For each publication unit, show the latest published stable and prerelease versions, the relevant Git tag or next-version marker and commit, and what the pipeline would produce on its configured prerelease and stable branches. Distinguish transient build `-SNAPSHOT` values from publication versions; identify branch/history assumptions and values inferred rather than exercised. Mark unavailable registry evidence as unknown.

Explain discrepancies and show the exact proposed version or marker changes and the subsequent progression. Wait for confirmation of this concrete plan before applying versioning changes or realignment; reuse confirmation already given for the same plan. This is a chat checkpoint, not an additional pipeline approval job. Use the native marker guidance in the reference for an approved realignment.

Keep the build barrier explicit: all required validations must succeed before remote tags, publication, or deployment. When documentation is requested, model its build and deployment separately, including its branch restriction and whether its build blocks release. Optional or skipped jobs need conditions that distinguish an intentional skip from failure or cancellation.

Place GitHub release creation after successful required publications. Gate documentation deployment on its agreed release/publication prerequisites and designated branch.

Choose whether publication consumes the validated artifacts or rebuilds through native tasks. A rebuild must use the same source revision and effective release versions; describe it as a rebuild, not immutable promotion. Establish the intended versions before packaging and verify project, POM, Gradle metadata, and internal dependency consistency.

Apply `$simplify` to the proposed graph and responsibilities. Prefer one direct command over an abstraction, native job conditions over shell orchestration, and one authoritative value over duplicated state. Every proposed custom block must name a verified native capability gap.

Done when the graph covers failure, cancellation, partial publication, and retry behavior, the version analysis and its confirmation status are explicit, and the design review leaves only necessary jobs, outputs, and glue.

For design-only requests, continue directly to the architecture-only security review and handoff in step 5.

### 3. Implement with native ownership

Implement the ownership map in the native-capabilities reference. Keep job dependencies, conditions, parallelism, concurrency, permissions, environments, and secret forwarding in GitHub Actions. Use an existing documentation tool's own commands when documentation is in scope. Inspect transitive task actions and existing hooks to ensure invoked commands respect the editing boundary.

Keep inline shell limited to invoking commands, validating inputs, comparing returned state, and formatting non-secret outputs. Prefer native machine-readable outputs and `gh --json`/`--jq` where supported. Keep mutation steps separate from version summaries or release-note formatting. A loop may repeat an unavoidable native command over publication units; it must not implement version arithmetic, change detection, an upload protocol, or a retry engine.

Serialize operations that share tag/version state. Parallelize independent build or publication units through the job graph. Prevent concurrency cancellation and matrix fail-fast from interrupting sibling publications that may already have changed remote state. A failed required operation must still block overall success and downstream release/deployment.

Done when each changed Gradle statement is plugin configuration, each invoked task has a native owner, and every inline block has a stated purpose not already covered by a native capability.

### 4. Simplify and validate the implementation

Apply `$simplify` to the changed workflows and allowed Gradle configuration. Remove redundant outputs, repeated discovery, speculative abstractions, and custom replacements for native commands. Preserve gates, credential scope, release identity, and failure semantics. A reusable workflow is justified by real repetition or an execution/permission boundary; a single module does not need one by default.

Run non-executing YAML/schema, workflow, and inline-shell checks available for the changed files. Check the applicable cases: first release, stable and prerelease, unchanged input, channel transition, dependency failure, cancellation, retry, partial publication, and deliberately skipped documentation. Include detached checkouts, namespaced annotated tags, a cold wrapper download, and failed version commands when those paths are used. Add multimodule cases from its reference only when applicable.

Gradle configuration, task listing, and `--dry-run` execute build logic. Treat them as execution rather than static inspection; run repository commands only under the authorization and execution rules of the active mode. Do not create or push tags, publish artifacts, or deploy merely to validate configuration.

Done when relevant checks pass or their limitations are recorded, and the diff contains only permitted changes with no executable helpers or custom tasks introduced.

### 5. Audit and hand off

Apply `$audit-cicd-security` to the final configuration in read-only mode, including transitive build/plugin and documentation execution paths. Produce its required verdict, evidence-backed findings, transfer matrix, credential-to-storage trace, and patch proposals. Keep unknown remote protections or secret scopes explicitly unknown. Follow its approval rules for remediation, then repeat affected static checks and review any authorized fixes.

State the attacker capabilities and accepted trust assumptions used for the verdict. Distinguish fork contributors, internal writers, and administrators; repository-level secrets or absent protected environments alone do not establish an exploitable path. Show which actor can reach which credential under the actual triggers and permissions. Where the user explicitly trusts internal writers, describe environment restrictions as additional protection unless another verified requirement makes them necessary; retain residual risk and any difference from the audit's baseline threat model.

Pay particular attention to Gradle execution with publishing/signing credentials and write tokens, checkout credential persistence, Actions caches, Gradle user-home/build/configuration caches, and artifact transfers. Step-scoped secrets remain accessible to all build logic running in that step. A cache default or official action is not evidence that the trust path is safe; when safe reuse cannot be established, disable that reuse. Record any explicit security exception narrowly, including its residual risk; do not carry exceptions from another task.

For architecture-only requests, apply these criteria to the proposed graph and report implementation-dependent checks as pending; do not invent file/line findings or claim an implemented pipeline was audited.

Report the release shape, changed files, native commands, justified glue, completed simplification passes, security outcome, checks, external setup, and recovery procedure. State which behavior was inspected, statically checked, or actually exercised. For observed runs, distinguish a successful job, a skipped publication step, and a confirmed registry publication; keep in-progress or unverified outcomes explicit.

Done when the requested design or implementation is reviewable, every scoped change is accounted for, and no unverified deployment or security property is presented as established.
