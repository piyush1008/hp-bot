import { Role } from "aws-cdk-lib/aws-iam";
import { Permission } from "aws-cdk-lib/aws-lambda";

export interface ILexLambdas {
    language?: string;
    functionName: string;
    botName?: string;
    localeId?: string;
    countryCode?: string;
    role?: Role;
    handler: string;
    grantLexInvoke?: boolean;
    filePath: string;
    permissions?: Permission[];
    parentDirectory?: string;
  }