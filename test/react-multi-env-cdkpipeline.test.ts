import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as ReactMultiEnvCdkpipeline from '../lib/react-multi-env-cdkpipeline-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new ReactMultiEnvCdkpipeline.ReactMultiEnvCdkpipelineStack(app, 'MyTestStack', {name:'test'});
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
