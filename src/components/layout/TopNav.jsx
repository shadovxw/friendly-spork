import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/profile.jpg';
import resumeFile from '../../assets/resume.pdf';
import { useSystem } from '../../hooks/useSystem';
import HackerText from '../effects/HackerText';
import { Mail, Linkedin, Github, FileText, X } from 'lucide-react';

// --- CONTACT MODAL (Larger Container + Full Portrait) ---
const ContactModal = ({ isOpen, onClose }) => {
  const { playClick } = useSystem();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

      {/* Scroll wrapper — centers the card when it fits, scrolls when it doesn't.
          pointer-events-none lets clicks in the empty area fall through to the backdrop. */}
      <div className="relative flex min-h-full items-center justify-center px-4 py-8 pointer-events-none">

        {/* Main Card Container */}
        <div className="relative w-full max-w-[300px] bg-neutral-900 border border-white/10 p-1 shadow-2xl animate-in fade-in zoom-in duration-300 pointer-events-auto">

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
            <div className="absolute bottom-3 left-4 z-10">
              <h2 className="text-2xl font-black text-white uppercase leading-none tracking-tighter mb-1.5">
                Vrishank<br />Warrier
              </h2>
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-8 bg-cyan-500" />
                <p className="text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase">
                  ENGINEERING STUDENT
                </p>
              </div>
            </div>
          </div>

          {/* Corner Accents */}
          <div className="absolute top-0 right-0 w-10 h-10 border-t-2 border-r-2 border-cyan-500/30 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-2 border-l-2 border-cyan-500/30 pointer-events-none" />
        </div>

        {/* 2. CONTENT BELOW */}
        <div className="bg-neutral-900 border-t border-white/5 p-4 space-y-3">

          {/* Status Line */}
          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mb-1 uppercase tracking-wider">
            <span></span>
            <span className="flex items-center gap-2 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              System Online
            </span>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <a
              href="https://github.com/shadovxw"
              target="_blank"
              rel="noreferrer"
              onClick={playClick}
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:bg-white hover:text-black hover:border-white text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Github size={16} /> GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/vrishank-warrier-ab529628a/"
              target="_blank"
              rel="noreferrer"
              onClick={playClick}
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:bg-[#0077b5] hover:text-white hover:border-[#0077b5] text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
            >
              <Linkedin size={16} /> LinkedIn
            </a>

            <a
              href="mailto:vrishank.w02@gmail.com"
              onClick={playClick}
              className="col-span-2 flex items-center justify-center gap-2 py-2.5 border border-white/10 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 text-gray-400 transition-all text-xs font-bold uppercase tracking-wider"
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
            className="w-full group relative py-3.5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] overflow-hidden block text-center cursor-pointer"
          >
            <div className="absolute inset-0 bg-cyan-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <FileText size={16} /> Download Resume
            </span>
          </a>
        </div>

        </div>
      </div>
    </div>
  );
};
// --- MAIN NAV ---
const TopNav = ({ show = true }) => {
  const [activeSection, setActiveSection] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [mobileHover, setMobileHover] = useState(''); // Tracking hover specifically for mobile

  const { playHover, playClick } = useSystem();
  const navLinks = ['Projects', 'Stack', 'Experience', 'About'];

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'stack', 'experience', 'about'];
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

  // Allow other components (e.g. the Command Palette) to open the contact modal.
  useEffect(() => {
    const open = () => setIsContactOpen(true);
    window.addEventListener('open-contact', open);
    return () => window.removeEventListener('open-contact', open);
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
      <nav className={`fixed top-0 w-full p-4 sm:p-6 md:p-8 lg:p-10 z-[200] flex justify-between items-center transition-all duration-1000 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}>

        <Link to="/" className="text-xl sm:text-2xl font-black tracking-widest text-white mix-blend-difference z-[210]">VW.</Link>

        {/* HAMBURGER TOGGLE */}
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden z-[210] flex flex-col justify-between w-8 h-5">
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-[2px] w-full bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`} />
        </button>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1">
          {navLinks.map((item) => {
            const id = item.toLowerCase();
            const isActive = activeSection === id;
            return (
              <a
                key={item}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                onMouseEnter={() => playHover()}
                className={`px-4 lg:px-6 py-2.5 lg:py-3 text-xs lg:text-sm font-bold uppercase tracking-widest rounded-full transition-colors ${isActive ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white'}`}
              >
                <HackerText label={item} />
              </a>
            );
          })}
          <button onClick={() => setIsContactOpen(true)} className="ml-1 lg:ml-2 px-5 lg:px-8 py-2.5 lg:py-3 bg-white text-black text-[10px] lg:text-xs font-black rounded-full uppercase hover:bg-cyan-400 transition-colors">Contact</button>
        </div>
      </nav>

      {/* MOBILE MENU OVERLAY — kept OUTSIDE <nav>: the nav has a transform from its
          show/hide animation, and a transformed ancestor makes a fixed child relative
          to the nav box (the top strip) instead of the full viewport. */}
      <div className={`fixed inset-0 bg-black flex flex-col items-center justify-center px-6 py-24 overflow-y-auto transition-all duration-500 md:hidden z-[190] ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
        }`}>
          {/* CRT & GLOW EFFECTS */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[size:100%_4px,3px_100%]" />
          <div className="absolute inset-0 bg-radial-gradient from-cyan-500/10 to-transparent opacity-50" />

          <div className="flex flex-col items-center gap-8 sm:gap-12 relative z-10 w-full">
            {navLinks.map((item, index) => {
              const id = item.toLowerCase();
              const isActive = activeSection === id;
              return (
                <a
                  key={item}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  onMouseEnter={() => { setMobileHover(id); playHover(); }}
                  onMouseLeave={() => setMobileHover('')}
                  style={{ transitionDelay: isMenuOpen ? `${(index + 1) * 100}ms` : '0ms' }}
                  className={`text-4xl sm:text-5xl font-black uppercase tracking-widest text-center break-words transition-all duration-500 transform ${isMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    } ${mobileHover === id ? 'text-cyan-400 scale-110' : isActive ? 'text-white' : 'text-white/40'} ${triggerGlitch ? 'animate-pulse' : ''}`}
                >
                  <HackerText label={item} trigger={triggerGlitch} />
                </a>
              );
            })}
            <button id="nav-contact-link" onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }} className="mt-6 sm:mt-10 px-10 sm:px-12 py-4 sm:py-5 bg-white text-black font-black uppercase text-sm rounded-full hover:bg-cyan-400 transition-colors">Contact</button>
          </div>
        </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default TopNav;