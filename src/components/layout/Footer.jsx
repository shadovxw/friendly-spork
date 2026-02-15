import React, { useState, useEffect, useRef } from 'react';
import ConstellationCanvas from '../effects/ConstellationCanvas';
import MagneticButton from '../ui/MagneticButton';
import { useSystem } from '../../hooks/useSystem';

const Footer = () => {
  const { playHover, playClick } = useSystem();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'CONNECTION_ESTABLISHED // NODE_ID: 0x82FA' },
    { type: 'system', text: 'TYPE "HELP" TO VIEW AVAILABLE COMMANDS.' }
  ]);
  const scrollRef = useRef(null);

  const currentYear = new Date().getFullYear();

  // Updated Contact Details
  const contactInfo = {
    email: "vrishank.w02@gmail.com",
    linkedin: "https://www.linkedin.com/in/vrishank-warrier-ab529628a/",
    github: "https://github.com/shadovxw" // Preserved from your previous project data
  };

  const socialLinks = [
    { name: 'GitHub', url: contactInfo.github },
    { name: 'LinkedIn', url: contactInfo.linkedin },
    // { name: 'Twitter', url: '#' }
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

  const handleCommand = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toLowerCase().trim();
      const newHistory = [...history, { type: 'user', text: `> ${cmd}` }];

      if (cmd === 'clear') {
        setHistory([]);
      } else if (commands[cmd]) {
        newHistory.push({ type: 'output', text: commands[cmd] });
        setHistory(newHistory);
        if (cmd === 'projects') document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
      } else if (cmd !== "") {
        newHistory.push({ type: 'error', text: `ERR: COMMAND_NOT_FOUND: ${cmd}` });
        setHistory(newHistory);
      }
      setInput('');
      playClick();
    }
  };

  return (
    <footer id="footer" className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden border-t border-white/10">

      {/* 1. NEURAL BACKGROUND & OVERLAY */}
      <div className="absolute inset-0 z-0">
        <ConstellationCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* 2. MAIN CALL TO ACTION (CENTERED) */}
      <div className="relative z-10 flex-grow flex flex-col justify-center items-center text-center px-4 pt-20">
        <p className="text-cyan-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-6 animate-pulse">
          Transmission End // Initialize Connection
        </p>

        {/* FIXED: text-4xl for mobile, sm:text-6xl for tablet, md:text-9xl for desktop */}
        <h2 className="text-4xl sm:text-6xl md:text-9xl font-black tracking-tighter mb-12 mix-blend-difference">
          LET'S <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-gray-500 transition-all duration-700">
            COLLABORATE
          </span>
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
          <MagneticButton
            href={`mailto:${contactInfo.email}`}
            className="px-10 py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-full hover:bg-cyan-400 transition-all duration-300"
          >
            Start a Project
          </MagneticButton>

          <div className="flex gap-8">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.url}
                target={social.url !== '#' ? "_blank" : "_self"}
                rel="noopener noreferrer"
                onClick={() => playClick()}
                onMouseEnter={() => playHover()}
                className="text-gray-500 hover:text-white uppercase text-[10px] font-bold tracking-[0.2em] border-b border-transparent hover:border-cyan-500 transition-all pb-1"
              >
                {social.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 3. INTEGRATED SYSTEM TERMINAL (BOTTOM) */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-6 pb-12">
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
          <div ref={scrollRef} className="h-32 overflow-y-auto p-4 font-mono text-[11px] leading-relaxed space-y-1 scrollbar-hide">
            {history.map((line, i) => (
              <div key={i} className={`${line.type === 'user' ? 'text-white font-bold' :
                  line.type === 'error' ? 'text-red-500' :
                    'text-cyan-400/70'
                }`}>
                {line.text}
              </div>
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
        <br />
        <br />
      </div>
    </footer>
  );
};

export default Footer;