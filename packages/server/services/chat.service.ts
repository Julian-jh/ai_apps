import OpenAI from 'openai';
import { conversationRepository } from '../repositories/conversation.repository';

//implementation details
const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type chatResponse = {
   id: string;
   message: string;
};

export const chatService = {
   // Add the user message to conversation
   async sendMessage(
      prompt: string,
      conversationId: string
   ): Promise<chatResponse> {
      const response = await client.responses.create({
         model: 'gpt-4o-mini',
         input: prompt,
         temperature: 0.2,
         max_output_tokens: 200,
         previous_response_id:
            conversationRepository.getLastResponseID(conversationId),
      });
      //res.json({ message: response.output_text });
      // Save the conversation state
      conversationRepository.setLastResponseID(conversationId, response.id);
      return {
         id: response.id,
         message: response.output_text,
      };
   },
};
