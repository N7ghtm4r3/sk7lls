---
name: pulumi-aws-bootstrap
description: Bootstrap or adapt repository infrastructure built with Pulumi, AWS, an S3 state backend, AWS KMS secrets, and GitHub Actions OIDC. Use when creating infra/aws, configuring stacks, resolving the first ECR/ECS image cycle, administering managed-node credentials or private database access through SSM, or adding the related deployment workflow.
---

# Pulumi AWS Bootstrap

Set up project-specific AWS infrastructure without copying credentials, overwriting an existing Pulumi project, or deploying unreviewed changes.

## Choose the branch

- For local project and stack setup or the first container deployment, read [references/bootstrap.md](references/bootstrap.md).
- For the complete Italian operational routine, including managed-node credentials and private database access through SSM, read [references/pulumi-infra-setup.md](references/pulumi-infra-setup.md).
- For GitHub Actions and AWS OIDC, read [references/github-actions-oidc.md](references/github-actions-oidc.md).
- Read both when the request covers end-to-end infrastructure delivery.

## Workflow

1. Inspect the repository before changing it.
   - Find its package manager, application build commands, Dockerfiles, existing `infra/`, Pulumi files, workflows, environment names, and deployment docs.
   - Identify any shared infrastructure template and whether `components/`, `lib/`, or stack config already exist.
   - Completion: existing infrastructure and project-specific commands are known; no existing file will be replaced accidentally.

2. Resolve only the missing decisions.
   - Determine AWS region, Pulumi project name, stack names, S3 state URL, KMS key alias or ARN, domains, branch-to-environment mapping, and application deployment targets.
   - Ask before choosing production-impacting values, replacing infrastructure, broadening IAM permissions, or selecting between GitHub Environments and suffixed repository variables.
   - Treat bucket, KMS key, hosted zone, certificate, repository, and role existence as facts to verify, not assumptions.
   - Completion: placeholders needed for the requested scope have concrete values or are explicitly left as documented placeholders.

3. Implement the smallest requested scope.
   - Follow the selected reference in order.
   - Match repository conventions and reuse existing components or workflows.
   - Completion: generated files contain no scaffold TODOs and project-specific paths and commands are valid.

4. Validate before mutation.
   - Run format, type checks, and workflow validation available in the repository.
   - Run `pulumi preview` for the intended stack when credentials and backend access are available.
   - Explain preview changes and unresolved placeholders before `pulumi up`.
   - Completion: local validation passes, or each blocker is reported with the exact command and reason.

5. Deploy only when explicitly requested.
   - Require confirmation of the target AWS account, region, stack, and preview before `pulumi up` or IAM mutation.
   - Do not create, rotate, reveal, or replace credentials as an incidental step.
   - Completion: either the approved deployment succeeds and outputs are reported, or the task stops at a reviewed preview.

## Invariants

- Configure the S3 backend before creating a new Pulumi project or stack.
- Configure AWS KMS before inserting stack secrets. Confirm before changing the secrets provider of an existing stack.
- Copy only non-sensitive stack configuration from templates. Insert sensitive values with `pulumi config set --secret`.
- Never print secret values or commit plaintext credentials.
- For private database administration, prefer SSM remote-host port forwarding through a managed instance; do not add public database or RDP ingress solely for access.
- Determine where the database client runs before configuring it. Use an SSM tunnel and a local port only for clients outside the private network; a client already running on the managed admin node should use the private database endpoint and its real port directly.
- Before starting a CLI session, verify that AWS CLI and Session Manager Plugin are installed on the local client; use the operating-system-specific instructions in the complete routine when missing.
- Treat operating-system account passwords as separate from AWS, database, and application credentials. Reset them interactively on the managed node and never place literal passwords in Pulumi, user data, command history, SSM command parameters, logs, or documentation.
- Retrieve database passwords from Secrets Manager directly into the system clipboard when practical, and do not place them in shell history, logs, or documentation.
- Keep operating-system credentials, private-database credentials, and any locally installed PostgreSQL server credentials distinct. Do not mistake pgAdmin's auto-registered local `PostgreSQL <version>` server or its `postgres` user for the managed database.
- Keep generated signing/session secrets stable after bootstrap unless rotation is intentional.
- Do not disable the sample image until the referenced real image tag exists in the registry.
- Prefer GitHub OIDC and short-lived AWS credentials over access keys in GitHub Secrets.
- Restrict the OIDC trust policy to the intended repository and refs.
- Treat `AdministratorAccess` as a temporary, explicit bootstrap choice; prefer least privilege.
- Preserve existing stacks, state backends, resources, and workflows unless replacement is explicitly approved.
