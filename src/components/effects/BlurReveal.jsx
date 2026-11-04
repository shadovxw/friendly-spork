import React, { useEffect, useRef, useState } from 'react';

// blur (px), y (px of rise) and duration (s) default to the original look.
const BlurReveal = ({ children, delay = 0, className = "", blur = 10, y = 20, duration = 1 }) => {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current); // Only animate once
        }
      },
      { threshold: 0.2 } // Trigger when 20% visible
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all ease-out ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? 'blur(0px)' : `blur(${blur}px)`,
        transform: isVisible ? 'translateY(0)' : `translateY(${y}px)`,
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`
      }}
    >
      {children}
    </div>
  );
};

export default BlurReveal;