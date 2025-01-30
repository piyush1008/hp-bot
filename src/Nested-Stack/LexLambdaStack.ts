import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');
import { ApplicationStageProps } from "../../model/ApplicationStageProps";
import { RoutingLambdaStack } from './Bot-lambdaStacks/Routing-Lambda-Stack';
import { SupportedDeviceLambdaStack } from './Bot-lambdaStacks/Supported-Device-Stack';

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

export class LexLambdaStack extends cdk.NestedStack {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: RootStactProp) {
    super(scope, id, props);


    new RoutingLambdaStack(this, 'RoutingLambdaStack', props)
    new SupportedDeviceLambdaStack(this, 'SupportedDeviceStack', props)



  }
}