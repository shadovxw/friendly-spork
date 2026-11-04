import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Check } from 'lucide-react';
import ConstellationCanvas from '../effects/ConstellationCanvas';

// three.js loads only when the footer is about to be used; phones and reduced-motion visitors keep the 2D constellation
const ConnectionField = lazy(() => import('../effects/ConnectionField'));
import ContactForm from '../ui/ContactForm';
import { useSystem } from '../../hooks/useSystem';
import resumeFile from '../../assets/resume.pdf';

// Headline lines rise out of a mask, one after the other. The in-view trigger sits on the (unclipped) <h2>:
// an element whose own clip-path hides it entirely never counts as intersecting, so it could not trigger itself.
const headline = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const headlineLine = {
  hidden: { clipPath: 'inset(100% 0 0 0)', y: 40 },
  show: { clipPath: 'inset(0% 0 0 0)', y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

// Same fade as the stars: transparent at the top edge, solid from 35% down.
const STAR_MASK = 'linear-gradient(to bottom, transparent, #000 35%)';

const contactInfo = {
  email: "vrishank.w02@gmail.com",
  linkedin: "https://www.linkedin.com/in/vrishank-warrier-ab529628a/",
  github: "https://github.com/shadovxw" // Preserved from your previous project data
};

const COMMAND_CHIPS = ['projects', 'resume', 'status', 'contact', 'help'];

const Footer = () => {
  const { playHover, playClick } = useSystem();
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([
    { type: 'system', text: 'CONNECTION_ESTABLISHED // NODE_ID: 0x82FA' },
    { type: 'system', text: 'TYPE "HELP" TO VIEW AVAILABLE COMMANDS.' }
  ]);
  const scrollRef = useRef(null);

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', url: contactInfo.github, Icon: Github },
    { name: 'LinkedIn', url: contactInfo.linkedin, Icon: Linkedin },
  ];

  // Command Logic with Updated Info
  const commands = {
    help: "AVAILABLE: PROJECTS, RESUME, STATUS, CLEAR, CONTACT",
    projects: "REDIRECTING TO ARCHIVES... (SCROLLING UP)",
    status: "ALL SYSTEMS OPERATIONAL // LOC: MUMBAI, IN",
    contact: `EMAIL: ${contactInfo.email} // LINKEDIN: @vrishank-warrier`,
    resume: "FETCHING RESUME.PDF... [DOWNLOAD_READY]",
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const runCommand = (raw) => {
    const cmd = raw.toLowerCase().trim();
    if (cmd === '') return;
    const next = [...history, { type: 'user', text: `> ${cmd}` }];

    if (cmd === 'clear') {
      setHistory([]);
    } else if (commands[cmd]) {
      next.push({ type: 'output', text: commands[cmd] });
      setHistory(next);
      if (cmd === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      if (cmd === 'resume') {
        const a = document.createElement('a');
        a.href = resumeFile;
        a.download = 'Vrishank_Warrier_Resume.pdf';
        a.click();
      }
    } else {
      next.push({ type: 'error', text: `ERR: COMMAND_NOT_FOUND: ${cmd}` });
      setHistory(next);
    }
    playClick();
  };

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      runCommand(input);
      setInput('');
    }
  };

  // The form reports back here so the terminal can log it.
  const handleSent = () => {
    setHistory((h) => [...h, { type: 'output', text: '> message_sent // ack 200' }]);
    window.dispatchEvent(new CustomEvent('contact-sent')); // the background pulses once
  };

  const copyEmail = async () => {
    playClick();
    try {
      await navigator.clipboard.writeText(contactInfo.email);
    } catch {
      const t = document.createElement('textarea');
      t.value = contactInfo.email;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const chipClass =
    'inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.15em] text-gray-300 transition-colors hover:border-cyan-500/60 hover:text-cyan-300 focus-visible:border-cyan-500/60 focus-visible:text-cyan-300 outline-none';

  return (
    // pt-32 keeps the heading clear of the fixed nav when you reach the very bottom
    <footer id="footer" className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden pt-32">

      {/* 1. NEURAL BACKGROUND: the stars fade in from the top instead of starting at a hard line */}
      <div className="absolute inset-0 z-0" style={{ maskImage: STAR_MASK, WebkitMaskImage: STAR_MASK }}>
        <Suspense fallback={null}>
          <ConnectionField fallback={<ConstellationCanvas />} />
        </Suspense>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90 pointer-events-none" />
      </div>

      {/* bridge: the About section's colour melting into black */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-56 bg-gradient-to-b from-[#0b0a0d] to-transparent" />

      {/* soft dark glow behind the form so the particles thin out where you type */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(ellipse_45%_32%_at_50%_66%,rgb(0_0_0/0.8),transparent_70%)]" />

      {/* 2. MAIN CALL TO ACTION (CENTERED) */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4">
        <p className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-6 animate-pulse">
          Transmission End // Initialize Connection
        </p>

        <motion.h2
          className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter mb-8"
          variants={headline}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={headlineLine}>LET'S</motion.div>
          <motion.div variants={headlineLine} className="collab-gradient">COLLABORATE</motion.div>
        </motion.h2>

        {/* links as chips: the most-clicked things in this section */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {socialLinks.map(({ name, url, Icon }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className={chipClass}
            >
              <Icon size={14} aria-hidden="true" /> {name}
            </a>
          ))}
          <button type="button" onClick={copyEmail} onMouseEnter={() => playHover()} className={chipClass} aria-label={`Copy email address ${contactInfo.email}`}>
            {copied ? <Check size={14} aria-hidden="true" /> : <Mail size={14} aria-hidden="true" />}
            {copied ? 'Copied' : contactInfo.email}
          </button>
        </div>

        {/* Functional contact form */}
        <ContactForm onSent={handleSent} fallbackEmail={contactInfo.email} />
      </div>

      {/* 3. INTEGRATED SYSTEM TERMINAL (BOTTOM) */}
      <div className="relative z-20 w-full max-w-[704px] mx-auto px-4 pb-8">
        <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          {/* Terminal Top Bar */}
          <div className="bg-neutral-800/50 px-4 py-2 flex items-center justify-between border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/20" />
              <div className="w-2 h-2 rounded-full bg-yellow-500/20" />
              <div className="w-2 h-2 rounded-full bg-green-500/20" />
            </div>
            <div className="text-[9px] font-mono text-neutral-500 uppercase tracking-[0.3em]">
              System_Diagnostics // {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Output Scroll Area */}
          <div ref={scrollRef} className="h-24 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-1 scrollbar-hide">
            {history.map((l, i) => (
              <div key={i} className={`${l.type === 'user' ? 'text-white font-bold' :
                  l.type === 'error' ? 'text-red-500' :
                    'text-cyan-400/70'
                }`}>
                {l.text}
              </div>
            ))}
          </div>

          {/* Command chips: shows it's interactive without typing "help" */}
          <div className="flex flex-wrap gap-2 px-4 pb-3">
            {COMMAND_CHIPS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => runCommand(c)}
                onMouseEnter={() => playHover()}
                className="rounded border border-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-300/80 transition-colors hover:border-cyan-500/60 hover:text-cyan-200 focus-visible:border-cyan-500/60 outline-none"
              >
                {c}
              </button>
            ))}
          </div>

          {/* Input Line */}
          <div className="flex items-center gap-3 p-4 bg-black/40 border-t border-white/5">
            <span className="text-cyan-500 font-black animate-pulse">{`>>`}</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleCommand}
              placeholder="ENTER_COMMAND_TO_EXECUTE..."
              aria-label="Terminal command"
              className="bg-transparent border-none outline-none text-white text-[11px] font-mono w-full placeholder:text-neutral-700"
            />
          </div>
        </div>

        {/* Footer Meta */}
        <div className="mt-8 flex justify-between items-center text-[9px] font-mono text-neutral-600 uppercase tracking-[0.3em]">
          <span>© {currentYear} SHADOVXW</span>
          <div className="hidden md:flex gap-4">
            <span>LAT: 19.0760° N</span>
            <span>LON: 72.8777° E</span>
          </div>
          <span>V.2.0.BUILD</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
