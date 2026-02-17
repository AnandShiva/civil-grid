
import { OpenAIAdapter } from "./openai";
import type { LLMProvider } from "./types";
import dotenv from "dotenv";

dotenv.config();

export function createLLMProvider(): LLMProvider {
    const providerType = process.env.LLM_PROVIDER || "openai";
    const apiKey = process.env.LLM_API_KEY || "dummy-key";
    const baseURL = process.env.LLM_BASE_URL;
    const model = process.env.LLM_MODEL || "gpt-4o";

    console.log(`Initializing LLM Provider: ${providerType}, Model: ${model}`);

    // Currently, both generic OpenAI and Ollama (compatible) use the OpenAI client structure
    // We can distinguish them here if custom logic is needed, but for now, reuse adapter.
    if (providerType === "ollama") {
        // Ollama usually runs on localhost:11434/v1 and acts like OpenAI
        return new OpenAIAdapter(apiKey, baseURL || "http://localhost:11434/v1", model);
    }

    return new OpenAIAdapter(apiKey, baseURL, model);
}
