export interface FallbackResponse {
    sessionState: {
      state: string;
      sessionAttributes: Record<string, string>;
      dialogAction: { type: string };
    };
    messages?: { contentType: "SSML"; content: string }[];
  }