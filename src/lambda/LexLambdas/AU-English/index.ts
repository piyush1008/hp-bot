import { I_ENVprops } from "../../../../model/Ienvprops";
import { RoutingLambda } from "../lib/RoutingLambda";
import { SupportDeviceLambda } from "../lib/supportDeviceLambda";



const _props : I_ENVprops={
  region: process.env.REGION!,
  Country_code: process.env.COUNTRY_CODE!,
  locale: process.env.LOCALE_ID!
}




export function getLambda(name: string) {

  if(_props.Country_code === "NZ")
  {
    _props.locale = "en_NZ"
    console.log("Loale change AU",_props.locale)
  }
  
    switch (name) {
      case "routing":
        return new RoutingLambda()
      case "supportDevice":
        return new SupportDeviceLambda()  
      default:
        throw new Error(`invalid lambda name ${name}`);
    }
  
  }
  
  
  export const routing = async (event: any) => {
    return await getLambda('routing').handler(event,_props);
  };

  export const supportDevice = async (event: any) => {
    return await getLambda('supportDevice').handler(event,_props);
  };


