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
      return { prefix: 'SYSTEM >', color: 'text-pink-500' };
    default:
      return { prefix: '>', color: 'text-gray-400' };
  }
};

const ChatMessageDisplay: React.FC<ChatMessageProps> = ({ message }) => {
  const { prefix, color } = getAuthorStyles(message.author);

  return (
    <div className={`flex items-start text-sm mb-2 ${color} break-words`}>
      <span className="mr-2 flex-shrink-0">{prefix}</span>
      <p className="min-w-0">{message.text}</p>
    </div>
  );
};

export default ChatMessageDisplay;