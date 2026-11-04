import BlurReveal from '../effects/BlurReveal';
import TextReveal from '../effects/TextReveal';
import React, { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

// Lazy-loaded: PulsingCore pulls in three.js + @react-three/fiber/drei.
// It lives below the fold, so we keep that weight off the initial bundle.
// The chrome knot. A particle-cloud portrait is also available: swap this import for '../effects/ParticlePortrait'.
const PulsingCore = lazy(() => import('../effects/PulsingCore'));

const PERSONNEL_LABEL = "The Profile";
const MAIN_HEADING_LINE_1 = "Limitless";
const MAIN_HEADING_LINE_2 = "Ambition.";
const PHILOSOPHY_TEXT =
  "I am early in my engineering journey, driven by a deep curiosity about how systems work—from hardware foundations to large-scale cloud platforms. My learning is shaped by both formal education and constant hands-on building. I focus on understanding fundamentals, applying them in real projects, and steadily expanding my depth across the stack.";

const BG_TEXT = "DEVELOPER ENGINEER ARCHITECT";

// === HEADER SECTION ===
const ProfileHeaderSection = () => {
  // Mount the heavy Spline scene only when it is about to be seen (and never on phones, where the box is display:none)
  const coreRef = useRef(null);
  const [coreNear, setCoreNear] = useState(false);

  // --- Profile entrance (border, knot, background text), all driven by scroll position ---
  const sectionRef = useRef(null);
  const reduce = useReducedMotion();

  // 0 = section top reaches the bottom of the screen, 1 = section is centred
  const { scrollYProgress: enter } = useScroll({ target: sectionRef, offset: ['start end', 'center center'] });
  // the whole time the section is on screen (background text drift)
  const { scrollYProgress: pass } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const borderDraw = useTransform(enter, [0.35, 0.75], [0, 1]);
  const coreScale = useTransform(enter, [0.2, 1], [0.55, 1]);
  const coreRotate = useTransform(enter, [0.2, 1], [-35, 0]);
  const coreY = useTransform(enter, [0.2, 1], [140, 0]);
  const coreOpacity = useTransform(enter, [0.2, 0.5], [0, 1]);
  const bgX = useTransform(pass, [0, 1], ['10%', '-25%']);

  useEffect(() => {
    if (!coreRef.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setCoreNear(true); io.disconnect(); }
    }, { rootMargin: '800px 0px' });
    io.observe(coreRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[60vh] min-h-[500px] bg-[#0b0a0d] flex items-center overflow-visible">
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full opacity-10 pointer-events-none select-none z-0">
        <motion.div style={{ x: reduce ? 0 : bgX }}>
          <BlurReveal delay={0.2}>
            <span className="text-[12rem] md:text-[20rem] font-black leading-none text-white whitespace-nowrap">
              {BG_TEXT}
            </span>
          </BlurReveal>
        </motion.div>
      </div>

      <div className="w-full z-10 px-6 md:px-20">
        <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Side - Text Content */}
          {/* z-30 + a width cap on large screens keep the text clear of (and above) the knot */}
          <div className="relative z-30 max-w-4xl w-full lg:max-w-[46%]">
            <div className="relative mb-6 md:mb-8 pl-4 md:pl-8">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-[1.5px] origin-top bg-cyan-200 shadow-[0_0_10px_2px_rgb(34_211_238/0.6)]"
                style={{ scaleY: reduce ? 1 : borderDraw }}
              />
              <BlurReveal>
                <h2 className="text-[10px] md:text-sm font-bold tracking-[0.5em] text-cyan-400 uppercase mb-1 md:mb-2">
                  {PERSONNEL_LABEL}
                </h2>
              </BlurReveal>
              <BlurReveal delay={0.2}>
                <h3 className="text-3xl md:text-6xl font-black text-white uppercase leading-none md:leading-tight">
                  {MAIN_HEADING_LINE_1} <br /> {MAIN_HEADING_LINE_2}
                </h3>
              </BlurReveal>
            </div>

            <div className="text-sm md:text-2xl font-bold leading-relaxed text-gray-500 w-full">
              <TextReveal text={PHILOSOPHY_TEXT} />
            </div>
          </div>

          {/* Right Side - PulsingCore */}
          <div ref={coreRef} className="flex-shrink-0 hidden md:block absolute right-20 xl:right-4 top-1/2 -translate-y-1/2 w-[500px] h-[500px] lg:w-[650px] lg:h-[650px] xl:w-[800px] xl:h-[800px] 2xl:w-[900px] 2xl:h-[900px] z-20 overflow-visible">
            {/* animate an inner wrapper: this div already uses a translate for its own positioning */}
            <motion.div
              className="h-full w-full"
              style={reduce ? undefined : { scale: coreScale, rotate: coreRotate, y: coreY, opacity: coreOpacity }}
            >
              {coreNear && (
                <Suspense fallback={null}>
                  <PulsingCore />
                </Suspense>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* --- Constants --- */
const CARD_ONE = {
  index: "01",
  title: "The Profession.",
  description:
    "I'm a software engineer building across the stack: AI solutions, system design, and UI-focused websites with a strong visual theme. I contribute to deployment pipelines and Generative AI solutions, and I care about how production systems are designed, deployed, and maintained, and about interfaces that feel as considered as the systems behind them."
};


const CARD_TWO = {
  index: "02",
  title: "The Pursuit.",
  description: "I don't claim mastery. I focus on fundamentals, repetition, and progression. These are the technologies I have worked with, continue to practice, and intend to deepen over time."
};

const CARD_THREE = {
  index: "03",
  title: "The Lab.",
  description:
    "Most of my learning happens through self-driven experimentation. I spend time building personal projects, managing a home server, and exploring new ideas without predefined outcomes. This is where mistakes turn into intuition and understanding compounds."
};


// const SKILLS = ["Software Dev", "Gen-AI", "K8s / OCP", "AWS / Azure", "Ansible", "Node.js", "Python", "React.js", "Docker", "Linux", "CV", "Robotics"];
const SKILLS = [
  "Problem Solving",
  "Building Applications",
  "Working with Servers",
  "Cloud Concepts",
  "Networking",
  "Automation",
  "AI Concepts",
  "Computer Vision",
  "Robotics",
  "Linux",
  "Debugging",
  "System Thinking"
];

// === SCROLLING SECTION ===
const HorizontalCardsSection = () => {
  const sectionRef = useRef(null);
  const cardsContainerRef = useRef(null);

  const [containerStyle, setContainerStyle] = useState({
    position: 'absolute',
    top: 0,
    left: 0
  });

  const [translateX, setTranslateX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current || !cardsContainerRef.current) return;

      const sectionRect = sectionRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHeight = sectionRef.current.offsetHeight;
      const contentWidth = cardsContainerRef.current.scrollWidth;
      const maxHorizontalScroll = contentWidth - window.innerWidth;

      if (sectionRect.top <= 0 && sectionRect.bottom > viewportHeight) {
        setContainerStyle({
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh'
        });
      } else if (sectionRect.bottom <= viewportHeight) {
        setContainerStyle({
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100vh'
        });
      } else {
        setContainerStyle({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100vh'
        });
      }

      const scrolledDistance = Math.abs(Math.min(sectionRect.top, 0));
      const maxVerticalScroll = sectionHeight - viewportHeight;
      const progress = maxVerticalScroll > 0
        ? Math.min(Math.max(scrolledDistance / maxVerticalScroll, 0), 1)
        : 0;

      setTranslateX(-(progress * maxHorizontalScroll));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full h-[400vh] bg-[#0b0a0d] overflow-visible">

      <div style={containerStyle} className="overflow-hidden flex items-center z-10">
        <div className="absolute top-32 left-0 w-full opacity-10 pointer-events-none select-none z-0">
          <BlurReveal delay={0.2}>
            <span className="text-[12rem] md:text-[20rem] font-black leading-none text-white whitespace-nowrap">
              {BG_TEXT}
            </span>
          </BlurReveal>
        </div>

        <div
          ref={cardsContainerRef}
          className="
            will-change-transform z-10
            flex gap-4
            pl-6 pr-6 items-center
            md:pl-20 md:pr-20 md:gap-12
          "
          style={{ transform: `translateX(${translateX}px)` }}
        >
          {/* === CARD 1 === */}
          <div className="shrink-0 w-[75vw] h-[60vh] md:w-[800px] md:h-[700px] bg-black border border-neutral-800 p-5 md:p-12 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-4xl md:text-8xl font-black text-neutral-800 mb-2 md:mb-8">{CARD_ONE.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-6">{CARD_ONE.title}</h4></BlurReveal>
              <BlurReveal delay={0.2}><p className="text-gray-400 leading-relaxed text-xs md:text-xl line-clamp-6 md:line-clamp-none">{CARD_ONE.description}</p></BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-cyan-500 w-1/3" /></div>
          </div>

          {/* === CARD 2 === */}
          <div className="shrink-0 w-[75vw] h-[60vh] md:w-[800px] md:h-[700px] bg-black border border-neutral-800 p-5 md:p-12 flex flex-col justify-between group hover:border-purple-500/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-4xl md:text-8xl font-black text-neutral-800 mb-2 md:mb-8">{CARD_TWO.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-6">{CARD_TWO.title}</h4></BlurReveal>

              {/* RESTORED DESCRIPTION */}
              <BlurReveal delay={0.2}>
                <p className="text-gray-400 leading-relaxed text-xs md:text-xl line-clamp-4 md:line-clamp-none mb-4 md:mb-6">
                  {CARD_TWO.description}
                </p>
              </BlurReveal>

              {/* SKILLS GRID */}
              <BlurReveal delay={0.3}>
                <div className="grid grid-cols-2 gap-2 md:gap-x-6 md:gap-y-4">
                  {SKILLS?.map((skill, i) => (
                    <div key={i} className="flex items-center gap-2 text-gray-500 group-hover:text-white transition-colors">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                      <span className="uppercase tracking-wider text-[9px] md:text-base">{skill}</span>
                    </div>
                  ))}
                </div>
              </BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-purple-500 w-2/3" /></div>
          </div>

          {/* === CARD 3 === */}
          <div className="shrink-0 w-[75vw] h-[60vh] md:w-[800px] md:h-[700px] bg-black border border-neutral-800 p-5 md:p-12 flex flex-col justify-between group hover:border-white/50 transition-colors duration-500">
            <div>
              <BlurReveal><div className="text-4xl md:text-8xl font-black text-neutral-800 mb-2 md:mb-8">{CARD_THREE.index}</div></BlurReveal>
              <BlurReveal delay={0.1}><h4 className="text-lg md:text-4xl font-bold text-white mb-2 md:mb-6">{CARD_THREE.title}</h4></BlurReveal>
              <BlurReveal delay={0.2}><p className="text-gray-400 leading-relaxed text-xs md:text-xl">{CARD_THREE.description}</p></BlurReveal>
            </div>
            <div className="w-full h-1 bg-neutral-800 relative overflow-hidden"><div className="absolute inset-0 bg-white w-full" /></div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <>
      <ProfileHeaderSection />
      <HorizontalCardsSection />
    </>
  );
};

export default AboutSection;