import React, { useEffect, useState, useRef } from 'react';
// import { motion } from 'framer-motion'; 

const GlowCursor = () => {
  const cursorRef = useRef(null);
  const [isClickable, setIsClickable] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Use direct DOM manipulation for instant feedback (no React render lag)
    const updatePosition = (e) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursor.style.opacity = '1'; // stay hidden until the pointer has actually moved
    };

    const hide = () => {
      cursor.style.opacity = '0';
    };

    const updateHoverState = (e) => {
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
    document.documentElement.addEventListener('mouseleave', hide);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
      document.documentElement.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference hidden lg:block"
      style={{
        transform: 'translate3d(-100px, -100px, 0)', // Initial off-screen position
        opacity: 0,
        willChange: 'transform',
        viewTransitionName: 'glow-cursor', // pinned so the page transition doesn't shake the cursor
      }}
    >
      {/* 1. The Main Dot */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 bg-white rounded-full transition-all duration-300 ease-out
            ${isClickable ? 'w-4 h-4' : 'w-2 h-2'}
        `}
      />

      {/* 2. The Glow Halo */}
      <div
        className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-500 transition-all duration-300 ease-out
            ${isClickable ? 'w-16 h-16 opacity-100 bg-cyan-500/20' : 'w-8 h-8 opacity-50 bg-transparent'}
        `}
      />
    </div>
  );
};

export default GlowCursor;