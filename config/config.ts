
import { DevEuCentral } from "./dev/deveu-central-1";
import { DevUsEast } from "./dev/devus-east-1";



export const AppConfig={
    hpDev:{
        env: {
            account: "034362056347",
            region: "us-east-1"
        },
        pipelineName: "hp-nl-v2-dev-lex-lambdas",
        pipelineStackName: "hp-nl-v2-dev-lex-lambdas",
        repoName: "hp-bot",
        repoTriggerBranch: "hp_dev",
        githubOrg:"piyush1008",
        stages: [DevEuCentral, DevUsEast ],
    },
}