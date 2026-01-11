import React, { useState, useEffect } from 'react';

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*";

const HackerText = ({ label, className }) => {
  const [text, setText] = useState(label);
  const [isHovering, setIsHovering] = useState(false);
  
  useEffect(() => {
    // If not hovering, reset text immediately to clean label
    if (!isHovering) {
        setText(label);
        return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      setText(prev => 
        label
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return label[index];
            }
            return letters[Math.floor(Math.random() * letters.length)];
          })
          .join("")
      );

      if (iteration >= label.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3; // Speed of decoding (Lower = Slower)
    }, 30);

    return () => clearInterval(interval);
  }, [isHovering, label]);

  return (
    <span 
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        className={className}
    >
      {text}
    </span>
  );
};

export default HackerText;