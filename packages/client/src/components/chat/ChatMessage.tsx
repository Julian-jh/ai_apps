import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import TypingIndicator from './TypingIndicator';

export type Message = {
   role: 'user' | 'assistant';
   content: string;
};

type Props = {
   messages: Message[];
   isBotTyping?: boolean;
};

const reformatCopyMessage = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
   const selection = window.getSelection()?.toString().trim();
   if (selection) {
      e.preventDefault(); // Prevent the default copy behavior
      e.clipboardData.setData('text/plain', selection); // Set the clipboard data to the selected text
   }
};

const ChatMessage = ({ messages, isBotTyping }: Props) => {
   const lastMessageRef = useRef<HTMLDivElement | null>(null); // Ref for the last message element
   useEffect(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the last message when messages change
   }, [messages, isBotTyping]); // Dependency array messages and isBotTyping to trigger the effect on update
   return (
      <div className="flex flex-col flex-1 min-h-0 gap-3 mb-5">
         {messages.map((message, index) => (
            <p
               key={index} // Use index as key since messages can be identical
               ref={
                  index === messages.length - 1 && !isBotTyping
                     ? lastMessageRef
                     : null
               } // Attach ref to the last message
               onCopy={reformatCopyMessage} // Attach copy event handler to reformat copied text
               className={`px-3 
                    py-1
                    rounded-lg 
                    ${
                       message.role === 'user'
                          ? 'bg-blue-600 text-white self-end' // If the message is from the user
                          : 'bg-gray-100 text-black self-start'
                    }`}
            >
               <ReactMarkdown>{message.content}</ReactMarkdown>{' '}
               {/* Render message content as Markdown */}
            </p>
         ))}
         {isBotTyping && (
            <div ref={lastMessageRef}>
               <TypingIndicator />
            </div>
         )}
      </div>
   );
};

export default ChatMessage;
