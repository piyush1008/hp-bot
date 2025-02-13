import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { ConnectLambdaStack } from '../src/Nested-Stack/Connect-Lambda-Stack';
import { ApplicationStageProps } from "../model/ApplicationStageProps";
import { LexLambdaStack } from '../src/Nested-Stack/LexLambdaStack';

export class LambdaRootStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: ApplicationStageProps) {
    super(scope, id, props);

    // Nested Lambda Stack
    new ConnectLambdaStack(this, 'ConnectLambdaStack', props);
    new LexLambdaStack(this, 'LexLambdaStack', props);
  }
}
