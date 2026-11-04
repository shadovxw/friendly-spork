import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP Plugin
gsap.registerPlugin(ScrollTrigger);

const WORDS = ['Backend', 'Frontend', 'DevOps', 'Design'];
const ACCENT = 'DevOps';

// Outlined letters so the band reads against the dark background; one word is filled with the accent.
const outline = { WebkitTextStroke: '1px rgb(255 255 255 / 0.28)' };
const accent = {
  WebkitTextStroke: '1px rgb(34 211 238 / 0.7)',
  WebkitTextFillColor: 'rgb(34 211 238 / 0.18)',
};

const MarqueeText = () => (
  <span className="text-[5rem] md:text-[8rem] font-black uppercase text-transparent">
    {WORDS.map((word) => (
      <React.Fragment key={word}>
        <span style={word === ACCENT ? accent : outline}>{word}</span>
        <span style={outline}> • </span>
      </React.Fragment>
    ))}
  </span>
);

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
    <div className="relative w-full h-[120px] md:h-[190px] overflow-hidden flex items-center bg-[#0b0a0d] border-y border-white/5">

      {/* The Slider Container */}
      <div ref={slider} className="absolute whitespace-nowrap flex">

        {/* Text Block 1 */}
        <div ref={firstText} className="flex items-center gap-8 pr-8">
          <MarqueeText />
        </div>

        {/* Text Block 2 (Duplicate for infinite loop) */}
        <div ref={secondText} className="flex items-center gap-8 pr-8 absolute left-full top-0">
          <MarqueeText />
        </div>

      </div>

      {/* Overlay Vignette for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0b0a0d] via-transparent to-[#0b0a0d] z-10 pointer-events-none" />

    </div>
  );
};

export default VelocityMarquee;
