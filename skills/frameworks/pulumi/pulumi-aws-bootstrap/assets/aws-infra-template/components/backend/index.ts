import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import * as pulumi from "@pulumi/pulumi";

import { BackendBuckets } from "./buckets";
import { BackendRegistry, type BackendRegistryConfig } from "./registry";
import { BackendService } from "./service";

export { BackendBuckets as Buckets } from "./buckets";
export {
  BackendRegistry as Registry,
  type BackendRegistryConfig as RegistryConfig,
} from "./registry";
export { BackendService as Service } from "./service";

export type BackendConfig = {
  cluster: aws.ecs.Cluster;
  vpc: awsx.ec2.Vpc;
  databaseUrl: pulumi.Input<string>;
  environment: Record<string, pulumi.Input<string>>;
  dns: string;
  dnsZone: string;
  webappUrl: pulumi.Input<string>;
  useSampleImage: boolean;
  commitHash?: string;
  replicas: number;
  cpu: string;
  memory: string;
  registry?: BackendRegistryConfig;
};

export class Backend extends pulumi.ComponentResource {
  public readonly buckets: BackendBuckets;
  public readonly registry: BackendRegistry;
  public readonly service: BackendService;

  constructor(name: string, params: BackendConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:components:Backend`, name, {}, opts);

    this.buckets = new BackendBuckets(
      "buckets",
      { webappUrl: params.webappUrl },
      { parent: this },
    );

    this.registry = new BackendRegistry("registry", params.registry, { parent: this });

    this.service = new BackendService(
      "service",
      {
        cluster: params.cluster,
        vpc: params.vpc,
        repositoryUrl: this.registry.repository.repositoryUrl,
        databaseUrl: params.databaseUrl,
        environment: params.environment,
        appDataBucket: this.buckets.appData.bucket,
        appDataBucketArn: this.buckets.appData.arn,
        dns: params.dns,
        dnsZone: params.dnsZone,
        useSampleImage: params.useSampleImage,
        commitHash: params.commitHash,
        replicas: params.replicas,
        cpu: params.cpu,
        memory: params.memory,
      },
      { parent: this },
    );

    this.registerOutputs({
      appBackupsBucket: this.buckets.appBackups.bucket,
      appDataBucket: this.buckets.appData.bucket,
      repositoryUrl: this.registry.repository.repositoryUrl,
      serviceArn: this.service.service.id,
      loadBalancerDns: this.service.loadBalancer.dnsName,
    });
  }
}
