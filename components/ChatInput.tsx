import React from 'react';
import SendIcon from './icons/SendIcon';

interface ChatInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ value, onChange, onSubmit, isLoading }) => {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={isLoading ? "GENERATING..." : "Enter game name..."}
        disabled={isLoading}
        className="flex-grow bg-gray-900 border-2 border-green-400 focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_10px_theme(colors.cyan.400)] text-green-400 p-2 sm:p-3 text-sm sm:text-base h-12 sm:h-14 min-w-0"
        autoComplete="off"
        spellCheck="false"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-pink-500 text-black h-12 sm:h-14 w-12 sm:w-14 flex-shrink-0 flex items-center justify-center border-2 border-pink-500 hover:bg-pink-400 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors focus:outline-none focus:shadow-[0_0_10px_theme(colors.pink.500)]"
      >
        <SendIcon />
      </button>
    </form>
  );
};

export default ChatInput;