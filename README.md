# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current sta te
* `npx cdk synth`   emits the synthesized CloudFormation template


npx cdk bootstrap --trust 034362056347 --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess aws://034362056347/eu-central-1 aws://034362056347/us-east-1 -c pipeline=hpDev

npx cdk deploy --all -c pipeline=hpDev