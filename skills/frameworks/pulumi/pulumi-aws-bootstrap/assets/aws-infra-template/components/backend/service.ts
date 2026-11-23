import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

const SAMPLE_IMAGE = "amazon/amazon-ecs-sample";

export type BackendServiceConfig = {
  cluster: aws.ecs.Cluster;
  vpc: awsx.ec2.Vpc;
  repositoryUrl: pulumi.Input<string>;
  databaseUrl: pulumi.Input<string>;
  environment: Record<string, pulumi.Input<string>>;
  appDataBucket: pulumi.Input<string>;
  appDataBucketArn: pulumi.Input<string>;
  dns: string;
  dnsZone: string;
  useSampleImage: boolean;
  commitHash?: string;
  replicas: number;
  cpu: string;
  memory: string;
};

export class BackendService extends pulumi.ComponentResource {
  public readonly service: aws.ecs.Service;
  public readonly loadBalancer: aws.lb.LoadBalancer;

  constructor(name: string, params: BackendServiceConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:BackendService`, name, {}, opts);

    if (!params.useSampleImage && !params.commitHash) {
      throw new Error("commitHash is required when useSampleImage is false");
    }

    const containerPort = params.useSampleImage ? 80 : 3873;
    const healthCheckPath = params.useSampleImage ? "/" : "/api/healthy";
    const image: pulumi.Input<string> = params.useSampleImage
      ? SAMPLE_IMAGE
      : pulumi.interpolate`${params.repositoryUrl}:${params.commitHash}`;

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
    const serviceSg = new aws.ec2.SecurityGroup(
      "backend-service-sg",
      {
        vpcId: params.vpc.vpcId,
        description: "Backend ECS service",
        ingress: [
          {
            protocol: "tcp",
            fromPort: containerPort,
            toPort: containerPort,
            securityGroups: [albSg.id],
          },
        ],
        egress: [{ protocol: "-1", fromPort: 0, toPort: 0, cidrBlocks: ["0.0.0.0/0"] }],
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
        port: containerPort,
        protocol: "HTTP",
        targetType: "ip",
        vpcId: params.vpc.vpcId,
        healthCheck: {
          path: healthCheckPath,
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

    const containerDefinitions = params.useSampleImage
      ? pulumi.all([logGroup.name, region]).apply(([logGroupName, reg]) =>
          JSON.stringify([
            {
              name: "backend",
              image: SAMPLE_IMAGE,
              essential: true,
              portMappings: [{ containerPort, protocol: "tcp" }],
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
        )
      : pulumi
          .all([
            image,
            logGroup.name,
            region,
            params.databaseUrl,
            pulumi.all(params.environment),
            params.appDataBucket,
          ])
          .apply(([img, logGroupName, reg, dbUrl, env, appDataBucket]) =>
            JSON.stringify([
              {
                name: "backend",
                image: img,
                essential: true,
                portMappings: [{ containerPort, protocol: "tcp" }],
                environment: [
                  { name: "PORT", value: String(containerPort) },
                  { name: "DB_URL", value: dbUrl },
                  { name: "APP_DATA_BUCKET_NAME", value: appDataBucket },
                  ...Object.entries(env).map(([name, value]) => ({ name, value })),
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

    const taskDefinition = new aws.ecs.TaskDefinition(
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
        taskDefinition: taskDefinition.arn,
        desiredCount: params.replicas,
        launchType: "FARGATE",
        networkConfiguration: {
          subnets: params.vpc.publicSubnetIds,
          securityGroups: [serviceSg.id],
          assignPublicIp: true,
        },
        loadBalancers: [
          {
            targetGroupArn: targetGroup.arn,
            containerName: "backend",
            containerPort,
          },
        ],
      },
      { parent: this },
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
