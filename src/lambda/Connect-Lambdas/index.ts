import { ClaimedPhNumberLambda } from "./ClaimedPhNumber";



export function getLambda(name: string) {

  
    switch (name) {
      case "claimed":
        return new ClaimedPhNumberLambda()
      default:
        throw new Error(`invalid lambda name ${name}`);
    }
  
  }
  
  
  export const routing = async (event: any) => {
    return await getLambda('claimed').handler(event);
  };