import { useState, useEffect } from 'react';
import useSound from 'use-sound';

const hoverSfx = '/sounds/hover.mp3'; 
const clickSfx = '/sounds/click.mp3';

export const useSystem = () => {
  const [matrixMode, setMatrixMode] = useState(false);
  
  // Audio Setup
  const [playHover] = useSound(hoverSfx, { volume: 0.2, interrupt: true });
  const [playClick] = useSound(clickSfx, { volume: 0.5 });

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (e) => {
      // Add key to buffer and keep last 6 chars
      buffer = (buffer + e.key).slice(-6).toLowerCase();
      
      console.log("Typing Buffer:", buffer); // <--- OPEN CONSOLE (F12) TO SEE THIS

      if (buffer === "matrix") {
          console.log("MATRIX MODE ACTIVATED");
          setMatrixMode(prev => !prev);
          // Optional: Reset buffer so it doesn't toggle immediately again if you type 'x'
          buffer = ""; 
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { matrixMode, playHover, playClick };
};