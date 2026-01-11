import React from 'react';
import ConstellationCanvas from './ConstellationCanvas'; // <--- Import
import MagneticButton from './MagneticButton';
import { useSystem } from '../hooks/useSystem';

const Footer = () => {
  const { playHover, playClick } = useSystem();

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer" className="relative w-full h-[80vh] bg-black text-white flex flex-col justify-center items-center overflow-hidden border-t border-white/10">
      
      {/* 1. THE NEURAL NETWORK BACKGROUND */}
      <ConstellationCanvas />
      
      {/* 2. GRADIENT OVERLAY (Fades bottom to black) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

      {/* 3. CONTENT */}
      <div className="relative z-10 text-center px-4">
        
        <p className="text-cyan-500 font-mono text-xs tracking-[0.5em] uppercase mb-6 animate-pulse">
            Transmission End // Initialize Connection
        </p>

        <h2 className="text-6xl md:text-9xl font-black tracking-tighter mb-12 mix-blend-exclusion">
            LET'S <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 hover:text-cyan-400 transition-colors duration-500 cursor-default">
                COLLABORATE
            </span>
        </h2>

        <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <MagneticButton 
                href="mailto:vrishank@example.com"
                className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-sm rounded-full hover:bg-cyan-400 transition-colors"
            >
                Start a Project
            </MagneticButton>

            <div className="flex gap-6">
                {['GitHub', 'LinkedIn', 'Twitter'].map((social) => (
                    <a 
                        key={social} 
                        href="#" 
                        onClick={() => playClick()}
                        onMouseEnter={() => playHover()}
                        className="text-gray-400 hover:text-white uppercase text-xs tracking-widest border-b border-transparent hover:border-cyan-500 transition-all pb-1"
                    >
                        {social}
                    </a>
                ))}
            </div>
        </div>

      </div>

      {/* 4. BOTTOM BAR */}
      <div className="absolute bottom-8 w-full flex justify-between px-10 text-[10px] text-gray-600 font-mono uppercase tracking-widest">
        <span>© {currentYear} Vrishank Warrier</span>
        <span>MUMBAI • IN</span>
        <span>Local Time: {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
      </div>

    </footer>
  );
};

export default Footer;