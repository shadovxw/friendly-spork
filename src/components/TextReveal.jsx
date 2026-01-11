import React, { useRef, useEffect, useState } from 'react';

const TextReveal = ({ text, className = "" }) => {
  const containerRef = useRef(null);
  const [words, setWords] = useState([]);

  useEffect(() => {
    // Split text into words for individual control
    setWords(text.split(" "));
  }, [text]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const wordElements = containerRef.current.children;
      const windowHeight = window.innerHeight;
      const triggerPoint = windowHeight * 0.75; // Light up when word is 75% down screen

      Array.from(wordElements).forEach((word) => {
        const rect = word.getBoundingClientRect();
        
        // Logic: If word is above trigger point, it lights up.
        // We add a class or style dynamically.
        if (rect.top < triggerPoint) {
            word.style.opacity = '1';
            word.style.filter = 'blur(0px)';
            word.style.transform = 'translateY(0)';
            word.style.color = '#fff'; // White
        } else {
            word.style.opacity = '0.2';
            word.style.filter = 'blur(2px)';
            word.style.transform = 'translateY(5px)';
            word.style.color = '#6b7280'; // Gray
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [words]);

  return (
    <p ref={containerRef} className={`flex flex-wrap gap-x-[0.3em] leading-relaxed ${className}`}>
      {words.map((word, i) => (
        <span 
            key={i} 
            className="transition-all duration-500 ease-out will-change-[opacity,filter,transform] inline-block"
            style={{ opacity: 0.2, filter: 'blur(2px)', transform: 'translateY(5px)' }}
        >
          {word}
        </span>
      ))}
    </p>
  );
};

export default TextReveal;