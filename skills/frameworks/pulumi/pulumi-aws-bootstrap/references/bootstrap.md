# Pulumi AWS Bootstrap Reference

Use this reference for repository structure, local initialization, stack configuration, template integration, and the first container deployment.

## Prerequisites

Verify, rather than silently create:

- Pulumi CLI and AWS CLI are installed.
- AWS credentials select the intended account and region.
- The S3 state bucket exists and is accessible.
- The KMS key or alias exists and is usable.
- The intended stack and `infra/aws` project do not already exist.

Create a missing state bucket or KMS key once, as an operator step with the AWS CLI. Pipelines and the Pulumi program only use them.

If credentials need interactive setup, let the user run `aws configure` or use the repository's established profile/SSO flow. Do not request access keys in chat.

## Initialize a new project

Create the provider directory only when absent:

```bash
mkdir -p infra/aws
cd infra/aws
pulumi login "s3://[bucket-or-path]"
pulumi new aws-typescript
```

Select the desired stack, then configure its secrets provider:

```bash
pulumi stack change-secrets-provider \
  "awskms://alias/[kms-alias]?region=[aws-region]"
```

For an existing project or stack, inspect `Pulumi.yaml`, `Pulumi.*.yaml`, `pulumi stack ls`, and `pulumi whoami -v` first. Do not repeat initialization or change its backend/provider without approval.

## Integrate a shared template

After `pulumi new`, copy only the reusable infrastructure source required by the project from the repository's shared template, or from the bundled [`aws-infra-template`](../assets/aws-infra-template/README.md) when none exists, commonly:

```text
infra/aws/
├── components/
├── lib/
├── index.ts
├── Pulumi.yaml
└── Pulumi.[stack].yaml
```

Adapt `index.ts`; the generated sample is not the finished infrastructure. It should read stack configuration, instantiate the required components, connect requested resources, and export useful outputs.

Size the VPC with free address space for another subnet tier or Availability Zone: for a /16 with two tiers in two zones, use /20 subnets. Changing subnets after deployment replaces them, together with the RDS subnet group and services on them.

Do not copy template secrets. Copy only relevant non-sensitive settings, then replace template domains, resource names, and environment values with verified project values.

## Configure a stack

Set non-sensitive configuration first:

```bash
pulumi config set aws:region "[aws-region]"
pulumi config set domain "[project-domain]"
pulumi config set [config-key] "[value]"
```

Set sensitive values only after verifying the KMS secrets provider:

```bash
pulumi config set --secret [secret-key] "[secret-value]"
```

Generate an application signing secret once during stack bootstrap when needed:

```bash
pulumi config set --secret backend:authSecret "$(openssl rand -base64 32)"
```

Do not regenerate stable signing/session secrets on routine deploys. Verify stored keys without revealing decrypted values with `pulumi config`.

## First release

Pulumi creates the ECR repository and an ECS service that starts with zero tasks and ignores task-definition and desired-count changes. Nothing runs before the first release, so no sample image is needed.

1. Run `pulumi preview`, then `pulumi up` after approval. An application image that connects to RDS carries the regional RDS CA bundle ([database-security.md](database-security.md#put-the-ca-bundle-in-the-image)). The server listens on `0.0.0.0`: Fargate sets `HOSTNAME` to the task's own hostname, which does not resolve, so a server that listens on `HOSTNAME`, such as the Next.js standalone server, exits with `getaddrinfo ENOTFOUND`. Set `HOSTNAME=0.0.0.0` in the task definition `environment`. A local `docker run` can hide the failure, because there the container hostname resolves.
2. Complete the [one-time steps](../assets/aws-infra-template/README.md#one-time-steps-after-the-first-pulumi-up) in the template README, such as the application database user.
3. Run the release from [Release model](github-actions-oidc.md#release-model).
4. Verify that the service reaches a steady state and the health check passes.

After this, infrastructure changes go through `pulumi up` and application versions go through the release pipeline.

For private database administration after deployment, follow the relevant section in the complete [Pulumi infrastructure setup routine](pulumi-infra-setup.md). Choose the connection path based on where the client runs: use SSM port forwarding from outside the VPC, or the private endpoint and real database port from an admin node that already has network access.

## Validation gate

Run repository checks and `pulumi preview`. Confirm the preview targets the expected account, region, project, and stack. Check especially replacements, deletions, IAM grants, DNS changes, and state migrations. Run `pulumi up` only after explicit approval.
