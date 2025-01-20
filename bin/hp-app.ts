import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';


import { AppConfig } from '../config/config';

import { HpNlLexLambdasStack } from '../lib/pipeline-stack';



const app = new cdk.App();
const pipeline = app.node.tryGetContext('pipeline');
function buildStack(){

  if (!pipeline) {
    throw new Error(`could not find pipeline context did you forget to add -c to your deploy command?`);
  }
  

  switch(pipeline)
  {
     case "hpDev":
       new HpNlLexLambdasStack(app, 'hp-nl-v2-dev-lex-lambdas',"dev", AppConfig.hpDev );
       break;


  }


  


}




buildStack();