import { I_ENVprops } from "../../../../model/Ienvprops";
import { BritishRoutingLambda } from "./BritishRoutingLambda";

const _props : I_ENVprops={
  region: process.env.REGION!,
  Country_code: process.env.COUNTRY_CODE!,
  locale: process.env.LOCALE_ID!
}

export function getLambda(name: string) {

    switch (name) {
      case "routing":
        return new BritishRoutingLambda()
      default:
        throw new Error(`invalid lambda name ${name}`);
    }
  
  }
  
  
  export const routing = async (event: any) => {
    return await getLambda('routing').validate(event,_props);
  };
