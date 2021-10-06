#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ReactMultiEnvCdkpipelineStack } from '../lib/react-multi-env-cdkpipeline-stack';
import { InfrastructureStage } from '../lib/react-multi-env-stage';

const app = new cdk.App();
const delivery = new ReactMultiEnvCdkpipelineStack(app, 'react-app-DeliveryPipeline', {
  name: 'react-app',
  env: {
    account: '290434217788',
    region: 'us-west-2',
  }
});

delivery.pipeline.addApplicationStage(
  new InfrastructureStage(app, 'devReactApp', { 
    name : `react-dev`,
    domainname : `react-dev.tpxaws-dev.com`,
    hostedzone : `tpxaws-dev.com`,
    acmCertRef : `arn:aws:acm:us-east-1:915271087263:certificate/516abaed-3044-4355-9948-86d576d4d0f9`,
    env: {
      account: '915271087263',
      region: 'us-west-2'
    }
  })
);

delivery.pipeline.addApplicationStage(
  new InfrastructureStage(app, 'qaReactApp', {
    name : `react-qa`,
    domainname : `react-qa.tpxaws-qa.com`,
    hostedzone : `tpxaws-qa.com`,
    acmCertRef : `arn:aws:acm:us-east-1:500748059377:certificate/9aca71ba-5d29-4455-a1cf-fd1dc6e7a0aa`,
    env: {
      account: '500748059377',
      region: 'us-west-2'
    }
  })
);

