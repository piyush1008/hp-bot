
import { DevEuCentral } from "./dev/deveu-central-1";
import { DevUsEast } from "./dev/devus-east-1";



export const AppConfig={
    hpDev:{
        env: {
            account: "015021686405",
            region: "us-east-1"
        },
        pipelineName: "hp-nl-v2-dev-lex-lambdas",
        pipelineStackName: "hp-nl-v2-dev-lex-lambdas",
        repoName: "hp-NLIVR-lex-lambdas",
        repoTriggerBranch: "hp_dev",
        githubOrg:"DTO-BTS-CS-Global-NLIVR",
        stages: [DevEuCentral, DevUsEast ],
    },
}