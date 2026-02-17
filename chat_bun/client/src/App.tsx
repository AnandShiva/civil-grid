
import { useChat } from './hooks/useChat';
import { FormEvent, useRef, useEffect } from 'react';

function App() {
  const { messages, input, setInput, sendMessage, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      <header className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Bun Chat AI
        </h1>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">Start a conversation...</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-800 text-gray-100 rounded-bl-none'
                }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
              <span className="animate-pulse">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-none rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl font-medium transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
