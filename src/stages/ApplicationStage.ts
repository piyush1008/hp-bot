import { Construct } from "constructs";
import { DefaultStackSynthesizer, Stage } from "aws-cdk-lib";
import * as cdk from 'aws-cdk-lib';
import { ApplicationStageProps } from "../../model/ApplicationStageProps";

import {
    Role,
    Effect,
    PolicyDocument,
    PolicyStatement,
    ServicePrincipal,
  } from "aws-cdk-lib/aws-iam";

import { Permission, Runtime } from "aws-cdk-lib/aws-lambda";
import { LambdaRootStack } from "../../lib/lambda-stack";



export interface ILexLambdas {
    language?: string;
    functionName: string;
    botName: string;
    localeId: string;
    countryCode: string;
    role: Role;
    handler: string;
    grantLexInvoke: boolean;
    filePath: string;
    permissions?: Permission[];
    parentDirectory?: string;
  }
  

export class ApplicationStage extends Stage {
    public readonly _lexLambdas: ILexLambdas[];
  
    constructor(scope: Construct, id: string, props: ApplicationStageProps) {
      super(scope, id, props);
      const prefix = `${props.client}-${props.stage}`;
      new LambdaRootStack(this, `${props.client}-${props.stage}-LambdaStack`, props);

    
    }
}