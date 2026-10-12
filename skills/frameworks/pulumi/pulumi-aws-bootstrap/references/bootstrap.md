# Pulumi AWS Bootstrap Reference

Use this reference for repository structure, local initialization, stack configuration, template integration, and the first container deployment.

## Prerequisites

Verify, rather than silently create:

- Pulumi CLI and AWS CLI are installed.
- AWS credentials select the intended account and region.
- The S3 state bucket exists and is accessible.
- The KMS key or alias exists and is usable.
- The intended stack and `infra/aws` project do not already exist.

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

After `pulumi new`, copy only the reusable infrastructure source required by the project, commonly:

```text
infra/aws/
├── components/
├── lib/
├── index.ts
├── Pulumi.yaml
└── Pulumi.[stack].yaml
```

Adapt `index.ts`; the generated sample is not the finished infrastructure. It should read stack configuration, instantiate the required components, connect requested resources, and export useful outputs.

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

## Break the ECR/ECS bootstrap cycle

When Pulumi creates the ECR repository that ECS must consume, deploy a sample image first if the project supports it:

```bash
pulumi config set backend:useSampleImage true
pulumi preview
pulumi up
```

After ECR exists, build and push the real application image using the repository's actual Dockerfile and context:

```bash
ECR="$(pulumi stack output ecrRepositoryUrl)"
TAG="$(git rev-parse --short HEAD)"

aws ecr get-login-password --region "[aws-region]" \
  | docker login --username AWS --password-stdin "${ECR%/*}"

docker build -f "[backend-dockerfile-path]" -t "$ECR:$TAG" "[docker-context]"
docker push "$ECR:$TAG"
```

Verify the exact tag exists in ECR. Only then switch to the real image:

```bash
pulumi config set backend:useSampleImage false
pulumi config set commitHash "$TAG"
pulumi preview
pulumi up
```

`commitHash` is a version/tag convention, not a Pulumi requirement. Use the project's existing image-version key when different.

For private database administration after deployment, follow the relevant section in the complete [Pulumi infrastructure setup routine](pulumi-infra-setup.md). Choose the connection path based on where the client runs: use SSM port forwarding from outside the VPC, or the private endpoint and real database port from an admin node that already has network access.

## Validation gate

Run repository checks and `pulumi preview`. Confirm the preview targets the expected account, region, project, and stack. Check especially replacements, deletions, IAM grants, DNS changes, and state migrations. Run `pulumi up` only after explicit approval.
