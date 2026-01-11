import React, { useEffect, useRef } from 'react';

const VelocityWrapper = ({ children, className = "" }) => {
  const contentRef = useRef(null);
  const prevScroll = useRef(0);
  const currentSkew = useRef(0);

  useEffect(() => {
    let rafId;

    const animate = () => {

        if (window.innerWidth < 768) return;
        
      // 1. Get current scroll position
      const scrollY = window.scrollY;
      
      // 2. Calculate Velocity (Difference between now and last frame)
      const velocity = scrollY - prevScroll.current;
      prevScroll.current = scrollY;

      // 3. Calculate Target Skew
      // Multiplier (0.1) determines intensity. Higher = More distortion.
      const targetSkew = velocity * 0.1;

      // 4. Smooth Interpolation (Lerp)
      // This makes the skew "catch up" smoothly rather than jittering
      currentSkew.current += (targetSkew - currentSkew.current) * 0.1;

      // 5. Clamp the value
      // We limit it to ±5 degrees so text stays readable
      let clampedSkew = Math.max(Math.min(currentSkew.current, 5), -5);

      // Optimization: If skew is tiny, snap to 0 to stop browser work
      if (Math.abs(clampedSkew) < 0.01) clampedSkew = 0;

      // 6. Apply to DOM
      if (contentRef.current) {
        contentRef.current.style.transform = `skewY(${clampedSkew}deg)`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    // 'will-change-transform' tells the browser to optimize this layer
    <div ref={contentRef} className={`will-change-transform transition-transform duration-100 ease-out ${className}`}>
      {children}
    </div>
  );
};

export default VelocityWrapper;