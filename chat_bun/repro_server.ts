
import Fastify from "fastify";

const fastify = Fastify({
    logger: true,
});

fastify.post("/api/chat", async (request, reply) => {
    try {
        // Mimic the bug: Set headers for SSE
        reply.raw.setHeader("Content-Type", "text/event-stream");
        reply.raw.setHeader("Cache-Control", "no-cache");
        reply.raw.setHeader("Connection", "keep-alive");

        // Simulate an error
        throw new Error("Simulated LLM error");

        // Unreachable
        /*
        const stream = ...
        for await (const chunk of stream) {
            reply.raw.write(chunk);
        }
        reply.raw.end();
        */
    } catch (error) {
        request.log.error(error);
        // Fix: Reset Content-Header if possible
        if (!reply.raw.headersSent) {
            reply.raw.removeHeader('Content-Type');
        }
        reply.code(500).send({ error: "Internal Server Error" });
    }
});

const start = async () => {
    try {
        await fastify.listen({ port: 3001, host: "0.0.0.0" });
        console.log("Repro server listening on http://localhost:3001");
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
