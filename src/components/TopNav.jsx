import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/hero.jpg'; 
import { useSystem } from '../hooks/useSystem'; // Sound Hook
import HackerText from './HackerText'; // <--- The new component

// --- CONTACT MODAL COMPONENT ---
const ContactModal = ({ isOpen, onClose }) => {
  const { playClick, playHover } = useSystem();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose} 
      />

      {/* The Card */}
      <div className="relative w-full max-w-md bg-neutral-900/90 border border-white/10 rounded-2xl p-8 shadow-2xl overflow-hidden animate-fade-in-up">
        
        {/* Decorative Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Close Button */}
        <button 
            onClick={() => { onClose(); playClick(); }}
            onMouseEnter={() => playHover()}
            className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Profile Pic */}
            <div className="relative w-40 h-40 mb-6 group">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-cyan-500/50 animate-[spin_10s_linear_infinite]" />
                <img 
                    src={heroImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full border-4 border-white/10 group-hover:border-cyan-400 transition-colors bg-white" 
                />
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 border-4 border-black rounded-full shadow-[0_0_10px_lime]" />
            </div>

            {/* Name */}
            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-1">
                Vrishank Warrier
            </h2>
            <p className="text-cyan-400 text-xs font-bold tracking-[0.3em] uppercase mb-8">
                Digital Alchemist
            </p>

            {/* Details */}
            <div className="w-full space-y-3 mb-8">
                {/* Phone */}
                <div 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-cyan-500/50 transition-colors group cursor-pointer"
                    onMouseEnter={() => playHover()}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-neutral-800 rounded-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-300">+91 98765 43210</span>
                    </div>
                    <a href="tel:+919876543210" onClick={() => playClick()} className="text-xs text-gray-600 uppercase tracking-widest group-hover:text-white font-bold">Call</a>
                </div>

                {/* Email */}
                <div 
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-cyan-500/50 transition-colors group cursor-pointer"
                    onMouseEnter={() => playHover()}
                    onClick={() => { navigator.clipboard.writeText('vrishank@example.com'); playClick(); }}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-2 bg-neutral-800 rounded-full text-gray-400 group-hover:text-cyan-400 transition-colors">
                             <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                        </div>
                        <span className="text-sm font-medium text-gray-300">vrishank@example.com</span>
                    </div>
                    <span className="text-xs text-gray-600 uppercase tracking-widest group-hover:text-white font-bold">Copy</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                     <div className="p-2 bg-neutral-800 rounded-full text-gray-400">
                         <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                     </div>
                     <span className="text-sm font-medium text-gray-300">Mumbai, India</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 w-full">
                <button 
                    onClick={() => playClick()} 
                    onMouseEnter={() => playHover()}
                    className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded hover:bg-cyan-400 transition-colors"
                >
                    Download Resume
                </button>
            </div>

        </div>
      </div>
    </div>
  );
};


// --- MAIN TOPNAV COMPONENT ---
const TopNav = ({ show = true }) => {
  const [activeSection, setActiveSection] = useState('');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  const navRefs = useRef({});
  const { playHover, playClick } = useSystem(); 

  // --- 1. SCROLL SPY ---
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['projects', 'experience', 'about'];
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= 100) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- 2. GHOST PILL MOVEMENT ---
  useEffect(() => {
    const activeElement = navRefs.current[activeSection];
    if (activeElement) {
      setIndicatorStyle({
        left: activeElement.offsetLeft,
        width: activeElement.offsetWidth,
        opacity: 1
      });
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeSection]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    playClick(); // Play Sound
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
        <nav className={`fixed top-0 w-full p-6 md:p-10 z-50 flex justify-between items-center transition-all duration-1000 ${
            show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10 pointer-events-none'
        }`}>
        
        <Link 
            to="/" 
            onClick={() => { window.scrollTo(0,0); playClick(); }}
            onMouseEnter={() => playHover()}
            className="text-2xl font-black tracking-widest uppercase text-white mix-blend-difference hover:opacity-80 transition-opacity"
        >
            VW.
        </Link>

        {/* NAVIGATION CONTAINER */}
        <div className="relative hidden md:flex items-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
            
            {/* Sliding Ghost Pill */}
            <div 
                className="absolute top-1 bottom-1 bg-white/10 rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
                style={{ left: indicatorStyle.left, width: indicatorStyle.width, opacity: indicatorStyle.opacity }}
            />

            {/* Links */}
            {['Projects', 'Experience', 'About'].map((item) => {
                const id = item.toLowerCase();
                const isActive = activeSection === id;

                return (
                    <a 
                        key={item} 
                        href={`#${id}`}
                        ref={el => navRefs.current[id] = el}
                        onClick={(e) => handleNavClick(e, id)}
                        onMouseEnter={() => playHover()} // Play Sound
                        className="relative z-10 px-6 py-3 rounded-full group block"
                    >
                        {/* 1. Gray Text (Base Layer) */}
                        <span className={`block text-sm font-bold tracking-[0.2em] uppercase transition-colors duration-500 ${isActive ? 'text-transparent' : 'text-gray-400 group-hover:text-gray-200'}`}>
                            {/* Uses HackerText, but scrambles only on hover */}
                            <HackerText label={item} />
                        </span>
                        
                        {/* 2. Gradient Text (Active/Hover Layer) */}
                        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold tracking-[0.2em] uppercase 
                            text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 animate-text-gradient
                            transition-opacity duration-500 ease-in-out
                            ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                        `}>
                            <HackerText label={item} />
                        </span>
                    </a>
                );
            })}

            {/* CONTACT BUTTON */}
            <button 
                onClick={() => { setIsContactOpen(true); playClick(); }} 
                onMouseEnter={() => playHover()} 
                className="relative z-10 ml-2 px-8 py-3 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full overflow-hidden hover:scale-105 transition-transform duration-300"
            >
                <span className="relative z-10 group-hover:text-cyan-600 transition-colors">Contact</span>
                <div className="absolute top-0 -left-[100%] w-full h-full bg-gradient-to-r from-transparent via-white/80 to-transparent skew-x-12 animate-shine opacity-50 pointer-events-none" />
            </button>

        </div>
        </nav>

        {/* RENDER MODAL */}
        <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default TopNav;