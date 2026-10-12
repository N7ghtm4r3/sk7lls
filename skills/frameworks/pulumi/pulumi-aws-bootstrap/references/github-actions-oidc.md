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

## GitHub configuration model

Prefer GitHub Environments when production approvals, environment-scoped secrets, or separate deployment history matter. Use stable names such as `AWS_ROLE_ARN` and `BACKEND_DNS` per environment.

Use repository variables with suffixes such as `AWS_ROLE_ARN_STAGING` and `AWS_ROLE_ARN_PROD` when environment protections are unnecessary. Store only genuinely sensitive third-party values as GitHub Secrets. Do not store long-lived AWS keys when OIDC is available.

## Workflow shape

Create or adapt a workflow under `.github/workflows/`. Match existing action and package-manager conventions. A typical dependency order is:

```text
resolve environment
├── build backend
├── build frontend
└── other artifacts
        ↓
Pulumi preview / deploy
        ↓
post-deploy checks
```

Required properties:

- `permissions.id-token: write` and `permissions.contents: read`;
- `aws-actions/configure-aws-credentials` with `role-to-assume` and the verified region;
- explicit Pulumi `stack-name` and `work-dir`;
- preview on pull requests;
- deploy only on the intended protected push or approved dispatch;
- explicit branch-to-environment mapping;
- real repository build commands instead of placeholders;
- dependencies that prevent deploy before required artifacts exist.

Example credential step:

```yaml
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    role-to-assume: ${{ vars.AWS_ROLE_ARN }}
    aws-region: ${{ env.AWS_REGION }}
```

Use action versions already governed by the repository, or verify current official versions before introducing new ones.

## Container versioning

For ECR deployments, use an immutable tag such as the Git commit SHA, push it before Pulumi references it, and pass the same tag into stack configuration. Do not switch away from a sample image until registry existence is verified.

## Validation gate

Validate YAML and repository CI conventions; verify branch mappings, IAM trust and permissions, and absence of placeholders or credentials; preview every affected stack; and ensure production has the intended approval boundary.
