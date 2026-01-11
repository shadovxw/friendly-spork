import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const VelocityMarquee = () => {
  const firstText = useRef(null);
  const secondText = useRef(null);
  const slider = useRef(null);
  
  // State variables for physics
  let xPercent = 0;
  let direction = -1;

  useEffect(() => {
    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (xPercent < -100) {
      xPercent = 0;
    } else if (xPercent > 0) {
      xPercent = -100;
    }
    
    // Apply movement
    if(firstText.current && secondText.current) {
        gsap.set(firstText.current, { xPercent: xPercent });
        gsap.set(secondText.current, { xPercent: xPercent });
    }
    
    // Smoothly adjust speed based on scroll direction
    // Default speed is 0.1, we add scroll velocity to it
    xPercent += 0.05 * direction;
    
    requestAnimationFrame(animate);
  };

  // Listen to scroll to flip direction
  useEffect(() => {
    ScrollTrigger.create({
      onUpdate: (self) => {
        direction = self.direction === 1 ? -1 : 1;
      }
    });
  }, []);

  return (
    <div className="relative w-full h-[150px] md:h-[250px] overflow-hidden flex items-center bg-neutral-900 border-y border-white/5">
      
      {/* The Slider Container */}
      <div ref={slider} className="absolute whitespace-nowrap flex">
        
        {/* Text Block 1 */}
        <div ref={firstText} className="flex items-center gap-8 pr-8">
            <span className="text-[6rem] md:text-[10rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 opacity-50">
                Backend • Frontend • DevOps • Design •
            </span>
        </div>

        {/* Text Block 2 (Duplicate for infinite loop) */}
        <div ref={secondText} className="flex items-center gap-8 pr-8 absolute left-full top-0">
            <span className="text-[6rem] md:text-[10rem] font-black uppercase text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600 opacity-50">
                Backend • Frontend • DevOps • Design •
            </span>
        </div>

      </div>
      
      {/* Overlay Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
      
    </div>
  );
};

export default VelocityMarquee;