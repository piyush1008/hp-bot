import { ClaimedPhNumberLambda } from "./ClaimedPhNumber";
import { MultiLingualPromptLambda } from "./MultilingualPromptLambda";



    
  export const ClaimedPhNumber = async (event: any) => {
    const ClaimPh = new ClaimedPhNumberLambda()
    return await ClaimPh.handler(event)
  };

  export const MultiLingualPrompt = async (event: any) => {
    const MultiPrompt = new MultiLingualPromptLambda()
    return await MultiPrompt.handler(event)
  };