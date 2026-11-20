import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { sfx } from '../utils/sfx';

const SystemContext = createContext();


export const SystemProvider = ({ children }) => {
  const [matrixMode, setMatrixMode] = useState(false);
  
  // Audio: see utils/sfx.js (loads after the first click/key, respects the mute toggle)
  const [muted, setMuted] = useState(sfx.muted);
  useEffect(() => sfx.subscribe(setMuted), []);
  const playHover = useCallback(() => sfx.play('hover'), []);
  const playClick = useCallback(() => sfx.play('click'), []);
  const toggleSound = useCallback(() => sfx.toggle(), []);

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (e) => {
      // Add key to buffer and keep last 6 chars
      buffer = (buffer + e.key).slice(-6).toLowerCase();
      
      // console.log("Typing Buffer:", buffer); 

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

  return (
    <SystemContext.Provider value={{ matrixMode, setMatrixMode, playHover, playClick, muted, toggleSound }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error('useSystem must be used within a SystemProvider');
    }
    return context;
};