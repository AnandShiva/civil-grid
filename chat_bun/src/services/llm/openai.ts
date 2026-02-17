
import OpenAI from "openai";
import type { LLMProvider, Message } from "./types";

export class OpenAIAdapter implements LLMProvider {
    private client: OpenAI;
    private model: string;

    constructor(apiKey: string, baseURL?: string, model: string = "gpt-4o") {
        this.client = new OpenAI({
            apiKey,
            baseURL,
        });
        this.model = model;
    }

    async streamResponse(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
        const stream = await this.client.chat.completions.create({
            model: this.model,
            messages: messages as any,
            stream: true,
        });

        return new ReadableStream({
            async start(controller) {
                for await (const chunk of stream) {
                    const content = chunk.choices[0]?.delta?.content || "";
                    if (content) {
                        controller.enqueue(new TextEncoder().encode(content));
                    }
                }
                controller.close();
            },
        });
    }

    async completeResponse(messages: Message[]): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: this.model,
            messages: messages as any,
        });
        return response.choices[0]?.message?.content || "";
    }
}
