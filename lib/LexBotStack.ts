import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lex from 'aws-cdk-lib/aws-lex';
import { Fn } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';

interface RootStackProps extends cdk.NestedStackProps {
  env: cdk.Environment;
  client: string;
  stage: string;
}

export class LexBotStack extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props: RootStackProps) {
    super(scope, id, props);

    const getLambdaArn = (name: string) => {
        try {
          return Fn.importValue(name.replace(/_/g, '-') + "-ARN"); // ✅ Match the fixed export names
        } catch (error) {
          console.error(`⚠️ Error importing Lambda ARN for ${name}:`, error);
          return ''; // Prevents deployment failure
        }
      };
      
      const usLambdaArn = getLambdaArn(`${props.client}-${props.stage}-RoutingLambda-US`);
      const gbLambdaArn = getLambdaArn(`${props.client}-${props.stage}-RoutingLambda-GB`);
      const auLambdaArn = getLambdaArn(`${props.client}-${props.stage}-RoutingLambda-AU`);

    console.log("🔍 Imported Lambda ARNs:", { usLambdaArn, gbLambdaArn, auLambdaArn });

    if (!usLambdaArn || !gbLambdaArn || !auLambdaArn) {
      throw new Error("❌ One or more Lambda ARNs could not be imported. Ensure `RoutingLambdaStack` is deployed first.");
    }

    const lexBotRole = new iam.Role(this, 'LexBotRole', {
        assumedBy: new iam.ServicePrincipal('lex.amazonaws.com'),
      });
      
      lexBotRole.addToPolicy(new iam.PolicyStatement({
        actions: ['lambda:InvokeFunction'],
        resources: [usLambdaArn, gbLambdaArn, auLambdaArn],
      }));
      

    // ✅ Create Lex Bot with fulfillment hooks inside `botLocales`
    const bot = new lex.CfnBot(this, 'RoutingBot', {
      name: 'RoutingBot',
      roleArn: lexBotRole.roleArn, // Update with actual IAM role
      dataPrivacy: { childDirected: false },
      idleSessionTtlInSeconds: 300,
      botLocales: [
        {
          localeId: 'en_US',
          nluConfidenceThreshold: 0.4,
          intents: [
            {
              name: 'RoutingIntent',
              sampleUtterances: [
                { utterance: 'I need help with routing' },
                { utterance: 'Can you help me with routing?' }
              ],
              fulfillmentCodeHook: { enabled: true }
            }
          ],
          voiceSettings: { voiceId: 'Joanna' },
        },
        {
          localeId: 'en_GB',
          nluConfidenceThreshold: 0.4,
          intents: [
            {
              name: 'RoutingIntent',
              sampleUtterances: [
                { utterance: 'Help with routing in the UK' },
                { utterance: 'How do I route calls in the UK?' }
              ],
              fulfillmentCodeHook: { enabled: true }
            }
          ],
          voiceSettings: { voiceId: 'Amy' },
        },
        {
          localeId: 'en_AU',
          nluConfidenceThreshold: 0.4,
          intents: [
            {
              name: 'RoutingIntent',
              sampleUtterances: [
                { utterance: 'How do I route calls in Australia?' },
                { utterance: 'Routing help for Australia' }
              ],
              fulfillmentCodeHook: { enabled: true }
            }
          ],
          voiceSettings: { voiceId: 'Nicole' },
        }
      ]
    });

    // ✅ Create Bot Alias (No `lambdaCodeHook` here!)
    new lex.CfnBotAlias(this, 'RoutingBotAlias', {
        botAliasName: 'LatestAlias',
        botId: bot.ref,
        botVersion: '$LATEST',
        sentimentAnalysisSettings: { detectSentiment: true },
        conversationLogSettings: {},
        botAliasLocaleSettings: [
            {
                localeId: 'en_US',
                botAliasLocaleSetting: {
                    enabled: true,
                    codeHookSpecification: {
                        lambdaCodeHook: {
                            codeHookInterfaceVersion: "1.0",
                            lambdaArn: usLambdaArn
                        }
                    }
                }
            },
            {
                localeId: 'en_GB',
                botAliasLocaleSetting: {
                    enabled: true,
                    codeHookSpecification: {
                        lambdaCodeHook: {
                            codeHookInterfaceVersion: "1.0",
                            lambdaArn: gbLambdaArn
                        }
                    }
                }
            },
            {
                localeId: 'en_AU',
                botAliasLocaleSetting: {
                    enabled: true,
                    codeHookSpecification: {
                        lambdaCodeHook: {
                            codeHookInterfaceVersion: "1.0",
                            lambdaArn: auLambdaArn
                        }
                    }
                }
            }
        ]
      });
  
    // ✅ Output the bot alias ID for debugging
    new cdk.CfnOutput(this, 'LexBotAliasID', {
      value: bot.ref,
      exportName: `${props.client}-${props.stage}-LexBotAliasID`,
    });

    console.log("✅ Successfully deployed LexBotStack.");
  }
}
