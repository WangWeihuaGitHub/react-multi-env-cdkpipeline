#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ReactMultiEnvCdkpipelineStack } from '../lib/react-multi-env-cdkpipeline-stack';
import { InfrastructureStage } from '../lib/react-multi-env-stage';

const app = new cdk.App();
const delivery = new ReactMultiEnvCdkpipelineStack(app, 'react-DeliveryPipeline', {
  name: 'react-app',
  env: {
    account: '290434217788',
    region: 'us-west-2',
  }
});

delivery.pipeline.addApplicationStage(
  new InfrastructureStage(app, 'devReactApp', { 
    name : `tpx-dev`,
    domainname : `tpx-dev.tpxaws-dev.com`,
    hostedzone : `tpxaws-dev.com`,
    acmCertRef : `arn:aws:acm:us-east-1:915271087263:certificate/3d7ecafe-754c-4abc-a201-5acdda274d97`,
    env: {
      account: '915271087263',
      region: 'us-west-2'
    }
  })
);

delivery.pipeline.addApplicationStage(
  new InfrastructureStage(app, 'qaReactApp', {
    name : `tpx-qa`,
    domainname : `tpx-qa.tpxaws-qa.com`,
    hostedzone : `tpxaws-qa.com`,
    acmCertRef : `arn:aws:acm:us-east-1:500748059377:certificate/45c003cd-d9b3-4027-962e-6527916134f8`,
    env: {
      account: '500748059377',
      region: 'us-west-2'
    }
  })
);

