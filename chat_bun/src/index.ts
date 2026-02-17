
import Fastify from "fastify";
import cors from "@fastify/cors";
import { createLLMProvider } from "./services/llm/factory";

const fastify = Fastify({
    logger: true,
});

await fastify.register(cors, {
    origin: "*", // Adjust for production
});

const llmProvider = createLLMProvider();

fastify.post("/api/chat", async (request, reply) => {
    const { messages } = request.body as { messages: any[] };

    if (!messages || !Array.isArray(messages)) {
        return reply.code(400).send({ error: "Invalid messages format" });
    }

    try {
        // Set headers for Server-Sent Events (SSE) or just raw streaming
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");

        const stream = await llmProvider.streamResponse(messages);

        // Pipe the stream to the response
        for await (const chunk of stream) {
            reply.raw.write(chunk);
        }

        reply.raw.end();
    } catch (error) {
        request.log.error(error);
        reply.code(500).send({ error: "Internal Server Error" });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: "0.0.0.0" });
        console.log("Server listening using Bun on http://localhost:3000");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
