import React, { useRef, useState } from 'react';
import { useSystem } from '../hooks/useSystem'; // <--- Import Hook

const MagneticButton = ({ children, className, onClick, href }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Get the sound functions
  const { playHover, playClick } = useSystem(); 

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX / 5, y: middleY / 5 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    transition: 'transform 0.1s ease-out',
  };

  const Component = href ? 'a' : 'button';

  return (
    <Component
      ref={ref}
      href={href}
      // Add Sounds Here:
      onClick={(e) => { 
        playClick(); // Click Sound
        if(onClick) onClick(e); 
      }}
      onMouseEnter={() => playHover()} // Hover Sound
      // End Sounds
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={style}
      className={className}
    >
      {children}
    </Component>
  );
};

export default MagneticButton;