"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactMultiEnvCdkpipelineStack = void 0;
const cdk = require("@aws-cdk/core");
const pipelines = require("@aws-cdk/pipelines");
const codepipeline = require("@aws-cdk/aws-codepipeline");
const actions = require("@aws-cdk/aws-codepipeline-actions");
const iam = require("@aws-cdk/aws-iam");
class ReactMultiEnvCdkpipelineStack extends cdk.Stack {
    constructor(scope, id, props) {
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
                buildCommand: 'npm ci && cd react-multi-env && npm ci && npm run build && cd .. && npx cdk synth –-plugin cdk-assume-role-credential-plugin',
                synthCommand: 'npx cdk synth –-plugin cdk-assume-role-credential-plugin'
            })
        });
    }
}
exports.ReactMultiEnvCdkpipelineStack = ReactMultiEnvCdkpipelineStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbXVsdGktZW52LWNka3BpcGVsaW5lLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVhY3QtbXVsdGktZW52LWNka3BpcGVsaW5lLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxnREFBK0M7QUFDL0MsMERBQTBEO0FBQzFELDZEQUE2RDtBQUM3RCx3Q0FBd0M7QUFPeEMsTUFBYSw2QkFBOEIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUcxRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQXlCO1FBQ3JFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLE1BQU0sY0FBYyxHQUFHLElBQUksWUFBWSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELE1BQU0scUJBQXFCLEdBQUcsSUFBSSxZQUFZLENBQUMsUUFBUSxFQUFFLENBQUM7UUFFMUQsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUMxRCxZQUFZLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBSSxtQkFBbUI7WUFDOUMscUJBQXFCO1lBQ3JCLFlBQVksRUFBRSxJQUFJLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQztnQkFDM0MsVUFBVSxFQUFFLFFBQVE7Z0JBQ3BCLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixVQUFVLEVBQUUsR0FBRyxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsY0FBYyxDQUFDO2dCQUMxRCxPQUFPLEVBQUUsT0FBTyxDQUFDLGFBQWEsQ0FBQyxPQUFPO2dCQUN0QyxLQUFLLEVBQUUsa0JBQWtCO2dCQUN6QixJQUFJLEVBQUUsNkJBQTZCO2dCQUNuQyxNQUFNLEVBQUUsTUFBTTthQUNmLENBQUM7WUFDRixXQUFXLEVBQUUsU0FBUyxDQUFDLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDO2dCQUN4RCxjQUFjO2dCQUNkLHFCQUFxQjtnQkFDckIsb0JBQW9CLEVBQUU7b0JBQ3BCLElBQUksR0FBRyxDQUFDLGVBQWUsQ0FBQzt3QkFDdEIsTUFBTSxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSzt3QkFDeEIsT0FBTyxFQUFFOzRCQUNQLGdCQUFnQjt5QkFDakI7d0JBQ0QsU0FBUyxFQUFFOzRCQUNULHNDQUFzQzt5QkFDdkM7cUJBQ0YsQ0FBQztvQkFDRixJQUFJLEdBQUcsQ0FBQyxlQUFlLENBQUM7d0JBQ3RCLE1BQU0sRUFBRSxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUs7d0JBQ3hCLE9BQU8sRUFBRTs0QkFDUCxnQkFBZ0I7eUJBQ2pCO3dCQUNELFNBQVMsRUFBRTs0QkFDVCxtQ0FBbUM7eUJBQ3BDO3FCQUNGLENBQUM7aUJBQ0g7Z0JBQ0QsWUFBWSxFQUFFLDhIQUE4SDthQUM3SSxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBaERELHNFQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcbmltcG9ydCAqIGFzIHBpcGVsaW5lcyBmcm9tICdAYXdzLWNkay9waXBlbGluZXMnXG5pbXBvcnQgKiBhcyBjb2RlcGlwZWxpbmUgZnJvbSAnQGF3cy1jZGsvYXdzLWNvZGVwaXBlbGluZSc7XG5pbXBvcnQgKiBhcyBhY3Rpb25zIGZyb20gJ0Bhd3MtY2RrL2F3cy1jb2RlcGlwZWxpbmUtYWN0aW9ucyc7XG5pbXBvcnQgKiBhcyBpYW0gZnJvbSAnQGF3cy1jZGsvYXdzLWlhbSc7XG5cblxuZXhwb3J0IGludGVyZmFjZSBQaXBlbGluZVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XG4gIG5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGNsYXNzIFJlYWN0TXVsdGlFbnZDZGtwaXBlbGluZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcbiAgcHVibGljIHJlYWRvbmx5IHBpcGVsaW5lOiBwaXBlbGluZXMuQ2RrUGlwZWxpbmU7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IGNkay5Db25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBQaXBlbGluZVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIGNvbnN0IHNvdXJjZUFydGlmYWN0ID0gbmV3IGNvZGVwaXBlbGluZS5BcnRpZmFjdCgpO1xuICAgIGNvbnN0IGNsb3VkQXNzZW1ibHlBcnRpZmFjdCA9IG5ldyBjb2RlcGlwZWxpbmUuQXJ0aWZhY3QoKTtcblxuICAgIHRoaXMucGlwZWxpbmUgPSBuZXcgcGlwZWxpbmVzLkNka1BpcGVsaW5lKHRoaXMsICdQaXBlbGluZScsIHtcbiAgICAgIHBpcGVsaW5lTmFtZTogYCR7cHJvcHMubmFtZX0tRGVsaXZlcnlQaXBlbGluZWAsXG4gICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICBzb3VyY2VBY3Rpb246IG5ldyBhY3Rpb25zLkdpdEh1YlNvdXJjZUFjdGlvbih7XG4gICAgICAgIGFjdGlvbk5hbWU6ICdHaXRIdWInLFxuICAgICAgICBvdXRwdXQ6IHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBvYXV0aFRva2VuOiBjZGsuU2VjcmV0VmFsdWUuc2VjcmV0c01hbmFnZXIoJ2dpdGh1Yi10b2tlbicpLFxuICAgICAgICB0cmlnZ2VyOiBhY3Rpb25zLkdpdEh1YlRyaWdnZXIuV0VCSE9PSyxcbiAgICAgICAgb3duZXI6ICdXYW5nV2VpaHVhR2l0SHViJyxcbiAgICAgICAgcmVwbzogJ3JlYWN0LW11bHRpLWVudi1jZGtwaXBlbGluZScsXG4gICAgICAgIGJyYW5jaDogJ21haW4nXG4gICAgICB9KSxcbiAgICAgIHN5bnRoQWN0aW9uOiBwaXBlbGluZXMuU2ltcGxlU3ludGhBY3Rpb24uc3RhbmRhcmROcG1TeW50aCh7XG4gICAgICAgIHNvdXJjZUFydGlmYWN0LFxuICAgICAgICBjbG91ZEFzc2VtYmx5QXJ0aWZhY3QsXG4gICAgICAgIHJvbGVQb2xpY3lTdGF0ZW1lbnRzOiBbXG4gICAgICAgICAgbmV3IGlhbS5Qb2xpY3lTdGF0ZW1lbnQoe1xuICAgICAgICAgICAgZWZmZWN0OiBpYW0uRWZmZWN0LkFMTE9XLFxuICAgICAgICAgICAgYWN0aW9uczogW1xuICAgICAgICAgICAgICBcInN0czpBc3N1bWVSb2xlXCIsXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgcmVzb3VyY2VzOiBbXG4gICAgICAgICAgICAgIFwiYXJuOmF3czppYW06Oio6cm9sZS9jZGstcmVhZE9ubHlSb2xlXCJcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9KSxcbiAgICAgICAgICBuZXcgaWFtLlBvbGljeVN0YXRlbWVudCh7XG4gICAgICAgICAgICBlZmZlY3Q6IGlhbS5FZmZlY3QuQUxMT1csXG4gICAgICAgICAgICBhY3Rpb25zOiBbXG4gICAgICAgICAgICAgIFwic3RzOkFzc3VtZVJvbGVcIixcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICByZXNvdXJjZXM6IFtcbiAgICAgICAgICAgICAgXCJhcm46YXdzOmlhbTo6Kjpyb2xlL2Nkay13cml0ZVJvbGVcIlxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0pXG4gICAgICAgIF0sXG4gICAgICAgIGJ1aWxkQ29tbWFuZDogJ25wbSBjaSAmJiBjZCByZWFjdC1tdWx0aS1lbnYgJiYgbnBtIGNpICYmIG5wbSBydW4gYnVpbGQgJiYgY2QgLi4gJiYgbnB4IGNkayBzeW50aCDigJMtcGx1Z2luIGNkay1hc3N1bWUtcm9sZS1jcmVkZW50aWFsLXBsdWdpbidcbiAgICAgIH0pXG4gICAgfSk7XG4gIH1cbn1cblxuIl19