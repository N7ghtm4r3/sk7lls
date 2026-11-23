import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";

export type DatabaseConfig = {
  vpc: awsx.ec2.Vpc;
  instanceClass: string;
  allocatedStorage: number;
  engineVersion: string;
  databaseName: string;
  username: string;
};

export class Database extends pulumi.ComponentResource {
  public readonly instance: aws.rds.Instance;
  public readonly secret: aws.secretsmanager.Secret;
  public readonly securityGroup: aws.ec2.SecurityGroup;

  constructor(name: string, params: DatabaseConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:Database`, name, {}, opts);

    const password = new random.RandomPassword(
      "db-password",
      { length: 32, special: false },
      { parent: this },
    );

    this.secret = new aws.secretsmanager.Secret(
      "db-secret",
      { name: `${pulumi.getProject()}/${pulumi.getStack()}/db-password` },
      { parent: this },
    );

    const secretVersion = new aws.secretsmanager.SecretVersion(
      "db-secret-version",
      {
        secretId: this.secret.id,
        secretString: pulumi.jsonStringify({
          username: params.username,
          password: password.result,
        }),
      },
      { parent: this },
    );

    this.securityGroup = new aws.ec2.SecurityGroup(
      "db-sg",
      {
        vpcId: params.vpc.vpcId,
        description: "Security group for RDS PostgreSQL",
        ingress: [
          {
            protocol: "tcp",
            fromPort: 5432,
            toPort: 5432,
            cidrBlocks: ["10.0.0.0/8"],
          },
        ],
        egress: [
          {
            protocol: "-1",
            fromPort: 0,
            toPort: 0,
            cidrBlocks: ["0.0.0.0/0"],
          },
        ],
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
        instanceClass: params.instanceClass,
        allocatedStorage: params.allocatedStorage,
        dbName: params.databaseName,
        username: params.username,
        password: password.result,
        dbSubnetGroupName: subnetGroup.name,
        vpcSecurityGroupIds: [this.securityGroup.id],
        skipFinalSnapshot: false,
        finalSnapshotIdentifier: `${pulumi.getProject()}-${pulumi.getStack()}-final`,
        storageEncrypted: true,
        multiAz: false,
      },
      { parent: this, dependsOn: [secretVersion] },
    );

    this.registerOutputs({
      instanceEndpoint: this.instance.endpoint,
      secretArn: this.secret.arn,
    });
  }
}
