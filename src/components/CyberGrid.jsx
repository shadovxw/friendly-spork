import React, { useEffect, useRef, useState } from 'react';

const CyberGrid = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div 
        ref={containerRef}
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
    >
        {/* 1. The Base Grid (Faint) */}
        <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #ffffff 1px, transparent 1px),
                    linear-gradient(to bottom, #ffffff 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
            }}
        />

        {/* 2. The Flashlight Reveal (Brighter Grid) */}
        <div 
            className="absolute inset-0 opacity-[0.15]"
            style={{
                backgroundImage: `
                    linear-gradient(to right, #06b6d4 1px, transparent 1px),
                    linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px',
                // This mask hides everything EXCEPT a circle around the mouse
                maskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                WebkitMaskImage: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
            }}
        />

        {/* 3. Little Crosshairs (Decorations) */}
        <div className="absolute top-10 left-10 w-4 h-4 border-t border-l border-white/20" />
        <div className="absolute top-10 right-10 w-4 h-4 border-t border-r border-white/20" />
        <div className="absolute bottom-10 left-10 w-4 h-4 border-b border-l border-white/20" />
        <div className="absolute bottom-10 right-10 w-4 h-4 border-b border-r border-white/20" />

    </div>
  );
};

export default CyberGrid;