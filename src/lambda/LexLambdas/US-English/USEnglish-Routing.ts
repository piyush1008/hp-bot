import { LexV2Event } from "aws-lambda";
import { RoutingLambda } from "../lib/RoutingLambda";
import { CustomLexV2Event } from "../utils/lexActions";
import { I_ENVprops } from "../../../../model/Ienvprops";





export class USEnglsihRoutingLambda extends RoutingLambda{

    public async handler(event: LexV2Event): Promise<any> {
           
        console.log("routing method",RoutingLambda);
        if ((event as any).isWarmer) {
            console.log("Warming detected");
            return "Lambda is warm." 
        }

        const _props : I_ENVprops={
            region: process.env.REGION!,
            Country_code: process.env.COUNTRY_CODE!,
            locale: process.env.LOCALE_ID!
        }
        const parentResponse = await super.validate(event,_props);  
        return { ...parentResponse};
    }
    
}