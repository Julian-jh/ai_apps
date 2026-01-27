// In-memory store for conversations
const conversations = new Map<string, string>();

export const conversationRepository = {
   getLastResponseID(conversationId: string) {
      return conversations.get(conversationId);
   },
   setLastResponseID(conversationId: string, responseId: string) {
      conversations.set(conversationId, responseId);
   },
};
