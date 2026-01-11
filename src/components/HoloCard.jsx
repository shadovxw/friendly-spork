import React, { useRef, useState } from 'react';
import { useSystem } from '../hooks/useSystem';

const HoloCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);
  
  const { playHover } = useSystem(); // Sound hook

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // Mouse X relative to card
    const y = e.clientY - rect.top;  // Mouse Y relative to card

    const width = rect.width;
    const height = rect.height;

    // Calculate Rotation (Max 15 degrees)
    // -y because moving mouse down should tilt card "towards" you (rotate negative X)
    const rotateX = ((y - height / 2) / height) * -15; 
    const rotateY = ((x - width / 2) / width) * 15;

    // Calculate Glare Position (Percentage)
    const glareX = (x / width) * 100;
    const glareY = (y / height) * 100;

    setRotation({ x: rotateX, y: rotateY });
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
    playHover();
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    // Reset to flat
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative transition-transform duration-200 ease-out will-change-transform ${className}`}
      style={{
        transformStyle: 'preserve-3d',
        transform: `
          perspective(1000px) 
          rotateX(${rotation.x}deg) 
          rotateY(${rotation.y}deg) 
          scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)
        `,
      }}
    >
      {/* 1. Content Layer */}
      <div className="relative z-10 h-full w-full">
        {children}
      </div>

      {/* 2. Glare Layer (Overlay) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none rounded-xl opacity-0 transition-opacity duration-300"
        style={{
            opacity: isHovering ? 0.4 : 0,
            background: `radial-gradient(
                circle at ${glarePosition.x}% ${glarePosition.y}%, 
                rgba(255, 255, 255, 0.3) 0%, 
                rgba(255, 255, 255, 0.0) 80%
            )`
        }}
      />
      
      {/* 3. Border Glow (Optional Cyan Outline) */}
      <div className={`absolute inset-0 z-0 rounded-xl transition-all duration-300 border border-white/5 ${isHovering ? 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.15)]' : ''}`} />

    </div>
  );
};

export default HoloCard;