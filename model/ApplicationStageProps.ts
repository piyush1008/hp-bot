import { Environment, StageProps } from "aws-cdk-lib";

export interface ApplicationStageProps extends StageProps {
    env: Environment;
    client: string;
    production?: boolean;
    stage: string;
    project?: string;
    connectseed?:string[]
    oauthApiEndpoint?: string;
    oauthCredsName?: string;
    deployProfileName?: string;
  
}