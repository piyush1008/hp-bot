import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');
import { ApplicationStageProps } from "../../model/ApplicationStageProps";
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { ILexLambdas } from '../../model/ILexLambdas';

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

export class ConnectLambdaStack extends cdk.NestedStack {
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

    this.buildLexLambdaDefinitions(props).forEach(config => {
      const lambdaFunction = new NodejsFunction(this, config.functionName!, {
        functionName: config.functionName,
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: config.filePath, // Path to the handler file (automatically handles it)
        handler: config.handler, // The exported handler function in the entry file
        environment: {
          REGION: props.env.region!,
          ACCOUNT: props.env.account!
        },
        role: role, // Attach the IAM Role
      });
    
      lambdaFunction.addPermission(`${config.functionName}LexPermission`, {
        principal: new iam.ServicePrincipal('lambda.amazonaws.com'),
        action: 'lambda:InvokeFunction',
      });
    });


  }





  private buildLexLambdaDefinitions(props: RootStactProp): ILexLambdas[] {
    return [
      {
        functionName: `${props.client}-ClaimedPhNumberLambda`,
        handler: "claimed",
        filePath: "src/lambda/Connect-Lambdas/index.ts",
      },
      {
        functionName: `${props.client}-MultiLingualPromptLambda`,
        handler: "multi-prompt",
        filePath: "src/lambda/Connect-Lambdas/index.ts",
      },
    ]
  }
}