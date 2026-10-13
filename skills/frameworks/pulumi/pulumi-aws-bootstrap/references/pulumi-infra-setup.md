# Set up Pulumi infrastructure with AWS

This procedure initializes a Pulumi infrastructure project using AWS as the cloud provider, S3 as the state backend, and AWS KMS as the secrets provider.

## Root

Create a dedicated infrastructure directory:

```bash
mkdir infra
cd infra
```

Inside `infra`, create a directory for the selected cloud provider:

```bash
mkdir aws
cd aws
```

> Instead of `aws`, the directory may use the selected provider name.

## Prerequisites

Before starting, you need:

- Pulumi CLI installed
- AWS CLI installed
- valid AWS credentials
- an existing S3 bucket for Pulumi state
- an existing AWS KMS key or alias for encrypting secrets

## Configure AWS CLI

Configure AWS credentials:

```bash
aws configure
```

The command requests:

- AWS Access Key ID
- AWS Secret Access Key
- Default region
- Default output format

## Log Pulumi into the S3 backend

Configure Pulumi to store state in an S3 backend:

```bash
pulumi login s3://[bucket-or-path]
```

Example:

```bash
pulumi login s3://my-pulumi-state-bucket
```

Do this before initializing the project so the stack is created on the correct backend.

## Initialize the Pulumi project

Initialize a new Pulumi project with the AWS TypeScript template:

```bash
pulumi new aws-typescript
```

The command creates the Pulumi project and initializes a stack.

## Configure AWS KMS as the secrets provider

For an existing stack, you can change the secrets provider to AWS KMS:

```bash
pulumi stack change-secrets-provider \
  "awskms://alias/[slug]?region=[region]"
```

Where:

- `[slug]` is the KMS key alias
- `[region]` is the AWS region, such as `eu-west-1`

Example:

```bash
pulumi stack change-secrets-provider \
  "awskms://alias/my-project-key?region=eu-west-1"
```

## Configure the stack

Set non-sensitive stack configuration before configuring secrets.

This configuration is stored in the stack file, for example:

```text
Pulumi.staging.yaml
```

If a reference template exists, first copy its non-sensitive configuration into the correct stack file.

Copy only configuration such as:

- region
- domain
- DNS
- resource names
- non-secret application settings

Do not manually copy secrets from the template.

After copying configuration, verify and set the real DNS values for the project and environment.

General form:

```bash
pulumi config set [nome-config] "[valore]"
```

Example:

```bash
pulumi config set domain "avatar-poc.sandbox.devpunks.com"
pulumi config set aws:region "eu-central-1"
```

You may inspect these values in `Pulumi.[stack].yaml`, but prefer `pulumi config set` to preserve the correct format.

### Backend image configuration

For a containerized backend, a configuration value may select a sample image or the real application image.

During initial infrastructure bootstrap, you may temporarily use a sample image:

```bash
pulumi config set backend:useSampleImage true
pulumi up
```

This verifies that the VPC, cluster, load balancer, DNS, and base resources are created correctly without depending on the application pipeline.

When the project also creates ECR, this breaks the bootstrap cycle:

```text
Pulumi deve creare ECR -> Docker deve pushare su ECR -> ECS deve usare l'immagine da ECR
```

The first `pulumi up` may therefore use a sample image. Once ECR exists, build and push the real image.

Example:

```bash
ECR=$(pulumi stack output ecrRepositoryUrl)
TAG=$(git rev-parse --short HEAD)

aws ecr get-login-password --region [aws-region] \
  | docker login --username AWS --password-stdin "${ECR%/*}"

docker build -f [backend-dockerfile-path] -t "$ECR:$TAG" [docker-context]
docker push "$ECR:$TAG"
```

Only after pushing the real image, set:

```bash
pulumi config set backend:useSampleImage false
pulumi config set commitHash "$TAG"
pulumi up
```

Also supply the image tag to deploy. For a manual value:

```bash
pulumi config set commitHash "[tag-immagine]"
```

`commitHash` is a common convention: it often matches the short Git commit hash used as the Docker image tag. More generally, it identifies the application version to deploy.

Keep `backend:useSampleImage` enabled until the image `"[ecr-repository-url]:[tag-immagine]"` exists in the registry. Disabling it earlier makes ECS fetch a nonexistent image and the service fails.

## Configure stack secrets

After configuring non-sensitive values and the correct secrets provider, store sensitive stack values with `--secret`.

General form:

```bash
pulumi config set --secret [nome-secret] "[valore]"
```

Example:

```bash
pulumi config set --secret databasePassword "my-password"
```

For generated application secrets, create the value at bootstrap and keep it stable. For example, generate a backend auth secret as follows:

```bash
pulumi config set --secret backend:authSecret "$(openssl rand -base64 32)"
```

Keep signing/session secrets stable across deployments: changing them can invalidate issued sessions or tokens. Regenerate them only when creating the stack, changing secrets provider, recovering lost secrets, or intentionally rotating them.

These secrets are encrypted by the stack secrets provider, AWS KMS in this case.

To inspect stack configuration:

```bash
pulumi config
```

## Use the repository template

After completing base Pulumi configuration, use the `aws-infra-template` repository as a structural reference for the infrastructure project.

Retrieve these directories from the template:

- `components`
- `lib`

Copy them into the initialized Pulumi project below the provider directory.

AWS example:

```text
infra/
└── aws/
    ├── components/
    ├── lib/
    ├── index.ts
    ├── Pulumi.yaml
    └── Pulumi.staging.yaml
```

Use the template after initial configuration, rather than replacing these steps:

```bash
pulumi new aws-typescript
```

Initialize Pulumi correctly first, then add the shared template structure.

## Copy template configuration

After copying `components` and `lib`, also copy non-sensitive template configuration before setting or changing values with `pulumi config set`.

Configuration may live in stack files, for example:

```text
Pulumi.staging.yaml
Pulumi.production.yaml
```

Copy only non-sensitive configuration, such as:

- region
- domain
- DNS
- resource names
- non-secret application settings

Do not manually copy secrets from the template.

Replace copied DNS values with the real project and environment DNS values.

Reinsert sensitive values into the correct stack using:

```bash
pulumi config set --secret [nome-secret] "[valore]"
```

## Adapt the Pulumi entrypoint

After copying template directories and configuration, update the Pulumi entrypoint, usually:

```text
index.ts
```

This file must actually use the copied components, for example those in:

```text
components/
lib/
```

`pulumi new aws-typescript` generates only a basic example. Before deployment, replace or adapt it to the actual project infrastructure composition.

In general, `index.ts` should:

- read stack configuration
- instantiate the required infrastructure components
- connect resources, DNS, backend, frontend, database, and other required services
- export useful outputs

Before applying AWS changes, inspect what would be created:

```bash
pulumi preview
```

Proceed with the following only when preview shows the expected resources:

```bash
pulumi up
```

## Use AWS Systems Manager for administrative access

Systems Manager administers managed nodes without directly exposing SSH or RDP ports. A managed node may be a Windows or Linux EC2 instance, a VM, or a server registered through a Systems Manager hybrid activation.

### Install AWS Session Manager Plugin on the local computer

`aws ssm start-session` requires AWS CLI and AWS Session Manager Plugin on the computer opening the tunnel. The plugin is local; the target EC2 instance instead needs an active SSM Agent.

First check whether the plugin is available:

```bash
session-manager-plugin
```

If the command is absent, use the installation procedure for the operating system.

#### macOS

With Homebrew on either Apple Silicon or Intel:

```bash
brew install --cask session-manager-plugin
```

Alternatively, use the signed AWS installer. On Apple Silicon:

```bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/mac_arm64/session-manager-plugin.pkg" \
  -o "session-manager-plugin.pkg"
sudo installer -pkg session-manager-plugin.pkg -target /
sudo ln -s /usr/local/sessionmanagerplugin/bin/session-manager-plugin \
  /usr/local/bin/session-manager-plugin
```

On Intel Macs, replace `mac_arm64` with `mac` in the URL.

Official documentation: [Install Session Manager Plugin on macOS](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-macos-overview.html).

#### Windows

Open PowerShell and download the official installer:

```powershell
$installer = Join-Path $env:TEMP "SessionManagerPluginSetup.exe"
Invoke-WebRequest `
  "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/windows/SessionManagerPluginSetup.exe" `
  -OutFile $installer
Start-Process $installer -Verb RunAs -Wait
```

Installation requires administrator privileges. Reopen PowerShell afterward. If the command is not found, add this directory to `PATH`:

```text
C:\Program Files\Amazon\SessionManagerPlugin\bin\
```

Official documentation: [Install Session Manager Plugin on Windows](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-windows.html).

#### Ubuntu or Debian

On `x86_64` systems:

```bash
curl "https://s3.amazonaws.com/session-manager-downloads/plugin/latest/ubuntu_64bit/session-manager-plugin.deb" \
  -o "session-manager-plugin.deb"
sudo dpkg -i session-manager-plugin.deb
```

On `ARM64`, replace `ubuntu_64bit` with `ubuntu_arm64` in the URL.

Official documentation: [Install Session Manager Plugin on Ubuntu and Debian](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-debian-and-ubuntu.html).

#### Amazon Linux or RHEL

On Amazon Linux 2023 or RHEL 8 and 9 `x86_64`:

```bash
sudo dnf install -y \
  https://s3.amazonaws.com/session-manager-downloads/plugin/latest/linux_64bit/session-manager-plugin.rpm
```

On Amazon Linux 2 or RHEL 7, use `yum` instead of `dnf`. On `ARM64`, replace `linux_64bit` with `linux_arm64` in the URL.

Official documentation: [Install Session Manager Plugin on Amazon Linux and RHEL](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-linux.html).

#### Verify installation

On every system, open a new terminal and run:

```bash
session-manager-plugin
```

The command must confirm installation. `SessionManagerPlugin is not found` from `aws ssm start-session` means the plugin is absent or its directory is missing from `PATH`.

Official documentation: [Verify Session Manager Plugin](https://docs.aws.amazon.com/systems-manager/latest/userguide/install-plugin-verify.html).

### Set or change a local user password

Operating-system credentials are separate from:

- AWS credentials used by the CLI or instance role
- database passwords in Secrets Manager
- application secrets in the Pulumi stack

First access the node through Session Manager with an authorized identity. Change a local password only when needed for RDP, console, or other OS access. Keep permanent passwords out of Pulumi, user data, repositories, documentation, and commands recorded in history.

#### Windows

From an administrative PowerShell session, select the local user and enter the new password interactively:

```powershell
$UserName = "Administrator"; $Password = Read-Host "Nuova password Windows" -AsSecureString; Set-LocalUser -Name $UserName -Password $Password; Enable-LocalUser -Name $UserName
```

For another user, change `$UserName`. Inspect status without showing the password:

```powershell
Get-LocalUser -Name $UserName
```

For local login, use for example:

```text
Username: .\Administrator
Password: valore inserito nel prompt protetto
```

Avoid commands such as `net user Administrator "password"`: they work but retain plaintext in PowerShell history, logs, or SSM session data.

When Windows was launched without a key pair, the normal EC2 `Get Windows password` flow cannot decrypt its initial password. An administrative SSM session can still set a new local password with the command above.

#### Linux and other Unix systems

Identify the correct user without assuming `root`, `ec2-user`, or `ubuntu`:

```bash
id [username]
```

Then use the interactive system prompt, keeping the password out of command arguments:

```bash
sudo passwd [username]
```

On macOS, `passwd [username]` may be used by an adequately privileged account. Local OS policy governs complexity, expiry, and account lockout.

Changing a password does not enable remote access. For Windows, prefer Fleet Manager Remote Desktop or an SSM tunnel to RDP; for Linux, prefer Session Manager or SSH keys. Keep ports `3389` and `22` closed to `0.0.0.0/0`.

## Access a private database through AWS Systems Manager

For a database without a public endpoint, use a Systems Manager managed administrative node. Do not expose PostgreSQL or RDP to the Internet merely for database access.

Before configuring the client, identify where it runs:

| Database client location | Host | Port | Local tunnel |
|---|---|---|---|
| Computer outside the VPC | `localhost` | a free local port, such as `55438` | required |
| Administrative node inside the VPC | private database endpoint | actual database port, usually `5432` | unnecessary |

The remote PostgreSQL port normally remains `5432`. A port such as `55438` is only the selected local SSM tunnel endpoint, not the database port. If pgAdmin, DataGrip, or another client runs on the administrative node and can reach the database, use its real endpoint and port directly.

The following procedure assumes these Pulumi stack outputs:

- administrative instance ID, such as `dbAdminInstanceId`
- database endpoint, such as `dbEndpoint`
- database secret ARN, such as `dbSecretArn`

Substitute output names when the project differs. From the Pulumi project directory, explicitly select the stack and derive all values without entering them manually:

```bash
PULUMI_STACK="[stack]"
AWS_REGION="$(pulumi config get aws:region --stack "$PULUMI_STACK")"
DB_ADMIN_INSTANCE_ID="$(pulumi stack output dbAdminInstanceId --stack "$PULUMI_STACK")"
DB_ENDPOINT="$(pulumi stack output dbEndpoint --stack "$PULUMI_STACK")"
DB_HOST="${DB_ENDPOINT%%:*}"
DB_PORT="${DB_ENDPOINT##*:}"
if [ "$DB_PORT" = "$DB_ENDPOINT" ]; then DB_PORT="5432"; fi
DB_SECRET_ARN="$(pulumi stack output dbSecretArn --stack "$PULUMI_STACK")"
LOCAL_DB_PORT="55438"
```

If `dbEndpoint` omits the port, set `DB_PORT` from the stack output or database configuration, normally `5432` for PostgreSQL.

### Client outside the VPC: open the tunnel

Verify that the instance is registered and `Online` in Systems Manager:

```bash
aws ssm describe-instance-information \
  --region "$AWS_REGION" \
  --filters "Key=InstanceIds,Values=$DB_ADMIN_INSTANCE_ID" \
  --query 'InstanceInformationList[0].PingStatus' \
  --output text
```

If it is `Online`, open the tunnel in a dedicated terminal and leave it open:

```bash
aws ssm start-session \
  --region "$AWS_REGION" \
  --target "$DB_ADMIN_INSTANCE_ID" \
  --document-name AWS-StartPortForwardingSessionToRemoteHost \
  --parameters "{\"host\":[\"$DB_HOST\"],\"portNumber\":[\"$DB_PORT\"],\"localPortNumber\":[\"$LOCAL_DB_PORT\"]}"
```

AWS Session Manager Plugin must be installed on the local client. The administrative instance needs:

- an active SSM Agent
- an instance role permitting Systems Manager registration
- network connectivity to Systems Manager and the database

Skip these port-forwarding commands entirely when the client already runs on the administrative node.

### Retrieve database credentials

If the AWS Secrets Manager secret is JSON with a `password` property, copy the password to the macOS clipboard without printing it:

```bash
aws secretsmanager get-secret-value \
  --region "$AWS_REGION" \
  --secret-id "$DB_SECRET_ARN" \
  --query SecretString \
  --output text | jq -r '.password' | pbcopy
```

From local PowerShell:

```powershell
$pulumiStack = "[stack]"
$awsRegion = pulumi config get aws:region --stack $pulumiStack
$dbSecretArn = pulumi stack output dbSecretArn --stack $pulumiStack
$secretJson = aws secretsmanager get-secret-value `
  --region $awsRegion `
  --secret-id $dbSecretArn `
  --query SecretString `
  --output text
$secret = $secretJson | ConvertFrom-Json
Set-Clipboard $secret.password
Remove-Variable secret, secretJson, dbSecretArn
```

On the administrative node, AWS CLI may use its instance role without local access keys when that role allows `secretsmanager:GetSecretValue` for the correct secret. Obtain region and secret ARN from the operator who selected the stack, then copy the password without printing it:

```powershell
$awsRegion = "[aws-region]"
$dbSecretArn = "[db-secret-arn]"
$secretJson = aws secretsmanager get-secret-value --region $awsRegion --secret-id $dbSecretArn --query SecretString --output text
$secret = $secretJson | ConvertFrom-Json
Set-Clipboard $secret.password
Remove-Variable secret, secretJson, dbSecretArn
```

If `aws` is not found on the node, AWS CLI is absent or its directory is missing from `PATH`. SSM Agent availability does not imply AWS CLI availability.

The database password is separate from the Windows, Linux, or macOS password used to enter the node. For PostgreSQL, use the database secret username and password rather than OS credentials.

### Configure the client outside the VPC

With the SSM tunnel open, configure the client as follows:

```text
Host: localhost
Port: value of LOCAL_DB_PORT, such as 55438
Database: name configured by the project
User: user configured by the project
Password: value copied from Secrets Manager
SSL mode: mode required by the stack, normally Require
```

Keep the tunnel terminal open for the entire connection. End the session with `Ctrl+C` afterward.

### Configure pgAdmin on the administrative node

If pgAdmin already runs inside the VPC on the administrative node, use neither `localhost` nor `LOCAL_DB_PORT`. Register a new connection to the private database:

```text
General > Name: descriptive environment label

Connection:
Host name/address: value of DB_HOST
Port: value of DB_PORT, normally 5432
Maintenance database: database name configured by the project
Username: user in the database secret
Password: password in the database secret
Service: empty
Role: empty

SSL > SSL mode: mode required by the stack, normally Require
```

A local PostgreSQL installation may automatically register a pgAdmin server such as `PostgreSQL 18` and request the `postgres` password. That server is the node's local PostgreSQL, not RDS or the project's private database. Cancel that prompt and use `Servers > Register > Server` for the connection above unless local database administration is intentional.

pgAdmin's `Name` is only a local label. Do not enter the database name in `Service` or `Role`: `Service` needs a `pg_service.conf` definition; `Role` is for an optional `SET ROLE` after login.

Keep environment-specific instance IDs, endpoints, secret ARNs, account IDs, regions, and passwords out of the guide and application configuration. Derive them from the selected stack; never print secrets or retain them in shell history or logs.

## Create the GitHub Action

After configuring the Pulumi project, create a dedicated infrastructure GitHub Action.

Place the workflow below:

```text
.github/workflows/
```

Example:

```text
.github/
└── workflows/
    └── deploy-infra.yml
```

Adapt the GitHub Action to the project. It may:

- install dependencies
- configure cloud-provider credentials
- select the correct Pulumi stack
- run `pulumi preview`
- run `pulumi up` when appropriate
- pass configuration or variables required by the project
- use required GitHub secrets for cloud-provider, registry, or external-service authentication

Keep the workflow generic across projects but consistent with the provider, stack, and deployment strategy.

A base template follows:

```yaml
name: Deploy

on:
  push:
    branches: [staging, main]
  pull_request:
    branches: [staging, main]

permissions:
  id-token: write
  contents: read

env:
  AWS_REGION: [region]

jobs:
  setup:
    name: Setup
    runs-on: ubuntu-latest
    outputs:
      env_name: ${{ steps.resolve.outputs.env_name }}
      env_suffix: ${{ steps.resolve.outputs.env_suffix }}
    steps:
      - name: Resolve environment name
        id: resolve
        run: |
          if [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "env_name=prod" >> "$GITHUB_OUTPUT"
            echo "env_suffix=PROD" >> "$GITHUB_OUTPUT"
          else
            echo "env_name=staging" >> "$GITHUB_OUTPUT"
            echo "env_suffix=STAGING" >> "$GITHUB_OUTPUT"
          fi

  build-backend:
    name: Build Backend
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v4

      - name: Install backend dependencies
        run: |
          # install backend dependencies

      - name: Build backend
        run: |
          # build the backend with the actual project stack

      - name: Upload backend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: backend-artifacts
          path: [backend-artifact-path]

  build-frontend:
    name: Build Frontend
    runs-on: ubuntu-latest
    needs: [setup]
    steps:
      - uses: actions/checkout@v4

      - name: Install frontend dependencies
        run: |
          # install frontend dependencies

      - name: Build frontend
        run: |
          # build the frontend with the actual project stack

      - name: Upload frontend artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-artifacts
          path: [frontend-artifact-path]

  pulumi-up:
    name: Pulumi Up
    runs-on: ubuntu-latest
    needs: [setup, build-backend, build-frontend]
    steps:
      - uses: actions/checkout@v4

      - name: Configure cloud credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ vars.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Install Pulumi dependencies
        working-directory: infra/aws
        run: |
          # install infrastructure dependencies

      - name: Pulumi login
        run: pulumi login "s3://[pulumi-state-bucket]"

      - name: Pulumi preview
        uses: pulumi/actions@v6
        with:
          command: preview
          stack-name: ${{ needs.setup.outputs.env_name }}
          work-dir: infra/aws

      - name: Pulumi up
        if: github.event_name == 'push'
        uses: pulumi/actions@v6
        with:
          command: up
          stack-name: ${{ needs.setup.outputs.env_name }}
          work-dir: infra/aws

  post-deploy:
    name: Post Deploy
    runs-on: ubuntu-latest
    needs: [setup, pulumi-up]
    if: github.event_name == 'push'
    steps:
      - name: Run post deploy steps
        run: |
          # perform applicable post-deployment steps
          # examples: service readiness, static artifact upload, cache invalidation
```

Backend and frontend build steps remain template-agnostic: each project replaces those blocks with its actual application-stack commands.

## GitHub Actions - AWS OIDC Authentication

GitHub Actions should authenticate with AWS through OIDC federation instead of long-lived AWS access keys.

OIDC allows a GitHub workflow to assume an IAM role in AWS only for the duration of the workflow run. This is the recommended approach for CI/CD pipelines that need to deploy infrastructure or publish application artifacts to AWS.

### Deployment Overview

Document the repository-specific deployment details before configuring OIDC.

Example structure:

```text
GitHub repository: [github-org]/[github-repo]
Pulumi project: [pulumi-project]
AWS region: [aws-region]
Workflow file: .github/workflows/deploy.yml
```

If the workflow maps branches to Pulumi stacks, document the mapping clearly:

| Branch | Environment | Pulumi Stack |
|---|---|---|
| `[staging-branch]` | staging | `[staging-stack]` |
| `[production-branch]` | production | `[production-stack]` |

For each environment, document the infrastructure values used by the workflow and Pulumi stack:

| Value | Placeholder |
|---|---|
| Pulumi state bucket | `[pulumi-state-bucket]` |
| Pulumi secrets provider | `[pulumi-secrets-provider]` |
| Route53 hosted zone | `[route53-zone]` |
| Backend DNS | `[backend-dns]` |
| Frontend DNS | `[frontend-dns]` |
| GitHub Actions IAM role ARN | `[github-actions-role-arn]` |

Example with placeholders:

```text
GitHub repository: [github-org]/[github-repo]
Pulumi project: [pulumi-project]
AWS region: [aws-region]

Staging Pulumi state bucket: [project]-pulumi-staging
Staging Pulumi secrets provider: awskms://alias/[project]-pulumi-secrets-staging?region=[aws-region]
Staging Route53 zone: [staging-domain]
Staging backend DNS: api.[staging-domain]
Staging frontend DNS: fe.[staging-domain]
```

Keep this section project-specific in the final wiki page, but avoid committing real secrets or sensitive credentials.

### When This Is Needed

Configure AWS OIDC authentication when a GitHub Action needs to interact with AWS services, for example:

- running Pulumi from CI/CD
- reading or writing Pulumi state from an S3 backend
- pushing container images to ECR
- updating ECS services
- uploading static assets to S3
- invalidating CloudFront distributions
- managing DNS records in Route53
- creating or validating ACM certificates
- creating or updating IAM, VPC, security groups, load balancers, or other AWS resources

### Prerequisites

Before configuring OIDC, collect the project-specific values:

| Placeholder | Description |
|---|---|
| `[github-org]` | GitHub organization or user that owns the repository |
| `[github-repo]` | GitHub repository name |
| `[aws-account-id]` | AWS account ID where resources are deployed |
| `[aws-region]` | AWS region used by the project |
| `[role-name]` | IAM role name assumed by GitHub Actions |
| `[environment]` | Deployment environment, for example `staging` or `prod` |

### 1. Create the GitHub OIDC Provider in AWS

Create the OIDC identity provider once per AWS account.

From AWS Console:

```text
IAM > Identity providers > Add provider
```

Use:

| Field | Value |
|---|---|
| Provider type | `OpenID Connect` |
| Provider URL | `https://token.actions.githubusercontent.com` |
| Audience | `sts.amazonaws.com` |

The provider URL is the GitHub Actions OIDC issuer. The audience tells AWS STS that tokens from this provider are meant to be exchanged for temporary AWS credentials.

CLI equivalent:

```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

If the provider already exists in the AWS account, do not create it again.

### 2. Create the IAM Trust Policy

Create a `trust-policy.json` file and replace the placeholders with the values of the project:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::[aws-account-id]:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:[github-org]/[github-repo]:ref:refs/heads/*"
        }
      }
    }
  ]
}
```

The `sub` condition controls which repository and refs are allowed to assume the AWS role.

For stricter access, replace the wildcard branch condition with specific branches, for example:

```text
repo:[github-org]/[github-repo]:ref:refs/heads/staging
repo:[github-org]/[github-repo]:ref:refs/heads/main
```

### 3. Create the IAM Role

Create the IAM role that GitHub Actions will assume.

From AWS Console:

```text
IAM > Roles > Create role
```

Use:

| Field | Value |
|---|---|
| Trusted entity type | `Web identity` |
| Identity provider | `token.actions.githubusercontent.com` |
| Audience | `sts.amazonaws.com` |
| GitHub organization | `[github-org]` |
| GitHub repository | `[github-repo]` |
| Branch or ref | `[branch-name]` |
| Role name | `[role-name]` |

For a staging environment, a common generic role name is:

```text
[project-name]-github-actions-staging
```

For production:

```text
[project-name]-github-actions-prod
```

The role is separate from the OIDC provider:

```text
OIDC provider = AWS trusts GitHub Actions tokens
IAM role = this repository/ref can use these AWS permissions
```

CLI equivalent using the trust policy:

```bash
aws iam create-role \
  --role-name [role-name] \
  --assume-role-policy-document file://trust-policy.json
```

The role ARN will have this format:

```text
arn:aws:iam::[aws-account-id]:role/[role-name]
```

### 4. Attach IAM Permissions

Attach the permissions required by the workflow.

The exact permissions depend on the resources managed by the project. A typical infrastructure deployment role may need access to:

- ECR
- ECS
- S3
- CloudFront
- Route53
- ACM
- IAM
- EC2/VPC
- KMS
- CloudWatch Logs
- the Pulumi state backend

For an initial bootstrap, a broad policy can be used temporarily and scoped down later:

```bash
aws iam attach-role-policy \
  --role-name [role-name] \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

After the infrastructure is stable, replace broad permissions with a least-privilege policy.

### 5. Configure GitHub Repository Variables

In the GitHub repository, go to:

```text
Settings > Secrets and variables > Actions > Variables
```

Add the variables required by the workflow.

For a multi-environment workflow, use environment-specific names:

| Variable | Example Value |
|---|---|
| `AWS_ROLE_ARN_STAGING` | `arn:aws:iam::[aws-account-id]:role/[role-name]` |
| `AWS_ROLE_ARN_PROD` | `arn:aws:iam::[aws-account-id]:role/[role-name]` |
| `BACKEND_DNS_STAGING` | `[backend-staging-domain]` |
| `BACKEND_DNS_PROD` | `[backend-prod-domain]` |

If the workflow uses a single environment, a single variable such as `AWS_ROLE_ARN` may be enough.

### 6. Configure GitHub Environments

For multi-stage deployments, create one GitHub Environment for each deployment stage.

Common examples:

```text
staging
prod
```

In the GitHub repository, go to:

```text
Settings > Environments
```

Create the environments used by the workflow.

For each environment, configure the environment-specific variables and secrets needed by that stage.

Example environment variable layout:

| Environment | Variable | Example Placeholder |
|---|---|---|
| `staging` | `AWS_ROLE_ARN` | `arn:aws:iam::[aws-account-id]:role/[staging-role-name]` |
| `staging` | `BACKEND_DNS` | `[backend-staging-domain]` |
| `prod` | `AWS_ROLE_ARN` | `arn:aws:iam::[aws-account-id]:role/[prod-role-name]` |
| `prod` | `BACKEND_DNS` | `[backend-prod-domain]` |

Example environment secret layout:

| Environment | Secret | When It Is Needed |
|---|---|---|
| `staging` | `[SERVICE_TOKEN]` | staging token for an external service |
| `prod` | `[SERVICE_TOKEN]` | production token for an external service |

GitHub Environments are useful when:

- staging and production use different AWS roles
- staging and production use different domains
- production requires manual approval before deployment
- secrets should be scoped to a specific environment
- deployment history should be tracked per environment

A workflow can reference an environment like this:

```yaml
jobs:
  deploy:
    environment: staging
```

For dynamic environments resolved from a setup job:

```yaml
jobs:
  deploy:
    needs: [setup]
    environment: ${{ needs.setup.outputs.env_name }}
```

When using GitHub Environments, environment variables can be referenced with the same syntax as repository variables:

```yaml
${{ vars.AWS_ROLE_ARN }}
${{ vars.BACKEND_DNS }}
```

This keeps the workflow cleaner because the variable name stays the same while the value changes based on the selected environment.

### Alternative Without GitHub Environments

GitHub Environments are useful, but they are not mandatory.

A workflow can also use repository-level variables with environment suffixes. This approach is simpler when no manual approvals or environment-scoped secrets are needed.

Example repository variables:

| Variable | Example Placeholder |
|---|---|
| `AWS_ROLE_ARN_STAGING` | `arn:aws:iam::[aws-account-id]:role/[staging-role-name]` |
| `AWS_ROLE_ARN_PROD` | `arn:aws:iam::[aws-account-id]:role/[prod-role-name]` |
| `BACKEND_DNS_STAGING` | `[backend-staging-domain]` |
| `BACKEND_DNS_PROD` | `[backend-prod-domain]` |

The workflow can resolve the suffix in a setup job:

```yaml
jobs:
  setup:
    runs-on: ubuntu-latest
    outputs:
      env_name: ${{ steps.resolve.outputs.env_name }}
      env_suffix: ${{ steps.resolve.outputs.env_suffix }}
    steps:
      - name: Resolve environment name
        id: resolve
        run: |
          if [[ "${{ github.ref_name }}" == "main" ]]; then
            echo "env_name=prod" >> "$GITHUB_OUTPUT"
            echo "env_suffix=PROD" >> "$GITHUB_OUTPUT"
          else
            echo "env_name=staging" >> "$GITHUB_OUTPUT"
            echo "env_suffix=STAGING" >> "$GITHUB_OUTPUT"
          fi
```

Then later jobs can resolve the correct repository variable dynamically:

```yaml
role-to-assume: ${{ vars[format('AWS_ROLE_ARN_{0}', needs.setup.outputs.env_suffix)] }}
```

And similarly for project-specific values:

```yaml
BACKEND_DNS="${{ vars[format('BACKEND_DNS_{0}', needs.setup.outputs.env_suffix)] }}"
```

Use this approach when:

- the workflow should stay simple
- environment-level approvals are not required
- repository-level variables are enough
- staging and production still need different values

Use GitHub Environments instead when production needs approvals, stricter scoping, or separate environment deployment history.

### 7. Configure GitHub Repository Secrets

In the GitHub repository, go to:

```text
Settings > Secrets and variables > Actions > Secrets
```

Add only the secrets required by the pipeline.

Examples:

| Secret | When It Is Needed |
|---|---|
| `[EXTERNAL_SERVICE_TOKEN]` | Authentication with a third-party service |
| `[REGISTRY_TOKEN]` | Authentication with a non-AWS container registry |
| `[FRONTEND_PROVIDER_TOKEN]` | Deployment to an external frontend hosting provider |

Do not store long-lived AWS access keys when OIDC is available.

### 8. Reference the Role in the Workflow

Use `aws-actions/configure-aws-credentials` in the workflow:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN_STAGING }}
    aws-region: [aws-region]
```

For environment-aware workflows, resolve the variable dynamically:

```yaml
role-to-assume: ${{ vars[format('AWS_ROLE_ARN_{0}', needs.setup.outputs.env_suffix)] }}
```

### 9. Optional External Frontend Deployment

If the frontend is deployed outside AWS, add a dedicated deployment job after the infrastructure deployment.

That job should be configured with provider-specific variables and secrets, such as:

- provider token
- project ID
- organization or team ID
- frontend environment variables
- backend public URL

Keep this section optional. If the frontend is deployed to S3 and CloudFront, these external provider secrets are not needed.

### 10. GitHub CLI Examples

Variables and secrets can also be configured with the GitHub CLI:

```bash
gh variable set AWS_ROLE_ARN_STAGING --repo [github-org]/[github-repo] --body "arn:aws:iam::[aws-account-id]:role/[role-name]"
gh variable set AWS_ROLE_ARN_PROD --repo [github-org]/[github-repo] --body "arn:aws:iam::[aws-account-id]:role/[role-name]"
gh variable set BACKEND_DNS_STAGING --repo [github-org]/[github-repo] --body "[backend-staging-domain]"
gh variable set BACKEND_DNS_PROD --repo [github-org]/[github-repo] --body "[backend-prod-domain]"

gh secret set [SECRET_NAME] --repo [github-org]/[github-repo]
```

### Commit hash example

Some projects use a commit hash as the identifier of the application version to deploy.

In this scenario, the GitHub Action may:

- compute the current commit hash
- build the application image
- publish the image to a container registry using the commit hash as its tag
- pass that value to Pulumi as configuration or a deployment variable

Conceptual example:

```bash
COMMIT_HASH=$(git rev-parse --short HEAD)

docker build -t my-app:$COMMIT_HASH .
docker tag my-app:$COMMIT_HASH [registry-url]/my-app:$COMMIT_HASH
docker push [registry-url]/my-app:$COMMIT_HASH

pulumi config set commitHash "$COMMIT_HASH"
pulumi up
```

A commit hash is optional; it is a common way to trace the deployed application version.

## Recommended order

Follow this sequence:

```bash
mkdir infra
cd infra
mkdir aws
cd aws

aws configure
pulumi login s3://[bucket-or-path]
pulumi new aws-typescript
pulumi stack change-secrets-provider \
  "awskms://alias/[slug]?region=[region]"

# after base configuration, copy from aws-infra-template
# the components and lib directories into the provider directory, such as infra/aws

# also copy non-sensitive template configuration

# then set or change applicable non-sensitive configuration
pulumi config set [nome-config] "[valore]"

# finally reinsert secrets
pulumi config set --secret [nome-secret] "[valore]"

# adapt index.ts to use the copied components and lib

# preview what will be created before deployment
pulumi preview
```
