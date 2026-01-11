import React, { useEffect, useState } from 'react';
import { useSystem } from '../hooks/useSystem'; // Import sound hook

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const { playHover, playClick } = useSystem();

  useEffect(() => {
    const calculateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      if (docHeight === 0) return setProgress(0);
      
      const scrollPercent = scrollTop / docHeight;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', calculateProgress);
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // SVG Configuration
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progress * circumference;

  return (
    <div 
      className={`fixed bottom-8 right-8 z-50 transition-all duration-500 ${progress > 0.02 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
    >
      <button
        onClick={scrollToTop}
        onMouseEnter={() => playHover()}
        className="group relative flex items-center justify-center w-16 h-16 bg-black/50 backdrop-blur-md rounded-full border border-white/10 hover:border-cyan-500/50 transition-colors"
      >
        {/* 1. The Progress Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 60 60">
          {/* Background Track */}
          <circle
            className="text-white/5"
            strokeWidth="2"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
          {/* Filling Indicator */}
          <circle
            className="text-cyan-500 transition-all duration-100 ease-out group-hover:drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]"
            strokeWidth="2"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r={radius}
            cx="30"
            cy="30"
          />
        </svg>

        {/* 2. The Content (Percentage or Arrow) */}
        <div className="relative flex items-center justify-center text-[10px] font-bold font-mono text-cyan-500 group-hover:text-white transition-colors">
            {/* Show Arrow on Hover, % otherwise */}
            <span className="absolute opacity-100 group-hover:opacity-0 transition-opacity">
                {Math.round(progress * 100)}%
            </span>
            <span className="absolute opacity-0 group-hover:opacity-100 transition-opacity -translate-y-1 group-hover:translate-y-0 duration-300">
                ↑
            </span>
        </div>

      </button>
    </div>
  );
};

export default ScrollProgress;