# AWS infrastructure template

Reusable Pulumi TypeScript structure for an AWS project. After `pulumi new` and the S3/KMS setup, copy `components/`, `lib/` and the non-sensitive stack config into `infra/aws`, then adapt `index.ts`.

| Path | Provides |
|---|---|
| `components/network` | VPC with public and isolated subnets (`awsx`) |
| `components/cluster` | ECS cluster on Fargate |
| `components/database` | RDS PostgreSQL in isolated subnets, RDS-managed master password, empty application-user secret |
| `components/backend` | ECR repository, app-data and backup buckets, Fargate service behind an HTTPS ALB with ACM and Route 53 |
| `lib/static-site` | Private S3 bucket, CloudFront with OAC, ACM certificate in `us-east-1`, Route 53 alias, SPA fallback to `index.html` |
| `index.ts` | Composition from stack config, with the outputs CI uses |

Resource names and type tokens derive from the project name in `Pulumi.yaml` (`pulumi.getProject()`) and the stack name: set `name` there before the first `pulumi up`.

Adapt to the application:

- `components/backend/service.ts`: container port `3873`, health path `/api/healthy`, env names `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` and `APP_DATA_BUCKET_NAME`.
- `index.ts`: the `environment` and `secrets` maps passed to the backend.
- `Pulumi.staging.yaml`: replace every `[placeholder]`. `pulumi stack init` writes `secretsprovider` and `encryptedkey`.

Components use fixed child resource names: one `Backend` per stack, and a distinct name for each `StaticSite`. `StaticSite` creates its own `us-east-1` provider and looks up the zone by name.

## Releases

The backend service starts with zero tasks and ignores task-definition and count changes. The release pipeline deploys each image tag and runs migrations as a stand-alone task before the service update. It reads the stack outputs `ecrRepositoryUrl`, `clusterName`, `backendServiceName`, `backendTaskFamily`, `backendContainerName`, `backendSecurityGroupId` and `publicSubnetIds`.

## One-time steps after the first `pulumi up`

1. Generate the application user's credentials straight into its secret:

   ```bash
   aws secretsmanager put-secret-value \
     --secret-id "$(pulumi stack output dbAppSecretArn)" \
     --secret-string "$(jq -n --arg u "[app-db-user]" --arg p "$(openssl rand -hex 24)" '{username: $u, password: $p}')"
   ```

2. From inside the VPC, for example the SSM administrative node, connect as the master user (secret `dbSecretArn`) and run:

   ```sql
   CREATE ROLE "[app-db-user]" LOGIN;
   GRANT "[app-db-user]" TO CURRENT_USER;  -- PostgreSQL 16+: required before ALTER ... OWNER
   ALTER DATABASE "[db-name]" OWNER TO "[app-db-user]";
   \password "[app-db-user]"
   ```

   At the `\password` prompt, paste the password from the `dbAppSecretArn` secret.

3. Run the first release.
