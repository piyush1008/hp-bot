import { USEnglsihRoutingLambda } from "./USEnglish-Routing";

export function getLambda(name: string) {

  
    switch (name) {
      case "routing":
        return new USEnglsihRoutingLambda()
      default:
        throw new Error(`invalid lambda name ${name}`);
    }
  
  }
  
  
  export const routing = async (event: any) => {
    return await getLambda('routing').handler(event);
  };


