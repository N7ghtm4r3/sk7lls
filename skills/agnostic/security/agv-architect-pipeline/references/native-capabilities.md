# Native capabilities

Use this map during design and implementation. Verify task names against the repository's plugin versions and applied projects; this reference does not authorize execution during discovery.

## Ownership

| Responsibility | Native owner | Selection rule |
| --- | --- | --- |
| Build and validation | Gradle wrapper and applied build plugins | Select their existing `build`, `check`, or target-specific tasks; confirm platform and toolchain requirements. |
| Effective version | Axion `currentVersion`, `scmVersion.version` | Configure the extension before reading its version and bind publication coordinates to that value. |
| Local release preparation | Axion `createRelease` | Use local-only behavior when preparing tags without remote authority; inspect configured hooks and check semantics. |
| Remote Git tags | Axion `pushRelease` or `release` | Select a deliberate push boundary; use tags-only configuration where commits must remain local. |
| Maven publication | Vanniktech publication/signing tasks | Use `publishAndReleaseToMavenCentral` for automatic Central publication when supported, or its documented equivalent. |
| GitHub state and releases | `gh api`, `gh release view`, `gh release create` | Request structured fields; verify the intended repository, tag, and commit. |
| Parallelism and gates | GitHub Actions | Express scheduling in jobs instead of background shell processes. |

Use fully qualified Gradle paths. `:build` selects the root project's task; `:library:build` selects that subproject; unqualified `build` can select matching tasks throughout the hierarchy. Verify the same distinction for release and publication tasks before using an aggregate selector. Follow the [Gradle CLI reference](https://docs.gradle.org/current/userguide/command_line_interface.html), using the wrapper's documentation version.

## Axion versions and tags

Read the official [task contract](https://axion-release-plugin.readthedocs.io/en/latest/configuration/tasks/), [version configuration](https://axion-release-plugin.readthedocs.io/en/latest/configuration/version/), and [CI integration](https://axion-release-plugin.readthedocs.io/en/latest/configuration/ci_servers/); inspect the corresponding release source when output or skip behavior is unclear.

- Give Axion the intended revision, branch context, and tag history in each checkout. A fresh runner must resolve the same release identity; recomputing after concurrent remote changes is not a substitute for preserving it.
- Test an unchanged prerelease crossing into the stable branch. Branch configuration alone may not trigger a new release when Axion detects no change. If a supported force option is necessary, scope it to the intended transition/project and verify the resulting version; never enable force globally to hide this case.
- Distinguish local preparation from remote tag push. Keep release checks enabled unless a specific check is incompatible with the established CI contract and an equivalent guard is documented.
- Prefer native GitHub outputs when they cover the operation. Verify their shape and presence for unchanged/skipped releases and shared versus distinct versions. Otherwise read the needed project's `currentVersion -q -Prelease.quiet`; do not parse ordinary Gradle logs or invent a reporting task.

## Publication and GitHub release state

Follow the [Vanniktech Central documentation](https://vanniktech.github.io/gradle-maven-publish-plugin/central/) at the installed version. Select the native task and deployment-validation setting that satisfy the promised destination state. Upload accepted, validated, published, and available for download are distinct states; delegate supported waiting to the plugin instead of writing a polling loop.

Before publishing, establish the effective version and expected tag commit. A tag-ownership check can use the [GitHub commit endpoint](https://docs.github.com/en/rest/commits/commits#get-a-commit) through the CLI:

```bash
gh api "repos/$GITHUB_REPOSITORY/commits/tags/$TAG" --jq .sha
```

Validate or encode refs as required by the endpoint. Resolve the commit rather than comparing a Git ref's object SHA, which may identify an annotated tag object. This check proves tag-to-commit identity only: it does not establish whether Maven coordinates are already published or whether a rerun is safe.

Create GitHub releases with [`gh release create`](https://cli.github.com/manual/gh_release_create) and `--verify-tag` when Axion owns tags. Set prerelease/latest behavior explicitly to match the release policy. Use its supported note-generation or notes-file options; keep formatting separate from release mutation. A `gh release view` result describes GitHub state, not Central state. Authentication, network, and server errors must not be treated as absence or successful recovery.

Prefer supported destination checks and recovery operations. If the required resume behavior has no verified native support, fail closed with a documented manual reconciliation path. Preserve published coordinates and tags; a deleted run or release does not reset other destinations. Keep automated retries bounded by the agreed identity and state checks.

## Credentials and storage

Apply the audit skill's rules to every path below. Use names only in configuration reports.

- Pass Central credentials and signing material through Vanniktech's documented environment properties at the publishing step: `ORG_GRADLE_PROJECT_mavenCentralUsername`, `ORG_GRADLE_PROJECT_mavenCentralPassword`, `ORG_GRADLE_PROJECT_signingInMemoryKey`, and the applicable key ID/password properties. Use in-memory signing; do not create a keyring or secret-bearing `gradle.properties`.
- Give `gh` a step-scoped `GH_TOKEN` with the minimum repository capability. Separate Git tag write authority from Maven credentials and signing identity.
- Use Axion's supported credential provider. When an environment-to-DSL binding is required, configure the provider directly instead of a custom task. Verify [Axion authentication](https://axion-release-plugin.readthedocs.io/en/latest/configuration/authorization/) for the installed version; do not assume GitHub CLI authentication configures Axion's Git implementation.
- Keep checkout credential persistence disabled unless an explicitly reviewed path requires it. Avoid secret-bearing command arguments, token URLs, logs, outputs, artifacts, and generated files.
- Inspect setup-action cache defaults as well as dependency, build, and configuration caches. Prevent credentials or tainted outputs from being saved/restored. Disabling an Actions cache does not disable Gradle's own caches; when needed, use supported setup-action inputs and Gradle's `--no-configuration-cache`, `--no-build-cache`, and `--no-daemon` options for the relevant jobs.

If documentation runs with deployment credentials, review its configuration, plugins, and build hooks as executable code. An earlier successful documentation build does not isolate a later credential-bearing rebuild.
