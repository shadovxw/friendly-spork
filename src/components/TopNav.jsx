import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg'; 
import { useSystem } from '../hooks/useSystem';
import HackerText from './HackerText';

// --- CONTACT MODAL (High Z-Index) ---
const ContactModal = ({ isOpen, onClose }) => {
  const { playClick, playHover } = useSystem();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md bg-neutral-900 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden">
        <button onClick={() => { onClose(); playClick(); }} className="absolute top-4 right-4 text-gray-500 hover:text-white z-20">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <div className="relative z-10 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50 animate-[spin_10s_linear_infinite]" />
                <img src={heroImage} alt="Profile" className="w-full h-full object-cover rounded-full border-4 border-white/10" />
            </div>
            <h2 className="text-2xl font-black text-white uppercase mb-1">Vrishank Warrier</h2>
            <p className="text-cyan-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-6">Digital Alchemist</p>
            <button onClick={() => playClick()} className="w-full py-3 bg-white text-black font-bold uppercase text-xs rounded">Download Resume</button>
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
            <button onClick={() => { setIsContactOpen(true); setIsMenuOpen(false); }} className="mt-10 px-12 py-5 bg-white text-black font-black uppercase text-sm rounded-full">Contact</button>
          </div>
        </div>
      </nav>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default TopNav;