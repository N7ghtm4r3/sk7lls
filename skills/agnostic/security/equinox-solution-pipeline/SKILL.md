---
name: equinox-solution-pipeline
description: Design, implement, or review the Equinox Compose Multiplatform application release pipeline on GitHub Actions, using the established Axion, Gradle Play Publisher, Apple Actions, JReleaser, and Vercel flow for Android, iOS, desktop, and web.
---

# Equinox Solution Pipeline

Use the application release contract established in LSync as this skill's profile. Re-read the target repository's workflows, Gradle configuration, release guide, and publisher configuration before changing them. Preserve installed versions and resolve actual module paths, schemes, package names, and artifact locations from the repository.

## Reference and specialization

Read [agv-architect-pipeline](../agv-architect-pipeline/SKILL.md) as the base reference. Apply its discovery, native ownership, version analysis, simplification, validation, and security review, including its referenced skills. Keep those shared instructions there rather than duplicating them here.

This application profile specializes the base in three places:

- Publish application packages through the target owners below. Vanniktech applies only to an actual Maven publication already in scope.
- Treat the GitHub release as the desktop destination, parallel with the other publishers. It is not the final gate after every destination; the workflow run records overall success.
- Allow the directly required publisher configuration, including JReleaser and Vercel files and minimal native Gradle plugin/signing configuration. Preserve the base boundary against executable helpers, custom Gradle tasks, production/test changes, and unrelated toolchain upgrades.

Read [references/vercel.md](references/vercel.md) when designing, implementing, or explaining the Web publisher or its activation.

## Established release flow

Preserve these choices when working on this pipeline. For another repository, reconcile them with its existing release contract instead of silently overwriting that contract.

| Trigger | Channel | Android | iOS | Desktop | Web |
| --- | --- | --- | --- | --- | --- |
| Push to `develop` | Axion RC | Play internal | TestFlight upload and processing | GitHub prerelease | Vercel Preview |
| Push to `main` | Axion stable | Play production | App Store Connect upload and processing | GitHub release | Vercel Production |

Keep PR CI separate, read-only, and without release secrets. One push entry workflow supplies the shared mobile build counter and serial release queue; staging and production wrappers select the channel and reuse the common workflow. Do not use the counter as the semantic version authority: Axion owns versions and tags.

The release graph is: prepare identity, then required tests, then all required packages, then native JReleaser dry run, then publish the Axion tag, then independent target publishers in parallel. In the established job structure every publisher uses `needs: [prepare, tag]`; the tag job carries the full test/package/preflight barrier. Do not make Web depend on iOS or serialize independent publishers.

Both channels require passing tests. Use the existing native and Parikshan tasks and target/class matrices; retain genuine product failures. Matrix fail-fast and release cancellation must not interrupt sibling work that may already have published.

## Native target owners

| Target | Build/package owner | Publication owner and terminal state |
| --- | --- | --- |
| Android | Android Gradle plugin, signed release AAB | Gradle Play Publisher consumes the stored AAB with its native artifact-directory option; configured internal/production track, duplicate/conflict errors preserved. |
| iOS | Native Xcode archive/export and Apple signing/provisioning actions | `Apple-Actions/upload-testflight-build` consumes the stored IPA and waits for processing. Upload/processing does not submit App Store review or make the app publicly available. |
| Desktop | Compose Gradle packaging tasks on the required OS runners | JReleaser publishes DEB, MSI, and DMG assets and generated notes to GitHub. Signing/notarization needs its own established contract. |
| Web | Kotlin/Gradle browser distribution task | Vercel CLI deploys the stored distribution through the Build Output API; see the Web reference. |

Use native task/action/CLI APIs at the repository's pinned versions. The established iOS packaging owner is Xcode; do not replace it with an additional Gradle wrapper plugin merely to make every target look alike. The JReleaser dry run validates its own configuration and artifacts, not every destination's credentials or eventual success.

## Identity, artifacts, and notes

Freeze the source SHA, branch/channel, Axion version and tag, run identity, mobile build number, and changelog baseline before packaging. Preserve detached-checkout branch context and tag ownership checks. A rerun must retain the same identity and bytes.

Keep the established seven-day retention for release identity, distributables, and test reports. Download packages from the same run with native digest verification. Publish the stored packages without rebuilding, renumbering, or restoring signing files/workspaces from artifacts.

Axion prepares the tag locally before tests and pushes it only after the release barrier. Configure JReleaser to use that existing tag rather than creating another. Generate notes with its conventional-commits changelog, including uncategorized commits: RCs compare to the previous RC in the same cycle or the previous stable; stable releases compare to the previous stable. Preserve the frozen baseline and avoid a generated changelog commit.

## Failure and recovery

Keep one non-cancelling release queue for shared version/tag state. A failed RC permits later RCs. An incomplete production run that reached tag publication blocks a later production release until reconciled; a failure before that boundary can be addressed by a new push. This does not make failing staging tests optional.

Recovery uses **Re-run failed jobs** on the original run while its artifacts exist. Reject missing/expired artifacts, a tag pointing to another commit, or a retry superseded on the same channel. Reconcile an upload accepted by a destination before retrying a job that subsequently failed. Do not implement automatic rollback, duplicate-success heuristics, or a custom resume engine.

## Validate and report

Use the base skill's static checks and final review. For a publisher-only change, compare the parsed workflow graph to confirm unrelated jobs, the release barrier, parallel publishers, and artifact retention remain intact. Verify native command flags without performing a real deployment merely as a check.

Report the changed target, checks actually performed, remaining activation configuration, and which destination states were not exercised. Keep implementation separate from external activation; creating accounts/projects, granting access, configuring secrets/domains, or publishing remotely requires authorization for that action.
