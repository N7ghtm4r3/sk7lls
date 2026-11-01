# Native capabilities

Use this map during design and implementation. Verify task names against the repository's plugin versions and applied projects; this reference does not authorize execution during discovery.

## Ownership

| Responsibility | Native owner | Selection rule |
| --- | --- | --- |
| Build and validation | Gradle wrapper and applied build plugins | Select their existing `build`, `check`, or target-specific tasks; confirm platform and toolchain requirements. |
| Effective version | Axion `currentVersion`, `scmVersion.version` | Configure the extension before reading its version and bind publication coordinates to that value. |
| Approved next-version realignment | Axion `markNextVersion` | Set the confirmed version through `release.version`; distinguish creating a local marker from pushing it. |
| Local release preparation | Axion `createRelease` | Use local-only behavior when preparing tags without remote authority; inspect configured hooks and check semantics. |
| Remote Git tags | Axion `pushRelease` or `release` | Select a deliberate push boundary; use tags-only configuration where commits must remain local. |
| Maven publication | Vanniktech publication/signing tasks | Use `publishAndReleaseToMavenCentral` for automatic Central publication when supported, or its documented equivalent. |
| GitHub state and releases | `gh api`, `gh release view`, `gh release create` | Request structured fields; verify the intended repository, tag, and commit. |
| Parallelism and gates | GitHub Actions | Express scheduling in jobs instead of background shell processes. |

Use fully qualified Gradle paths. `:build` selects the root project's task; `:library:build` selects that subproject; unqualified `build` can select matching tasks throughout the hierarchy. Verify the same distinction for release and publication tasks before using an aggregate selector. Follow the [Gradle CLI reference](https://docs.gradle.org/current/userguide/command_line_interface.html), using the wrapper's documentation version.

## Required build artifacts

Before changing caches or excluding slow/failing tasks, match the task graph to the artifacts consumers actually require. Use task-level timing to distinguish compilation from native linking. Preserve the agreed cache and credential boundaries while addressing unnecessary work.

- For Kotlin Multiplatform Maven libraries, native targets produce `.klib` dependencies. Explicit `binaries.framework` declarations add final binaries for direct Swift/Objective-C consumption, often with debug and release linking. They are not required merely to publish the native Maven variants. Removing unused framework declarations preserves those targets but removes standalone framework production and its linking coverage. Verify whether consumers need that deliverable. See [Kotlin native binaries](https://kotlinlang.org/docs/multiplatform/multiplatform-build-native-binaries.html).
- For JVM libraries, `java-library` does not cancel the executable packaging added by the Spring Boot plugin. A failing `bootJar` can indicate application packaging applied to a library. Propose the appropriate native plugin configuration, preserving required BOM/dependency management, rather than automatically excluding `bootJar`. See [Spring Boot packaging](https://docs.spring.io/spring-boot/gradle-plugin/packaging.html).

Changes to binary declarations or application plugins exceed the default Axion/Vanniktech wiring boundary. Explain the concrete change and lost deliverable or coverage, and apply it only when the user's authorization covers it. Verify the resulting native task graph and publication artifacts under the applicable execution rules; retain required build and test gates.

## Axion versions and tags

Read the official [task contract](https://axion-release-plugin.readthedocs.io/en/latest/configuration/tasks/), [version configuration](https://axion-release-plugin.readthedocs.io/en/latest/configuration/version/), and [CI integration](https://axion-release-plugin.readthedocs.io/en/latest/configuration/ci_servers/); inspect the corresponding release source when output or skip behavior is unclear.

- Give Axion the intended revision, branch context, and tag history in each checkout. A SHA checkout can leave Git on detached `HEAD` even during a branch push. Preserve the immutable checkout and, when supported by the installed version, pass `-Prelease.overriddenBranchName="$GITHUB_REF_NAME"` consistently to version, build, tagging, and publication commands for a validated branch-push event. Derive the branch appropriately for other events. Verify branch restrictions actually allow tag creation; a successful task invocation may contain skipped release tasks. A fresh runner must resolve the same release identity; recomputing after concurrent remote changes is not a substitute for preserving it.
- Test an unchanged prerelease crossing into the stable branch. Branch configuration alone may not trigger a new release when Axion detects no change. If a supported force option is necessary, scope it to the intended transition/project and verify the resulting version; never enable force globally to hide this case.
- Distinguish local preparation from remote tag push. Keep release checks enabled unless a specific check is incompatible with the established CI contract and an equivalent guard is documented.
- Prefer native GitHub outputs when they cover the operation. Verify the producing task, output shape, and presence for unchanged/skipped releases and shared versus distinct versions. Outputs documented for `release` or `publish` are not automatically available from `currentVersion`, `createRelease`, or `pushRelease`. Keep version inspection free of publication side effects.

### Read a version in CI

When the selected native operation has no suitable structured output, use the needed project's `currentVersion -q -Prelease.quiet --console=plain`. Quiet mode does not suppress the wrapper's first download progress or bootstrap messages. Capture the explicit version response separately from those diagnostics; never append the whole captured stdout to `GITHUB_OUTPUT`.

If the installed task's verified contract places the version on its final line, `tee /dev/stderr | tail -n 1` can preserve diagnostics while selecting that line. Use Bash with `pipefail` so a failed Gradle command cannot be hidden by the filter. Validate the entire selected value against the agreed publication grammar, including rejecting `-SNAPSHOT` when publishing releases, then write one `printf 'version=%s\n' "$version"` record to `GITHUB_OUTPUT`. Do not search arbitrary build logs for a version-looking substring or create a reporting task.

Verify cold and already-installed wrapper cases, stable and prerelease values, malformed output, and command failure using the real step where execution is authorized. A cached local wrapper does not validate bootstrap behavior; static checks alone cannot establish the runtime output contract.

### Apply a confirmed next-version plan

Follow the chat analysis and confirmation in the main skill before changing version policy or markers. For an approved one-time realignment, use the project's native [`markNextVersion`](https://axion-release-plugin.readthedocs.io/en/latest/configuration/next_version/) task with `-Prelease.version=<confirmed-version>`. Use `-Prelease.localOnly` when only local changes are authorized; the task can otherwise push. Verify the marker and subsequent `currentVersion` result. A marker's configurable suffix (normally `-alpha`) identifies planning state, not an additional Maven publication.

Explain when the marker must reach the remote for CI to see it. Its chosen next version is consumed by the normal Axion release flow; later increments follow the configured policy. Do not turn a one-time adjustment into a permanent override or a workflow-run counter. A new stable/prerelease cycle depends on the configured branch policy and visibility of the stable tag in the relevant history.

## Publication and GitHub release state

Follow the [Vanniktech Central documentation](https://vanniktech.github.io/gradle-maven-publish-plugin/central/) at the installed version. Select the native task and deployment-validation setting that satisfy the promised destination state. Upload accepted, validated, published, and available for download are distinct states; delegate supported waiting to the plugin instead of writing a polling loop.

Before publishing, establish the effective version and expected tag commit. A tag-ownership check can use the [GitHub commit endpoint](https://docs.github.com/en/rest/commits/commits#get-a-commit) through the CLI:

```bash
gh api "repos/$GITHUB_REPOSITORY/commits/refs/tags/$TAG" --jq .sha
```

Here `TAG` is the tag name without `refs/tags/`, including any module namespace. Validate or encode refs as required by the endpoint and verify a real namespaced tag. Resolve the commit rather than comparing a Git ref's object SHA, which may identify an annotated tag object. This check proves tag-to-commit identity only: it does not establish whether Maven coordinates are already published or whether a rerun is safe.

Create GitHub releases with [`gh release create`](https://cli.github.com/manual/gh_release_create) and `--verify-tag` when Axion owns tags. Set prerelease/latest behavior explicitly to match the release policy. Use its supported note-generation or notes-file options; keep formatting separate from release mutation. A `gh release view` result describes GitHub state, not Central state. Authentication, network, and server errors must not be treated as absence or successful recovery.

Prefer supported destination checks and recovery operations. If the required resume behavior has no verified native support, fail closed with a documented manual reconciliation path. [Central publication is immutable](https://central.sonatype.org/faq/can-i-change-a-component/), including release-candidate versions. Deleting Git tags, GitHub releases, or workflow runs neither removes those artifacts nor frees their coordinates for reuse. Keep automated retries bounded by the agreed identity and state checks.

## Credentials and storage

Apply the audit skill's rules to every path below. Use names only in configuration reports.

- Pass Central credentials and signing material through Vanniktech's documented environment properties at the publishing step: `ORG_GRADLE_PROJECT_mavenCentralUsername`, `ORG_GRADLE_PROJECT_mavenCentralPassword`, `ORG_GRADLE_PROJECT_signingInMemoryKey`, and the applicable key ID/password properties. Use in-memory signing; do not create a keyring or secret-bearing `gradle.properties`.
- Give `gh` a step-scoped `GH_TOKEN` with the minimum repository capability. Separate Git tag write authority from Maven credentials and signing identity.
- Use Axion's supported credential provider. When an environment-to-DSL binding is required, configure the provider directly instead of a custom task. Verify [Axion authentication](https://axion-release-plugin.readthedocs.io/en/latest/configuration/authorization/) for the installed version; do not assume GitHub CLI authentication configures Axion's Git implementation.
- Keep checkout credential persistence disabled unless an explicitly reviewed path requires it. Avoid secret-bearing command arguments, token URLs, logs, outputs, artifacts, and generated files.
- Inspect setup-action cache defaults as well as dependency, build, and configuration caches. Prevent credentials or tainted outputs from being saved/restored. Disabling an Actions cache does not disable Gradle's own caches; when needed, use supported setup-action inputs and Gradle's `--no-configuration-cache`, `--no-build-cache`, and `--no-daemon` options for the relevant jobs.

If documentation runs with deployment credentials, review its configuration, plugins, and build hooks as executable code. An earlier successful documentation build does not isolate a later credential-bearing rebuild.
