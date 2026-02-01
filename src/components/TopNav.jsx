import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/profile.jpg'; 
import resumeFile from '../assets/resume.pdf';
import { useSystem } from '../hooks/useSystem';
import HackerText from './HackerText';
import { Mail, Linkedin, Github, FileText, X } from 'lucide-react';

// --- CONTACT MODAL (Larger Container + Full Portrait) ---
const ContactModal = ({ isOpen, onClose }) => {
  const { playClick, playHover } = useSystem();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4 py-7">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      
      {/* Main Card Container - INCREASED SIZE (max-w-md) */}
      <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 p-1 shadow-2xl animate-in fade-in zoom-in duration-300">
        
        {/* Close Button */}
        <button 
            onClick={() => { onClose(); playClick(); }} 
            className="absolute -top-8 right-0 text-white/50 hover:text-white transition-colors flex items-center gap-2 text-xs uppercase font-mono tracking-widest"
        >
            [CLOSE] <X size={14} />
        </button>

        {/* 1. THE PHOTO SECTION - INCREASED HEIGHT (aspect-[3/4]) */}
        <div className="relative w-full aspect-[3/4] bg-black overflow-hidden mb-1 group">
            {/* The Cut Edge Mask */}
            <div 
              className="absolute inset-0 w-full h-full bg-neutral-800" 
              style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 85%, 85% 100%, 0 100%, 0 10%)' }}
            >
                <img 
                    src={heroImage} 
                    alt="Profile" 
                    // Reverted to standard centering (object-center) inside a larger frame
                    className="w-full h-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-110" 
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                
                {/* Text Overlay */}
                <div className="absolute bottom-6 left-8 z-10">
                    <h2 className="text-5xl font-black text-white uppercase leading-none tracking-tighter mb-2">
                        Vrishank<br />Warrier
                    </h2>
                    <div className="flex items-center gap-3">
                        <div className="h-[2px] w-12 bg-cyan-500" />
                        <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase">
                            ENGINERRING STUDENT
                        </p>
                    </div>
                </div>
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
        </div>

        {/* 2. CONTENT BELOW */}
        <div className="bg-neutral-900 border-t border-white/5 p-6 space-y-5">
            
            {/* Status Line */}
            <div className="flex justify-between items-center text-[11px] font-mono text-gray-500 mb-2 uppercase tracking-wider">
                <span></span>
                <span className="flex items-center gap-2 text-green-500">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> 
                    System Online
                </span>
            </div>

            {/* Action Grid */}
            <div className="grid grid-cols-2 gap-3">
                <a 
                  href="https://github.com/shadovxw" 
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={playClick} 
                  className="flex items-center justify-center gap-2 py-4 border border-white/10 hover:bg-white hover:text-black hover:border-white text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <Github size={16} /> GitHub
                </a>
                
                <a 
                  href="https://www.linkedin.com/in/vrishank-warrier-ab529628a/"
                  target="_blank" 
                  rel="noreferrer" 
                  onClick={playClick} 
                  className="flex items-center justify-center gap-2 py-4 border border-white/10 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <Linkedin size={16} /> LinkedIn
                </a>
                
                <a 
                  href="mailto:vrishank.w02@email.com" 
                  onClick={playClick} 
                  className="col-span-2 flex items-center justify-center gap-2 py-4 border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
                >
                    <Mail size={16} /> Send Transmission
                </a>
            </div>

            {/* Resume Button */}
            {/* Resume Button - Changed from <button> to <a> for download */}
            <a 
                href={resumeFile}             // The imported file
                download="Vrishank_Warrier_Resume.pdf" // The name the file will have when downloaded
                onClick={playClick} 
                className="w-full group relative py-5 bg-white text-black font-black uppercase text-sm tracking-[0.2em] overflow-hidden block text-center cursor-pointer"
            >
                <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <FileText size={16} /> Download Resume
                </span>
            </a>
        </div>

      </div>
    </div>
  );
};
// --- MAIN NAV ---
const TopNav = ({ show = true }) => {
  const [activeSection, setActiveSection] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [mobileHover, setMobileHover] = useState(''); // Tracking hover specifically for mobile
  
  const navRefs = useRef({});
  const { playHover, playClick } = useSystem(); 
  const navLinks = ['Projects', 'Experience', 'About'];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'experience', 'about'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) current = section;
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    if (isMenuOpen) {
      setTriggerGlitch(true);
      setTimeout(() => setTriggerGlitch(false), 400);
    }
  }, [isMenuOpen]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    playClick();
    setIsMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  

  return (
    <>
      <nav className={`fixed top-0 w-full p-6 md:p-10 z-[200] flex justify-between items-center transition-all duration-1000 ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
      }`}>
        
        <Link to="/" className="text-2xl font-black tracking-widest text-white mix-blend-difference z-[210]">VW.</Link>

        {/* HAMBURGER TOGGLE */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-[210] flex flex-col justify-between w-8 h-5">
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 relative">
          {navLinks.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => handleNavClick(e, item.toLowerCase())} onMouseEnter={() => playHover()} className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-widest">
              <HackerText label={item} />
            </a>
          ))}
          <button onClick={() => setIsContactOpen(true)} className="ml-2 px-8 py-3 bg-white text-black text-xs font-black rounded-full uppercase">Contact</button>
        </div>

        {/* MOBILE MENU OVERLAY */}
        <div className={`fixed inset-0 bg-black flex flex-col items-center pt-40 transition-all duration-500 md:hidden z-[190] ${
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          {/* CRT & GLOW EFFECTS */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]" />
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent opacity-50" />

          <div className="flex flex-col items-center gap-12 relative z-10">
            {navLinks.map((item, index) => {
              const id = item.toLowerCase();
              return (
                <a 
                  key={item} 
                  href={`#${id}`} 
                  onClick={(e) => handleNavClick(e, id)}
                  onMouseEnter={() => { setMobileHover(id); playHover(); }}
                  onMouseLeave={() => setMobileHover('')}
                  style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 100}ms` : '0ms' }}
                  className={`text-5xl font-black uppercase tracking-widest transition-all duration-500 transform ${
                    isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  } ${mobileHover === id ? 'text-cyan-400 scale-110' : 'text-white/40'} ${triggerGlitch ? 'animate-pulse' : ''}`}
                >
                  <HackerText label={item} trigger={triggerGlitch} />
                </a>
              );
            })}
            <button id="nav-contact-link" onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }} className="mt-10 px-12 py-5 bg-white text-black font-black uppercase text-sm rounded-full">Contact</button>
          </div>
        </div>
      </nav>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default TopNav;