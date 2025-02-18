import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');
import { ApplicationStageProps } from "../../../model/ApplicationStageProps";
import { ILexLambdas } from '../../../model/ILexLambdas';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Rule, RuleTargetInput, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';


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

export class ASK_CASE_ProductLambdaStack extends cdk.NestedStack {
  public readonly lambdaFunction: lambda.Function;
  props: any;

  constructor(scope: Construct, id: string, props: RootStactProp) {
    super(scope, id, props);

    const role = new iam.Role(this, 'LambdaExecutionRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });
    
    role.addToPolicy(new iam.PolicyStatement({
      actions: [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem"
      ],
      resources: [
        `arn:aws:dynamodb:${props.env.region}:${props.env.account}:table/hptableDev12-dev-ConnectDataTable`
      ]
    }));

    role.addToPolicy(new iam.PolicyStatement({
      actions: ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"],
      resources: [`arn:aws:logs:*:${props.env.account}:*:*`],
    }));

    this.buildLexLambdaDefinitions(props).forEach(config => {
      const lambdaFunction = new NodejsFunction(this, config.functionName!, {
        functionName: config.functionName,
        runtime: lambda.Runtime.NODEJS_20_X,
        entry: config.filePath, 
        handler: config.handler, 
        environment: {
          REGION: props.env.region!,
          ACCOUNT: props.env.account!,
          WARMER_ENABLED: "true"
        },
        role: role, // Attach the IAM Role
      });
    
      lambdaFunction.addPermission(`${config.functionName}LexPermission`, {
        principal: new iam.ServicePrincipal('lex.amazonaws.com'),
        action: 'lambda:InvokeFunction',
        sourceArn: `arn:aws:lex:${props.env.region}:${props.env.account}:bot-alias/*`,
      });

      new Rule(this, `${config.functionName}-warmer-rule`, {
        schedule: Schedule.rate(cdk.Duration.minutes(5)), // Adjust the interval if needed
        targets: [
          new LambdaFunction(lambdaFunction, {
            event: RuleTargetInput.fromObject({ warmer: true }), // Custom warm-up event
          }),
        ],
      });

      new cdk.CfnOutput(this, `${config.functionName}ARN`, {
        value: lambdaFunction.functionArn,
        exportName: `${config.functionName}-ARN`, // ✅ Fixed: Replaced underscores with hyphens
      });
      
      console.log(`✅ Created Lambda: ${config.functionName}, ARN: ${lambdaFunction.functionArn}`);
    });


  }





  private buildLexLambdaDefinitions(props: RootStactProp): ILexLambdas[] {
    return [
      {
        functionName: `${props.client}-${props.stage}-AskCaseProduct-US`,
        botName: "supportDeviceLambdaUS",
        localeId: "en_US",
        countryCode: "US",
        handler: "ask_case_product",
        grantLexInvoke: true,
        filePath: "src/lambda/LexLambdas/index.ts",
      },
      {
        functionName: `${props.client}-${props.stage}-AskCaseProduct-GB`,
        botName: "Ask_Case_ProductGB",
        localeId: "en_GB",
        countryCode: "US",
        handler: "ask_case_product",
        grantLexInvoke: true,
        filePath: "src/lambda/LexLambdas/british-english/index.ts",
      },
      {
        functionName: `${props.client}-${props.stage}-AskCaseProduct-AU`,
        botName: "Ask_Case_ProductAU",
        localeId: "en_AU",
        countryCode: "AU",
        handler: "ask_case_product",
        grantLexInvoke: true,
        filePath: "src/lambda/LexLambdas/AU-English/index.ts",
      }
    ]
  }


    // Add additional triggers (e.g., EventBridge, SQS, DynamoDB, etc.) as needed
  
}