import { LexV2Event } from "aws-lambda";
import { RoutingLambda } from "../lib/RoutingLambda";
import { CustomLexV2Event } from "../utils/lexActions";
import { I_ENVprops } from "../../../../model/Ienvprops";





export class USEnglsihRoutingLambda extends RoutingLambda{


    public async handler(event: LexV2Event): Promise<any> {
       
        if ((event as any).isWarmer) {
            console.log("Warming detected");
            return "Lambda is warm." 
        }

        const _props : I_ENVprops={
            region: process.env.REGION!,
            Country_code: process.env.COUNTRY_CODE!,
            locale: process.env.LOCALE_ID!
        }
        return super.validate(event,_props); 
    }

    
}