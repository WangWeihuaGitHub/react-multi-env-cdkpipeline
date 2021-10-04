import * as cdk from "@aws-cdk/core";
import * as s3 from "@aws-cdk/aws-s3";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as cloudFront from "@aws-cdk/aws-cloudfront";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from '@aws-cdk/aws-route53-targets';

export interface InfraStackProps extends cdk.StackProps {
    name: string;
    domainname: string;
    hostedzone: string;
    acmCertRef: string;
}

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: InfraStackProps) {
    super(scope, id, props);

    // Add S3 Bucket
    const s3Site = new s3.Bucket(this, `${props.name}`, {
      bucketName: `${props.name}-s3`,
      publicReadAccess: true,
      websiteIndexDocument: "index.html",
      websiteErrorDocument: "index.html"
    });
    this.enableCorsOnBucket(s3Site);

    // Create a new CloudFront Distribution
    const distribution = new cloudFront.CloudFrontWebDistribution(
      this,
      `${props.name}-cf-distribution`,
      {
        // viewerCertificate: {
        //   aliases: ['tpx-dev.tpxaws-dev.com'],
        //   props: {
        //     acmCertificateArn: 'arn:aws:acm:us-east-1:915271087263:certificate/3d7ecafe-754c-4abc-a201-5acdda274d97', // optional
        //     sslSupportMethod: cloudFront.SSLMethod.SNI,
        //     minimumProtocolVersion: cloudFront.SecurityPolicyProtocol.TLS_V1_2_2021
        //     // All `props` options here: https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-cloudfront.CfnDistribution.ViewerCertificateProperty.html
        //   }
        // },
       aliasConfiguration: {
          acmCertRef:  `${props.acmCertRef}`,//'arn:aws:acm:us-east-1:915271087263:certificate/3d7ecafe-754c-4abc-a201-5acdda274d97',
          names: [`${props.domainname}`],
          sslMethod: cloudFront.SSLMethod.SNI,
          securityPolicy: cloudFront.SecurityPolicyProtocol.TLS_V1_2_2021,
        },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: s3Site
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                compress: true,
                allowedMethods: cloudFront.CloudFrontAllowedMethods.ALL,
                cachedMethods:
                  cloudFront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
                forwardedValues: {
                  queryString: true,
                  cookies: {
                    forward: "none"
                  },
                  headers: [
                    "Access-Control-Request-Headers",
                    "Access-Control-Request-Method",
                    "Origin"
                  ]
                }
              }
            ]
          }
        ],
        comment: `${props.name} - CloudFront Distribution`,
        viewerProtocolPolicy: cloudFront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS
      }
    );

    // Setup Bucket Deployment to automatically deploy new assets and invalidate cache
    new s3deploy.BucketDeployment(this, `${props.name}-s3deployment`, {
      sources: [s3deploy.Source.asset("../build")],
      destinationBucket: s3Site,
      distribution: distribution,
      distributionPaths: ["/*"]
    });
    
    //const hostedZoneId = cdk.Fn.importValue(`infra-r53-zones-region::PrivateZoneId`)
    const zone = route53.HostedZone.fromLookup(this, 'baseZone',{
      domainName: `${props.hostedzone}`//'tpxaws-dev.com'
    });
    new route53.ARecord(this, 'SiteAliasRecord', {
      recordName: `${props.domainname}`,//'tpx-dev.tpxaws-dev.com',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),//distribution,
      zone,
    });

    // Final CloudFront URL
    new cdk.CfnOutput(this, "CloudFront URL", {
      value: distribution.domainName
    });
    new cdk.CfnOutput(this, "SiteUrl", {
      value: `https://${props.domainname}`
    });
  }

  /**
   * Enables CORS access on the given bucket
   *
   * @memberof CxpInfrastructureStack
   */
  enableCorsOnBucket = (bucket: s3.IBucket) => {
    const cfnBucket = bucket.node.findChild("Resource") as s3.CfnBucket;
    cfnBucket.addPropertyOverride("CorsConfiguration", {
      CorsRules: [
        {
          AllowedOrigins: ["*"],
          AllowedMethods: ["HEAD", "GET", "PUT", "POST", "DELETE"],
          ExposedHeaders: [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2"
          ],
          AllowedHeaders: ["*"]
        }
      ]
    });
  };
}