import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Loader2 } from 'lucide-react';

const GREETING = {
  role: 'assistant',
  text: "Hey — I'm mini-Vrishank 🤖. Ask me about my projects, experience, or stack.",
};

const SUGGESTIONS = [
  'What projects have you built?',
  'Tell me about your experience',
  'What’s your tech stack?',
];

const MiniMe = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to the newest message.
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  // Focus the input when the panel opens.
  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const nextMessages = [...messages, { role: 'user', text: trimmed }];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    // Shown to the user whenever anything goes wrong — never leak raw errors.
    const FALLBACK =
      "Hmm, I can't reach my brain right now 😅 — drop me a line at vrishank.w02@gmail.com and I'll reply personally.";

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Drop the static greeting so it isn't sent as conversation history.
        body: JSON.stringify({
          messages: nextMessages.filter((m) => m !== GREETING).map((m) => ({ role: m.role, text: m.text })),
        }),
      });

      // Read as text first so a non-JSON / empty body (e.g. a 404 in plain `vite dev`)
      // doesn't throw a cryptic "Unexpected end of JSON input" at the user.
      const raw = await res.text();
      let data = null;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      const reply = typeof data?.reply === 'string' ? data.reply.trim() : '';
      if (!res.ok || !reply) {
        throw new Error(data?.error || `Unexpected response (${res.status}).`);
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      // Log the real reason for debugging, show the friendly message to the user.
      console.error('[mini-me] chat failed:', err);
      setMessages((prev) => [...prev, { role: 'assistant', text: FALLBACK, error: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? 'Close chat' : 'Chat with mini-Vrishank'}
        className="fixed bottom-8 right-8 z-[120] w-14 h-14 flex items-center justify-center rounded-full bg-cyan-500 text-black shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:scale-110 active:scale-95 transition-transform"
      >
        {isOpen ? <X size={22} /> : <Bot size={24} />}
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-cyan-500 animate-ping opacity-30" />
        )}
      </button>

      {/* Chat panel */}
      <div
        className={`fixed z-[120] bottom-28 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-[380px] max-w-[380px] origin-bottom-right transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-[60vh] max-h-[520px] bg-neutral-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot size={18} />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-white">mini-Vrishank</p>
              <p className="text-[10px] font-mono uppercase tracking-widest text-green-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Online
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close" className="ml-auto text-white/40 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-cyan-500 text-black rounded-br-sm font-medium'
                      : m.error
                      ? 'bg-amber-500/10 text-amber-200/90 border border-amber-500/20 rounded-bl-sm'
                      : 'bg-white/5 text-gray-200 border border-white/5 rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Suggested prompts (only before the first question) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-[11px] px-3 py-1.5 rounded-full border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="px-3.5 py-2.5 rounded-2xl rounded-bl-sm bg-white/5 border border-white/5 text-gray-400">
                  <Loader2 size={16} className="animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
            className="flex items-center gap-2 p-3 border-t border-white/10 bg-black/40"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything…"
              className="flex-1 bg-neutral-800/60 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 outline-none focus:border-cyan-500/50 transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 shrink-0 flex items-center justify-center rounded-full bg-cyan-500 text-black hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MiniMe;
