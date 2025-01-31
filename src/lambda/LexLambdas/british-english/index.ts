import { I_ENVprops } from "../../../../model/Ienvprops";
import { ASK_CASE_Product } from "../lib/Ask_Case_ProductLambda";
import { RoutingLambda } from "../lib/RoutingLambda";
import { SupportDeviceLambda } from "../lib/supportDeviceLambda";



const _props : I_ENVprops={
  region: process.env.REGION!,
  Country_code: process.env.COUNTRY_CODE!,
  locale: process.env.LOCALE_ID!
}


export function getLambda(name: string) {
  if (_props.Country_code === "IE") {
    _props.locale = "en_IE";
    console.log("Locale changed to British", _props.locale);
  }

  switch (name) {
    case "routing":
      return new RoutingLambda().handler;
    case "supportDevice":
      return new SupportDeviceLambda().handler;
    case "ask_case_product":
      return new ASK_CASE_Product().handler;
    default:
      throw new Error(`Invalid lambda name: ${name}`);
  }
}

export const routing = async (event: any) => {
  return await getLambda("routing")(event, _props);
};

export const supportDevice = async (event: any) => {
  return await getLambda("supportDevice")(event, _props);
};

export const ask_case_product = async (event: any) => {
  return await getLambda("ask_case_product")(event, _props);
};