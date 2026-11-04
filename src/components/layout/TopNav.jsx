import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSystem } from '../../hooks/useSystem';
import HackerText from '../effects/HackerText';
import ContactModal from '../ui/ContactModal';

// --- MAIN NAV ---
const TopNav = ({ show = true }) => {
  const [activeSection, setActiveSection] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const [mobileHover, setMobileHover] = useState(''); // Tracking hover specifically for mobile

  const { playHover, playClick } = useSystem();
  const navLinks = ['Projects', 'Stack', 'Experience', 'About'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20); // gives the bar a backdrop once content can slide under it
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
        } ${scrolled ? 'bg-black/60 backdrop-blur-md border-b border-white/5 py-3 sm:py-3 md:py-3 lg:py-3' : ''}`}>

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
                className={`px-4 lg:px-6 py-2.5 lg:py-3 text-xs lg:text-sm font-bold uppercase tracking-widest rounded-full transition-colors ${isActive ? 'text-cyan-400 bg-white/10' : 'text-gray-400 hover:text-white'}`}
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