import React, { useState, useEffect, useRef } from 'react';
import { useSystem } from '../hooks/useSystem';

const TerminalFooter = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'WAVEDRIVE_OS V.2.0.0 READY...' },
    { type: 'system', text: 'TYPE "HELP" FOR AVAILABLE COMMANDS.' }
  ]);
  const scrollRef = useRef(null);
  const { playClick, playHover } = useSystem();

  const commands = {
    help: "AVAILABLE: LS, WHOAMI, STATUS, CLEAR, CONTACT",
    ls: "FILES: PROJECTS.LOG, RESUME.PDF, GEAR_LIST.TXT",
    whoami: "USER: VRISHANK WARRIER // ROLE: DIGITAL_ALCHEMIST // LOC: MUMBAI",
    status: "ALL SYSTEMS OPERATIONAL // NODE_ID: 0x82FA",
    contact: "DIRECT_LINK: vrishank@example.com",
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
      } else if (cmd !== "") {
        newHistory.push({ type: 'error', text: `COMMAND NOT FOUND: ${cmd}` });
        setHistory(newHistory);
      }
      
      setInput('');
      playClick();
    }
  };

  return (
    <footer className="w-full bg-black border-t border-white/10 p-6 font-mono md:px-20">
      <div className="max-w-4xl mx-auto bg-neutral-900/50 rounded-lg border border-white/5 overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-neutral-800 px-4 py-2 flex items-center justify-between border-b border-white/5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
          </div>
          <span className="text-[10px] text-neutral-500 tracking-widest uppercase">system_terminal_v1</span>
        </div>

        {/* Output Area */}
        <div ref={scrollRef} className="h-48 overflow-y-auto p-4 text-[12px] space-y-1 custom-scrollbar">
          {history.map((line, i) => (
            <div key={i} className={`${
              line.type === 'user' ? 'text-white' : 
              line.type === 'error' ? 'text-red-400' : 
              'text-cyan-400/80'
            }`}>
              {line.text}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-2 p-4 bg-black/20 border-t border-white/5">
          <span className="text-cyan-500 font-bold">{`>>`}</span>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleCommand}
            onMouseEnter={() => playHover()}
            placeholder="ENTER COMMAND..."
            className="bg-transparent border-none outline-none text-white text-[12px] w-full placeholder:text-neutral-700"
          />
        </div>
      </div>
      
      <div className="mt-8 text-center">
         <p className="text-[10px] text-neutral-600 uppercase tracking-[0.4em]">
           © 2026 // SHADOVXW // ALL_RIGHTS_RESERVED
         </p>
      </div>
    </footer>
  );
};

export default TerminalFooter;