"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfrastructureStack = void 0;
const cdk = require("@aws-cdk/core");
const s3 = require("@aws-cdk/aws-s3");
const s3deploy = require("@aws-cdk/aws-s3-deployment");
const cloudFront = require("@aws-cdk/aws-cloudfront");
const route53 = require("@aws-cdk/aws-route53");
const targets = require("@aws-cdk/aws-route53-targets");
class InfrastructureStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        /**
         * Enables CORS access on the given bucket
         *
         * @memberof CxpInfrastructureStack
         */
        this.enableCorsOnBucket = (bucket) => {
            const cfnBucket = bucket.node.findChild("Resource");
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
        // Add S3 Bucket
        const s3Site = new s3.Bucket(this, `${props.name}`, {
            bucketName: `${props.name}-s3`,
            publicReadAccess: true,
            websiteIndexDocument: "index.html",
            websiteErrorDocument: "index.html"
        });
        this.enableCorsOnBucket(s3Site);
        // Create a new CloudFront Distribution
        const distribution = new cloudFront.CloudFrontWebDistribution(this, `${props.name}-cf-distribution`, {
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
                acmCertRef: `${props.acmCertRef}`,
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
                            cachedMethods: cloudFront.CloudFrontAllowedCachedMethods.GET_HEAD_OPTIONS,
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
        });
        // Setup Bucket Deployment to automatically deploy new assets and invalidate cache
        new s3deploy.BucketDeployment(this, `${props.name}-s3deployment`, {
            sources: [s3deploy.Source.asset("./react-multi-env/build")],
            destinationBucket: s3Site,
            distribution: distribution,
            distributionPaths: ["/*"]
        });
        //const hostedZoneId = cdk.Fn.importValue(`infra-r53-zones-region::PrivateZoneId`)
        const zone = route53.HostedZone.fromLookup(this, 'baseZone', {
            domainName: `${props.hostedzone}` //'tpxaws-dev.com'
        });
        new route53.ARecord(this, 'SiteAliasRecord', {
            recordName: `${props.domainname}`,
            target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
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
}
exports.InfrastructureStack = InfrastructureStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVhY3QtbXVsdGktZW52LXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVhY3QtbXVsdGktZW52LXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyxzQ0FBc0M7QUFDdEMsdURBQXVEO0FBQ3ZELHNEQUFzRDtBQUN0RCxnREFBZ0Q7QUFDaEQsd0RBQXdEO0FBU3hELE1BQWEsbUJBQW9CLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDaEQsWUFBWSxLQUFvQixFQUFFLEVBQVUsRUFBRSxLQUFzQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQTBGMUI7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFHLENBQUMsTUFBa0IsRUFBRSxFQUFFO1lBQzFDLE1BQU0sU0FBUyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBaUIsQ0FBQztZQUNwRSxTQUFTLENBQUMsbUJBQW1CLENBQUMsbUJBQW1CLEVBQUU7Z0JBQ2pELFNBQVMsRUFBRTtvQkFDVDt3QkFDRSxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ3JCLGNBQWMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLENBQUM7d0JBQ3hELGNBQWMsRUFBRTs0QkFDZCw4QkFBOEI7NEJBQzlCLGtCQUFrQjs0QkFDbEIsWUFBWTt5QkFDYjt3QkFDRCxjQUFjLEVBQUUsQ0FBQyxHQUFHLENBQUM7cUJBQ3RCO2lCQUNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBN0dBLGdCQUFnQjtRQUNoQixNQUFNLE1BQU0sR0FBRyxJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLElBQUksRUFBRSxFQUFFO1lBQ2xELFVBQVUsRUFBRSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUs7WUFDOUIs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QUU7WUFDakMsS0FBSyxFQUFFLFdBQVcsS0FBSyxDQUFDLFVBQVUsRUFBRTtTQUNyQyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBd0JGO0FBbEhELGtEQWtIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xyXG5pbXBvcnQgKiBhcyBzMyBmcm9tIFwiQGF3cy1jZGsvYXdzLXMzXCI7XHJcbmltcG9ydCAqIGFzIHMzZGVwbG95IGZyb20gXCJAYXdzLWNkay9hd3MtczMtZGVwbG95bWVudFwiO1xyXG5pbXBvcnQgKiBhcyBjbG91ZEZyb250IGZyb20gXCJAYXdzLWNkay9hd3MtY2xvdWRmcm9udFwiO1xyXG5pbXBvcnQgKiBhcyByb3V0ZTUzIGZyb20gXCJAYXdzLWNkay9hd3Mtcm91dGU1M1wiO1xyXG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gJ0Bhd3MtY2RrL2F3cy1yb3V0ZTUzLXRhcmdldHMnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJbmZyYVN0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICBkb21haW5uYW1lOiBzdHJpbmc7XHJcbiAgICBob3N0ZWR6b25lOiBzdHJpbmc7XHJcbiAgICBhY21DZXJ0UmVmOiBzdHJpbmc7XHJcbn1cclxuXHJcbmV4cG9ydCBjbGFzcyBJbmZyYXN0cnVjdHVyZVN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IEluZnJhU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgLy8gQWRkIFMzIEJ1Y2tldFxyXG4gICAgY29uc3QgczNTaXRlID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBgJHtwcm9wcy5uYW1lfWAsIHtcclxuICAgICAgYnVja2V0TmFtZTogYCR7cHJvcHMubmFtZX0tczNgLFxyXG4gICAgICBwdWJsaWNSZWFkQWNjZXNzOiB0cnVlLFxyXG4gICAgICB3ZWJzaXRlSW5kZXhEb2N1bWVudDogXCJpbmRleC5odG1sXCIsXHJcbiAgICAgIHdlYnNpdGVFcnJvckRvY3VtZW50OiBcImluZGV4Lmh0bWxcIlxyXG4gICAgfSk7XHJcbiAgICB0aGlzLmVuYWJsZUNvcnNPbkJ1Y2tldChzM1NpdGUpO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhIG5ldyBDbG91ZEZyb250IERpc3RyaWJ1dGlvblxyXG4gICAgY29uc3QgZGlzdHJpYnV0aW9uID0gbmV3IGNsb3VkRnJvbnQuQ2xvdWRGcm9udFdlYkRpc3RyaWJ1dGlvbihcclxuICAgICAgdGhpcyxcclxuICAgICAgYCR7cHJvcHMubmFtZX0tY2YtZGlzdHJpYnV0aW9uYCxcclxuICAgICAge1xyXG4gICAgICAgIC8vIHZpZXdlckNlcnRpZmljYXRlOiB7XHJcbiAgICAgICAgLy8gICBhbGlhc2VzOiBbJ3RweC1kZXYudHB4YXdzLWRldi5jb20nXSxcclxuICAgICAgICAvLyAgIHByb3BzOiB7XHJcbiAgICAgICAgLy8gICAgIGFjbUNlcnRpZmljYXRlQXJuOiAnYXJuOmF3czphY206dXMtZWFzdC0xOjkxNTI3MTA4NzI2MzpjZXJ0aWZpY2F0ZS8zZDdlY2FmZS03NTRjLTRhYmMtYTIwMS01YWNkZGEyNzRkOTcnLCAvLyBvcHRpb25hbFxyXG4gICAgICAgIC8vICAgICBzc2xTdXBwb3J0TWV0aG9kOiBjbG91ZEZyb250LlNTTE1ldGhvZC5TTkksXHJcbiAgICAgICAgLy8gICAgIG1pbmltdW1Qcm90b2NvbFZlcnNpb246IGNsb3VkRnJvbnQuU2VjdXJpdHlQb2xpY3lQcm90b2NvbC5UTFNfVjFfMl8yMDIxXHJcbiAgICAgICAgLy8gICAgIC8vIEFsbCBgcHJvcHNgIG9wdGlvbnMgaGVyZTogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2Nkay9hcGkvbGF0ZXN0L2RvY3MvQGF3cy1jZGtfYXdzLWNsb3VkZnJvbnQuQ2ZuRGlzdHJpYnV0aW9uLlZpZXdlckNlcnRpZmljYXRlUHJvcGVydHkuaHRtbFxyXG4gICAgICAgIC8vICAgfVxyXG4gICAgICAgIC8vIH0sXHJcbiAgICAgICBhbGlhc0NvbmZpZ3VyYXRpb246IHtcclxuICAgICAgICAgIGFjbUNlcnRSZWY6ICBgJHtwcm9wcy5hY21DZXJ0UmVmfWAsLy8nYXJuOmF3czphY206dXMtZWFzdC0xOjkxNTI3MTA4NzI2MzpjZXJ0aWZpY2F0ZS8zZDdlY2FmZS03NTRjLTRhYmMtYTIwMS01YWNkZGEyNzRkOTcnLFxyXG4gICAgICAgICAgbmFtZXM6IFtgJHtwcm9wcy5kb21haW5uYW1lfWBdLFxyXG4gICAgICAgICAgc3NsTWV0aG9kOiBjbG91ZEZyb250LlNTTE1ldGhvZC5TTkksXHJcbiAgICAgICAgICBzZWN1cml0eVBvbGljeTogY2xvdWRGcm9udC5TZWN1cml0eVBvbGljeVByb3RvY29sLlRMU19WMV8yXzIwMjEsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBvcmlnaW5Db25maWdzOiBbXHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHMzT3JpZ2luU291cmNlOiB7XHJcbiAgICAgICAgICAgICAgczNCdWNrZXRTb3VyY2U6IHMzU2l0ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBiZWhhdmlvcnM6IFtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpc0RlZmF1bHRCZWhhdmlvcjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIGNvbXByZXNzOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgYWxsb3dlZE1ldGhvZHM6IGNsb3VkRnJvbnQuQ2xvdWRGcm9udEFsbG93ZWRNZXRob2RzLkFMTCxcclxuICAgICAgICAgICAgICAgIGNhY2hlZE1ldGhvZHM6XHJcbiAgICAgICAgICAgICAgICAgIGNsb3VkRnJvbnQuQ2xvdWRGcm9udEFsbG93ZWRDYWNoZWRNZXRob2RzLkdFVF9IRUFEX09QVElPTlMsXHJcbiAgICAgICAgICAgICAgICBmb3J3YXJkZWRWYWx1ZXM6IHtcclxuICAgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmc6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIGNvb2tpZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBmb3J3YXJkOiBcIm5vbmVcIlxyXG4gICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICBoZWFkZXJzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgXCJBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnNcIixcclxuICAgICAgICAgICAgICAgICAgICBcIkFjY2Vzcy1Db250cm9sLVJlcXVlc3QtTWV0aG9kXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgXCJPcmlnaW5cIlxyXG4gICAgICAgICAgICAgICAgICBdXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBjb21tZW50OiBgJHtwcm9wcy5uYW1lfSAtIENsb3VkRnJvbnQgRGlzdHJpYnV0aW9uYCxcclxuICAgICAgICB2aWV3ZXJQcm90b2NvbFBvbGljeTogY2xvdWRGcm9udC5WaWV3ZXJQcm90b2NvbFBvbGljeS5SRURJUkVDVF9UT19IVFRQU1xyXG4gICAgICB9XHJcbiAgICApO1xyXG5cclxuICAgIC8vIFNldHVwIEJ1Y2tldCBEZXBsb3ltZW50IHRvIGF1dG9tYXRpY2FsbHkgZGVwbG95IG5ldyBhc3NldHMgYW5kIGludmFsaWRhdGUgY2FjaGVcclxuICAgIG5ldyBzM2RlcGxveS5CdWNrZXREZXBsb3ltZW50KHRoaXMsIGAke3Byb3BzLm5hbWV9LXMzZGVwbG95bWVudGAsIHtcclxuICAgICAgc291cmNlczogW3MzZGVwbG95LlNvdXJjZS5hc3NldChcIi4vcmVhY3QtbXVsdGktZW52L2J1aWxkXCIpXSxcclxuICAgICAgZGVzdGluYXRpb25CdWNrZXQ6IHMzU2l0ZSxcclxuICAgICAgZGlzdHJpYnV0aW9uOiBkaXN0cmlidXRpb24sXHJcbiAgICAgIGRpc3RyaWJ1dGlvblBhdGhzOiBbXCIvKlwiXVxyXG4gICAgfSk7XHJcbiAgICBcclxuICAgIC8vY29uc3QgaG9zdGVkWm9uZUlkID0gY2RrLkZuLmltcG9ydFZhbHVlKGBpbmZyYS1yNTMtem9uZXMtcmVnaW9uOjpQcml2YXRlWm9uZUlkYClcclxuICAgIGNvbnN0IHpvbmUgPSByb3V0ZTUzLkhvc3RlZFpvbmUuZnJvbUxvb2t1cCh0aGlzLCAnYmFzZVpvbmUnLHtcclxuICAgICAgZG9tYWluTmFtZTogYCR7cHJvcHMuaG9zdGVkem9uZX1gLy8ndHB4YXdzLWRldi5jb20nXHJcbiAgICB9KTtcclxuICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ1NpdGVBbGlhc1JlY29yZCcsIHtcclxuICAgICAgcmVjb3JkTmFtZTogYCR7cHJvcHMuZG9tYWlubmFtZX1gLC8vJ3RweC1kZXYudHB4YXdzLWRldi5jb20nLFxyXG4gICAgICB0YXJnZXQ6IHJvdXRlNTMuUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgdGFyZ2V0cy5DbG91ZEZyb250VGFyZ2V0KGRpc3RyaWJ1dGlvbikpLC8vZGlzdHJpYnV0aW9uLFxyXG4gICAgICB6b25lLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRmluYWwgQ2xvdWRGcm9udCBVUkxcclxuICAgIG5ldyBjZGsuQ2ZuT3V0cHV0KHRoaXMsIFwiQ2xvdWRGcm9udCBVUkxcIiwge1xyXG4gICAgICB2YWx1ZTogZGlzdHJpYnV0aW9uLmRvbWFpbk5hbWVcclxuICAgIH0pO1xyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJTaXRlVXJsXCIsIHtcclxuICAgICAgdmFsdWU6IGBodHRwczovLyR7cHJvcHMuZG9tYWlubmFtZX1gXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEVuYWJsZXMgQ09SUyBhY2Nlc3Mgb24gdGhlIGdpdmVuIGJ1Y2tldFxyXG4gICAqXHJcbiAgICogQG1lbWJlcm9mIEN4cEluZnJhc3RydWN0dXJlU3RhY2tcclxuICAgKi9cclxuICBlbmFibGVDb3JzT25CdWNrZXQgPSAoYnVja2V0OiBzMy5JQnVja2V0KSA9PiB7XHJcbiAgICBjb25zdCBjZm5CdWNrZXQgPSBidWNrZXQubm9kZS5maW5kQ2hpbGQoXCJSZXNvdXJjZVwiKSBhcyBzMy5DZm5CdWNrZXQ7XHJcbiAgICBjZm5CdWNrZXQuYWRkUHJvcGVydHlPdmVycmlkZShcIkNvcnNDb25maWd1cmF0aW9uXCIsIHtcclxuICAgICAgQ29yc1J1bGVzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgQWxsb3dlZE9yaWdpbnM6IFtcIipcIl0sXHJcbiAgICAgICAgICBBbGxvd2VkTWV0aG9kczogW1wiSEVBRFwiLCBcIkdFVFwiLCBcIlBVVFwiLCBcIlBPU1RcIiwgXCJERUxFVEVcIl0sXHJcbiAgICAgICAgICBFeHBvc2VkSGVhZGVyczogW1xyXG4gICAgICAgICAgICBcIngtYW16LXNlcnZlci1zaWRlLWVuY3J5cHRpb25cIixcclxuICAgICAgICAgICAgXCJ4LWFtei1yZXF1ZXN0LWlkXCIsXHJcbiAgICAgICAgICAgIFwieC1hbXotaWQtMlwiXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICAgQWxsb3dlZEhlYWRlcnM6IFtcIipcIl1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0pO1xyXG4gIH07XHJcbn0iXX0=