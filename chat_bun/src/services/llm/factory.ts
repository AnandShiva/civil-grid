
import { OpenAIAdapter } from "./openai";
import { GeminiAdapter } from "./gemini";
import type { LLMProvider } from "./types";
import dotenv from "dotenv";

dotenv.config();

export function createLLMProvider(): LLMProvider {
    const providerType = process.env.LLM_PROVIDER || "gemini";
    const apiKey = process.env.LLM_API_KEY || "dummy-key"; // Default generic key
    const geminiKey = process.env.GEMINI_API_KEY;
    const baseURL = process.env.LLM_BASE_URL;
    const model = process.env.LLM_MODEL; // Let providers decide default if undefined

    console.log(`Initializing LLM Provider: ${providerType}, (target model: ${model || "default"})`);

    if (providerType === "gemini") {
        if (!geminiKey) {
            console.warn("GEMINI_API_KEY is not set. Using dummy key or failing.");
        }
        return new GeminiAdapter(geminiKey || "dummy-key", model || "gemini-2.0-flash");
    }

    // Currently, both generic OpenAI and Ollama (compatible) use the OpenAI client structure
    // We can distinguish them here if custom logic is needed, but for now, reuse adapter.
    if (providerType === "ollama") {
        // Ollama usually runs on localhost:11434/v1 and acts like OpenAI
        return new OpenAIAdapter(apiKey, baseURL || "http://localhost:11434/v1", model || "llama3");
    }

    return new OpenAIAdapter(apiKey, baseURL, model || "gpt-4o");
}
