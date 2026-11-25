import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export type ClusterConfig = {
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

    this.registerOutputs({
      clusterArn: this.cluster.arn,
      clusterName: this.cluster.name,
    });
  }
}
