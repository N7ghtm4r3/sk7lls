# AWS infrastructure template

Reusable Pulumi TypeScript structure for an AWS project. After `pulumi new` and the S3/KMS setup, copy `components/`, `lib/` and the non-sensitive stack config into `infra/aws`, then adapt `index.ts`.

| Path | Provides |
|---|---|
| `components/network` | VPC with public and isolated subnets (`awsx`) |
| `components/cluster` | ECS cluster on Fargate and Fargate Spot |
| `components/database` | RDS PostgreSQL in isolated subnets, password in Secrets Manager |
| `components/backend` | ECR repository, app-data and backup buckets, Fargate service behind an HTTPS ALB with ACM and Route 53 |
| `lib/static-site` | Private S3 bucket, CloudFront with OAC, ACM certificate in `us-east-1`, Route 53 alias, SPA fallback to `index.html` |
| `index.ts` | Composition from stack config, with the outputs CI uses |

Resource names and type tokens derive from the project name in `Pulumi.yaml` (`pulumi.getProject()`) and the stack name: set `name` there before the first `pulumi up`.

Adapt to the application:

- `components/backend/service.ts`: container port `3873`, health path `/api/healthy`, env names `DB_URL` and `APP_DATA_BUCKET_NAME`. Run database migrations from the image entrypoint.
- `index.ts`: the `environment` map passed to the backend.
- `Pulumi.staging.yaml`: replace every `[placeholder]`. `pulumi stack init` writes `secretsprovider` and `encryptedkey`.

Components use fixed child resource names: one `Backend` per stack, and a distinct name for each `StaticSite`. `StaticSite` creates its own `us-east-1` provider and looks up the zone by name.
