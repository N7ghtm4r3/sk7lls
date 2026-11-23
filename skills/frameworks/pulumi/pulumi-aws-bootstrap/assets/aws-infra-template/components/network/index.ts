import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

export type NetworkConfig = {
  addresses: string;
  maxAzs: number;
  natGateways: number;
  subnets: { cidrMask: number; name: string; subnetType: awsx.ec2.SubnetType }[];
};

export class Network extends pulumi.ComponentResource {
  public readonly vpc: awsx.ec2.Vpc;

  constructor(name: string, params: NetworkConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:Network`, name, {}, opts);

    this.vpc = new awsx.ec2.Vpc(
      "main",
      {
        cidrBlock: params.addresses,
        numberOfAvailabilityZones: params.maxAzs,
        natGateways: { strategy: params.natGateways === 0 ? "None" : "OnePerAz" },
        subnetSpecs: params.subnets.map((subnet) => ({
          cidrMask: subnet.cidrMask,
          name: subnet.name,
          type: subnet.subnetType,
        })),
      },
      { parent: this },
    );

    this.registerOutputs({
      vpcId: this.vpc.vpcId,
    });
  }
}
