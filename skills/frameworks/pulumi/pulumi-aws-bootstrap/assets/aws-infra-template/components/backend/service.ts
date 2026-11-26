import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

const CONTAINER_NAME = "backend";
const CONTAINER_PORT = 3873;
const HEALTH_CHECK_PATH = "/api/healthy";
/** Never pushed: the service starts with zero tasks and the release pipeline renders the real tag. */
const INITIAL_TAG = "initial";

export type BackendDatabase = {
  host: pulumi.Input<string>;
  port: pulumi.Input<number>;
  name: pulumi.Input<string>;
  /** Secret with the application user's `username` and `password`. */
  secretArn: pulumi.Input<string>;
  securityGroupId: pulumi.Input<string>;
};

export type BackendServiceConfig = {
  cluster: aws.ecs.Cluster;
  vpc: awsx.ec2.Vpc;
  repositoryUrl: pulumi.Input<string>;
  database: BackendDatabase;
  environment: Record<string, pulumi.Input<string>>;
  /** Values the container reads as secrets; they reach the task through Secrets Manager. */
  secrets: Record<string, pulumi.Input<string>>;
  appDataBucket: pulumi.Input<string>;
  appDataBucketArn: pulumi.Input<string>;
  dns: string;
  dnsZone: string;
  cpu: string;
  memory: string;
};

export class BackendService extends pulumi.ComponentResource {
  public readonly service: aws.ecs.Service;
  public readonly loadBalancer: aws.lb.LoadBalancer;
  public readonly taskDefinition: aws.ecs.TaskDefinition;
  public readonly securityGroup: aws.ec2.SecurityGroup;
  public readonly containerName = CONTAINER_NAME;

  constructor(name: string, params: BackendServiceConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:BackendService`, name, {}, opts);

    const appSecrets = new aws.secretsmanager.Secret(
      "backend-secrets",
      { name: `${pulumi.getProject()}/${pulumi.getStack()}/backend` },
      { parent: this },
    );

    new aws.secretsmanager.SecretVersion(
      "backend-secrets-version",
      { secretId: appSecrets.id, secretString: pulumi.jsonStringify(params.secrets) },
      { parent: this },
    );

    // Task execution role
    const executionRole = new aws.iam.Role(
      "backend-execution-role",
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: { Service: "ecs-tasks.amazonaws.com" },
            },
          ],
        }),
      },
      { parent: this },
    );

    new aws.iam.RolePolicyAttachment(
      "backend-execution-policy",
      {
        role: executionRole.name,
        policyArn: "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy",
      },
      { parent: this },
    );

    new aws.iam.RolePolicy(
      "backend-execution-secrets-policy",
      {
        role: executionRole.name,
        policy: pulumi.jsonStringify({
          Version: "2012-10-17",
          Statement: [
            {
              Effect: "Allow",
              Action: "secretsmanager:GetSecretValue",
              Resource: [appSecrets.arn, params.database.secretArn],
            },
          ],
        }),
      },
      { parent: this },
    );

    // Task role
    const taskRole = new aws.iam.Role(
      "backend-task-role",
      {
        assumeRolePolicy: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Action: "sts:AssumeRole",
              Effect: "Allow",
              Principal: { Service: "ecs-tasks.amazonaws.com" },
            },
          ],
        }),
      },
      { parent: this },
    );

    // S3 access for app-data bucket
    new aws.iam.RolePolicy(
      "backend-task-s3-policy",
      {
        role: taskRole.name,
        policy: pulumi.output(params.appDataBucketArn).apply((arn) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: ["s3:GetObject", "s3:PutObject", "s3:DeleteObject", "s3:ListBucket"],
                Resource: [arn, `${arn}/*`],
              },
            ],
          }),
        ),
      },
      { parent: this },
    );

    // Logging
    const logGroup = new aws.cloudwatch.LogGroup(
      "backend-logs",
      {
        name: `/ecs/${pulumi.getProject()}/${pulumi.getStack()}/backend`,
        retentionInDays: 30,
      },
      { parent: this },
    );

    // ALB security group
    const albSg = new aws.ec2.SecurityGroup(
      "backend-alb-sg",
      {
        vpcId: params.vpc.vpcId,
        description: "Backend ALB",
        ingress: [
          { protocol: "tcp", fromPort: 80, toPort: 80, cidrBlocks: ["0.0.0.0/0"] },
          { protocol: "tcp", fromPort: 443, toPort: 443, cidrBlocks: ["0.0.0.0/0"] },
        ],
        egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
      },
      { parent: this },
    );

    // Service security group
    this.securityGroup = new aws.ec2.SecurityGroup(
      "backend-service-sg",
      {
        vpcId: params.vpc.vpcId,
        description: "Backend ECS service",
        ingress: [
          {
            protocol: "tcp",
            fromPort: CONTAINER_PORT,
            toPort: CONTAINER_PORT,
            securityGroups: [albSg.id],
          },
        ],
        egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
      },
      { parent: this },
    );

    new aws.vpc.SecurityGroupIngressRule(
      "backend-db-ingress",
      {
        securityGroupId: params.database.securityGroupId,
        referencedSecurityGroupId: this.securityGroup.id,
        ipProtocol: "tcp",
        fromPort: params.database.port,
        toPort: params.database.port,
      },
      { parent: this },
    );

    // ALB
    this.loadBalancer = new aws.lb.LoadBalancer(
      "backend-alb",
      {
        internal: false,
        loadBalancerType: "application",
        securityGroups: [albSg.id],
        subnets: params.vpc.publicSubnetIds,
      },
      { parent: this },
    );

    const targetGroup = new aws.lb.TargetGroup(
      "backend-tg",
      {
        port: CONTAINER_PORT,
        protocol: "HTTP",
        targetType: "ip",
        vpcId: params.vpc.vpcId,
        healthCheck: {
          path: HEALTH_CHECK_PATH,
          protocol: "HTTP",
          healthyThreshold: 2,
          unhealthyThreshold: 3,
          timeout: 5,
          interval: 30,
        },
      },
      { parent: this },
    );

    // DNS zone
    const zone = aws.route53.getZoneOutput({ name: params.dnsZone });

    // ACM certificate
    const certificate = new aws.acm.Certificate(
      "backend-cert",
      {
        domainName: params.dns,
        validationMethod: "DNS",
      },
      { parent: this },
    );

    const certValidationRecord = new aws.route53.Record(
      "backend-cert-validation",
      {
        zoneId: zone.zoneId,
        name: certificate.domainValidationOptions[0].resourceRecordName,
        type: certificate.domainValidationOptions[0].resourceRecordType,
        records: [certificate.domainValidationOptions[0].resourceRecordValue],
        ttl: 60,
      },
      { parent: this },
    );

    const certValidation = new aws.acm.CertificateValidation(
      "backend-cert-validation-wait",
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certValidationRecord.fqdn],
      },
      { parent: this },
    );

    // HTTP listener — redirect to HTTPS
    new aws.lb.Listener(
      "backend-http-listener",
      {
        loadBalancerArn: this.loadBalancer.arn,
        port: 80,
        protocol: "HTTP",
        defaultActions: [
          {
            type: "redirect",
            redirect: {
              port: "443",
              protocol: "HTTPS",
              statusCode: "HTTP_301",
            },
          },
        ],
      },
      { parent: this },
    );

    // HTTPS listener
    new aws.lb.Listener(
      "backend-https-listener",
      {
        loadBalancerArn: this.loadBalancer.arn,
        port: 443,
        protocol: "HTTPS",
        sslPolicy: "ELBSecurityPolicy-TLS13-1-2-2021-06",
        certificateArn: certValidation.certificateArn,
        defaultActions: [{ type: "forward", targetGroupArn: targetGroup.arn }],
      },
      { parent: this },
    );

    // Task definition
    const region = aws.getRegionOutput({});

    const containerDefinitions = pulumi
      .all([
        params.repositoryUrl,
        logGroup.name,
        region,
        pulumi.output(params.database),
        pulumi.all(params.environment),
        params.appDataBucket,
        appSecrets.arn,
      ])
      .apply(([repositoryUrl, logGroupName, reg, db, env, appDataBucket, appSecretsArn]) =>
        JSON.stringify([
          {
            name: CONTAINER_NAME,
            image: `${repositoryUrl}:${INITIAL_TAG}`,
            essential: true,
            portMappings: [{ containerPort: CONTAINER_PORT, protocol: "tcp" }],
            environment: [
              { name: "PORT", value: String(CONTAINER_PORT) },
              // Fargate's HOSTNAME does not resolve: listen on every interface.
              { name: "HOSTNAME", value: "0.0.0.0" },
              { name: "DB_HOST", value: db.host },
              { name: "DB_PORT", value: String(db.port) },
              { name: "DB_NAME", value: db.name },
              { name: "APP_DATA_BUCKET_NAME", value: appDataBucket },
              ...Object.entries(env).map(([name, value]) => ({ name, value })),
            ],
            secrets: [
              { name: "DB_USER", valueFrom: `${db.secretArn}:username::` },
              { name: "DB_PASSWORD", valueFrom: `${db.secretArn}:password::` },
              ...Object.keys(params.secrets).map((name) => ({
                name,
                valueFrom: `${appSecretsArn}:${name}::`,
              })),
            ],
            logConfiguration: {
              logDriver: "awslogs",
              options: {
                "awslogs-group": logGroupName,
                "awslogs-region": reg.region,
                "awslogs-stream-prefix": "backend",
              },
            },
          },
        ]),
      );

    this.taskDefinition = new aws.ecs.TaskDefinition(
      "backend-task",
      {
        family: `${pulumi.getProject()}-${pulumi.getStack()}-backend`,
        requiresCompatibilities: ["FARGATE"],
        networkMode: "awsvpc",
        cpu: params.cpu,
        memory: params.memory,
        executionRoleArn: executionRole.arn,
        taskRoleArn: taskRole.arn,
        containerDefinitions,
      },
      { parent: this },
    );

    // ECS Service
    this.service = new aws.ecs.Service(
      "backend-service",
      {
        cluster: params.cluster.arn,
        taskDefinition: this.taskDefinition.arn,
        // The release pipeline sets the task definition and the task count.
        desiredCount: 0,
        launchType: "FARGATE",
        deploymentCircuitBreaker: { enable: true, rollback: true },
        networkConfiguration: {
          subnets: params.vpc.publicSubnetIds,
          securityGroups: [this.securityGroup.id],
          assignPublicIp: true,
        },
        loadBalancers: [
          {
            targetGroupArn: targetGroup.arn,
            containerName: CONTAINER_NAME,
            containerPort: CONTAINER_PORT,
          },
        ],
      },
      { parent: this, ignoreChanges: ["taskDefinition", "desiredCount"] },
    );

    // DNS
    new aws.route53.Record(
      "backend-dns",
      {
        zoneId: zone.zoneId,
        name: params.dns,
        type: "A",
        aliases: [
          {
            name: this.loadBalancer.dnsName,
            zoneId: this.loadBalancer.zoneId,
            evaluateTargetHealth: true,
          },
        ],
      },
      { parent: this },
    );

    this.registerOutputs({
      serviceArn: this.service.id,
      loadBalancerDns: this.loadBalancer.dnsName,
    });
  }
}
