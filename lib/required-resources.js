"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequiredResourcesStack = void 0;
const cdk = require("@aws-cdk/core");
const iam = require("@aws-cdk/aws-iam");
class RequiredResourcesStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // the role to assume when the CDK is in read mode, i.e. synth
        // allow roles from the trusted account to assume this role
        const readRole = new iam.Role(this, 'ReadRole', {
            assumedBy: new iam.AccountPrincipal(props.trustedAccount),
            roleName: 'cdk-readOnlyRole'
        });
        // Attach the ReadOnlyAccess policy to this role. You could use a more restrictive policy
        // if you only wanted read access to specific resources
        readRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('ReadOnlyAccess'));
        // the role to assume when the CDK is in write mode, i.e. deploy
        // allow roles from the trusted account to assume this role
        const writeRole = new iam.Role(this, 'WriteRole', {
            assumedBy: new iam.AccountPrincipal(props.trustedAccount),
            roleName: 'cdk-writeRole'
        });
        // Attach the AdministratorAccess policy to this role.
        writeRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));
    }
}
exports.RequiredResourcesStack = RequiredResourcesStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWlyZWQtcmVzb3VyY2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVxdWlyZWQtcmVzb3VyY2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFXeEMsTUFBYSxzQkFBdUIsU0FBUSxHQUFHLENBQUMsS0FBSztJQUNuRCxZQUFZLEtBQW9CLEVBQUUsRUFBVSxFQUFFLEtBQWtDO1FBQzlFLEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLDhEQUE4RDtRQUM5RCwyREFBMkQ7UUFDM0QsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDOUMsU0FBUyxFQUFFLElBQUksR0FBRyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7WUFDekQsUUFBUSxFQUFFLGtCQUFrQjtTQUM3QixDQUFDLENBQUM7UUFFSCx5RkFBeUY7UUFDekYsdURBQXVEO1FBQ3ZELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLHdCQUF3QixDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztRQUV4RixnRUFBZ0U7UUFDaEUsMkRBQTJEO1FBQzNELE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsV0FBVyxFQUFFO1lBQ2hELFNBQVMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDO1lBQ3pELFFBQVEsRUFBRSxlQUFlO1NBQzFCLENBQUMsQ0FBQztRQUVILHNEQUFzRDtRQUN0RCxTQUFTLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUM7SUFDaEcsQ0FBQztDQUNGO0FBekJELHdEQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNkayBmcm9tICdAYXdzLWNkay9jb3JlJztcclxuaW1wb3J0ICogYXMgaWFtIGZyb20gJ0Bhd3MtY2RrL2F3cy1pYW0nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBSZXF1aXJlZFJlc291cmNlc1N0YWNrUHJvcHMgZXh0ZW5kcyBjZGsuU3RhY2tQcm9wcyB7XHJcbiAgLyoqXHJcbiAgICogVGhlIEFXUyBBY2NvdW50IElEIHRvIGFkZCB0byB0aGUgSUFNIFJvbGUgdHJ1c3QgcG9saWN5LlxyXG4gICAqIEFueSByb2xlIGZyb20gdGhpcyBBV1MgQWNjb3VudCB3aWxsIGJlIGFibGUgdG8gYXNzdW1lIHRoZVxyXG4gICAqIHR3byByb2xlcyBjcmVhdGVkXHJcbiAgICovXHJcbiAgdHJ1c3RlZEFjY291bnQ6IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlcXVpcmVkUmVzb3VyY2VzU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogUmVxdWlyZWRSZXNvdXJjZXNTdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAvLyB0aGUgcm9sZSB0byBhc3N1bWUgd2hlbiB0aGUgQ0RLIGlzIGluIHJlYWQgbW9kZSwgaS5lLiBzeW50aFxyXG4gICAgLy8gYWxsb3cgcm9sZXMgZnJvbSB0aGUgdHJ1c3RlZCBhY2NvdW50IHRvIGFzc3VtZSB0aGlzIHJvbGVcclxuICAgIGNvbnN0IHJlYWRSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdSZWFkUm9sZScsIHtcclxuICAgICAgYXNzdW1lZEJ5OiBuZXcgaWFtLkFjY291bnRQcmluY2lwYWwocHJvcHMudHJ1c3RlZEFjY291bnQpLFxyXG4gICAgICByb2xlTmFtZTogJ2Nkay1yZWFkT25seVJvbGUnXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBBdHRhY2ggdGhlIFJlYWRPbmx5QWNjZXNzIHBvbGljeSB0byB0aGlzIHJvbGUuIFlvdSBjb3VsZCB1c2UgYSBtb3JlIHJlc3RyaWN0aXZlIHBvbGljeVxyXG4gICAgLy8gaWYgeW91IG9ubHkgd2FudGVkIHJlYWQgYWNjZXNzIHRvIHNwZWNpZmljIHJlc291cmNlc1xyXG4gICAgcmVhZFJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ1JlYWRPbmx5QWNjZXNzJykpO1xyXG4gICAgXHJcbiAgICAvLyB0aGUgcm9sZSB0byBhc3N1bWUgd2hlbiB0aGUgQ0RLIGlzIGluIHdyaXRlIG1vZGUsIGkuZS4gZGVwbG95XHJcbiAgICAvLyBhbGxvdyByb2xlcyBmcm9tIHRoZSB0cnVzdGVkIGFjY291bnQgdG8gYXNzdW1lIHRoaXMgcm9sZVxyXG4gICAgY29uc3Qgd3JpdGVSb2xlID0gbmV3IGlhbS5Sb2xlKHRoaXMsICdXcml0ZVJvbGUnLCB7XHJcbiAgICAgIGFzc3VtZWRCeTogbmV3IGlhbS5BY2NvdW50UHJpbmNpcGFsKHByb3BzLnRydXN0ZWRBY2NvdW50KSxcclxuICAgICAgcm9sZU5hbWU6ICdjZGstd3JpdGVSb2xlJ1xyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gQXR0YWNoIHRoZSBBZG1pbmlzdHJhdG9yQWNjZXNzIHBvbGljeSB0byB0aGlzIHJvbGUuXHJcbiAgICB3cml0ZVJvbGUuYWRkTWFuYWdlZFBvbGljeShpYW0uTWFuYWdlZFBvbGljeS5mcm9tQXdzTWFuYWdlZFBvbGljeU5hbWUoJ0FkbWluaXN0cmF0b3JBY2Nlc3MnKSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==