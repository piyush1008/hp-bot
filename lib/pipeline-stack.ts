import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { PipelineStackProps } from '../model/PipelineStackProps';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { LinuxBuildImage } from 'aws-cdk-lib/aws-codebuild';

import { ApplicationStage } from '../src/stages/ApplicationStage';
import { QUALIFIER } from '../constant';

export class HpNlLexLambdasStack extends cdk.Stack {
  private _pipelineName:string;
  private _props:PipelineStackProps;
  constructor(scope: Construct, id: string,pipelineName:string, props: PipelineStackProps) {
    super(scope, id, props);

    this._pipelineName = pipelineName;

    this._props = props;

    
    //create a pipeline with github repository
    const pipeline = this._createPipeline();


    //add stages to pipeline
    this.createStage(pipeline)
  }



    
  private _createPipeline(){
     const PIPELINE_NAME=this._props.pipelineName;
     const githubOrg = this._props.githubOrg
     const githubRepo = this._props.repoName;
     const githubBranch = this._props.repoTriggerBranch;
     const SYNTH_STACK_NAME = this._props.pipelineStackName;
      console.log("test 1 23")

     const pipeline = new CodePipeline(this, "CDKPipeline", {
      crossAccountKeys: true,
      pipelineName:PIPELINE_NAME,
      selfMutation: true,
      publishAssetsInParallel: false,
      // role: pipelineRole, // Attach the custom role to the pipeline
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_7_0,
        },
        timeout: cdk.Duration.minutes(480),
      },
      synth: new CodeBuildStep("SynthStep", {
        input: CodePipelineSource.connection(
          "DTO-BTS-CS-Global-NLIVR/hp-NLIVR-lex-lambdas",
          githubBranch,
          {
              connectionArn:
                  "arn:aws:codeconnections:us-east-1:015021686405:connection/0514a73c-bf99-47c8-a849-7109667570a0"
          }
      ),
        commands: [ 
          "n 20.17.0",
          "node --version",
          "npm install -g npm",
          "npm ci",
          "npm run build",
          `npx cdk synth --qualifier ${QUALIFIER} --toolkit-stack-name ${QUALIFIER}-cdk-toolkit ${SYNTH_STACK_NAME} -c pipeline=${this._pipelineName}`,
        ]
      }),
    });

    return pipeline;
  }

  public createStage(pipeline:CodePipeline)
  {
      const applicationWave=pipeline.addWave("Application");

      for(let i=0;i<this._props.stages.length;i++)
      {
          const stage = this._props.stages[i];

          const appStage=new ApplicationStage(this, `hptable${i+1}`,stage)
          applicationWave.addStage(appStage)

      
      }
  }
}
