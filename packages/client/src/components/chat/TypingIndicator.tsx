import React from 'react';

const TypingIndicator = () => {
   return (
      <div>
         <div className="inline-flex gap-1 px-3 py-3 bg-gray-400 rounded-xl">
            <Dot />
            <Dot className="[animation-delay:0.2s]" />
            <Dot className="[animation-delay:0.4s]" />
         </div>
      </div>
   );
};

type DotProps = {
   className?: string;
};

const Dot = ({ className }: DotProps) => (
   <div
      className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${className || ''}`}
   ></div>
); // Tailwind CSS classes for styling and animation for a dot
export default TypingIndicator;
