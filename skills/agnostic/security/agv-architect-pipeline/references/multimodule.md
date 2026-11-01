# Multimodule releases

Read this only when several publication units exist. Discover paths and dependencies from the target repository; directory names, module counts, and a root publication are not defaults.

## Choose the version model

Follow Axion's [single-version and independent-version configuration](https://axion-release-plugin.readthedocs.io/en/latest/configuration/basic_usage/).

| Model | Version authority | Required distinction |
| --- | --- | --- |
| Shared version | One Axion authority, usually the root | Propagate its version consistently; modules need not each create a tag. |
| Independent versions | Axion on each independently released project | Use collision-free tag namespaces and change scopes that include relevant shared build files and dependencies. |

Treat an aggregate GitHub release as a separate decision. It may use the shared version, an explicitly chosen module's version, or its own root Axion identity. If tied to a module, define what happens when other modules change while that module does not. Add an independent root identity only when the aggregate release contract needs one; a root project is not automatically a Maven publication.

For independent versions, inspect Axion's native monorepo include/exclude behavior. Cover changes to shared configuration and the dependencies that affect a module's published contents or metadata. Preserve unchanged versions according to the agreed policy. Keep Maven coordinates, internal project dependencies, POMs, and Gradle module metadata consistent; a workflow path filter is not a substitute for version semantics.

Done when every module has a version authority, tag namespace, change scope, and dependency policy, and the GitHub release identity works when any one module remains unchanged.

## Compose execution

Represent independent build units with a workflow matrix or explicit jobs when runners differ. Use the smallest reusable workflow that removes real repetition. Pass only the secrets required by the invoked phase; validation must not inherit publishing credentials.

Apply the main workflow's build barrier to the complete release set, not separately to each module. For publication matrices, use `fail-fast: false` so an individual failure does not cancel siblings already publishing; retain failure as the overall result.

Inspect native publication task dependencies. If a module must consume another module from the remote registry, model that dependency and its availability gate instead of pretending every publication is independent. Gradle project dependencies may allow independent publication, but verify the generated metadata and task graph before asserting it.

Make every job use the agreed revision and versions. A matrix's single reusable-workflow output is not a dependable map of all module results; choose a supported explicit aggregation or minimal read-only reporting over the known publication units. Distinguish a publication intentionally skipped because it is unchanged from a failure, a missing result, or an incomplete prior attempt.

Create an aggregate GitHub release only after all required publications are confirmed. Recovery must distinguish individual Central outcomes from a failed aggregate release or documentation deployment.

Done when parallelism follows actual independence, the build barrier covers the full release set, and any partial outcome has a known blocking or recovery path.

## Additional validation cases

Check a single changed module, a changed dependency, a shared build-file change, and no module changes. Cover shared versions and independently differing/equal versions as applicable, nested project paths, tag namespace collisions, an unchanged RC promoted to stable, an unchanged module chosen as aggregate identity, and partial parallel publication followed by a rerun. Include a versioning migration where Central already contains prereleases missing from Git history; the chat preview must expose the discrepancy before any realignment.

Done when the chosen model explains each applicable case without forced unrelated version increments, duplicate publication, or production-code changes.
