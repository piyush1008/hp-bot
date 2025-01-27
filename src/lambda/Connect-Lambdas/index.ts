import { ClaimedPhNumberLambda } from "./ClaimedPhNumber";
import { MultiLingualPromptLambda } from "./MultilingualPromptLambda";



export function getLambda(name: string) {

  
    switch (name) {
      case "claimed":
        return new ClaimedPhNumberLambda()
      case "multi-prompt":
        return new MultiLingualPromptLambda()  
      default:
        throw new Error(`invalid lambda name ${name}`);
    }
  
  }
  
  
  export const ClaimedPhNumber = async (event: any) => {
    return await getLambda('claimed').handler(event);
  };

  export const MultiLingualPrompt = async (event: any) => {
    return await getLambda('multi-prompt').handler(event);
  };