#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { RequiredResourcesStack } from '../lib/required-resources';

const dev = { account: '915271087263', region: 'us-west-2' }
const qa = { account: '500748059377', region: 'us-west-2' }
const trustedAccount = '290434217788';

const app = new cdk.App();

new RequiredResourcesStack(app, 'dev', {
  env: dev,
  trustedAccount
});

new RequiredResourcesStack(app, 'qa', {
  env: qa,
  trustedAccount
});
