---
name: pulumi-aws-bootstrap
description: "Bootstrap or adapt Pulumi on AWS with S3 state and KMS secrets; set up projects/stacks, the first ECR/ECS image cycle, GitHub Actions OIDC, managed-node credentials, private database access through SSM, or deployment workflows."
---

# Pulumi AWS Bootstrap

Set up project-specific AWS infrastructure without copying credentials, overwriting an existing Pulumi project, or deploying unreviewed changes.

## Choose the branch

- For local project and stack setup or the first container deployment, read [references/bootstrap.md](references/bootstrap.md).
- For the complete operational routine, including managed-node credentials and private database access through SSM, read [references/pulumi-infra-setup.md](references/pulumi-infra-setup.md).
- For GitHub Actions and AWS OIDC, read [references/github-actions-oidc.md](references/github-actions-oidc.md).
- For end-to-end infrastructure delivery, read bootstrap and OIDC, then follow the applicable detailed branches in the operational routine. Read managed-node or database procedures only when that access is in scope.

The selected branch determines discovery, validation, and completion. For access to an existing node or database, use its existing configuration and verify the requested access; project creation, backend/secrets-provider changes, infrastructure preview, and deployment are not prerequisites. A missing access prerequisite is a blocker to report, not permission to bootstrap infrastructure or broaden IAM access.

## Workflow

1. Inspect the context required by the selected branch before changing it.
   - For infrastructure or workflow changes, find the repository's package manager, application build commands, Dockerfiles, existing `infra/`, Pulumi files, workflows, environment names, and deployment docs. Identify any shared template and existing `components/`, `lib/`, or stack config.
   - For existing-node or database access, identify the account/region, target, client location, available configuration/outputs, credentials and permissions, network path, and required client tools. Inspect repository or stack files only where needed to establish those facts.
   - Completion: the relevant existing configuration and target are known; no existing file or resource will be replaced accidentally.

2. Resolve only the missing decisions.
   - Determine only the AWS region, Pulumi project/stack, S3 state URL, KMS key alias or ARN, domains, branch-to-environment mapping, and application deployment targets needed by the selected branch. Existing access does not require new bootstrap or deployment decisions.
   - Ask before choosing production-impacting values, replacing infrastructure, broadening IAM permissions, or selecting between GitHub Environments and suffixed repository variables.
   - Treat bucket, KMS key, hosted zone, certificate, repository, and role existence as facts to verify, not assumptions.
   - Completion: placeholders needed for the requested scope have concrete values or are explicitly left as documented placeholders.

3. Implement the smallest requested scope.
   - Follow the selected reference in order.
   - Match repository conventions and reuse existing components or workflows.
   - Completion: requested files or access configuration are complete, with no scaffold TODOs and valid scope-specific paths and commands; otherwise report the exact unmet prerequisite.

4. Validate the selected operation.
   - For infrastructure changes, run available format/type checks pertinent to the changed files and `pulumi preview` for the intended stack when credentials and backend access are available. Explain preview changes and unresolved placeholders before `pulumi up`.
   - For workflow-only changes, validate the changed workflow, branch/environment mappings, IAM trust/permission configuration, and repository conventions. Run infrastructure checks or preview only when infrastructure is also changed or the user explicitly requests that validation.
   - For existing-node or database access, verify the selected identity and target, required permissions, readiness/network path, and the requested session or connection result. Do not run project format/type checks, `pulumi preview`, or bootstrap commands merely to establish access.
   - Completion: the checks relevant to the requested operation pass, or each blocker is reported with the exact command and reason. Separate inspected prerequisites from an access result actually verified at runtime.

5. Deploy only when explicitly requested.
   - Require confirmation of the target AWS account, region, stack, and preview before `pulumi up` or IAM mutation.
   - Do not create, rotate, reveal, or replace credentials as an incidental step.
   - Completion: either the approved deployment succeeds and outputs are reported, or the infrastructure task stops at a reviewed preview. Access-only and workflow-only tasks finish at their relevant validation outcome in step 4; they do not enter deployment as a completion requirement.

## Invariants

- Configure the S3 backend before creating a new Pulumi project or stack.
- Configure AWS KMS before inserting stack secrets. Confirm before changing the secrets provider of an existing stack.
- Copy only non-sensitive stack configuration from templates. Insert sensitive values with `pulumi config set --secret`.
- Never print secret values or commit plaintext credentials.
- For private database administration, prefer SSM remote-host port forwarding through a managed instance; do not add public database or RDP ingress solely for access.
- Determine where the database client runs before configuring it. Use an SSM tunnel and a local port only for clients outside the private network; a client already running on the managed admin node should use the private database endpoint and its real port directly.
- Before using AWS CLI, verify it is installed where the command will run. Before starting an SSM session, also verify Session Manager Plugin on the client that opens that session; use the operating-system-specific instructions in the complete routine when required tools are missing. A direct database connection inside the VPC does not require a local SSM tunnel or plugin.
- Treat operating-system account passwords as separate from AWS, database, and application credentials. Reset them interactively on the managed node and never place literal passwords in Pulumi, user data, command history, SSM command parameters, logs, or documentation.
- Retrieve database passwords from Secrets Manager directly into the system clipboard when practical, and do not place them in shell history, logs, or documentation.
- Keep operating-system credentials, private-database credentials, and any locally installed PostgreSQL server credentials distinct. Do not mistake pgAdmin's auto-registered local `PostgreSQL <version>` server or its `postgres` user for the managed database.
- Keep generated signing/session secrets stable after bootstrap unless rotation is intentional.
- Do not disable the sample image until the referenced real image tag exists in the registry.
- Prefer GitHub OIDC and short-lived AWS credentials over access keys in GitHub Secrets.
- Restrict the OIDC trust policy to the intended repository and refs.
- Treat `AdministratorAccess` as a temporary, explicit bootstrap choice; prefer least privilege.
- Preserve existing stacks, state backends, resources, and workflows unless replacement is explicitly approved.
