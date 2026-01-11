import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion'; // Assuming you can use framer, or we use plain CSS

const GlowCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateHoverState = (e) => {
        // Check if the target is a link, button, or inside one
        const target = e.target;
        const isInteractive = 
            target.tagName === 'A' || 
            target.tagName === 'BUTTON' || 
            target.closest('a') || 
            target.closest('button');
            
        setIsClickable(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
    >
      {/* 1. The Main Dot (Always follows mouse) */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-out
            ${isClickable ? 'w-4 h-4' : 'w-2 h-2'}
        `}
      />

      {/* 2. The Glow Halo (Lags slightly, expands on hover) */}
      <div 
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500 transition-all duration-500 ease-out
            ${isClickable ? 'w-16 h-16 opacity-100 bg-cyan-500/20' : 'w-8 h-8 opacity-50 bg-transparent'}
        `}
      />
    </div>
  );
};

export default GlowCursor;