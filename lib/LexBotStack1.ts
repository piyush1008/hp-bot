import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lex from 'aws-cdk-lib/aws-lex';
import { Fn } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as fs from 'fs';
import * as path from 'path';

interface RootStackProps extends cdk.NestedStackProps {
  env: cdk.Environment;
  client: string;
  stage: string;
}

interface BotConfig {
  botLocales: {
    localeId: string;
    slotTypes?: any[];
    intents?: any[];
  }[];
}

export class LexBotStack1 extends cdk.NestedStack {
  constructor(scope: Construct, id: string, props: RootStackProps) {
    super(scope, id, props);

    const getLambdaArn = (name: string) => {
      return Fn.importValue(`${name}-ARN`); // Append "-ARN" to the function name
    };

    // Read the bot configuration from the JSON file
    const botConfigPath = path.join(__dirname, 'definitions', 'routingbot.json');

    if (!fs.existsSync(botConfigPath)) {
      throw new Error(`Bot config file not found at: ${botConfigPath}`);
    }
    const botConfig:BotConfig= JSON.parse(fs.readFileSync(botConfigPath, 'utf-8'));

    console.log("Bot Config Path:", botConfigPath);

    console.log("Type of botConfig:", typeof botConfig);
console.log("Is botLocales defined?", botConfig.botLocales !== undefined);
console.log("Is botLocales an array?", Array.isArray(botConfig.botLocales));
console.log("Raw botLocales:", JSON.stringify(botConfig.botLocales, null, 2));


if (!botConfig || !botConfig.botLocales || !Array.isArray(botConfig.botLocales)) {
  throw new Error(`Invalid botConfig: ${JSON.stringify(botConfig, null, 2)}`);
}
console.log("botConfig before mapping:", JSON.stringify(botConfig, null, 2));

const botLocales1 = botConfig.botLocales?.map((locale: any) => {
  console.log("Processing locale:", JSON.stringify(locale, null, 2));
  return locale;
});

console.log("Processed botLocales:", botLocales1);



    const lexBotRole = new iam.Role(this, 'LexBotRole', {
      assumedBy: new iam.ServicePrincipal('lex.amazonaws.com'),
    });

    lexBotRole.addToPolicy(new iam.PolicyStatement({
      actions: ['lambda:InvokeFunction'],
      resources: ['*'],
    }));

    lexBotRole.assumeRolePolicy?.addStatements(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        principals: [new iam.ServicePrincipal('lex.amazonaws.com')],
        actions: ['sts:AssumeRole'],
      })
    );

    console.log("Bot Config:", JSON.stringify(botConfig, null, 2));
    console.log("Bot Config bot Locales:", JSON.stringify(botConfig.botLocales, null, 2));


    // Dynamically generate bot locales from the JSON configuration
    const botLocales = botConfig.botLocales.map((locale: any) => {
      return {
        localeId: locale.localeId,
        nluConfidenceThreshold: locale.nluConfidenceThreshold ?? 0.4, // Default threshold
        slotTypes: (locale.slotTypes || []).map((slotType: any) => ({
          name: slotType.name,
          description: slotType.description || '',
          slotTypeValues: (slotType.slotTypeValues || []).map((value: any) => ({
            sampleValue: { value: value.sampleValue?.value || '' },
            synonyms: value.synonyms && value.synonyms.length > 0 
              ? value.synonyms.map((synonym: any) => ({ value: synonym.value || '' }))
              : null, // Ensure it's null if empty
          })),
          valueSelectionSetting: {
            resolutionStrategy: slotType.valueSelectionSetting?.resolutionStrategy || 'ORIGINAL_VALUE',
          },
        })),
        intents: (locale.intents || []).map((intent: any) => {
          // Handle built-in FallbackIntent separately
          if (intent.name === 'FallbackIntent') {
            return {
              name: intent.name,
              fulfillmentCodeHook: { enabled: intent.fulfillmentCodeHook?.enabled || false },
              dialogCodeHook: { enabled: intent.dialogCodeHook?.enabled || false },
              intentClosingSetting: intent.intentClosingSetting || undefined, // Optional
            };
          }
        
          return {
            name: intent.name,
            parentIntentSignature: intent.parentIntentSignature || undefined,
            description: intent.description || '',
            sampleUtterances: (intent.sampleUtterances || []).map((utterance: any) => ({
              utterance: utterance.utterance || '',
            })),
            fulfillmentCodeHook: { enabled: intent.fulfillmentCodeHook?.enabled || false },
            dialogCodeHook: { enabled: intent.dialogCodeHook?.enabled || false },
            slots: (intent.slots || []).map((slot: any) => ({
              name: slot.name,
              slotTypeName: slot.slotTypeName,
              valueElicitationSetting: slot.valueElicitationSetting
                ? {
                    slotConstraint: slot.valueElicitationSetting.slotConstraint || 'Optional',
                    promptSpecification: slot.valueElicitationSetting.promptSpecification
                      ? {
                          messageGroupsList: (slot.valueElicitationSetting.promptSpecification.messageGroupsList || []).map(
                            (group: any) => ({
                              message: {
                                plainTextMessage: { value: group.message?.plainTextMessage?.value || '' },
                              },
                            })
                          ),
                          maxRetries: slot.valueElicitationSetting.promptSpecification.maxRetries ?? 2,
                          allowInterrupt: slot.valueElicitationSetting.promptSpecification.allowInterrupt ?? true,
                        }
                      : undefined,
                  }
                : undefined,
              obfuscationSetting: slot.obfuscationSetting
                ? { obfuscationSettingType: slot.obfuscationSetting.obfuscationSettingType || 'DefaultObfuscation' }
                : undefined,
            })),
          };
        }),
        
        voiceSettings: locale.voiceSettings || undefined,
      };
    });
    

    // Create Lex Bot with dynamic locales, slot types, and slots
    const bot = new lex.CfnBot(this, 'RoutingBot', {
      name: 'RoutingBot',
      roleArn: lexBotRole.roleArn,
      dataPrivacy: { ChildDirected: false },
      idleSessionTtlInSeconds: 300,
      botLocales: botLocales,
    });

    // Create Bot Version
    const botVersion = new lex.CfnBotVersion(this, 'RoutingBotVersion', {
      botId: bot.ref,
      botVersionLocaleSpecification: botConfig.botLocales.map((locale: any) => {
        return {
          localeId: locale.localeId,
          botVersionLocaleDetails: {
            sourceBotVersion: 'DRAFT',
          },
        };
      }),
    });

    // Dynamically generate bot alias settings
    const botAliasLocaleSettings = botConfig.botLocales.map((locale: any) => {
      const lambdaArn = getLambdaArn(`${props.client}-${props.stage}-RoutingLambda-${locale.localeId.split('_')[1]}`);
      return {
        localeId: locale.localeId,
        botAliasLocaleSetting: {
          enabled: true,
          codeHookSpecification: {
            lambdaCodeHook: {
              codeHookInterfaceVersion: "1.0",
              lambdaArn: lambdaArn,
            },
          },
        },
      };
    });

    // Create Bot Alias
    const botAlias = new lex.CfnBotAlias(this, 'RoutingBotAlias', {
      botAliasName: 'LatestAlias',
      botId: bot.ref,
      botVersion: botVersion.attrBotVersion,
      conversationLogSettings: {},
      botAliasLocaleSettings: botAliasLocaleSettings,
    });

    // Add dependency
    botAlias.node.addDependency(botVersion);

    // Output the bot alias ID for debugging
    new cdk.CfnOutput(this, 'LexBotAliasID', {
      value: bot.ref,
      exportName: `${props.client}-${props.stage}-LexBotAliasID`,
    });

    console.log("✅ Successfully deployed LexBotStack.");
  }
}