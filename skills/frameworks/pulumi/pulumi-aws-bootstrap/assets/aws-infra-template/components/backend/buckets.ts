import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export type BackendBucketsConfig = {
  webappUrl: pulumi.Input<string>;
};

export class BackendBuckets extends pulumi.ComponentResource {
  public readonly appBackups: aws.s3.Bucket;
  public readonly appData: aws.s3.Bucket;

  constructor(
    name: string,
    params: BackendBucketsConfig,
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super(`${pulumi.getProject()}:components:BackendBuckets`, name, {}, opts);

    const stack = pulumi.getStack();

    this.appBackups = new aws.s3.Bucket(
      "app-backups",
      { bucket: `${pulumi.getProject()}-${stack}-app-backups` },
      { parent: this },
    );

    this.appData = new aws.s3.Bucket(
      "app-data",
      { bucket: `${pulumi.getProject()}-${stack}-app-data` },
      { parent: this },
    );

    new aws.s3.BucketCorsConfiguration(
      "app-data-cors",
      {
        bucket: this.appData.id,
        corsRules: [
          {
            allowedHeaders: ["*"],
            allowedMethods: ["GET", "HEAD", "PUT", "POST", "DELETE"],
            allowedOrigins: [params.webappUrl],
            exposeHeaders: ["ETag"],
            maxAgeSeconds: 3000,
          },
        ],
      },
      { parent: this },
    );

    this.registerOutputs({
      appBackupsBucket: this.appBackups.bucket,
      appDataBucket: this.appData.bucket,
    });
  }
}
