import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

export type BackendRegistryConfig = {
  imageTagMutability?: "MUTABLE" | "IMMUTABLE";
};

export class BackendRegistry extends pulumi.ComponentResource {
  public readonly repository: aws.ecr.Repository;
  public readonly lifecyclePolicy: aws.ecr.LifecyclePolicy;

  constructor(
    name: string,
    params: BackendRegistryConfig = {},
    opts?: pulumi.ComponentResourceOptions,
  ) {
    super(`${pulumi.getProject()}:components:Registry`, name, {}, opts);

    this.repository = new aws.ecr.Repository(
      "backend-repo",
      {
        name: `${pulumi.getProject()}/${pulumi.getStack()}/backend`,
        imageTagMutability: params.imageTagMutability ?? "IMMUTABLE",
        imageScanningConfiguration: { scanOnPush: true },
        forceDelete: false,
      },
      { parent: this },
    );

    this.lifecyclePolicy = new aws.ecr.LifecyclePolicy(
      "backend-repo-lifecycle",
      {
        repository: this.repository.name,
        policy: JSON.stringify({
          rules: [
            {
              rulePriority: 1,
              description: "Keep last 10 images",
              selection: {
                tagStatus: "any",
                countType: "imageCountMoreThan",
                countNumber: 10,
              },
              action: { type: "expire" },
            },
          ],
        }),
      },
      { parent: this },
    );

    this.registerOutputs({
      repositoryUrl: this.repository.repositoryUrl,
      repositoryArn: this.repository.arn,
    });
  }
}
