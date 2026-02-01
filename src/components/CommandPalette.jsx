import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  // Define the available commands
  const commands = [
    { id: 'home', label: 'Go Home', icon: '🏠', action: () => navigate('/') },
    {
      id: 'projects',
      label: 'View Projects',
      icon: '⚡',
      action: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }), 500);
        } else {
          document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      id: 'about',
      label: 'Read Philosophy',
      icon: '🧠',
      action: () => {
        if (location.pathname !== '/') {
          navigate('/');
          setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 500);
        } else {
          document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    { id: 'contact', label: 'Send Signal', icon: '📡', action: () => document.querySelector('button[class*="Contact"]').click() },
    { id: 'github', label: 'Open GitHub', icon: '🐙', action: () => window.open('https://github.com', '_blank') },
    { id: 'linkedin', label: 'Connect on LinkedIn', icon: '💼', action: () => window.open('https://linkedin.com', '_blank') },
  ];

  // Filter commands based on search
  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Toggle on CTRL+K or CMD+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle Arrow Keys navigation inside the menu
  useEffect(() => {
    const handleNav = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        filteredCommands[selectedIndex]?.action();
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [isOpen, filteredCommands, selectedIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

      {/* The Palette Window */}
      <div className="relative w-full max-w-lg bg-neutral-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-white/10">
          <span className="text-cyan-400 text-lg mr-3">›</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command..."
            className="w-full py-4 bg-transparent text-white outline-none placeholder-gray-500 font-mono"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">ESC</span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-gray-500 text-center text-sm font-mono">No commands found.</div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <button
                key={cmd.id}
                onClick={() => { cmd.action(); setIsOpen(false); }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200
                            ${index === selectedIndex ? 'bg-cyan-500/10 border-l-2 border-cyan-500' : 'border-l-2 border-transparent hover:bg-white/5'}
                        `}
              >
                <span className="text-xl">{cmd.icon}</span>
                <span className={`text-sm font-bold uppercase tracking-wider ${index === selectedIndex ? 'text-white' : 'text-gray-400'}`}>
                  {cmd.label}
                </span>
                {index === selectedIndex && (
                  <span className="ml-auto text-xs text-cyan-400 font-mono">↵ Enter</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/50 px-4 py-2 border-t border-white/5 flex justify-between text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          <span>Digital Chaos OS</span>
          <span>v2.0.26</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;