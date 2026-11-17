# Web publication through Vercel

Apply this reference to the Web publisher of the Equinox application pipeline. GitHub Actions owns the release gate; Gradle produces the distribution; Vercel hosts that already-built distribution. Preserve the other targets and their dependencies.

## Deploy the validated artifact

1. Keep the existing tag ownership and superseded-retry guards before publication.
2. Download the same-run Web package with native digest verification directly into `.vercel/output/static`.
3. Write `.vercel/output/config.json` containing `{"version":3}`. The [Build Output API](https://vercel.com/docs/build-output-api) accepts manually prepared output; a second application build is unnecessary.
4. Install the repository's pinned Vercel CLI with a compatible Node runtime. Preserve the minimal native installation; disable npm lifecycle scripts where the selected version supports that installation. Verify the selected CLI's flags and environment-token support rather than assuming every historical version behaves alike.
5. Validate `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`, and `VERCEL_TOKEN` before invoking deployment, then use `vercel deploy --prebuilt --yes --non-interactive --environment "$VERCEL_ENVIRONMENT"`. Use `preview` for staging and `production` for stable. Wait for the native command's completion and preserve its non-zero exit status.

Pass `VERCEL_TOKEN` only in the deployment step's environment. The two IDs are project/team variables and must identify the intended existing project; missing values must not trigger interactive project creation or linking. The Web job needs a read-only GitHub token, not Pages write or OIDC permissions.

Do not run `vercel build` or `vercel pull` just to upload Gradle output. Future channel-specific client values must be provided during the Gradle build; upload metadata cannot change values already compiled into the artifact. Keep credential-bearing CLI state out of artifacts and shared caches.

Native references: [CLI deploy](https://vercel.com/docs/cli/deploy), [global options and environment variables](https://vercel.com/docs/cli/global-options), [output configuration](https://vercel.com/docs/build-output-api/configuration), and [static output](https://vercel.com/docs/build-output-api/primitives).

## Project, Git association, and domains

Distinguish three separate setup decisions when explaining or activating Vercel:

- **Project:** the destination selected by the team/project IDs. A project is required for this pipeline.
- **Git association:** importing/connecting the GitHub repository is optional for CLI uploads. The established profile uses it to associate a fixed Preview domain with `develop`.
- **Deployment trigger:** the pipeline invokes the CLI only after its release gate. Connecting Git must not independently publish pushes outside that gate.

Keep one project for both channels: the staging domain serves Preview deployments from `develop`; the public domain serves Production. Both distributions are served at their own root, without a combined site or `rc/` folder. Preview used for staging is distinct from a named custom environment called `staging`.

For the chosen GitHub-linked project, add the native metadata when the checkout is detached:

```bash
vercel deploy --prebuilt --yes --non-interactive \
  --environment "$VERCEL_ENVIRONMENT" \
  --meta githubDeployment=1 \
  --meta "githubCommitRef=$GITHUB_REF_NAME"
```

The branch must come from the validated release event. These metadata fields describe the deployment; they do not connect a repository or check out another revision. Configure the Preview branch domain on that same project. See [branch association](https://vercel.com/docs/cli/deploy#associate-a-cli-deployment-with-a-git-branch) and [branch domains](https://vercel.com/docs/domains/working-with-domains/assign-domain-to-a-git-branch).

Disable Vercel's automatic Git-triggered deployments in the repository configuration:

```json
{
  "git": {
    "deploymentEnabled": false
  }
}
```

This leaves CLI deployments available. Ensure the setting is effective on the branches Vercel would otherwise deploy before activation; a change present only on an implementation branch is insufficient. See [Git configuration](https://vercel.com/docs/project-configuration/git-configuration).

If the user chooses to omit the Git association, retain the prebuilt upload and explicitly assign the staging domain using Vercel's native [alias command](https://vercel.com/docs/cli/alias). Verify the selected CLI's structured deployment result before extracting its URL and ensure Production auto-assignment cannot claim the staging domain. Treat alias assignment as a separate mutation after successful deployment, with failure and retry behavior preserved. This is an alternative requiring a workflow change, not behavior already present in the linked-project profile.

## Activation and verification

Configure the team/project IDs and deployment token in the appropriate release environments, plus the domains and access policy in Vercel. A Preview URL may require Vercel authentication; verify whether staging is intended to be public or restricted.

Before enabling staging on a new project, account for Vercel's documented [first deployment behavior](https://vercel.com/docs/deployments/environments#first-deployment): the first deployment is Production even when Preview is requested. Project initialization must be deliberate and authorized, not an incidental validation upload.

Check current [plan eligibility and limits](https://vercel.com/docs/plans/hobby) and [service terms](https://vercel.com/legal/terms) when selecting the account plan. Hobby is intended for personal/non-commercial use; do not promise free commercial hosting or confuse Git integration permissions with transferring repository ownership.

For a Pages-to-Vercel change, remove obsolete Pages steps and permissions from the Web job and reusable-workflow callers. Do not delete the old remote site or branch as an implicit part of editing the pipeline. Validate JSON, workflow and shell syntax, native CLI support, and unchanged non-Web jobs; state separately whether authenticated deployment, domain assignment, and browser accessibility were actually exercised.
