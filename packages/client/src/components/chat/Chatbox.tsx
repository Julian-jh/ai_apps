import axios from 'axios';
import React, { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import TypingIndicator from './TypingIndicator';

type FormData = {
   prompt: string;
};

type chatResponse = {
   message: string;
};

type Message = {
   role: 'user' | 'assistant';
   content: string;
};

const Chatbox = () => {
   const [messages, setMessages] = useState<Message[]>([]); // State to hold chat messages
   const conversationId = useRef(crypto.randomUUID()); // Generate a unique conversation ID
   const formRef = useRef<HTMLFormElement | null>(null); // Ref for the form element
   const [error, setError] = useState('');
   const [isBotTyping, setIsBotTyping] = useState(false); // State to track if the bot is typing
   const { register, handleSubmit, reset, formState } = useForm<FormData>(); // Initialize react-hook-form
   useEffect(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth' }); // Scroll to the form when messages change
   }, [messages]); // Dependency array messages to trigger the effect on messages update

   const onSubmit = async ({ prompt }: FormData) => {
      try {
         setMessages((prev) => [...prev, { content: prompt, role: 'user' }]); // Add user's message to state
         setIsBotTyping(true); // Set bot typing state to true
         setError(''); // Clear any previous errors
         reset(); // Clear the textarea after submission
         const { data } = await axios.post<chatResponse>('/api/chat', {
            // Send POST request to the server
            prompt: prompt, // User's input prompt
            conversationId: conversationId.current, // Current conversation ID
         });
         setMessages((prev) => [
            ...prev,
            { content: data.message, role: 'assistant' },
         ]);
         console.log(data); // Log the response from the server
      } catch (error) {
         console.error(error);
         setError(
            'An error occurred while fetching the response. Please try again.'
         );
      } finally {
         setIsBotTyping(false); // Set bot typing state to false
      }
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); // Prevents adding a new line
         handleSubmit(onSubmit)(); // Calls the submit handler
      }
   };

   const reformatCopyMessage = (
      e: React.ClipboardEvent<HTMLParagraphElement>
   ) => {
      const selection = window.getSelection()?.toString().trim();
      if (selection) {
         e.preventDefault();
         e.clipboardData.setData('text/plain', selection);
      }
   };

   return (
      <div className="flex flex-col h-dvh">
         <div className="flex flex-col flex-1 min-h-0 gap-3 mb-5">
            {messages.map((messages, index) => (
               <p
                  key={index} // Use index as key since messages can be identical
                  onCopy={reformatCopyMessage}
                  className={`px-3 
                    py-1
                    rounded-lg 
                    ${
                       messages.role === 'user'
                          ? 'bg-blue-600 text-white self-end' // If the message is from the user
                          : 'bg-gray-100 text-black self-start'
                    }`}
               >
                  <ReactMarkdown>{messages.content}</ReactMarkdown>
               </p>
            ))}
            {isBotTyping && <TypingIndicator />}
            {error && <p className="text-red-700">{error}</p>}
         </div>

         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
            ref={formRef}
            className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
         >
            <textarea
               {...register('prompt', {
                  required: true,
                  validate: (data) => data.trim().length > 0, // Prevents submission of only whitespace
               })} // Register the textarea with react-hook-form, ... means spread operator
               className="w-full border-0 focus:outline-0 resize-none" // Tailwind CSS classes for styling
               placeholder="Ask Anything" // Placeholder text
               maxLength={1000} // Maximum length of input
            />
            <button
               disabled={!formState.isValid} // Disable button if form is invalid(blank input or only whitespace)
               className="bg-black
                           text-white
                           px-2
                           py-2
                           rounded-full
                           disabled:bg-gray-400
                           disabled:cursor-not-allowed
                           disabled:opacity-60"
            >
               <FaArrowUp />
            </button>
         </form>
      </div>
   );
};

export default Chatbox;
