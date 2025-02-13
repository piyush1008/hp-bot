// @ts-nocheck
import {elicitSlot, fulfill,updateSlotValue,getSessionAttribute,setSessionAttribute ,shouldAskAgain, increaseCounterProduct, deleteSessionAttribute , safelyRemoveAtIndex} from '../utils/lexActions'
import { LexV2Event } from "aws-lambda";
import { LexRuntimeV2Client, RecognizeTextCommand } from "@aws-sdk/client-lex-runtime-v2";
import { I_ENVprops } from '../../../../model/Ienvprops';
const warmer = require("lambda-warmer");


export class ASK_CASE_Product{


    public async handler(event: LexV2Event,_props: I_ENVprops): Promise<any> {
        try {
            if (await warmer(event)) {
                console.log("Lambda is warmed up!");
                return "Lambda warmed";
            }
            console.log("Event details",JSON.stringify(event))
            const intentName = event.sessionState.intent.name;
            const slots = event.sessionState.intent.slots;
            const SessionAttributes = event.sessionState.sessionAttributes! || {};
    
    
                const logSessionAttribute = (key: string, value: string | null) => {
                    if (value) {
                        let array_value = value ? (value.includes(";") ? value.replace(/\n/g, "").split(";").filter(Boolean) : value.replace(/\n/g, " ").split(" ").filter(Boolean)) : null;
                        return array_value;
                    }
                    return null;
                };
        
                var CaseId_Array : string[] | null = logSessionAttribute("CaseId", getSessionAttribute(event,"CaseId"));
                var CaseSerials_Array: string[] | null =logSessionAttribute("CaseSerials", getSessionAttribute(event,"CaseSerials"));
                var FirstNames_Array: string[] | null =logSessionAttribute("FirstNames", getSessionAttribute(event,"FirstNames"));
                var LastModifiedDates_Array: string[] | null =logSessionAttribute("LastModifiedDates", getSessionAttribute(event,"LastModifiedDates"));
                var LastNames_Array: string[] | null =logSessionAttribute("LastNames", getSessionAttribute(event,"LastNames"));
                var ProductDeviceId_Array: string[] | null =logSessionAttribute("ProductDeviceId", getSessionAttribute(event,"ProductDeviceId"));
                var ProductNames_Array: string[] | null =logSessionAttribute("ProductNames", getSessionAttribute(event,"ProductNames"));
                var ProductCategory_Array: string[] | null =logSessionAttribute("ProductCategory", getSessionAttribute(event,"ProductCategory"));
                var ProductNumbers_Array: string[] | null =logSessionAttribute("ProductNumbers", getSessionAttribute(event,"ProductNumbers"));
                var ProductProfileId_Array: string[] | null =logSessionAttribute("ProductProfileId", getSessionAttribute(event,"ProductProfileId"));
                var ProductSerials_Array: string[] | null =logSessionAttribute("ProductSerials", getSessionAttribute(event,"ProductSerials"));
                var Profile_Profile_Id_Array: string[] | null =logSessionAttribute("Profile_Profile_Id", getSessionAttribute(event,"Profile_Profile_Id"));
                var Profile_Person_Id_Array: string[] | null =logSessionAttribute("Profile_PersonId", getSessionAttribute(event,"Profile_PersonId"));
                var Profile_Type_Array: string[] | null =logSessionAttribute("Profile_Type", getSessionAttribute(event,"Profile_Type"));
                var Product_Sub_Category_Array: string[] | null =logSessionAttribute("Product_Sub_Category", getSessionAttribute(event,"Product_Sub_Category"));
                var Profile_Email_Address_Array: string[] | null =logSessionAttribute("Profile_Email_Address", getSessionAttribute(event,"Profile_Email_Address"));
                var Latest_First_Name: string[] | null =logSessionAttribute("Latest_First_Name", getSessionAttribute(event,"Latest_First_Name"));
                var Latest_Last_Name: string[] | null =logSessionAttribute("Latest_Last_Name", getSessionAttribute(event,"Latest_Last_Name"));
                var Latest_Email_Address: string[] | null =logSessionAttribute("Latest_Email_Address", getSessionAttribute(event,"Latest_Email_Address"));
                var Latest_Profile_Id: string[] | null =logSessionAttribute("Latest_Email_Address", getSessionAttribute(event,"Latest_Profile_Id"));
                var Latest_Person_Id: string[] | null =logSessionAttribute("Latest_Email_Address", getSessionAttribute(event,"Latest_Person_Id"));
                var SourceMatch: string[] | null =logSessionAttribute("SourceMacth", getSessionAttribute(event,"SourceMacth"));
                var ConnId: string[] | null =logSessionAttribute("ConnId", getSessionAttribute(event,"ConnId"));
        
                
        
                console.log("CaseId_Array:", CaseId_Array);
                console.log("CaseSerials_Array:", CaseSerials_Array);
                console.log("FirstNames_Array:", FirstNames_Array);
                console.log("LastModifiedDates_Array:", LastModifiedDates_Array);
                console.log("LastNames_Array:", LastNames_Array);
                console.log("Profile_PersonId_Array:", Profile_Person_Id_Array);
                console.log("ProductDeviceId_Array:", ProductDeviceId_Array);
                console.log("ProductNames_Array:", ProductNames_Array);
                console.log("ProductCategory_Array:", ProductCategory_Array);
                console.log("ProductNumbers_Array:", ProductNumbers_Array);
                console.log("ProductProfileId_Array:", ProductProfileId_Array);
                console.log("ProductSerials_Array:", ProductSerials_Array);
                console.log("Profile_Profile_Id_Array:", Profile_Profile_Id_Array);
                console.log("Profile_Type_Array:", Profile_Type_Array);
                console.log("Product_Sub_Category_Array:", Product_Sub_Category_Array);
                console.log("Profile_Email_Address_Array:", Profile_Email_Address_Array);
        
                console.log("Latest_First_Name:", Latest_First_Name);
                console.log("Latest_Last_Name:", Latest_Last_Name);
                console.log("Latest_Email_Address:", Latest_Email_Address);
                console.log("Latest_Profile_Id:", Latest_Profile_Id);
                console.log("Latest_Person_Id:", Latest_Person_Id);
                console.log("SourcMatch", SourceMatch);
                console.log("ConnId:", ConnId);
        
                var CaseCount = Number(getSessionAttribute(event,"CaseCount"))
                console.log("CaseCount",CaseCount,typeof(CaseCount));
                var productCount = Number(getSessionAttribute(event,"productCount"))
                console.log("productCount", productCount,typeof(CaseCount));
        
                console.log("details of slot and intent", intentName, slots)
    
            

    
            if(CaseId_Array)
            {
                if(getSessionAttribute(event,"Ask_product_ques") !== "true")
                {
                    console.log("Case Numbers Length", CaseId_Array.length)
                    if(getSessionAttribute(event,"CaseAsk_iterator") === undefined)
                    {
                        setSessionAttribute(event,"CaseAsk_iterator","0")
                    }
                    var Case_Serial_Number = CaseSerials_Array[Number(getSessionAttribute(event,"CaseAsk_iterator"))]
                    var Case_Number = CaseId_Array[Number(getSessionAttribute(event,"CaseAsk_iterator"))]
                    console.log("Case serial 99", Case_Serial_Number ,Case_Number)
                    if(getSessionAttribute(event,"No_of_Times_Ask_CaseNumber") === "1")
                    {
                        console.log("ask exceeded")
                        updateSlotValue(event , 'confirmCaseNumber' , "no")
                    }
    
                    if(slots.confirmCaseNumber === null )
                    {
                        for(let i=0; i< productCount;i++){
                            if(Case_Serial_Number===ProductSerials_Array[i])
                            {
                                let Last_Four_Digits = Case_Number.slice(-4)
                                console.log("last for digit",Last_Four_Digits)
                                setSessionAttribute(event,"Temp_caseNumber",CaseId_Array[i])
                                console.log("asking the product name",ProductNames_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_productName",ProductNames_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_productCategory",ProductCategory_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_SerialNumber",ProductSerials_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_ProductNumber",ProductNumbers_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_DeviceId",ProductDeviceId_Array?.[i] ?? null)
                                setSessionAttribute(event,"Temp_ProductProfileId",ProductProfileId_Array?.[i] ?? null)
                                console.log("session attri",SessionAttributes)
                                if(getSessionAttribute(event,"First_CaseAsk_Time") === undefined)
                                {
                                    setSessionAttribute(event,"First_CaseAsk_Time","true")
                                    return elicitSlot(intentName, slots, 'confirmCaseNumber', `<speak>Thank you for your patience <break time='0.1s'/> I see that you had called us previously for <break time='0.1s'/> ${ProductNames_Array[i]} <break time='0.1s'/>and a case with the number ending<break time='0.1s'/><say-as interpret-as='digits'>${Last_Four_Digits}</say-as>is still open. Is this the ${ProductCategory_Array[i]} you are calling about?</speak>`,SessionAttributes);
                                }else{
                                    if(shouldAskAgain(event,"Ask_CaseNumber",2))
                                    {
                                        return elicitSlot(intentName, slots, 'confirmCaseNumber', `<speak>I see that you had called us previously for <break time='0.1s'/> ${ProductNames_Array[i]} <break time='0.1s'/>and a case with the number ending<break time='0.1s'/><say-as interpret-as='digits'>${Last_Four_Digits}</say-as>is still open. Is this the ${ProductCategory_Array[i]} you are calling about?</speak>`,SessionAttributes);
                                    }
                                }
                            }
                        }
                    
                    }
                    else if(slots.confirmCaseNumber.value.interpretedValue.toLowerCase() === "yes")
                    {   
                        //confirm the Case and Product as yes
                        updateSlotValue(event,"CaseNumber",getSessionAttribute(event,"Temp_caseNumber"))
                        setSessionAttribute(event,"caseNumber",slots.CaseNumber.value.interpretedValue)
                        setSessionAttribute(event,"whichapi","validateCaseId")
                        const save_Decision_product ={
                            Product_Name:getSessionAttribute(event,"Temp_productName") !==null ? getSessionAttribute(event,"Temp_productName") :null,
                            Product_Serial: getSessionAttribute(event,"Temp_SerialNumber") !==null ? getSessionAttribute(event,"Temp_SerialNumber") :null,
                            ProductNumber: getSessionAttribute(event,"Temp_ProductNumber") !==null ? getSessionAttribute(event,"Temp_ProductNumber") :null,
                            ProductDeviceId: getSessionAttribute(event,"Temp_DeviceId") !==null ? getSessionAttribute(event,"Temp_DeviceId") :null,
                            ProductProfileId:getSessionAttribute(event,"Temp_ProductProfileId") !==null ? getSessionAttribute(event,"Temp_ProductProfileId") :null,
                            CaseId: getSessionAttribute(event,"caseNumber") !== null ? getSessionAttribute(event,"caseNumber"): null
                        }  
                        console.log("Debug 98")
                        console.log("Final_product_Deatils_case1",save_Decision_product)
                        const attributes = {
                            "Selected_Product_Name": save_Decision_product?.Product_Name,
                            "Selected_Product_Serial": save_Decision_product?.Product_Serial,
                            "Selected_ProductNumber": save_Decision_product?.ProductNumber,
                            "Selected_ProductDeviceId": save_Decision_product?.ProductDeviceId,
                            "Selected_ProductProfileId": save_Decision_product?.ProductProfileId,
                            "Selected_CaseId": save_Decision_product?.CaseId
                        };
                        
                        Object.entries(attributes).forEach(([key, value]) => {
                            if (value !== undefined && value !== null) {
                                setSessionAttribute(event, key, value.toString());
                            }
                        });
                        setSessionAttribute(event,"final_Product_details",save_Decision_product.toString())
                        setSessionAttribute(event,"Check_Profile","true") //yes to caswe and product so check profile
                    }
                    else if(slots.confirmCaseNumber.value.interpretedValue.toLowerCase() === "no" || slots.confirmCaseNumber.value.interpretedValue === "Don't know")
                    {
                        
                        deleteSessionAttribute(event,"Temp_caseNumber")
                        deleteSessionAttribute(event,"Temp_productName")
                        deleteSessionAttribute(event,"Temp_ProductNumber")
                        deleteSessionAttribute(event,"Temp_DeviceId")
                        deleteSessionAttribute(event,"Temp_ProductProfileId")
                        deleteSessionAttribute(event,"No_of_Times_Ask_CaseNumber")
                        updateSlotValue(event , 'confirmCaseNumber' , null)
    
                        if(getSessionAttribute(event,"Not_Ask_Serials") === undefined)
                        { // for first time
                            let Not_Ask_Serials = []
                            Not_Ask_Serials.push(Case_Serial_Number)
                            console.log("Not ask serial first", Not_Ask_Serials)
                            setSessionAttribute(event,"Not_Ask_Serials",Not_Ask_Serials.join(","))
                        }else{
                            let Not_Ask_Serials = getSessionAttribute(event,"Not_Ask_Serials").split(",")
                            console.log("Not ask serial 1", Not_Ask_Serials)
                            Not_Ask_Serials.push(Case_Serial_Number)
                            console.log("Not ask serial 2", Not_Ask_Serials)
                            setSessionAttribute(event,"Not_Ask_Serials",Not_Ask_Serials.join(","))
                        }
    
                        setSessionAttribute(event,"CaseAsk_iterator",increaseCounterProduct(getSessionAttribute(event,"CaseAsk_iterator")))
                        Case_Serial_Number = CaseSerials_Array[Number(getSessionAttribute(event,"CaseAsk_iterator"))]
                        var Case_Number = CaseId_Array[Number(getSessionAttribute(event,"CaseAsk_iterator"))]
                        console.log("Case serial 93", Case_Serial_Number,Case_Number)
    
                        if(Number(getSessionAttribute(event,"CaseAsk_iterator")) <  CaseId_Array.length){
                            for(let i=0; i< productCount;i++){
                                if(Case_Serial_Number===ProductSerials_Array[i])
                                {
                                    let Last_Four_Digits = Case_Number.slice(-4)
                                    console.log("last for digit",Last_Four_Digits)
                                    setSessionAttribute(event,"Temp_caseNumber",CaseId_Array[i])
                                    console.log("asking the product name",ProductNames_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_productName",ProductNames_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_productCategory",ProductCategory_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_SerialNumber",ProductSerials_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_ProductNumber",ProductNumbers_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_DeviceId",ProductDeviceId_Array?.[i] ?? null)
                                    setSessionAttribute(event,"Temp_ProductProfileId",ProductProfileId_Array?.[i] ?? null)
                                    console.log("session attri",SessionAttributes)
    
                                    return elicitSlot(intentName, slots, 'confirmCaseNumber', `<speak>I see that you had called us previously for <break time='0.1s'/> ${ProductNames_Array[i]} <break time='0.1s'/>and a case with the number ending<break time='0.1s'/><say-as interpret-as='digits'>${Last_Four_Digits}</say-as>is still open. Is this the ${ProductCategory_Array[i]} you are calling about?</speak>`,SessionAttributes);
                                    
                                }
                            }
                        }else{
                            console.log("No Case to ask now")
                            if(productCount === 1 || productCount == CaseId_Array.length )
                            {
                                updateSlotValue(event,'confirmCaseNumber',"no")
                                console.log("no product to  check prodfile")
                                setSessionAttribute(event,"whichapi","No_Response")
                                setSessionAttribute(event,"Check_Profile","true")
                            }
                            else{
                                console.log("22_ask product")
                                updateSlotValue(event,'confirmCaseNumber',"no")
                                setSessionAttribute(event,"Ask_product_ques","true") // single case user say no to case ask product
                            }
                        
                        }
                    }
                }
            }
            else{
                console.log("No Case |22|")
                setSessionAttribute(event,"Ask_product_ques","true")
            }
    
    
            if(getSessionAttribute(event,"Ask_product_ques")=== "true")
            {
                if(getSessionAttribute(event,"iterator") === undefined)
                {
                    setSessionAttribute(event,"iterator","0")
                }
                var i = Number(getSessionAttribute(event,"iterator"))
    
                //filter all the product details we ask in case number
                if(CaseId_Array)
                {
                    if(getSessionAttribute(event,"Filter_ProductDeatils") === undefined)
                    {
                        setSessionAttribute(event,"Filter_ProductDeatils", "true")
                        console.log("filter poduct 99",getSessionAttribute(event,"Filter_ProductDeatils"))
                        let filterProductDetails = getSessionAttribute(event,"Not_Ask_Serials").split(",")
                        console.log("filtrer product deailts",filterProductDetails)
                        filterProductDetails.forEach(value => {
    
                            let indexToRemove = ProductSerials_Array.indexOf(value);
                            
                            if (indexToRemove !== -1) {
                                ProductSerials_Array=safelyRemoveAtIndex(ProductSerials_Array, indexToRemove)
                                ProductNames_Array=safelyRemoveAtIndex(ProductNames_Array, indexToRemove)
                                ProductNumbers_Array=safelyRemoveAtIndex(ProductNumbers_Array, indexToRemove)
                                ProductDeviceId_Array=safelyRemoveAtIndex(ProductDeviceId_Array, indexToRemove)
                                ProductProfileId_Array=safelyRemoveAtIndex(ProductProfileId_Array, indexToRemove)
                                ProductCategory_Array=safelyRemoveAtIndex(ProductCategory_Array, indexToRemove)
                                setSessionAttribute(event,"productCount",String(Number(getSessionAttribute(event,"productCount"))-1))
                            }
                        });
    
                        console.log("Filter_ProductSerials_Array:", ProductSerials_Array);
                        console.log("Filter_ProductNames_Array:", ProductNames_Array);
                        console.log("Filter_ProductNumbers_Array:", ProductNumbers_Array);
                        console.log("Filter_ProductDeviceId_Array:", ProductDeviceId_Array);
                        console.log("Filter_ProductProfileId_Array:", ProductProfileId_Array);
                        console.log("Filter_ProductCategory_Array:", ProductCategory_Array);
    
                        setSessionAttribute(event, "Filter_ProductSerials",ProductSerials_Array?.join("")?? null);
                        setSessionAttribute(event, "Filter_ProductNames",ProductNames_Array?.join("")?? null);
                        setSessionAttribute(event, "Filter_ProductNumbers", ProductNumbers_Array?.join("")?? null);
                        setSessionAttribute(event, "Filter_ProductDeviceId", ProductDeviceId_Array?.join("")?? null);
                        setSessionAttribute(event, "Filter_ProductProfileId", ProductProfileId_Array?.join("")?? null);
                        setSessionAttribute(event, "Filter_ProductCategory", ProductCategory_Array?.join("")?? null)    
                        
                        setSessionAttribute(event,"First_SerialAsk_Time","true")
                    }
    
                    ProductDeviceId_Array = getSessionAttribute(event, "Filter_ProductDeviceId")?.split(",") ?? null
                    ProductNames_Array = getSessionAttribute(event,"Filter_ProductNames")?.split(",") ?? null
                    ProductCategory_Array =getSessionAttribute(event,"Filter_ProductCategory")?.split(",") ?? null
                    ProductNumbers_Array =getSessionAttribute(event,"Filter_ProductNumbers")?.split(",") ?? null
                    ProductProfileId_Array =getSessionAttribute(event,"Filter_ProductProfileId")?.split(",") ?? null
                    ProductSerials_Array =getSessionAttribute(event,"Filter_ProductSerials")?.split(",") ?? null
                    productCount = Number(getSessionAttribute(event,"productCount"))
    
                }
    
                if(getSessionAttribute(event,"No_of_Times_Ask_ProductName")=== "3")
                {
                    i =  increaseCounterProduct(getSessionAttribute(event,"iterator"))
                    setSessionAttribute(event,"iterator",i.toString()) // deleteing session attribute if iterator increase
                    deleteSessionAttribute(event,"No_of_Times_Ask_ProductName")
                    if (productCount <= i) {
                        updateSlotValue(event,"askProduct","no")
                    }
                }
                
                if(slots.askProduct == null)
                { 
    
                    if(shouldAskAgain(event,"Ask_ProductName",3))
                    {
                        if(getSessionAttribute(event,"First_SerialAsk_Time") ===  undefined)
                        {
                            setSessionAttribute(event,"First_SerialAsk_Time","true")
                            console.log("dyubge 21")
                            return elicitSlot(intentName, slots, 'askProduct', `<speak>Thank you for your patience<break time='0.1s'/>I see that there is  <break time='0.1s'/>${ProductNames_Array[i]}<break time='0.1s'/> registered against the phone number you are calling from. Is this the one that you are calling about today</speak>`,SessionAttributes);
                        }
                        else{
                            console.log("dyubge 22")
    
                            return elicitSlot(intentName, slots, 'askProduct', `<speak>Are you Calling About <prosody rate='medium'> ${ProductNames_Array[i]} </prosody></speak>`,SessionAttributes);
                            
                        }
    
                    }
                    
                }
    
                else if(slots.askProduct.value.interpretedValue.toLowerCase() === "no" || slots.askProduct.value.interpretedValue === "Don't know")
                {
                    i =  increaseCounterProduct(getSessionAttribute(event,"iterator"))
                    setSessionAttribute(event,"iterator",i.toString()) // deleteing session attribute if iterator increase
                    deleteSessionAttribute(event,"No_of_Times_Ask_ProductName")
                    updateSlotValue(event,"askProduct",null)
    
                    if (i < productCount) {
                        console.log("Debug43")
                        return elicitSlot(intentName, slots, 'askProduct', 
                            `<speak>Apologies <break time='0.1s'/> Let’s try this one more time<break time='0.1s'/> Are you calling about<break time='0.1s'/> <prosody rate='medium'> ${ProductNames_Array[i]} </prosody></speak>`, 
                            SessionAttributes
                        );
                    }
                    else{
                        console.log("no more product left")
                        const save_Decision_profile ={
                            First_Name:Latest_First_Name[0] !==null ? Latest_First_Name[0] :null,
                            Last_Name:Latest_Last_Name[0] !==null ? Latest_Last_Name[0] :null,
                            Email_address:Latest_Email_Address[0] !==null ?Latest_Email_Address[0] :null,
                            Profile_Id : (Latest_Profile_Id && Latest_Profile_Id[0] != null) ? Latest_Profile_Id[0] : null,
                            Person_Id: (Latest_Person_Id && Latest_Person_Id[0] != null) ? Latest_Person_Id[0] : null
                        }
                        console.log("Final Profile details_NO_response",save_Decision_profile)
                        setSessionAttribute(event,"final_profile_details",save_Decision_profile.toString())
                        setSessionAttribute(event,"Selected_First_Name",save_Decision_profile.First_Name.toString())
                        setSessionAttribute(event,"Selected_Last_Name",save_Decision_profile.Last_Name.toString())
                        setSessionAttribute(event,"Selected_Email_address",save_Decision_profile.Email_address.toString())
                        setSessionAttribute(event,"Selected_ProductProfileId",String(save_Decision_profile.Profile_Id))
                        setSessionAttribute(event,"Selected_Person_Id",String(save_Decision_profile.Person_Id))
                        setSessionAttribute(event,"Selected_ProductNumber","null")
                        setSessionAttribute(event,"Selected_ProductDeviceId","null")
                        setSessionAttribute(event,"Selected_Product_Name","null")
                        setSessionAttribute(event,"whichapi","No_Response") // ask serial Number
                        return fulfill(intentName,slots,SessionAttributes , "<speak>Okay</speak>")
                    }
                }
                else{
                    i = Number(getSessionAttribute(event,"iterator"))
                    console.log("saving prpduct Details iterator",i)
    
                    if(CaseSerials_Array !== null){
                        CaseSerials_Array.forEach(caseSerial => {
                            if(caseSerial === ProductSerials_Array[i])
                            {
                                console.log("Case_Serial_008",caseSerial)
                                setSessionAttribute(event,"caseNumber",caseSerial)
                                updateSlotValue(event,"CaseNumber",getSessionAttribute(event,"caseNumber"))
                                updateSlotValue(event,"CaseNumberPrompt","yes")
                            }
                        });
                    }
                    
                    console.log("Case number value ",getSessionAttribute(event,"caseNumber"))
                    if(!getSessionAttribute(event,"caseNumber"))
                    {
                        updateSlotValue(event,"CaseNumber",null)
                        updateSlotValue(event,"CaseNumberPrompt","no")    
                    }
    
                    console.log("saving prpduct Details iterator 2332",i)
                    const save_Decision_product = {
                        Product_Name: ProductNames_Array[i] ,
                        Product_Serial: ProductSerials_Array[i] , 
                        ProductNumber: ProductNumbers_Array[i] , 
                        ProductDeviceId: ProductDeviceId_Array && ProductDeviceId_Array[i] || null,
                        ProductProfileId: ProductProfileId_Array && ProductProfileId_Array[i] || null, 
                        CaseId: getSessionAttribute(event, "caseNumber") ?? null
                    };
        
                    console.log("Final_product_Deatils",save_Decision_product)
                    setSessionAttribute(event,"final_Product_details",save_Decision_product.toString())
                    setSessionAttribute(event,"Temp_ProductProfileId",save_Decision_product.ProductProfileId)
                    const attributes = {
                        "Selected_Product_Name": save_Decision_product?.Product_Name,
                        "Selected_Product_Serial": save_Decision_product?.Product_Serial,
                        "Selected_ProductNumber": save_Decision_product?.ProductNumber,
                        "Selected_ProductDeviceId": save_Decision_product?.ProductDeviceId,
                        "Selected_ProductProfileId": save_Decision_product?.ProductProfileId,
                        "Selected_CaseId": save_Decision_product?.CaseId
                    };
                    
                    Object.entries(attributes).forEach(([key, value]) => {
                        if (value !== undefined && value !== null) {
                            setSessionAttribute(event, key, value.toString());
                        }
                        else
                        {
                           setSessionAttribute(event, key, String(value)); 
                        }
                    });
                    setSessionAttribute(event,"Check_Profile","true")
                    console.log("going fullfill")
                }   
                
            }
    
            if(getSessionAttribute(event,"Check_Profile") === "true")
            {
                console.log("checking the User profile exist")
                if( getSessionAttribute(event,"Temp_ProductProfileId") === undefined || getSessionAttribute(event,"Temp_ProductProfileId") === null){
                    console.log("exist profile", SourceMatch)
                    if(Latest_First_Name) {
        
                        const save_Decision_profile ={
                            First_Name:Latest_First_Name[0] !==null ? Latest_First_Name[0] :null,
                            Last_Name:Latest_Last_Name[0] !==null ? Latest_Last_Name[0] :null,
                            Email_address:Latest_Email_Address[0] !==null ?Latest_Email_Address[0] :null,
                            Profile_Id : (Latest_Profile_Id && Latest_Profile_Id[0] != null) ? Latest_Profile_Id[0] : null,
                            Person_Id: (Latest_Person_Id && Latest_Person_Id[0] != null) ? Latest_Person_Id[0] : null
                        }
                        console.log("Final Profile details_Case_Creation2",save_Decision_profile)
                        if(!getSessionAttribute(event,"caseNumber"))
                        {
                            if(getSessionAttribute(event,"whichapi") && getSessionAttribute(event,"whichapi")=== "No_Response")
                            {
                                console.log("No REsponse final")
                            }else{
                                console.log("Going create Case Route")
                                setSessionAttribute(event,"whichapi","createCase") // for case Creation API
                            }
                        }
                        else{
                            setSessionAttribute(event,"whichapi","validateCaseId") // for case Creation API
                        }
                        setSessionAttribute(event,"final_profile_details",save_Decision_profile.toString())
                        setSessionAttribute(event,"Selected_First_Name",save_Decision_profile.First_Name.toString())
                        setSessionAttribute(event,"Selected_Last_Name",save_Decision_profile.Last_Name.toString())
                        setSessionAttribute(event,"Selected_Email_address",save_Decision_profile.Email_address.toString())
                        setSessionAttribute(event,"Selected_ProductProfileId",String(save_Decision_profile.Profile_Id))
                        setSessionAttribute(event,"Selected_Person_Id",String(save_Decision_profile.Person_Id))
                    }
                    else{
                        console.log("Latest User prodile does not exist")
                        setSessionAttribute(event,"whichapi","validateSN")
                        return fulfill(intentName,slots,SessionAttributes,"<speak>Thank you. Let me connect you to an agent for furthur assistance</speak>")
                    }
                }
                else{
                        // console.log("Email Addres",Profile_Email_Address_Array[0])
                        console.log("My identity product profile ID",getSessionAttribute(event,"Temp_ProductProfileId"))
                        if(FirstNames_Array !== null)
                        {
                            for(let j=0 ;j<Profile_Profile_Id_Array.length ; j++)
                            {
                                console.log("j val",j)
                                if(Profile_Profile_Id_Array[j] == getSessionAttribute(event,"Temp_ProductProfileId"))
                                {
                                    if(Profile_Type_Array[j].toLowerCase() === "consumer")
                                    {
                                        const save_Decision_profile ={
                                            First_Name: FirstNames_Array?.[j] ?? null,
                                            Last_Name: LastNames_Array?.[j] ?? null,
                                            Email_address: Profile_Email_Address_Array?.[j] ?? null,
                                            Person_Id: Profile_Person_Id_Array?.[j] ?? null
                                        }
                                        console.log("Final Profile details_1",save_Decision_profile)
                                        if(!getSessionAttribute(event,"caseNumber"))
                                        {
                                            if(getSessionAttribute(event,"whichapi")&&getSessionAttribute(event,"whichapi")=== "No_Response")
                                            {
                                                console.log("No REsponse final_2")
                                            }else{
                                                console.log("Going create Case Route")
                                                setSessionAttribute(event,"whichapi","createCase") // for case Creation API
                                            }
                                        }
                                        else{
                                            console.log("Going validate Case ID Route")
                                            setSessionAttribute(event,"whichapi","validateCaseId") // for case Creation API
                                        }
                                        setSessionAttribute(event, "final_profile_details", save_Decision_profile.toString() || null);
                                        setSessionAttribute(event, "Selected_First_Name", save_Decision_profile.First_Name ? save_Decision_profile.First_Name.toString() : null);
                                        setSessionAttribute(event, "Selected_Last_Name", save_Decision_profile.Last_Name ? save_Decision_profile.Last_Name.toString() : null);
                                        setSessionAttribute(event, "Selected_Email_address", save_Decision_profile.Email_address != null ? String(save_Decision_profile.Email_address) : null);
                                        setSessionAttribute(event, "Selected_Person_Id", save_Decision_profile.Person_Id != null ? String(save_Decision_profile.Person_Id) : null);
                                    }
                                }
                            }
                        }
                        else{
                            console.log("User prodile does not exist")
                            setSessionAttribute(event,"whichapi","validateSN")
                            return fulfill(intentName,slots,SessionAttributes,"<speak>Thank you. Let me connect you to an agent for furthur assistance</speak>")
                        }
                    }
            }
    
            if(getSessionAttribute(event,"whichapi")=== "validateCaseId"){
                console.log("Validate Case ID")
                return fulfill(intentName,slots,SessionAttributes,"<speak>Thank you </speak>")
            }
            else if (getSessionAttribute(event,"whichapi")=== "createCase"){
                console.log("Create Case")
                return fulfill(intentName,slots,SessionAttributes,"<speak>Thank you. Let me document the details before connecting you to an agent for further assistance</speak>")
            }
            else if (getSessionAttribute(event,"whichapi")=== "validateSN") {
                console.log("Validate SN")
                setSessionAttribute(event,"whichapi","validateSN")
                return fulfill(intentName,slots,SessionAttributes,"<speak>Thank you. Let me connect you to an agent for furthur assistance</speak>")
            }
            else  {
                console.log("No_Response")
                setSessionAttribute(event,"whichapi","No_Response")
                return fulfill(intentName,slots,SessionAttributes,"<speak>Okay</speak>")
            }
    
            
        } catch (error) {
            console.log("Error",error)
        }
    }

}