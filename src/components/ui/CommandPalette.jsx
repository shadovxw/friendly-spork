import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, FolderGit2, Layers, Briefcase, User, Mail, FileText, Github, Linkedin, Copy, Archive, ArrowUp, Send, Check } from 'lucide-react';
import resumeFile from '../../assets/resume.pdf';
import { withViewTransition } from '../../utils/viewTransition';
import { modKeyLabel } from '../../utils/platform';

const EMAIL = 'vrishank.w02@gmail.com';

// Palette and nav sit above the site's colour overlay, so they show true colours: purple here, not cyan.
const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const lastFocus = useRef(null); // what had focus before opening, so Esc can hand it back
  const listRef = useRef(null);
  const mod = useMemo(modKeyLabel, []);

  const open = () => {
    lastFocus.current = document.activeElement;
    setQuery("");
    setSelectedIndex(0);
    setIsOpen(true);
  };
  const close = () => {
    setIsOpen(false);
    // after the palette unmounts, put keyboard users back where they were
    setTimeout(() => lastFocus.current?.focus?.(), 0);
  };

  // Scroll to a section, navigating home first if we're on another route.
  const goToSection = (id) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 500);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToTop = () => {
    if (location.pathname !== '/') navigate('/');
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const downloadResume = () => {
    const a = document.createElement('a');
    a.href = resumeFile;
    a.download = 'Vrishank_Warrier_Resume.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const t = document.createElement('textarea');
      t.value = EMAIL;
      document.body.appendChild(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
    setCopied(true);
    setTimeout(() => { setCopied(false); close(); }, 900);
  };

  const openArchive = () => {
    if (location.pathname === '/projects') return;
    sessionStorage.setItem('landingScroll', String(Math.round(window.scrollY)));
    withViewTransition(() => navigate('/projects'));
  };

  // label = the nav's word; hint = the playful version; keywords feed search; keys = "G then ..." shortcut.
  const commands = [
    { id: 'home', label: 'Home', hint: 'back to the top', Icon: Home, keys: 'H', keywords: 'top start landing hero', action: goToTop },
    { id: 'projects', label: 'Projects', hint: 'selected works', Icon: FolderGit2, keys: 'P', keywords: 'work portfolio apps builds archives', action: () => goToSection('projects') },
    { id: 'stack', label: 'Stack', hint: 'the toolchain', Icon: Layers, keys: 'S', keywords: 'skills tech tools k8s kubernetes docker infra languages', action: () => goToSection('stack') },
    { id: 'experience', label: 'Experience', hint: 'the journey', Icon: Briefcase, keys: 'E', keywords: 'work job career education timeline history', action: () => goToSection('experience') },
    { id: 'about', label: 'About', hint: 'the profile', Icon: User, keys: 'A', keywords: 'philosophy bio profile who me', action: () => goToSection('about') },
    { id: 'contact', label: 'Contact', hint: 'send a signal', Icon: Mail, keys: 'C', keywords: 'mail email message hire reach talk', action: () => window.dispatchEvent(new CustomEvent('open-contact')) },
    { id: 'form', label: 'Contact form', hint: 'jump to the bottom', Icon: Send, keys: 'F', keywords: 'message write footer terminal', action: () => goToSection('footer') },
    { id: 'email', label: 'Copy email', hint: EMAIL, Icon: Copy, keywords: 'mail address clipboard', keepOpen: true, action: copyEmail },
    { id: 'archive', label: 'Full archive', hint: 'every project', Icon: Archive, keywords: 'projects all list', action: openArchive },
    { id: 'resume', label: 'Resume', hint: 'download the PDF', Icon: FileText, keys: 'R', keywords: 'cv download pdf', action: downloadResume },
    { id: 'github', label: 'GitHub', hint: 'opens in a new tab', Icon: Github, keywords: 'code repos git source', action: () => window.open('https://github.com/shadovxw', '_blank', 'noopener') },
    { id: 'linkedin', label: 'LinkedIn', hint: 'opens in a new tab', Icon: Linkedin, keywords: 'connect network social', action: () => window.open('https://www.linkedin.com/in/vrishank-warrier-ab529628a/', '_blank', 'noopener') },
  ];

  // Search the label, the playful hint and the keywords
  const q = query.toLowerCase().trim();
  const filteredCommands = commands.filter((cmd) =>
    !q || `${cmd.label} ${cmd.hint} ${cmd.keywords}`.toLowerCase().includes(q)
  );

  const run = (cmd) => {
    if (!cmd) return;
    cmd.action();
    if (!cmd.keepOpen) close();
  };

  // Global shortcuts: Ctrl/Cmd+K toggles, Esc closes, and "g" then a letter jumps to a section.
  const gPending = useRef(0);
  useEffect(() => {
    const onKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) close(); else open();
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        close();
        return;
      }
      if (isOpen) return;

      // "g" then a letter, only when the visitor isn't typing somewhere
      const t = e.target;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (gPending.current && Date.now() - gPending.current < 1200) {
        gPending.current = 0;
        const cmd = commands.find((c) => c.keys && c.keys.toLowerCase() === key);
        if (cmd) { e.preventDefault(); cmd.action(); }
      } else if (key === 'g') {
        gPending.current = Date.now();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  // Let other components (the top bar's hint) open the palette.
  useEffect(() => {
    const onOpen = () => open();
    window.addEventListener('open-palette', onOpen);
    return () => window.removeEventListener('open-palette', onOpen);
  });

  // Arrow keys / Enter inside the menu
  useEffect(() => {
    if (!isOpen) return;
    const onNav = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'Enter') {
        run(filteredCommands[selectedIndex]);
      }
    };
    window.addEventListener('keydown', onNav);
    return () => window.removeEventListener('keydown', onNav);
  });

  // keep the highlighted row in view while arrowing through a long list
  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: 'nearest' });
  }, [selectedIndex, isOpen]);

  // When closed, show a subtle shortcut hint badge (desktop only) so visitors know the palette exists.
  if (!isOpen) {
    return (
      <button
        onClick={open}
        aria-label="Open command palette"
        style={{ viewTransitionName: 'cmdk-hint' }}
        className="hidden md:flex fixed bottom-6 left-6 z-[100] items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-lg text-[10px] font-mono uppercase tracking-widest text-gray-400 hover:text-white hover:border-purple-500/50 transition-colors"
      >
        <kbd className="text-purple-400 font-bold">{mod === '⌘' ? '⌘K' : `${mod} K`}</kbd>
        <span>Menu</span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4" role="dialog" aria-modal="true" aria-label="Command palette">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={close} />

      {/* The Palette Window */}
      <div className="relative w-full max-w-lg bg-neutral-900 border border-white/20 rounded-xl shadow-2xl overflow-hidden animate-fade-in-up">

        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-white/10">
          <span className="text-purple-400 text-lg mr-3">›</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command..."
            aria-label="Search commands"
            className="w-full py-4 bg-transparent text-white outline-none placeholder-gray-500 font-mono"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
          />
          <span className="text-xs text-gray-500 border border-gray-700 px-2 py-1 rounded">ESC</span>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="p-4 text-gray-500 text-center text-sm font-mono">No commands found.</div>
          ) : (
            filteredCommands.map((cmd, index) => {
              const selected = index === selectedIndex;
              const { Icon } = cmd;
              return (
                <button
                  key={cmd.id}
                  data-selected={selected}
                  onClick={() => run(cmd)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors duration-200
                              ${selected ? 'bg-purple-500/10 border-l-2 border-purple-500' : 'border-l-2 border-transparent hover:bg-white/5'}
                          `}
                >
                  <Icon size={18} aria-hidden="true" className={selected ? 'text-purple-300' : 'text-gray-500'} />
                  <span className="min-w-0">
                    <span className={`block text-sm font-bold uppercase tracking-wider ${selected ? 'text-white' : 'text-gray-400'}`}>
                      {cmd.label}
                    </span>
                    <span className="block truncate text-[11px] font-mono text-gray-600">{cmd.hint}</span>
                  </span>
                  <span className="ml-auto flex items-center gap-2">
                    {cmd.id === 'email' && copied ? (
                      <span className="flex items-center gap-1 text-xs font-mono text-purple-300"><Check size={12} /> Copied</span>
                    ) : selected ? (
                      <span className="text-xs text-purple-300 font-mono">↵ Enter</span>
                    ) : cmd.keys ? (
                      <span className="text-[10px] font-mono text-gray-600">G {cmd.keys}</span>
                    ) : null}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/50 px-4 py-2 border-t border-white/5 flex justify-between text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          <span>SHADOVXW</span>
          <span>V.2.0.BUILD</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
