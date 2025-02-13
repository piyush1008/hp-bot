import { LexV2DialogAction, LexV2Event, LexV2Slots } from "aws-lambda";


export const elicitSlot = (intentName: string, slots: LexV2Slots, slotToElicit: string, messageContent: string ,sessionAttributes: Record<string, string>) => {
    
    // console.log("Intent Name", intentName)
    // console.log("slots", slots)
    // console.log("slotToElicit",slotToElicit)
    console.log("message content", messageContent)
    return {
        sessionState: {
            dialogAction: {
                type: 'ElicitSlot',
                slotToElicit: slotToElicit,  
            },
            intent: {
                name: intentName,
                slots: slots,
                confirmationState: 'None',
                state: "InProgress"
            },
            sessionAttributes:sessionAttributes
        },
        messages: [{
            contentType: 'SSML',
            content: messageContent 
        }]
    };
};
export interface CustomLexV2Event extends LexV2Event {
    isWarmer?: boolean; // Custom property
}
export const deleteSessionAttribute=(event: LexV2Event, attributeName: string)=> {
    // console.log("deleteing session attribute name",attributeName)
    let sessionAttributes = event.sessionState.sessionAttributes || {};
    delete sessionAttributes[attributeName];  // Remove the attribute
    event.sessionState.sessionAttributes = sessionAttributes;  // Update the session attributes
}


export const shouldAskAgain = (event: LexV2Event,varName: string, numOfTimes: number) =>{

    // console.log("EVENT Should ask Again",event)
    let newVarName = "No_of_Times_" + varName;
    let tempVarValue = getSessionAttributeObject(event,newVarName);
    // console.log("|3443|-> temp var",tempVarValue);
    if (tempVarValue == undefined || tempVarValue == null) {
        tempVarValue = 0;
        // console.log("tempVarValue", tempVarValue)
        setSessionAttributeObject(event,newVarName, 0);
    }
    // console.log("|345| -> no of times: ", numOfTimes, "and temVarValue: ", tempVarValue)
    if (tempVarValue < numOfTimes) {
        tempVarValue++;
        setSessionAttributeObject(event,newVarName, tempVarValue);
        return true;
    }
    // console.log(`|1001| -> returning false from shouldweaskAgain? ${varName} : ${numOfTimes}`);
    return false;
}

export const increaseCounterProduct=(counter: string)=> {
    counter = `${Number(counter) + 1}`;
    // console.log("|3440|-> counter",counter)
    return counter
}

export const getSessionAttributeObject = (event: LexV2Event, attributeName: string) => {
    try {
        const attribute = getSessionAttribute(event, attributeName);
        if (attribute) {
            return JSON.parse(attribute); // Only parse if the attribute is a valid string
        }
        return undefined;
    } catch {
        return undefined; // Return undefined if parsing fails
    }
};


export const getSessionAttribute=(event: LexV2Event,attributeName: string | null) => {
    // console.log("inside getSessionAttribute");
    if (event.sessionState.sessionAttributes) {
        if (!attributeName) return "null"; 
        return event.sessionState.sessionAttributes?.[attributeName]
    }
    // console.log("did not find the attibute name")
    return null
}


export const safelyRemoveAtIndex =(array: any, index: number) => {
    console.log("Splicing", array ,index)
    if (array != null && index >= 0 && index < array.length) {
      array.splice(index, 1)
      console.log("Spliced 1", array)
      return array
    }
}

export const setSessionAttributeObject=(event: any,attributeName: string , value: number ) =>{
    // console.log("event object",event, attributeName , value)
    setSessionAttribute(event,attributeName, JSON.stringify(value));
}

export const setSessionAttribute=(event: LexV2Event,attributeName: string , value: string)=> {
    if (typeof event.sessionState.sessionAttributes === "undefined" || event.sessionState.sessionAttributes === null) {
        console.log("yes the value is nul");
        event.sessionState.sessionAttributes = {}
        console.log("after null sa", event.sessionState.sessionAttributes);
    }
    if (value) {
        // console.log("value setting",value)
        // console.log("0099",attributeName)
        event.sessionState.sessionAttributes[attributeName] = value;
        console.log("Updated sessionAttributes:", event.sessionState.sessionAttributes);
    } else {
        delete event.sessionState.sessionAttributes[attributeName];
    }
}

export const updateSlotValue = (event: any, slotName: string, newSlotValue: string | null) => {
    console.log(`Updating slot "${slotName}" with value:`, newSlotValue);

    // Check if the slot exists in the event's intent
    if (Object.keys(event.sessionState.intent.slots).includes(slotName)) {
        
        let slotValue = null;

        // If newSlotValue is not null, construct the slot object
        if (newSlotValue !== null) {
            slotValue = {
                value: {
                    originalValue: newSlotValue,
                    resolvedValues: [newSlotValue],
                    interpretedValue: newSlotValue
                }
            };
        }

        event.sessionState.intent.slots[slotName] = slotValue;

        console.log(`Updated slot "${slotName}" to:`, event.sessionState.intent.slots[slotName]);

        return event; // Return the updated event object
    } else {
        console.warn(`Slot "${slotName}" does not exist in the intent.`);
        return event; // Return the event unchanged
    }
};

export const fulfill =(intentName: string, slots: LexV2Slots,sessionAttrs: Record<string, string> ,messageContent: string)=>{
    let result={
        sessionState: {
            dialogAction: {
                type: 'Close',
                fulfillmentState: 'Fulfilled',
            },
            intent: {
                name: intentName,
                slots: slots,
                confirmationState: 'None',
                state : "Fulfilled"
            },
            sessionAttributes: sessionAttrs,
        },
        messages: [{
            contentType: 'SSML',
            content: messageContent
        }]
    };
    console.log("FULFILL RESULT ", JSON.stringify(result))
    return result;
}