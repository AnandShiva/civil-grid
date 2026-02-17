
import { useState, useCallback } from 'react';

export interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim()) return;

        const userMessage: Message = { role: 'user', content };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                }),
            });

            if (!response.body) return;

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                assistantMessage += chunk;

                setMessages((prev) => {
                    const newMessages = [...prev];
                    const lastMsg = newMessages[newMessages.length - 1];
                    if (lastMsg.role === 'assistant') {
                        lastMsg.content = assistantMessage;
                    }
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return {
        messages,
        input,
        setInput,
        sendMessage,
        isLoading,
    };
}
