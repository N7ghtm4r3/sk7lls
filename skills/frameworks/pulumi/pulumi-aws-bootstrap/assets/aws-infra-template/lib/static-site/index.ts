import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export type StaticSiteConfig = {
  dns: string;
  dnsZone: string;
  /** Path prefix for S3 objects served as index (default: index.html) */
  indexDocument?: string;
  /** Custom error document (default: index.html for SPA routing) */
  errorDocument?: string;
  /** CloudFront price class (default: PriceClass_100 — US/EU only) */
  priceClass?: string;
};

export class StaticSite extends pulumi.ComponentResource {
  public readonly bucket: aws.s3.Bucket;
  public readonly distribution: aws.cloudfront.Distribution;
  public readonly bucketName: pulumi.Output<string>;
  public readonly distributionId: pulumi.Output<string>;
  public readonly url: pulumi.Output<string>;

  constructor(name: string, params: StaticSiteConfig, opts?: pulumi.ComponentResourceOptions) {
    super(`${pulumi.getProject()}:lib:StaticSite`, name, {}, opts);

    const indexDocument = params.indexDocument ?? "index.html";
    const errorDocument = params.errorDocument ?? "index.html";

    // S3 bucket
    this.bucket = new aws.s3.Bucket(
      `${name}-bucket`,
      {
        bucket: `${pulumi.getProject()}-site-${name}-${pulumi.getStack()}`,
        forceDestroy: true,
      },
      { parent: this },
    );

    new aws.s3.BucketPublicAccessBlock(
      `${name}-bucket-public-access`,
      {
        bucket: this.bucket.id,
        blockPublicAcls: true,
        blockPublicPolicy: true,
        ignorePublicAcls: true,
        restrictPublicBuckets: true,
      },
      { parent: this },
    );

    // CloudFront Origin Access Control
    const oac = new aws.cloudfront.OriginAccessControl(
      `${name}-oac`,
      {
        name: `${name}-${pulumi.getStack()}`,
        originAccessControlOriginType: "s3",
        signingBehavior: "always",
        signingProtocol: "sigv4",
      },
      { parent: this },
    );

    // DNS zone
    const zone = aws.route53.getZoneOutput({ name: params.dnsZone });

    // ACM certificate — must be in us-east-1 for CloudFront
    const usEast1 = new aws.Provider(
      `${name}-us-east-1`,
      { region: "us-east-1" },
      { parent: this },
    );

    const certificate = new aws.acm.Certificate(
      `${name}-cert`,
      {
        domainName: params.dns,
        validationMethod: "DNS",
      },
      { parent: this, provider: usEast1 },
    );

    const certValidationRecord = new aws.route53.Record(
      `${name}-cert-validation`,
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
      `${name}-cert-validation-wait`,
      {
        certificateArn: certificate.arn,
        validationRecordFqdns: [certValidationRecord.fqdn],
      },
      { parent: this, provider: usEast1 },
    );

    // CloudFront response headers policy — security defaults + SPA cache
    const responseHeadersPolicy = new aws.cloudfront.ResponseHeadersPolicy(
      `${name}-response-headers`,
      {
        name: `${name}-${pulumi.getStack()}-headers`,
        securityHeadersConfig: {
          contentTypeOptions: { override: true },
          frameOptions: { frameOption: "DENY", override: true },
          referrerPolicy: { referrerPolicy: "strict-origin-when-cross-origin", override: true },
          strictTransportSecurity: {
            accessControlMaxAgeSec: 31536000,
            includeSubdomains: true,
            preload: true,
            override: true,
          },
        },
      },
      { parent: this },
    );

    // CloudFront distribution
    this.distribution = new aws.cloudfront.Distribution(
      `${name}-cdn`,
      {
        enabled: true,
        isIpv6Enabled: true,
        defaultRootObject: indexDocument,
        aliases: [params.dns],
        priceClass: params.priceClass ?? "PriceClass_100",

        origins: [
          {
            domainName: this.bucket.bucketRegionalDomainName,
            originId: "s3",
            originAccessControlId: oac.id,
          },
        ],

        defaultCacheBehavior: {
          targetOriginId: "s3",
          viewerProtocolPolicy: "redirect-to-https",
          allowedMethods: ["GET", "HEAD", "OPTIONS"],
          cachedMethods: ["GET", "HEAD"],
          compress: true,
          responseHeadersPolicyId: responseHeadersPolicy.id,
          forwardedValues: {
            queryString: false,
            cookies: { forward: "none" },
          },
        },

        customErrorResponses: [
          {
            errorCode: 403,
            responseCode: 200,
            responsePagePath: `/${errorDocument}`,
            errorCachingMinTtl: 10,
          },
          {
            errorCode: 404,
            responseCode: 200,
            responsePagePath: `/${errorDocument}`,
            errorCachingMinTtl: 10,
          },
        ],

        restrictions: {
          geoRestriction: { restrictionType: "none" },
        },

        viewerCertificate: {
          acmCertificateArn: certValidation.certificateArn,
          sslSupportMethod: "sni-only",
          minimumProtocolVersion: "TLSv1.2_2021",
        },
      },
      { parent: this },
    );

    // S3 bucket policy — allow CloudFront OAC
    new aws.s3.BucketPolicy(
      `${name}-bucket-policy`,
      {
        bucket: this.bucket.id,
        policy: pulumi.all([this.bucket.arn, this.distribution.arn]).apply(([bucketArn, distArn]) =>
          JSON.stringify({
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "AllowCloudFrontGetObject",
                Effect: "Allow",
                Principal: { Service: "cloudfront.amazonaws.com" },
                Action: "s3:GetObject",
                Resource: `${bucketArn}/*`,
                Condition: { StringEquals: { "AWS:SourceArn": distArn } },
              },
              {
                Sid: "AllowCloudFrontListBucket",
                Effect: "Allow",
                Principal: { Service: "cloudfront.amazonaws.com" },
                Action: "s3:ListBucket",
                Resource: bucketArn,
                Condition: { StringEquals: { "AWS:SourceArn": distArn } },
              },
            ],
          }),
        ),
      },
      { parent: this },
    );

    // DNS record
    new aws.route53.Record(
      `${name}-dns`,
      {
        zoneId: zone.zoneId,
        name: params.dns,
        type: "A",
        aliases: [
          {
            name: this.distribution.domainName,
            zoneId: this.distribution.hostedZoneId,
            evaluateTargetHealth: false,
          },
        ],
      },
      { parent: this },
    );

    this.bucketName = this.bucket.bucket;
    this.distributionId = this.distribution.id;
    this.url = pulumi.interpolate`https://${params.dns}`;

    this.registerOutputs({
      bucketName: this.bucketName,
      distributionId: this.distributionId,
      url: this.url,
    });
  }
}
