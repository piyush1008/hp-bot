
import {elicitSlot, fulfill,getSessionAttribute, setSessionAttribute,shouldAskAgain, updateSlotValue } from '../utils/lexActions';
import { LexV2Event } from "aws-lambda";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { I_ENVprops } from '../../../../model/Ienvprops';
import { FallbackResponse} from '../../../../model/fallbackresponse';

export class SupportDeviceLambda {




    public async handler(event: LexV2Event,_props: I_ENVprops) {
      try{
          console.log("Event details", JSON.stringify(event))
        //   if (event.isWarmer) {
        //     console.log("Warmer event received");
        //     return "Warm";
        //   }
    
          //console.log("ConnId:",getSessionAttribute(event, "ConnId"))
          var IntentName :string = event.sessionState.intent.name
          var Slots = event.sessionState.intent.slots
          const SessionAttributes = event.sessionState!.sessionAttributes!
          console.log("Intent Name", IntentName)
          console.log("Slots", Slots)
    
          var initialinput = event.inputTranscript;
    
          if(event.sessionState.intent.name === "Printer" && event.sessionState.intent.slots.productName === null){ 
              console.log("Print") 
              setSessionAttribute(event, "SupportDevice_intent", IntentName);
              setSessionAttribute(event, "InputTranscript", initialinput);
              if(getSessionAttribute(event, "IsInstantInk") === "true")
              {
                if(shouldAskAgain(event,"product_Name_Asking",2))
                {
                  return elicitSlot(IntentName, Slots, 'productName', `<speak>What kind of Instant Ink printer are you using? <break time="0.1s"/> is it an Officejet<break time="0.1s"/> Deskjet<break time="0.1s"/>or <break time="0.1s"/> Smart Tank</speak>`, SessionAttributes);
                }
              }
              else{
                if(shouldAskAgain(event,"product_Name_Asking",2))
                {
                  return elicitSlot(IntentName, Slots, 'productName', `<speak>What type of HP Printer are you using <break time="0.1s"/> is it an Officejet<break time="0.1s"/> Deskjet<break time="0.1s"/>Smart Tank <break time="0.1s"/>or <break time="0.1s"/>Laserjet Printer?</speak>`, SessionAttributes);
                }
              }
          }
    
    
          if(event.sessionState.intent.name === "PC"){
            console.log("PC")
            var supportedDevice = getSessionAttribute(event, "Supported_device");
            var deviceCheck // for note book desktop updation 
            // support device check from routing bot 
            if(supportedDevice !== undefined && supportedDevice !== null && supportedDevice !== "null"){
              setSessionAttribute(event, "SupportDevice_intent", supportedDevice);
              updateSlotValue(event,"deviceName",supportedDevice)
              deviceCheck= supportedDevice
              console.log("my device 1",deviceCheck)
            }
            else{
              console.log("device Name values",Slots.deviceName)
                if(Slots.deviceName === null)
                {
                  if(shouldAskAgain(event,"Device_Name_Asking",3))
                  {
                    console.log("ask Device question")
                    return elicitSlot(IntentName, Slots, 'deviceName',"<speak>Is it a HP Notebook <break time='0.2s'/> or <break time='0.2s'/> Desktop?</speak>", SessionAttributes);
                  }else{
                    setSessionAttribute(event, "SupportDevice_intent", "NA");
                  }
                }
                else
                {
                  if(Slots.deviceName.value.interpretedValue)
                  {
                    deviceCheck= Slots.deviceName.value.interpretedValue
                    console.log("my device 2",deviceCheck)
                    setSessionAttribute(event, "SupportDevice_intent", Slots.deviceName.value.interpretedValue);
                  }else{
                    {
                      if(shouldAskAgain(event,"Device_Name_Asking",3))
                      {
                        console.log("ask Device question_2")
                        return elicitSlot(IntentName, Slots, 'deviceName',"<speak>Is it a HP Notebook <break time='0.2s'/> or <break time='0.2s'/> Desktop?</speak>", SessionAttributes);
                      }else{
                        setSessionAttribute(event, "SupportDevice_intent", "NA");
                      }
                    }
                  }
                }
            }
              //console.log("ask product question",event.sessionState.intent.slots.deviceName.subSlots.product_Name)
              if(!event.sessionState.intent.slots.productName)
              {
                //updating the Device Name asking the family accordinly
                console.log("Device val", deviceCheck)
                if(deviceCheck === "Notebook")
                {
                  console.log("its Notebook")
                  if(shouldAskAgain(event,"product_Name_Asking",2))
                  {
                    return elicitSlot(IntentName, Slots, 'productName',`<speak>What type of HP Laptop are you using <break time='0.1s'/> is it a Pavillion<break time='0.1s'/> Envy<break time='0.1s'/>Spectre <break time='0.1s'/> Chromebook <break time='0.1s'/> or <break time='0.1s'/>Omen Laptop</speak>`, SessionAttributes);
                  }
                }  
                else if(deviceCheck === "Desktop")
                {
                  console.log("its Desktop")
                  if(shouldAskAgain(event,"product_Name_Asking",2))
                  {
                    return elicitSlot(IntentName, Slots, 'productName',"<speak>What type of HP Desktop are you using <break time='0.1s'/> is it a Pavillion<break time='0.1s'/> Envy<break time='0.1s'/>Spectre <break time='0.1s'/> or <break time='0.1s'/>Omen Desktop</speak>", SessionAttributes);
                  }
                }
              }
          }
    
    
          if(event.sessionState.intent.name === "OtherDevice"){
                if(getSessionAttribute(event, "Device_Name"))
                {
                    // check if session attibute exist we we will not ask Device question
                    console.log("Device name exist",getSessionAttribute(event, "Device_Name") )
                    setSessionAttribute(event, "SupportDevice_intent", event.sessionState.intent.slots.device_Name!.value.interpretedValue!);
                    const deviceName = getSessionAttribute(event, "Device_Name");
                    updateSlotValue(event, "device_Name", deviceName !== undefined ? deviceName : null);
                }
                else{
                    return elicitSlot(IntentName, Slots, 'device_Name',"<speak>Are you type of Device calling about is it a scanner <break time='0.1s'/> Chromebook <break time='0.1s'/> Keyboared <break time='0.1s'/> Monitors</speak>", SessionAttributes);
                }
          }
            
    
          if(event.sessionState.intent.name =="FallbackIntent")
          {
            console.log("FALLBACK EVENT: ", event);
            if(shouldAskAgain(event,"FallBack",3))
            {
              console.log("dyubge 21")
              var message
              message = "Is it for a Printer <break time='0.3s'/>or <break time='0.2s'/> Notebook or <break time='0.3s'/> a Desktop?"
              
              console.log("Mesasge", message)
              const response: FallbackResponse = {
                sessionState: {
                  state: "InProgress",
                  sessionAttributes: JSON.parse(
                    JSON.stringify(event.sessionState.sessionAttributes)
                  ),
                  dialogAction: {
                    type: "ElicitIntent",
                  },
                },
                messages :[]
              };
              if (message) {
                response.messages = [{ contentType: "SSML", content: `<speak>${message}</speak>`}];
              }
              console.log("|8102| => Reprompt for Intent", response);
              return response;
            }
            else{
              return fulfill(IntentName, Slots, event.sessionState.sessionAttributes!, "<speak>Let Transfer you to an agent for furthur Assistance</speak>");
            }
          }
    
          if(Slots.productName !== null && Slots.productName !== undefined)
          {
            console.log("value pn exist")
            setSessionAttribute(event, "SubCategoryName", event.sessionState.intent.slots.productName!.value.interpretedValue!);
            if(Slots.productName.value.interpretedValue === "Chromebook")
            {
              console.log("9982")
              setSessionAttribute(event, "SupportDevice_intent", "HP Chromebook");
            }
          }
          else{
            console.log("value not pn exist")
            setSessionAttribute(event, "SubCategoryName", "NA");
          }
          return fulfill(IntentName, Slots, SessionAttributes, "<speak><prosody rate='medium'>Okay<break time='0.3s'/>Please allow me a few seconds to pull up your records </prosody></speak>");
        }catch(error){
        console.error("Error_3:", error);
        throw new Error("Lambda function failed.");
      }
    }
    

}


