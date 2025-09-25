import React from 'react';
import { ChatMessage, MessageAuthor } from '../types';

interface ChatMessageProps {
  message: ChatMessage;
}

const getAuthorStyles = (author: MessageAuthor) => {
  switch (author) {
    case MessageAuthor.USER:
      return { prefix: 'PLAYER_1 >', color: 'text-green-400' };
    case MessageAuthor.AI:
      return { prefix: 'ARCADE_AI >', color: 'text-cyan-400' };
    case MessageAuthor.SYSTEM:
      return { prefix: 'SYSTEM >', color: 'text-pink-300' };
    default:
      return { prefix: '>', color: 'text-gray-400' };
  }
};

const ChatMessageDisplay: React.FC<ChatMessageProps> = ({ message }) => {
  const { prefix, color } = getAuthorStyles(message.author);

  return (
    <div className={`mb-6 p-3 ${color} leading-loose border-b border-gray-800 last:border-b-0`}>
      <div className="text-sm font-bold opacity-80 mb-2 whitespace-nowrap">{prefix}</div>
      <div className="text-sm break-words leading-relaxed">{message.text}</div>
    </div>
  );
};

export default ChatMessageDisplay;