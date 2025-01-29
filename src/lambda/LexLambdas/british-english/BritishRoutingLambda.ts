import { LexV2Event } from "aws-lambda";
import { RoutingLambda } from "../lib/RoutingLambda";
import { I_ENVprops } from "../../../../model/Ienvprops";


const _props : I_ENVprops={
    region: process.env.REGION!,
    Country_code: process.env.COUNTRY_CODE!,
    locale: process.env.LOCALE_ID!
  }




export class BritishRoutingLambda extends RoutingLambda{
//     public async handler(event: LexV2Event): Promise<any> {
           
//         console.log("routing method",RoutingLambda);
//         if ((event as any).isWarmer) {
//             console.log("Warming detected");
//             return "Lambda is warm." 
//         }

//         await super.handler(event,_props);  
// }

}