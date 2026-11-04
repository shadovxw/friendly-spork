import React, { useEffect, useRef, useState } from 'react';

const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// How many characters ahead of the resolved text may show scramble noise.
// Everything beyond the window stays blank, so junk never fills the line.
const SCRAMBLE_WINDOW = 3;

const FlickeringHeadline = ({
  phrases,
  switchInterval = 2800,   // ⬅ slower phrase switching
  scrambleSpeed = 1,      // ⬅ slower scrambling
  settlePause = 800,       // ⬅ pause after text resolves
  className
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState(phrases[0]);
  const scrambleInterval = useRef(null);
  const timeoutRef = useRef(null);

  const scrambleToText = (text) => {
    let iteration = 0;
    clearInterval(scrambleInterval.current);

    scrambleInterval.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((_, index) => {
            if (index < iteration) return text[index];
            if (text[index] === " " || index >= iteration + SCRAMBLE_WINDOW) return " ";
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(scrambleInterval.current);

        // ⬇ pause once text fully settles
        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((prev) => (prev + 1) % phrases.length);
        }, settlePause);
      }

      iteration += 1 / 4; // ⬅ slower reveal
    }, scrambleSpeed);
  };

  useEffect(() => {
    scrambleToText(phrases[currentIndex]);

    return () => {
      clearInterval(scrambleInterval.current);
      clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  // whitespace-pre keeps the blank tail in place, so the line never reflows mid-scramble
  return <span className={`${className} md:whitespace-pre`}>{displayText}</span>;
};

export default FlickeringHeadline;
