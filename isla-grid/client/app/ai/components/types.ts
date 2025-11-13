export type ChatRole = "user" | "assistant";

export interface ChatReference {
  title?: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  usedSearch?: boolean;
  references?: ChatReference[];
}

export interface ConversationPreview {
  id: string;
  title: string;
  lastMessage: string;
  updatedAt: string;
  pinned?: boolean;
}
