export type Message = {
  messageId: string; // identifier of the message
  chatId: string; // id of the chat the message belongs to
  sender: "user" | "bot"; // sender of the message
  content: string; // content of the message
  timestamp: number; // timestamp of the message
  usedSearch?: boolean;
  references?: {
    title?: string;
    url: string;
  }[];
};

export type CreateMessageDTO = Omit<
  Message,
  "messageId" | "chatId" | "timestamp"
>;

export type Chat = {
  chatId: string; // identifier of the chat
  userId: string; // id of the user who is the owner of the chat. users can have multiple chats
  messages: Message[]; // list of messages sent on the chat
  createdAt: number; // creation date of the chat
  updatedAt: number; // last updated date of the chat. (date of the last message sent)
  title?: string; // title of the chat
};
