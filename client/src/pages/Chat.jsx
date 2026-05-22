import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Plus, Search, BookmarkPlus, ChevronRight, X } from 'lucide-react';
import { useChat } from '../hooks/useChat';
import { useLeadCapture } from '../hooks/useLeadCapture';
import ChatBubble from '../components/ChatBubble';
import LeadGate from '../components/LeadGate';
import LeadModal from '../components/LeadModal';
import Disclaimer from '../components/Disclaimer';

const SUGGESTION_CHIPS = [
  { label: '3-bed under $900K near GO',         persona: 'buying' },
  { label: 'Is Leslieville still a good buy?',  persona: 'buying' },
  { label: 'Cash flow on a Hamilton duplex',    persona: 'investing' },
  { label: 'Get a private recommendation',      persona: 'recommendation' },
];

export default function Chat() {
  const [input, setInput]             = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showGate, setShowGate]       = useState(false);
  const [modalType, setModalType]     = useState(null);
  const [gated, setGated]             = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const { messages, streaming, streamText, error, sendMessage, clearMessages } = useChat();
  const { submitLead } = useLeadCapture();

  const allMessages = streaming
    ? [...messages, { role: 'assistant', content: streamText, id: 'stream', _streaming: true }]
    : messages;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length, streamText]);

  // Show lead gate after 3 user messages
  useEffect(() => {
    const userCount = messages.filter(m => m.role === 'user').length;
    if (userCount >= 3 && !gated) {
      setShowGate(true);
    }
  }, [messages, gated]);

  const handleSend = () => {
    if (!input.trim() || streaming) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChip = (chip) => {
    if (chip.persona === 'recommendation') {
      setModalType('recommendation');
      return;
    }
    sendMessage(chip.label);
  };

  const handleGateSubmit = async (data) => {
    await submitLead({ type: 'alert', ...data });
    setGated(true);
    setShowGate(false);
  };

  const handleLeadSubmit = async (data) => {
    await submitLead({ ...data, conversation: messages });
  };

  const isEmpty = messages.length === 0 && !streaming;

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-cream overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || window.innerWidth >= 1024) && (
          <motion.aside
            initial={{ x: -260, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -260, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-[260px] shrink-0 bg-cream2 border-r border-cream3 flex flex-col z-30 absolute lg:relative h-full"
          >
            <div className="p-4 border-b border-cream3">
              <button
                onClick={() => clearMessages()}
                className="btn-primary w-full text-sm"
              >
                <Plus size={16} />
                new search
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-ink4 font-sans px-2 py-2">recent</p>
              {messages.length > 0 && (
                <button className="w-full text-left px-3 py-2.5 rounded-xl text-sm text-ink2 font-sans hover:bg-cream3 transition-colors truncate">
                  {messages[0]?.content?.slice(0, 40)}...
                </button>
              )}
              {messages.length === 0 && (
                <p className="text-xs text-ink4 font-sans px-3 py-2">no searches yet</p>
              )}
            </div>
            <div className="p-4 border-t border-cream3">
              <p className="text-[11px] text-ink3 font-sans leading-snug">
                Create a free account to save searches and get alerts.
              </p>
              <button
                onClick={() => setModalType('alert')}
                className="mt-2 w-full btn-secondary text-xs py-2"
              >
                create free account
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Mobile sidebar toggle */}
        <div className="lg:hidden absolute top-3 left-3 z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-white rounded-lg border border-cream3 text-ink2 min-h-[36px] min-w-[36px] flex items-center justify-center"
          >
            <Search size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 pt-4">
          {isEmpty ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-lg mx-auto">
              <div className="w-14 h-14 bg-greenl rounded-2xl flex items-center justify-center mb-5">
                <div className="w-8 h-8 bg-green rounded-xl flex items-center justify-center">
                  <span className="text-white font-serif text-sm font-bold">PL</span>
                </div>
              </div>
              <h2 className="font-serif text-3xl text-ink mb-2">What are you looking for?</h2>
              <p className="text-ink3 font-sans text-sm mb-8">
                Tell us like you'd tell a friend — we'll handle the rest.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.label}
                    onClick={() => handleChip(chip)}
                    className="px-4 py-2 bg-white text-ink2 font-sans text-sm rounded-xl border border-cream3 hover:border-green hover:text-green transition-all min-h-[44px]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-6 pt-4">
              {allMessages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  streaming={!!msg._streaming}
                />
              ))}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-red-600 font-sans">{error}</p>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Lead gate overlay */}
        {showGate && !gated && (
          <LeadGate
            onSubmit={handleGateSubmit}
            onDismiss={() => setShowGate(false)}
          />
        )}

        {/* Input bar */}
        <div className="border-t border-cream3 bg-cream px-4 sm:px-6 py-3 pb-16 md:pb-3">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-end gap-3 bg-white rounded-2xl border border-cream3 px-4 py-3 focus-within:ring-2 focus-within:ring-green focus-within:border-transparent transition-all">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about a property, neighbourhood, or market..."
                rows={1}
                style={{ resize: 'none' }}
                className="flex-1 bg-transparent font-sans text-sm text-ink placeholder:text-ink4 outline-none leading-relaxed"
              />
              <motion.button
                onClick={handleSend}
                disabled={!input.trim() || streaming}
                whileHover={input.trim() && !streaming ? { scale: 1.05 } : {}}
                whileTap={input.trim() && !streaming ? { scale: 0.95 } : {}}
                className={`p-2 rounded-xl min-h-[36px] min-w-[36px] flex items-center justify-center transition-all ${
                  input.trim() && !streaming
                    ? 'bg-green text-white hover:bg-greend'
                    : 'bg-cream2 text-ink4'
                }`}
              >
                <Send size={16} />
              </motion.button>
            </div>
            <Disclaimer type="chat-bar" className="mt-2" />
          </div>
        </div>
      </div>

      {/* Lead modal */}
      {modalType && (
        <LeadModal
          type={modalType}
          conversationHistory={messages}
          onSubmit={handleLeadSubmit}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
