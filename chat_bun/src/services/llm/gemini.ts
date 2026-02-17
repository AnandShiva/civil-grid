
import { GoogleGenerativeAI, type Content, type Part } from "@google/generative-ai";
import type { LLMProvider, Message } from "./types";

export class GeminiAdapter implements LLMProvider {
    private genAI: GoogleGenerativeAI;
    private model: string;

    constructor(apiKey: string, model: string = "gemini-1.5-flash") {
        this.genAI = new GoogleGenerativeAI(apiKey);
        this.model = model;
    }

    private mapMessagesToGemini(messages: Message[]): { history: Content[], lastMessage: string, systemInstruction?: string } {
        const history: Content[] = [];
        let systemInstruction: string | undefined;
        let lastMessage = "";

        // Iterate through all messages except the last one to build history
        // The last message is the current prompt
        const messagesToProcess = [...messages];
        const lastMsgObj = messagesToProcess.pop();

        if (lastMsgObj && lastMsgObj.role === 'user') {
            lastMessage = lastMsgObj.content;
        } else if (lastMsgObj) {
            // If last message is not user, put it back or handle appropriately. 
            // Usually chat completions end with a user user. 
            // But validly, we might just treat it as history if we want to continue? 
            // For now, assume strict chat flow: User asks, bot answers. 
            // If the last message is what we want to generate *response to*, it should be user.
            // If we just want to continue, it might be different. 
            // Let's assume standard "chat with history" where last is user.
            lastMessage = lastMsgObj.content; // Even if it's assistant? No, that would be weird.
            // Actually, for robust handling, if the last message is assistant, we might be asking for continuation?
            // But simpler usage: Last message is new input.
        }

        for (const msg of messagesToProcess) {
            if (msg.role === 'system') {
                // Collect system messages. Gemini 1.5 supports systemInstruction.
                // We'll concatenate if multiple.
                systemInstruction = systemInstruction ? systemInstruction + "\n" + msg.content : msg.content;
            } else {
                const parts: Part[] = [{ text: msg.content }];
                const role = msg.role === 'assistant' ? 'model' : 'user';
                history.push({ role, parts });
            }
        }

        return { history, lastMessage, systemInstruction };
    }

    async streamResponse(messages: Message[]): Promise<ReadableStream<Uint8Array>> {
        const { history, lastMessage, systemInstruction } = this.mapMessagesToGemini(messages);

        const model = this.genAI.getGenerativeModel({
            model: this.model,
            systemInstruction: systemInstruction
        });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessageStream(lastMessage);

        return new ReadableStream({
            async start(controller) {
                for await (const chunk of result.stream) {
                    const chunkText = chunk.text();
                    if (chunkText) {
                        controller.enqueue(new TextEncoder().encode(chunkText));
                    }
                }
                controller.close();
            },
        });
    }

    async completeResponse(messages: Message[]): Promise<string> {
        const { history, lastMessage, systemInstruction } = this.mapMessagesToGemini(messages);

        const model = this.genAI.getGenerativeModel({
            model: this.model,
            systemInstruction: systemInstruction
        });

        const chat = model.startChat({
            history: history,
        });

        const result = await chat.sendMessage(lastMessage);
        return result.response.text();
    }
}
