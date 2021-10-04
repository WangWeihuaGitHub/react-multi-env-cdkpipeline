import { CfnOutput, Construct, Stage, StageProps } from '@aws-cdk/core';
import { InfrastructureStack } from './react-multi-env-stack';

/**
 * Deployable unit of web service app
 */
 export interface InfraStageProps extends StageProps {
    name: string;
    domainname: string;
    hostedzone: string;
    acmCertRef: string;
}
export class InfrastructureStage extends Stage {
  
  constructor(scope: Construct, id: string, props: InfraStageProps) {
    super(scope, id, props);

    const service = new InfrastructureStack(this, 'ReactMultiEnvApp', {
        name : props.name,
        domainname : props.domainname,
        hostedzone : props.hostedzone,
        acmCertRef : props.acmCertRef,
        env: props?.env});
  }
}