import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');
import { ApplicationStageProps } from "../../model/ApplicationStageProps";
import { RoutingLambdaStack } from './Bot-lambdaStacks/Routing-Lambda-Stack';
import { SupportedDeviceLambdaStack } from './Bot-lambdaStacks/Supported-Device-Stack';
import { ASK_CASE_ProductLambdaStack } from './Bot-lambdaStacks/Case-Product-Stack';
import { LexBotStack } from '../../lib/LexBotStack';
import { LexBotStack1 } from '../../lib/LexBotStack1';

export interface RootStactProp extends cdk.NestedStackProps {
    env: cdk.Environment;
    client: string;
    production?: boolean;
    stage: string;
    project?: string;
    connectseed?:string[]
    oauthApiEndpoint?: string;
    oauthCredsName?: string;
    deployProfileName?: string;
    fileName?:string;
    botname?:string;
    LambdaName?:string;
}

export class LexLambdaStack extends cdk.NestedStack {
  public readonly lambdaFunction: lambda.Function;

  constructor(scope: Construct, id: string, props: RootStactProp) {
    super(scope, id, props);


    const routingLambdaStack=new RoutingLambdaStack(this, 'RoutingLambdaStack', props)
    const supportlambaStack=new SupportedDeviceLambdaStack(this, 'SupportedDeviceStack', props)
    const askCaseProductStack=new ASK_CASE_ProductLambdaStack(this, 'ASK_CASE_ProductStack', props)

  // const lexBotStack= new LexBotStack(this,"LexBotStack",props);

  const props1={...props, fileName: "routingbot.json", botname:"RoutingBot", LambdaName: "RoutingLambda"}

   const lexBotStack1= new LexBotStack1(this,"LexBotStack",props1);


    
   const props2={...props, fileName: "support.json", botname:"SupportBot", LambdaName: "SupportDeviceLambda"}

   const lexBotStack2= new LexBotStack1(this,"SupportLexBotStack",props2);


   // Ensure LexBotStack depends on RoutingLambdaStack
  //  lexBotStack.node.addDependency(routingLambdaStack);
  //  lexBotStack.node.addDependency(supportlambaStack);

  //  lexBotStack.node.addDependency(supportlambaStack);


   lexBotStack1.node.addDependency(routingLambdaStack);
   lexBotStack1.node.addDependency(supportlambaStack);

   lexBotStack1.node.addDependency(askCaseProductStack);

   lexBotStack2.node.addDependency(routingLambdaStack);
   lexBotStack2.node.addDependency(supportlambaStack);

   lexBotStack2.node.addDependency(askCaseProductStack);


  }
}