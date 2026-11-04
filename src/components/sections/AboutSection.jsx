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

// === HORIZONTAL CARDS ===
// The section is pinned while the cards slide sideways. Its height is exactly the sideways distance plus one screen,
// so 1px of scrolling moves the cards 1px (no dead scrolling), and the cards settle on a card after you stop.
const CARDS = [CARD_ONE, { ...CARD_TWO, skills: SKILLS }, CARD_THREE];

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const HorizontalCardsSection = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const cardRefs = useRef([]);
  const snapsRef = useRef([0]); // sideways distance (px) at which each card sits on the page margin
  const maxRef = useRef(0);
  const [sectionHeight, setSectionHeight] = useState(null);
  const [pin, setPin] = useState('top'); // 'top' (before), 'fixed' (pinned), 'bottom' (after)
  const reduced = useReducedMotion();

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const max = Math.max(track.scrollWidth - window.innerWidth, 0);
      maxRef.current = max;
      const first = cardRefs.current[0]?.getBoundingClientRect().left ?? 0;
      snapsRef.current = cardRefs.current.map((el) => clamp((el?.getBoundingClientRect().left ?? 0) - first, 0, max));
      // getBoundingClientRect includes the current translate for every card equally, so the differences are stable
      setSectionHeight(max + window.innerHeight);
    };

    let raf = 0;
    let idle = 0;
    const update = () => {
      raf = 0;
      const section = sectionRef.current;
      const track = trackRef.current;
      if (!section || !track) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrolled = clamp(-rect.top, 0, maxRef.current);
      track.style.transform = `translate3d(${-scrolled}px, 0, 0)`;
      setPin(rect.top <= 0 && rect.bottom > vh ? 'fixed' : rect.bottom <= vh ? 'bottom' : 'top');

      // settle on the nearest card once scrolling stops (only while the cards are actually moving)
      clearTimeout(idle);
      if (reduced || scrolled <= 4 || scrolled >= maxRef.current - 4) return;
      idle = setTimeout(() => {
        const target = snapsRef.current.reduce((best, t) => (Math.abs(t - scrolled) < Math.abs(best - scrolled) ? t : best), 0);
        if (Math.abs(target - scrolled) > 2) {
          window.scrollTo({ top: window.scrollY + rect.top + target, behavior: 'smooth' });
        }
      }, 160);
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };

    measure();
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', () => { measure(); schedule(); });
    const ro = new ResizeObserver(() => { measure(); schedule(); });
    ro.observe(trackRef.current);
    return () => {
      window.removeEventListener('scroll', schedule);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      clearTimeout(idle);
    };
  }, [reduced]);

  const containerStyle =
    pin === 'fixed'
      ? { position: 'fixed', top: 0, left: 0, width: '100%', height: '100vh' }
      : pin === 'bottom'
        ? { position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100vh' }
        : { position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' };

  return (
    <section ref={sectionRef} className="relative w-full bg-[#0b0a0d]" style={{ height: sectionHeight ?? '200vh' }}>
      <div style={containerStyle} className="z-10 flex items-center overflow-hidden">
        {/* pl: card 1 lines up with the page margin. pr: the last card can come to rest near the middle of the screen. */}
        <div ref={trackRef} className="flex items-stretch gap-4 pl-6 pr-[20vw] will-change-transform md:gap-12 md:pl-20">
          {CARDS.map((card, i) => (
            <article
              key={card.index}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="relative w-[82vw] shrink-0 overflow-hidden rounded-2xl border border-cyan-500/20 bg-neutral-950 p-6 transition-colors duration-500 hover:border-cyan-500/50 md:w-[720px] md:p-12"
            >
              <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-500/70 via-cyan-500/20 to-transparent" />
              <div className="mb-4 text-5xl font-black text-neutral-800 md:mb-8 md:text-8xl">{card.index}</div>
              <h4 className="mb-3 text-2xl font-bold text-white md:mb-6 md:text-4xl">{card.title}</h4>
              <p className="text-sm leading-relaxed text-gray-400 md:text-xl">{card.description}</p>

              {card.skills && (
                <ul className="mt-6 flex flex-wrap gap-2 md:mt-8 md:gap-3">
                  {card.skills.map((skill) => (
                    <li key={skill} className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan-200/80 md:text-xs">
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
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