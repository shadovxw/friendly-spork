import React, { useRef, useEffect, useState } from 'react';
import BlurReveal from './BlurReveal';
import TextReveal from './TextReveal';

/* =======================
   TEXT CONSTANTS
======================= */

// Section meta
const SECTION_ID = "about";
const BG_TEXT = "DEVELOPER ENGINEER ARCHITECT"; 

// Headings
const PERSONNEL_LABEL = "The Profile";
const MAIN_HEADING_LINE_1 = "Limitless";
const MAIN_HEADING_LINE_2 = "Ambition.";

// Philosophy
const PHILOSOPHY_TEXT =
  "I am early in my engineering journey, driven by a deep curiosity about how systems work—from hardware foundations to large-scale cloud platforms. My learning is shaped by both formal education and constant hands-on building. I focus on understanding fundamentals, applying them in real projects, and steadily expanding my depth across the stack. This space represents the beginning of that journey, not the destination.";

// Cards
const CARD_ONE = {
  index: "01",
  title: "The Profession.",
  description:
    "I am currently gaining real-world experience through an intensive internship, where I contribute to deployment pipelines and assist in implementing Generative AI solutions. My focus is on learning how production systems are designed, deployed, and maintained—bridging academic concepts with practical engineering realities."
};


const CARD_TWO = {
  index: "02",
  title: "The Pursuit.",
  description: 
    "I don’t claim mastery. I focus on fundamentals, repetition, and progression. These are the technologies I have worked with, continue to practice, and intend to deepen over time. Each represents an area where I am building confidence step by step, with long-term mastery as the goal."
};

const CARD_THREE = {
  index: "03",
  title: "The Lab.",
  description:
    "Most of my learning happens through self-driven experimentation. I spend time building personal projects, managing a home server, and exploring new technologies outside structured requirements. These projects are where concepts turn into intuition, and where mistakes become understanding. My long-term aim is to grow into a well-rounded engineer with depth across Gen-AI, DevOps, and core systems."
};


// Skills
const SKILLS = [
  "Software Dev",
  "Gen-AI Integration", // Changed from "Basics" to "Integration" (Sound more active)
  "K8s / OCP",
  "AWS / Azure",
  "Ansible",
  "Node.js",
  "Python",
  "React.js",
  "Docker",
  "Linux Admin",
  "Comp. Vision",
  "Robotics"
];


const AboutSection = () => {
  const containerRef = useRef(null);
  const [stickState, setStickState] = useState('relative'); 
  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionHeight = containerRef.current.offsetHeight; 
      const scrollDistance = -rect.top; 
      const maxScroll = sectionHeight - windowHeight;
      
      let progress = 0;
      if (rect.top <= 0 && rect.bottom >= windowHeight) {
        setStickState('fixed');
        progress = scrollDistance / maxScroll;
      } else if (rect.bottom < windowHeight) {
        setStickState('bottom');
        progress = 1;
      } else {
        setStickState('relative');
        progress = 0;
      }

      const safeProgress = Math.min(Math.max(progress, 0), 1);
      const moveAmount = safeProgress * (window.innerWidth < 768 ? 280 : 180); 
      setTranslateX(-moveAmount);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getContainerStyle = () => {
    if (stickState === 'fixed') {
      return { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    if (stickState === 'bottom') {
      return { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh', zIndex: 10 };
    }
    return { position: 'relative', width: '100%', height: '100vh', zIndex: 10 };
  };

  return (
    <section ref={containerRef} id={SECTION_ID} className="relative w-full h-[300vh] bg-neutral-900">
      
      <div style={getContainerStyle()} className="overflow-hidden flex items-center bg-neutral-900">
        
        {/* Background Text */}
        <div className="absolute top-20 left-0 w-full opacity-10 pointer-events-none select-none z-0">
          <BlurReveal delay={0.2}>
            <span className="text-[12rem] md:text-[20rem] font-black leading-none text-white whitespace-nowrap">
              {BG_TEXT}
            </span>
          </BlurReveal>
        </div>

        {/* HORIZONTAL MOVER */}
        <div 
          className="flex gap-12 px-6 md:px-20 will-change-transform transition-transform duration-100 ease-out z-10"
          style={{ transform: `translateX(${translateX}vw)` }} 
        >
          
          {/* INTRO CARD */}
          <div className="shrink-0 w-[85vw] md:w-[45vw] flex flex-col justify-center pr-10">
            <div className="mb-10 border-l-2 border-cyan-500 pl-8">
              <BlurReveal>
                <h2 className="text-sm font-bold tracking-[0.5em] text-cyan-400 uppercase mb-2">
                  {PERSONNEL_LABEL}
                </h2>
              </BlurReveal>
              <BlurReveal delay={0.2}>
                <h3 className="text-4xl md:text-6xl font-black text-white uppercase">
                  {MAIN_HEADING_LINE_1} <br /> {MAIN_HEADING_LINE_2}
                </h3>
              </BlurReveal>
            </div>

            <div className="text-xl md:text-3xl font-bold leading-relaxed max-w-2xl text-gray-500">
              <TextReveal text={PHILOSOPHY_TEXT} />
            </div>
          </div>

          {/* CARD 1: THE PROFESSION */}
          <div className="shrink-0 w-[85vw] md:w-[600px] h-[500px] md:h-[600px] bg-black border border-neutral-800 p-8 md:p-12 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-8xl font-black text-neutral-800 mb-6">{CARD_ONE.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-3xl font-bold text-white mb-6">{CARD_ONE.title}</h4></BlurReveal>
              <BlurReveal delay={0.2}><p className="text-gray-400 leading-relaxed text-lg">{CARD_ONE.description}</p></BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-cyan-500 w-1/3" /></div>
          </div>

          {/* CARD 2: THE PURSUIT (SKILLS) */}
          <div className="shrink-0 w-[85vw] md:w-[600px] h-[500px] md:h-[600px] bg-black border border-neutral-800 p-8 md:p-12 flex flex-col justify-between group hover:border-purple-500/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-8xl font-black text-neutral-800 mb-6">{CARD_TWO.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-3xl font-bold text-white mb-4">{CARD_TWO.title}</h4></BlurReveal>
              
              <BlurReveal delay={0.15}>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed border-l-2 border-purple-500 pl-4">
                  {CARD_TWO.description}
                </p>
              </BlurReveal>

              <BlurReveal delay={0.2}>
                <div className="grid grid-cols-2 gap-4">
                  {SKILLS.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      <span className="uppercase tracking-wider text-xs md:text-sm">{skill}</span>
                    </div>
                  ))}
                </div>
              </BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-purple-500 w-2/3" /></div>
          </div>

          {/* CARD 3: THE LAB (PROJECTS) */}
          <div className="shrink-0 w-[85vw] md:w-[600px] h-[500px] md:h-[600px] bg-black border border-neutral-800 p-8 md:p-12 flex flex-col justify-between group hover:border-white/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-8xl font-black text-neutral-800 mb-6">{CARD_THREE.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-3xl font-bold text-white mb-6">{CARD_THREE.title}</h4></BlurReveal>
              <BlurReveal delay={0.2}><p className="text-gray-400 leading-relaxed text-lg">{CARD_THREE.description}</p></BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-white w-full" /></div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;