import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

// Free, no-backend form delivery via Web3Forms (https://web3forms.com).
// 1. Grab a free access key at https://web3forms.com (takes ~30s, no account needed).
// 2. Locally: create a `.env` file in the project root with  VITE_WEB3FORMS_KEY=your-key-here  and restart `npm run dev`.
// 3. In production: set VITE_WEB3FORMS_KEY in the hosting provider's build environment variables and rebuild,
//    because Vite bakes the value in at build time. Then send yourself a test message.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const ContactForm = ({ onSent, fallbackEmail }) => {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ACCESS_KEY) {
      // visitors should never see setup instructions: point them at email instead
      setStatus('error');
      setError(fallbackEmail ? `The form isn't live yet. Please email ${fallbackEmail}.` : "The form isn't live yet.");
      return;
    }

    setStatus('sending');
    setError('');

    const form = e.target;
    const formData = new FormData(form);
    formData.append('access_key', ACCESS_KEY);
    formData.append('subject', 'New message from your portfolio');
    formData.append('from_name', 'Portfolio Contact Form');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus('success');
        form.reset();
        onSent?.();
      } else {
        setStatus('error');
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const labelClass = 'block mb-1.5 font-mono text-[10px] uppercase tracking-[0.25em] text-gray-400';
  const inputClass =
    'w-full bg-neutral-900/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 font-mono outline-none transition focus:border-cyan-500/70 focus:ring-2 focus:ring-cyan-500/30';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mt-14 mb-10 text-left space-y-4">
      {/* Honeypot anti-spam field — bots fill it, humans never see it. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className={labelClass}>Name</label>
          <input id="cf-name" name="name" type="text" required autoComplete="name" placeholder="Your name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="cf-email" className={labelClass}>Email</label>
          <input id="cf-email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" className={inputClass} />
        </div>
      </div>

      <div>
        <label htmlFor="cf-message" className={labelClass}>Message</label>
        <textarea id="cf-message" name="message" required rows={4} placeholder="What are you building?" className={`${inputClass} resize-none`} />
      </div>

      {/* dark with an accent border that fills on hover, so the heading stays the brightest thing here */}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 px-10 py-4 border border-cyan-500/60 bg-transparent text-cyan-200 font-black uppercase tracking-widest text-xs rounded-full transition-all duration-300 hover:bg-cyan-500 hover:text-black focus-visible:bg-cyan-500 focus-visible:text-black outline-none disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        {status === 'sending' ? 'Transmitting…' : 'Send Message'}
      </button>

      <div aria-live="polite">
        {status === 'success' && (
          <p className="flex items-center justify-center gap-2 text-green-400 text-xs font-mono uppercase tracking-wider">
            <CheckCircle size={14} /> Message transmitted — I’ll get back to you.
          </p>
        )}
        {status === 'error' && (
          <p className="flex items-center justify-center gap-2 text-red-400 text-xs font-mono uppercase tracking-wider text-center">
            <AlertTriangle size={14} /> {error}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
