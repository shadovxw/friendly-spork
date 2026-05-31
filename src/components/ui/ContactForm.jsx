import React, { useState } from 'react';
import { Send, CheckCircle, AlertTriangle } from 'lucide-react';

// Free, no-backend form delivery via Web3Forms (https://web3forms.com).
// 1. Grab a free access key at https://web3forms.com (takes ~30s, no account needed).
// 2. Create a `.env` file in the project root with:  VITE_WEB3FORMS_KEY=your-key-here
// 3. Restart `npm run dev`. Submissions then arrive in your inbox.
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY || '';

const ContactForm = () => {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!ACCESS_KEY) {
      setStatus('error');
      setError('Form not configured yet — set VITE_WEB3FORMS_KEY in your .env file.');
      return;
    }

    setStatus('sending');
    setError('');

    const formData = new FormData(e.target);
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
        e.target.reset();
      } else {
        setStatus('error');
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setError('Network error. Please try again.');
    }
  };

  const inputClass =
    'w-full bg-neutral-900/60 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder:text-neutral-600 font-mono outline-none focus:border-cyan-500/50 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto mt-14 mb-10 text-left space-y-4">
      {/* Honeypot anti-spam field — bots fill it, humans never see it. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} className="hidden" aria-hidden="true" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input name="name" type="text" required placeholder="NAME" className={inputClass} />
        <input name="email" type="email" required placeholder="EMAIL" className={inputClass} />
      </div>

      <textarea name="message" required rows={4} placeholder="MESSAGE" className={`${inputClass} resize-none`} />

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-cyan-400 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Send size={14} />
        {status === 'sending' ? 'Transmitting…' : 'Send Message'}
      </button>

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
    </form>
  );
};

export default ContactForm;
