import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');
import { ApplicationStageProps } from "../../model/ApplicationStageProps";

interface RootStactProp extends cdk.NestedStackProps {
    env: cdk.Environment;
    client: string;
    production?: boolean;
    stage: string;
    project?: string;
    connectseed?:string[]
    oauthApiEndpoint?: string;
    oauthCredsName?: string;
    deployProfileName?: string;
}

export class RoutingLambdaStack extends cdk.NestedStack {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: RootStactProp) {
    super(scope, id, props);


    const lambdaFunction = new lambda.Function(this, `${props.client}-RoutingLambdaUS`, {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'index.handler',
      // Bundling the Lambda code, using image bundling
      code: lambda.Code.fromAsset(path.join(__dirname, '../lambda')),
      timeout: cdk.Duration.minutes(2)
    });

    lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem"
      ],
      resources: [
        "*"
      ]
    }));



    // Add additional triggers (e.g., EventBridge, SQS, DynamoDB, etc.) as needed
  }
}