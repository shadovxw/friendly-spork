import React, { useEffect, useRef, useState } from 'react';

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+=-<>?/";

const HyperText = ({ text, className, triggerOnLoad = false }) => {
  const [displayText, setDisplayText] = useState(text); // Start with full text (or empty if you prefer)
  const intervalRef = useRef(null);
  const hasAnimated = useRef(false);

  const scramble = () => {
    let iteration = 0;
    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return text[index];
            }
            return characters[Math.floor(Math.random() * 26)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3; 
    }, 30);
  };

  // Trigger on Mount if requested
  useEffect(() => {
    if (triggerOnLoad && !hasAnimated.current) {
        scramble();
        hasAnimated.current = true;
    }
  }, [triggerOnLoad]);

  return (
    <span 
      className={className} 
      onMouseEnter={scramble} // Keep hover effect too
    >
      {displayText}
    </span>
  );
};

export default HyperText;