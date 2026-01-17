import React, { useState, useEffect } from 'react';

const HackerText = ({ label, trigger = false }) => {
  const [displayText, setDisplayText] = useState(label);
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  const scramble = () => {
    let iterations = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        prev.split("").map((char, index) => {
          if (index < iterations) return label[index];
          return charset[Math.floor(Math.random() * charset.length)];
        }).join("")
      );

      if (iterations >= label.length) clearInterval(interval);
      iterations += 1 / 3;
    }, 30);
  };

  // Scramble on hover (if mouse events are used) or when manual trigger is fired
  useEffect(() => {
    if (trigger) scramble();
  }, [trigger]);

  return <span className="font-mono">{displayText}</span>;
};

export default HackerText;