export enum MessageAuthor {
  USER = 'USER',
  AI = 'AI',
  SYSTEM = 'SYSTEM',
}

export interface ChatMessage {
  id: string;
  author: MessageAuthor;
  text: string;
}