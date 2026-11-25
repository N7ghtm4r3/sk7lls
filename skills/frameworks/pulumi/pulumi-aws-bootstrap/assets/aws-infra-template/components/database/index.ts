import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

export type DatabaseConfig = {
  vpc: awsx.ec2.Vpc;
  instanceClass: string;
  allocatedStorage: number;
  /** Major version only: RDS applies minor upgrades, so a pinned minor drifts. */
  engineVersion: string;
  databaseName: string;
  username: string;
};

/**
 * RDS PostgreSQL in isolated subnets. RDS keeps the master password in Secrets Manager,
 * so it never enters Pulumi state. The application uses its own user: `appSecret`
 * starts empty and the operator fills it once (README, one-time steps).
 */
export class Database extends pulumi.ComponentResource {
  public readonly instance: aws.rds.Instance;
  public readonly securityGroup: aws.ec2.SecurityGroup;
  public readonly appSecret: aws.secretsmanager.Secret;
  public readonly masterSecretArn: pulumi.Output<string>;

  constructor(name: string, params: DatabaseConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:Database`, name, {}, opts);

    this.appSecret = new aws.secretsmanager.Secret(
      "db-app-secret",
      {
        name: `${pulumi.getProject()}/${pulumi.getStack()}/db-app`,
        description:
          "Application database user as JSON {username, password}; set once by the operator",
      },
      { parent: this },
    );

    // No inline rules: each client adds its own ingress rule, and no egress is needed.
    this.securityGroup = new aws.ec2.SecurityGroup(
      "db-sg",
      {
        vpcId: params.vpc.vpcId,
        description: "RDS PostgreSQL; ingress only from client security groups",
      },
      { parent: this },
    );

    const subnetGroup = new aws.rds.SubnetGroup(
      "db-subnet-group",
      { subnetIds: params.vpc.isolatedSubnetIds },
      { parent: this },
    );

    this.instance = new aws.rds.Instance(
      "db",
      {
        engine: "postgres",
        engineVersion: params.engineVersion,
        autoMinorVersionUpgrade: true,
        instanceClass: params.instanceClass,
        allocatedStorage: params.allocatedStorage,
        dbName: params.databaseName,
        username: params.username,
        manageMasterUserPassword: true,
        dbSubnetGroupName: subnetGroup.name,
        vpcSecurityGroupIds: [this.securityGroup.id],
        publiclyAccessible: false,
        skipFinalSnapshot: false,
        finalSnapshotIdentifier: `${pulumi.getProject()}-${pulumi.getStack()}-final`,
        storageEncrypted: true,
        multiAz: false,
      },
      { parent: this },
    );

    this.masterSecretArn = this.instance.masterUserSecrets.apply(
      (secrets) => secrets[0].secretArn,
    );

    this.registerOutputs({
      instanceEndpoint: this.instance.endpoint,
      masterSecretArn: this.masterSecretArn,
      appSecretArn: this.appSecret.arn,
    });
  }
}
