
import type { ReadableStream } from "bun";

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface LLMProvider {
  streamResponse(messages: Message[]): Promise<ReadableStream<Uint8Array>>;
  completeResponse(messages: Message[]): Promise<string>;
}
