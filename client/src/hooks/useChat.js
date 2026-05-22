import { useState, useCallback, useRef } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useChat() {
  const [messages, setMessages]       = useState([]);
  const [streaming, setStreaming]     = useState(false);
  const [streamText, setStreamText]   = useState('');
  const [error, setError]             = useState(null);
  const abortRef = useRef(null);

  const sendMessage = useCallback(async (userText) => {
    if (!userText.trim() || streaming) return;

    const userMsg = { role: 'user', content: userText, id: crypto.randomUUID() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setStreaming(true);
    setStreamText('');
    setError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              accumulated += parsed.text;
              setStreamText(accumulated);
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }

      const assistantMsg = {
        role: 'assistant',
        content: accumulated,
        id: crypto.randomUUID(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError('Something went wrong. Please try again.');
        console.error('Chat error:', err);
      }
    } finally {
      setStreaming(false);
      setStreamText('');
      abortRef.current = null;
    }
  }, [messages, streaming]);

  const abort = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  const clearMessages = useCallback(() => {
    abort();
    setMessages([]);
    setStreamText('');
    setError(null);
  }, [abort]);

  return { messages, streaming, streamText, error, sendMessage, abort, clearMessages };
}
