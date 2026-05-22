import { motion } from 'framer-motion';
import PropertyCard from './PropertyCard';
import SignalCard from './SignalCard';
import Disclaimer from './Disclaimer';

function parseMessageContent(text) {
  const parts = [];
  const propertyRegex = /<property_card>([\s\S]*?)<\/property_card>/g;
  const signalRegex   = /<market_signal>([\s\S]*?)<\/market_signal>/g;

  let lastIndex = 0;
  const matches = [];

  let m;
  const re = /<(property_card|market_signal)>([\s\S]*?)<\/\1>/g;
  while ((m = re.exec(text)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ type: 'text', content: text.slice(lastIndex, m.index) });
    }
    try {
      const data = JSON.parse(m[2].trim());
      parts.push({ type: m[1] === 'property_card' ? 'property' : 'signal', data });
    } catch {
      parts.push({ type: 'text', content: m[0] });
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: 'text', content: text.slice(lastIndex) });
  }
  return parts;
}

function TextContent({ text, streaming }) {
  const hasPrice = /\$[\d,]/.test(text);
  return (
    <div className="space-y-2">
      {text.split('\n').filter(Boolean).map((line, i) => (
        <p key={i} className="text-sm font-sans text-ink leading-relaxed">{line}</p>
      ))}
      {streaming && <span className="stream-cursor" />}
      {hasPrice && !streaming && <Disclaimer type="ai-estimate" className="block mt-1" />}
    </div>
  );
}

export default function ChatBubble({ role, content, streaming = false }) {
  const isUser = role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[75%] bg-ink text-cream px-4 py-3 rounded-2xl rounded-br-sm">
          <p className="text-sm font-sans leading-relaxed">{content}</p>
        </div>
      </motion.div>
    );
  }

  const parts = parseMessageContent(content || '');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 bg-green rounded-full flex items-center justify-center shrink-0 mt-1">
        <span className="text-white font-serif text-xs font-bold">PL</span>
      </div>
      <div className="flex-1 space-y-3 max-w-[85%]">
        {parts.length === 0 && streaming && (
          <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3">
            <span className="stream-cursor" />
          </div>
        )}
        {parts.map((part, i) => {
          if (part.type === 'text' && part.content.trim()) {
            return (
              <div key={i} className="bg-white rounded-2xl rounded-tl-sm px-4 py-3">
                <TextContent text={part.content} streaming={streaming && i === parts.length - 1} />
              </div>
            );
          }
          if (part.type === 'property') {
            return <PropertyCard key={i} property={part.data} inline />;
          }
          if (part.type === 'signal') {
            return <SignalCard key={i} signal={part.data} />;
          }
          return null;
        })}
      </div>
    </motion.div>
  );
}
