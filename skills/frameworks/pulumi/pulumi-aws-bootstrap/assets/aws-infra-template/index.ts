import * as pulumi from "@pulumi/pulumi";

import { Backend } from "./components/backend";
import { Cluster } from "./components/cluster";
import { Database } from "./components/database";
import { Network } from "./components/network";
import { StaticSite } from "./lib";

const vpcConfig = new pulumi.Config("vpc");
const dbConfig = new pulumi.Config("db");
const backendConfig = new pulumi.Config("backend");
const webappConfig = new pulumi.Config("webapp");
const domainsConfig = new pulumi.Config("domains");

const network = new Network("network", {
  addresses: vpcConfig.require("addresses"),
  maxAzs: vpcConfig.requireNumber("maxAzs"),
  natGateways: vpcConfig.requireNumber("natGateways"),
  subnets: vpcConfig.requireObject("subnets"),
});

const database = new Database("database", {
  vpc: network.vpc,
  instanceClass: dbConfig.require("instanceClass"),
  allocatedStorage: dbConfig.requireNumber("allocatedStorage"),
  engineVersion: dbConfig.require("engineVersion"),
  databaseName: dbConfig.require("databaseName"),
  username: dbConfig.require("username"),
});

const cluster = new Cluster("cluster", {
  clusterName: `${pulumi.getProject()}-${pulumi.getStack()}`,
});

const webUrl = `https://${webappConfig.require("dns")}`;

const backend = new Backend("backend", {
  cluster: cluster.cluster,
  vpc: network.vpc,
  database: {
    host: database.instance.address,
    port: database.instance.port,
    name: database.instance.dbName,
    secretArn: database.appSecret.arn,
    securityGroupId: database.securityGroup.id,
  },
  dns: backendConfig.require("dns"),
  dnsZone: domainsConfig.require("dnsZone"),
  webappUrl: webUrl,
  cpu: backendConfig.require("cpu"),
  memory: backendConfig.require("memory"),
  environment: {
    WEB_URL: webUrl,
    API_URL: `https://${backendConfig.require("dns")}`,
    DEBUG: backendConfig.requireBoolean("debug").toString(),
  },
  secrets: { BETTER_AUTH_SECRET: backendConfig.requireSecret("authSecret") },
});

const webappSite = new StaticSite("webapp", {
  dns: webappConfig.require("dns"),
  dnsZone: domainsConfig.require("dnsZone"),
});

export const vpcId = network.vpc.vpcId;
export const clusterArn = cluster.cluster.arn;
export const clusterName = cluster.cluster.name;
export const dbEndpoint = database.instance.endpoint;
export const dbSecretArn = database.masterSecretArn;
export const dbAppSecretArn = database.appSecret.arn;
export const publicSubnetIds = network.vpc.publicSubnetIds;
export const ecrRepositoryUrl = backend.registry.repository.repositoryUrl;
export const backendServiceName = backend.service.service.name;
export const backendTaskFamily = backend.service.taskDefinition.family;
export const backendContainerName = backend.service.containerName;
export const backendSecurityGroupId = backend.service.securityGroup.id;
export const backendServiceUrl = backend.service.loadBalancer.dnsName;
export const webappUrl = webappSite.url;
export const webappBucketName = webappSite.bucketName;
export const webappDistributionId = webappSite.distributionId;
