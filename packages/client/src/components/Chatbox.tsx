import { FaArrowUp } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { useRef, useState, type KeyboardEvent } from 'react';
import axios from 'axios';

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
   const { register, handleSubmit, reset, formState } = useForm<FormData>(); // Initialize react-hook-form

   const onSubmit = async ({ prompt }: FormData) => {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
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
   };

   const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault(); // Prevents adding a new line
         handleSubmit(onSubmit)(); // Calls the submit handler
      }
   };

   return (
      <div>
         <div className="flex flex-col gap-3 mb-5">
            {messages.map((messages, index) => (
               <p
                  key={index}
                  className={`px-3 
                    py-1
                    rounded-lg 
                    ${
                       messages.role === 'user'
                          ? 'bg-blue-600 text-white self-end'
                          : 'bg-gray-100 text-black self-start'
                    }`}
               >
                  {messages.content}
               </p>
            ))}
         </div>

         <form
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={onKeyDown}
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
