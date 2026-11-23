import * as pulumi from "@pulumi/pulumi";

import { Backend } from "./components/backend";
import { Cluster } from "./components/cluster";
import { Database } from "./components/database";
import { Network } from "./components/network";
import { StaticSite } from "./lib";

const pulumiConfig = new pulumi.Config();
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
  vpc: network.vpc,
  clusterName: `${pulumi.getProject()}-${pulumi.getStack()}`,
});

const databaseUrl = pulumi.interpolate`postgresql://${database.instance.username}:${database.instance.password}@${database.instance.address}:${database.instance.port}/${database.instance.dbName}?sslmode=require`;

const webUrl = `https://${webappConfig.require("dns")}`;

const backend = new Backend("backend", {
  cluster: cluster.cluster,
  vpc: network.vpc,
  databaseUrl,
  dns: backendConfig.require("dns"),
  dnsZone: domainsConfig.require("dnsZone"),
  webappUrl: webUrl,
  useSampleImage: backendConfig.requireBoolean("useSampleImage"),
  replicas: backendConfig.requireNumber("replicas"),
  commitHash: pulumiConfig.get("commitHash"),
  cpu: backendConfig.require("cpu"),
  memory: backendConfig.require("memory"),
  environment: {
    WEB_URL: webUrl,
    API_URL: `https://${backendConfig.require("dns")}`,
    BETTER_AUTH_SECRET: backendConfig.requireSecret("authSecret"),
    DEBUG: backendConfig.requireBoolean("debug").toString(),
  },
});

const webappSite = new StaticSite("webapp", {
  dns: webappConfig.require("dns"),
  dnsZone: domainsConfig.require("dnsZone"),
});

export const vpcId = network.vpc.vpcId;
export const clusterArn = cluster.cluster.arn;
export const clusterName = cluster.cluster.name;
export const dbEndpoint = database.instance.endpoint;
export const dbSecretArn = database.secret.arn;
export const ecrRepositoryUrl = backend.registry.repository.repositoryUrl;
export const backendServiceName = backend.service.service.name;
export const backendServiceUrl = backend.service.loadBalancer.dnsName;
export const webappUrl = webappSite.url;
export const webappBucketName = webappSite.bucketName;
export const webappDistributionId = webappSite.distributionId;
