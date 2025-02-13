import { Environment } from "aws-cdk-lib";
import { ApplicationStageProps } from "./ApplicationStageProps";




export interface PipelineStackProps {
    pipelineName: string;
    repoTriggerBranch: string;
    pipelineStackName: string;
    env: Environment,
    repoName: string;
    githubOrg:string;
    stages:  ApplicationStageProps[];
  }