import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

export type ClusterConfig = {
  vpc: awsx.ec2.Vpc;
  clusterName: string;
};

export class Cluster extends pulumi.ComponentResource {
  public readonly cluster: aws.ecs.Cluster;

  constructor(name: string, params: ClusterConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:Cluster`, name, {}, opts);

    this.cluster = new aws.ecs.Cluster(
      "cluster",
      {
        name: params.clusterName,
        settings: [{ name: "containerInsights", value: "enabled" }],
      },
      { parent: this },
    );

    new aws.ecs.ClusterCapacityProviders(
      "cluster-capacity-providers",
      {
        clusterName: this.cluster.name,
        capacityProviders: ["FARGATE", "FARGATE_SPOT"],
        defaultCapacityProviderStrategies: [
          { capacityProvider: "FARGATE", weight: 1, base: 1 },
          { capacityProvider: "FARGATE_SPOT", weight: 1 },
        ],
      },
      { parent: this },
    );

    this.registerOutputs({
      clusterArn: this.cluster.arn,
      clusterName: this.cluster.name,
    });
  }
}
