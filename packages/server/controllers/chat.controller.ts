import type { Request, Response } from 'express';
import z, { set } from 'zod';
import { chatService } from '../services/chat.service';

// implementation details
// set up zod schema for input validation
const ChatSchema = z.object({
   prompt: z
      .string()
      .trim() // remove leading/trailing whitespace
      .min(1, 'Prompt is required')
      .max(1000, 'Prompt is too long'),
   conversationId: z.uuid(),
});

// Public interface for chat controller
export const chatController = {
   async sendMessage(req: Request, res: Response) {
      // Validate input by zod
      const parseResult = ChatSchema.safeParse(req.body);
      if (!parseResult.success) {
         const tree = z.treeifyError(parseResult.error);
         return res.status(400).json({ error: tree });
      }

      try {
         const { prompt, conversationId } = parseResult.data;
         const response = await chatService.sendMessage(prompt, conversationId);
         res.json({ message: response.message });
      } catch (error) {
         res.status(500).json({ error: 'Failed to get response from OpenAI' });
      }
   },
};
