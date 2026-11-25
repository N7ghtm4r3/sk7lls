# GitHub Actions and AWS OIDC Reference

Use this reference when adding CI/CD for Pulumi or application artifacts that interact with AWS.

## Gather deployment facts

Document the GitHub organization/repository, AWS account/region, Pulumi project and stacks, state URL, secrets provider, branch-to-environment mapping, domains, build commands, Docker paths, and environment role ARNs. Do not put real secrets in documentation or workflow YAML.

## OIDC trust

Verify whether the GitHub OIDC provider already exists in the AWS account. If absent and creation is approved, configure:

```text
Provider URL: https://token.actions.githubusercontent.com
Audience: sts.amazonaws.com
```

Use current AWS and GitHub documentation for provider creation details; do not copy a stale TLS thumbprint without verification.

Create a dedicated IAM role with `sts:AssumeRoleWithWebIdentity`. Its trust policy must constrain both:

```json
{
  "StringEquals": {
    "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
  },
  "StringLike": {
    "token.actions.githubusercontent.com:sub": "repo:[github-org]/[github-repo]:ref:refs/heads/[branch]"
  }
}
```

Use separate roles or explicit allowed refs for staging and production. Avoid unrestricted repository or organization wildcards.

## Permissions

Derive permissions from resources actually managed by the stack and jobs, such as ECR, ECS, S3, CloudFront, Route53, ACM, IAM, EC2/VPC, KMS, CloudWatch Logs, and the Pulumi state bucket.

Prefer least privilege. If broad bootstrap permissions are proposed, mark them temporary, obtain approval, and leave a concrete tightening step; do not silently attach `AdministratorAccess`.

Grant the pipeline role only what every run needs. Bootstrap permissions, such as state-bucket configuration, stay with the operator.

When the stack creates IAM roles, condition the pipeline role's `iam:CreateRole` and role-policy actions on `iam:PermissionsBoundary` equal to a boundary policy that caps every created role. Deny `iam:DeleteRolePermissionsBoundary`, `iam:PutRolePermissionsBoundary`, and version or delete actions on the boundary policy. Otherwise the pipeline can create a role with more permissions than its own.

## GitHub configuration model

Prefer GitHub Environments when production approvals, environment-scoped secrets, or separate deployment history matter. Use stable names such as `AWS_ROLE_ARN` and `BACKEND_DNS` per environment.

Use repository variables with suffixes such as `AWS_ROLE_ARN_STAGING` and `AWS_ROLE_ARN_PROD` when environment protections are unnecessary. Store only genuinely sensitive third-party values as GitHub Secrets. Do not store long-lived AWS keys when OIDC is available.

## Workflow shape

Create or adapt a workflow under `.github/workflows/`. Match existing action and package-manager conventions. A typical dependency order is:

```text
resolve environment
├── infrastructure: Pulumi preview (pull request) / up (protected push)
└── release, per changed service:
    build → push SHA tag → render → migrate (run-task) → deploy → post-deploy checks
```

Required properties:

- `permissions.id-token: write` and `permissions.contents: read`;
- `aws-actions/configure-aws-credentials` with `role-to-assume` and the verified region;
- explicit Pulumi `stack-name` and `work-dir`;
- preview on pull requests;
- deploy only on the intended protected push or approved dispatch;
- explicit branch-to-environment mapping;
- real repository build commands instead of placeholders;
- dependencies that prevent deploy before required artifacts exist;
- changed services selected through the build tool's affected query (Turborepo, Nx) plus infrastructure and Dockerfile paths.

Example credential step:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN }}
    aws-region: ${{ env.AWS_REGION }}
```

Use action versions already governed by the repository, or verify current official versions before introducing new ones.

## Release model

Pulumi creates the ECR repository, the task-definition family, and the ECS service with `desiredCount: 0` and `ignoreChanges: ["taskDefinition", "desiredCount"]`. The pipeline releases with the official ECS actions:

```yaml
- name: Render task definition
  id: render
  uses: aws-actions/amazon-ecs-render-task-definition@v1
  with:
    task-definition-family: [task-family]
    container-name: [container-name]
    image: [ecr-repository-url]:${{ github.sha }}

- name: Migrate and deploy
  uses: aws-actions/amazon-ecs-deploy-task-definition@v2
  with:
    task-definition: ${{ steps.render.outputs.task-definition }}
    cluster: [cluster-name]
    service: [service-name]
    desired-count: [replicas]
    wait-for-service-stability: true
    run-task: true
    run-task-container-overrides: '[{"name": "[container-name]", "command": ["[migrate-command]"]}]'
    run-task-subnets: [comma-separated-subnet-ids]
    run-task-security-groups: [service-security-group-id]
    run-task-assign-public-IP: ENABLED
    wait-for-task-stopped: true
```

- Push the immutable commit-SHA tag before rendering.
- The stand-alone task runs inside the VPC before the service update, and a non-zero exit code fails the step. A failed migration therefore never reaches the service. Omit the `run-task` inputs when a release has no migration. Set `run-task-assign-public-IP: ENABLED` only for public subnets without NAT, where the task needs a public IP to pull the image.
- Run one-off data operations that need the private network, such as creating a service's database user, the same way: the deploy action with only `cluster` and the `run-task` inputs. Render a task definition that Pulumi fully owns from its exact `task-definition-arn`, so the task runs what Pulumi declared. Render a service's task definition from its `task-definition-family`, whose newest revision carries the latest release and infrastructure changes. Make data operations idempotent so every release can run them. Keep them in the pipeline rather than in `pulumi up` through `command.local.Command`: the preview cannot show their outcome, and the up would depend on the AWS CLI of whoever runs it.
- Read every name, ARN, subnet, and security group the pipeline needs from stack outputs (`pulumi stack output --json`), never from values copied into the workflow.
- Rollback comes from ECS: the deployment circuit breaker with `rollback: true`, or ECS native blue/green.
- An infrastructure change to the task definition, such as a new environment variable, registers a new revision in the family. The next release renders from it. Release once when such a change must apply at once.
- For a single service with rare releases, the tag may stay in Pulumi config: pass it with `pulumi up --config` and omit this release job.

## Validation gate

Validate YAML and repository CI conventions; verify branch mappings, IAM trust and permissions, and absence of placeholders or credentials; preview every affected stack; and ensure production has the intended approval boundary.
