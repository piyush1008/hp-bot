
import {fulfill,getSessionAttribute, setSessionAttribute,shouldAskAgain } from '../utils/lexActions';
import { LexV2Event } from "aws-lambda";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { I_ENVprops } from '../../../../model/Ienvprops';

export class RoutingLambda {

    private async getIntent(event: LexV2Event,lexClient: LexRuntimeV2Client): Promise<any> {
        try {
          const userMessage = getSessionAttribute(event, "InitialInputTranscript");
          console.log("Input Transcript:", userMessage);
    
          const params = {
            botId: "0BI7IUNXWF",
            botAliasId: "NMP0UOWDVN",
            sessionId: event.sessionId,
            localeId: event.bot.localeId,
            text: userMessage,
            sessionState: {},
          };
    
          console.log("Params:", params);
    
          const command = new RecognizeTextCommand(params);
          const response = await lexClient.send(command);
          console.log("Lex Response:", response);
    
          return response;
        } catch (error) {
          console.error("Error invoking Lex:", error);
        }
      }
    


    public async handler(event: LexV2Event,_props: I_ENVprops): Promise<any> {
      
        console.log("Event Details ROUTING:", event);
      
        const connId = getSessionAttribute(event, "ConnId");
        console.log("ConnId:", connId);
      
        const intentName = event.sessionState.intent.name;
        console.log("Intent Name:", intentName);
      
        const transcript = event.inputTranscript;
        console.log("Transcript:", transcript);
      
        if (!getSessionAttribute(event, "InitialInputTranscript")) {
          setSessionAttribute(event, "InitialInputTranscript", transcript);
          console.log("Set InitialInputTranscript:", transcript);
        } else {
          console.log(
            "InitialInputTranscript already set:",
            getSessionAttribute(event, "InitialInputTranscript")
          );
        }
      
        const slots = event.sessionState.intent.slots;
        console.log("Slots:", slots);
      
        if (intentName === "InkRetention" || intentName === "InkSubscription" || intentName === "InkSales") {
          console.log("Ink intent");
          return fulfill(
            intentName,
            slots,
            event.sessionState.sessionAttributes || {},
            "<speak>Okay</speak>"
          );
        }
      
        if (intentName === "CS_Intent") {

         const LexClient = new LexRuntimeV2Client({region: _props.region});;
          setSessionAttribute(event, "SupportDevice_intent", intentName);
          const lexCallStart = Date.now();
      
          const lexResponse = await this.getIntent(event,LexClient);
          const lexCallEnd = Date.now();
      
          console.log("Timing taken:", {
            lexCallTime: lexCallEnd - lexCallStart,
          });
      
          if (connId === "dummy_warmer") {
            return fulfill(
              intentName,
              slots,
              event.sessionState.sessionAttributes || {},
              "<speak>dummy warmer</speak>"
            );
          }
      
          if (lexResponse) {
            setSessionAttribute(
              event,
              "SupportDevice_intent",
              lexResponse.sessionState.intent.name
            );
            const productName = lexResponse.sessionState.intent.slots?.productName?.value?.interpretedValue;
      
            if (productName) {
              setSessionAttribute(event, "SubCategoryName", productName);
      
              if (getSessionAttribute(event, "SubCategoryName") === "Chromebook") {
                setSessionAttribute(event, "SupportDevice_intent", "HP Chromebook");
              }
      
              return fulfill(
                intentName,
                slots,
                event.sessionState.sessionAttributes || {},
                "<speak><prosody rate='medium'>Okay<break time='0.3s'/>Please allow me a few seconds to pull up your records</prosody></speak>"
              );
            }
      
            const deviceName = lexResponse.sessionState.intent.slots?.deviceName?.value?.interpretedValue;
            if (deviceName) {
              setSessionAttribute(event, "SupportDevice_Name", deviceName);
            }
          }
        }
      
        if (intentName === "CustomerService") {
          if (shouldAskAgain(event, "CustomerService", 3)) {
            const retries = Number(getSessionAttribute(event, "No_of_Times_CustomerService"))
      
            if (retries <= 3) {
              return {
                sessionState: {
                  dialogAction: {
                    type: "ElicitIntent",
                  },
                  intent: {
                    name: "WelcomeIntent",
                    state: "InProgress",
                  },
                  sessionAttributes: event.sessionState.sessionAttributes || {},
                },
                messages: [
                  {
                    contentType: "SSML",
                    content:
                      '<speak>I need to know a few details about your HP product and the issue that you are calling about. This will help me quickly connect you to the right technical support department that can help you .<break time="0.5s"/>You can say something like, I cannot print <break time="0.1s"/> or <break time="0.1s"/> my laptop is not charging</speak>',
                  },
                ],
              };
            }
          } else {
            setSessionAttribute(event, "SubCategoryName", "NA");
            setSessionAttribute(event, "SupportDevice_intent", "NA");
            return fulfill(
              intentName,
              slots,
              event.sessionState.sessionAttributes || {},
              "<speak>Let me transfer you to an agent for further assistance</speak>"
            );
          }
        }
      
        return fulfill(intentName, slots, event.sessionState.sessionAttributes || {}, "<speak>Okay</speak>");
    };

}


