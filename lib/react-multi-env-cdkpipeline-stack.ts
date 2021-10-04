import * as cdk from '@aws-cdk/core';
import * as pipelines from '@aws-cdk/pipelines'
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as actions from '@aws-cdk/aws-codepipeline-actions';
import * as iam from '@aws-cdk/aws-iam';


export interface PipelineStackProps extends cdk.StackProps {
  name: string;
}

export class ReactMultiEnvCdkpipelineStack extends cdk.Stack {
  public readonly pipeline: pipelines.CdkPipeline;

  constructor(scope: cdk.Construct, id: string, props: PipelineStackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    this.pipeline = new pipelines.CdkPipeline(this, 'Pipeline', {
      pipelineName: `${props.name}-DeliveryPipeline`,
      cloudAssemblyArtifact,
      sourceAction: new actions.GitHubSourceAction({
        actionName: 'GitHub',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-token'),
        trigger: actions.GitHubTrigger.WEBHOOK,
        owner: 'WangWeihuaGitHub',
        repo: 'react-multi-env-cdkpipeline',
        branch: 'main'
      }),
      synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
        sourceArtifact,
        cloudAssemblyArtifact,
        rolePolicyStatements: [
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "sts:AssumeRole",
            ],
            resources: [
              "arn:aws:iam::*:role/cdk-readOnlyRole"
            ]
          }),
          new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: [
              "sts:AssumeRole",
            ],
            resources: [
              "arn:aws:iam::*:role/cdk-writeRole"
            ]
          })
        ],
        buildCommand: 'npm ci && cd react-multi-env && npm ci && npm run build && cd .. && npx cdk synth –-plugin cdk-assume-role-credential-plugin'
      })
    });
  }
}

