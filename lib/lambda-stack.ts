import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RoutingLambdaStack } from '../src/Nested-Stack/RoutingLambdaStack';
import { ApplicationStageProps } from "../model/ApplicationStageProps";

export class LambdaRootStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);

    // Nested Lambda Stack
    new RoutingLambdaStack(this, 'LambdaStack', props);
  }
}
