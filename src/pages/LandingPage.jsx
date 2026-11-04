import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopNav from '../components/layout/TopNav';
import ProjectSection from '../components/sections/ProjectSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import AboutSection from '../components/sections/AboutSection';
import Footer from '../components/layout/Footer';
import HyperText from '../components/effects/HyperText';
import heroImage from '../assets/hero.jpg';
import resumeFile from '../assets/resume.pdf';
import VelocityWrapper from '../components/layout/VelocityWrapper';
import VelocityMarquee from '../components/effects/VelocityMarquee';
import FlickeringHeadline from '../components/effects/FlickeringHeadline';
import StackPage from '../components/sections/StackPage';

const LandingPage = () => {
  const { enableIntro } = useOutletContext();
  const [showLandingContent, setShowLandingContent] = useState(!enableIntro);
  const [introFinished, setIntroFinished] = useState(!enableIntro);
  const heroRef = useRef(null);
  const [glitch, setGlitch] = useState(false);
  const glitchTimer = useRef(0);
  const lastFaceGlitch = useRef(0);

  // Cursor spotlight: --mx/--my (eased toward the pointer) and --spot (on/off) drive the
  // CSS in the hero. Written straight to the DOM so mouse moves never re-render React.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const pos = { x: 0, y: 0, tx: 0, ty: 0 };
    let raf = 0;

    const paint = () => {
      pos.x += (pos.tx - pos.x) * 0.18;
      pos.y += (pos.ty - pos.y) * 0.18;
      el.style.setProperty('--mx', `${pos.x}px`);
      el.style.setProperty('--my', `${pos.y}px`);
      const settled = Math.abs(pos.tx - pos.x) < 0.5 && Math.abs(pos.ty - pos.y) < 0.5;
      raf = settled ? 0 : requestAnimationFrame(paint);
    };

    const onMove = (e) => {
      if (e.pointerType === 'touch') return;
      const r = el.getBoundingClientRect();
      pos.tx = e.clientX - r.left;
      pos.ty = e.clientY - r.top;
      if (el.style.getPropertyValue('--spot') !== '1') {
        pos.x = pos.tx; // first entry: start under the cursor instead of sliding in
        pos.y = pos.ty;
        el.style.setProperty('--spot', '1');
      }
      if (!raf) raf = requestAnimationFrame(paint);
    };
    const onLeave = () => el.style.setProperty('--spot', '0');

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Short RGB-split glitch on the portrait: every 6-8s while idle, and when the cursor crosses the face.
  const triggerGlitch = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setGlitch(true);
    clearTimeout(glitchTimer.current);
    glitchTimer.current = setTimeout(() => setGlitch(false), 200);
  }, []);

  useEffect(() => {
    if (!showLandingContent) return;
    let id;
    const schedule = () => {
      id = setTimeout(() => {
        triggerGlitch();
        schedule();
      }, 6000 + Math.random() * 2000);
    };
    schedule();
    return () => {
      clearTimeout(id);
      clearTimeout(glitchTimer.current);
    };
  }, [showLandingContent, triggerGlitch]);

  // Face zone (desktop): tracked from the pointer position, so no element sits over the hero text.
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    let inFace = false;
    const onMove = (e) => {
      if (e.pointerType === 'touch' || window.innerWidth < 768) return;
      const r = el.getBoundingClientRect();
      const fx = (e.clientX - r.left) / r.width;
      const fy = (e.clientY - r.top) / r.height;
      const inside = fx > 0.48 && fx < 0.76 && fy > 0.14 && fy < 0.66;
      if (inside && !inFace && Date.now() - lastFaceGlitch.current > 2500) {
        lastFaceGlitch.current = Date.now();
        triggerGlitch();
      }
      inFace = inside;
    };
    el.addEventListener('pointermove', onMove);
    return () => el.removeEventListener('pointermove', onMove);
  }, [triggerGlitch]);

  const spotMask = 'radial-gradient(circle 240px at var(--mx) var(--my), #000 0%, transparent 100%)';

  const HERO_PHRASES = [
    "I build systems that hold up.",
    "backend, cloud, and the glue between.",
    "infrastructure that stays out of your way.",
    "from bare metal to deployment.",
    "fundamentals first, always.",
    "Docker, Kubernetes, Linux, Go.",
    "automating the boring parts.",
    "learning fast, shipping faster.",
    "obsessed with how things actually work.",
    "real systems, real constraints.",
  ];

  useEffect(() => {
    if (enableIntro) {
      const timer1 = setTimeout(() => {
        setIntroFinished(true);
        setTimeout(() => {
          setShowLandingContent(true);
        }, 500);
      }, 2500);
      return () => clearTimeout(timer1);
    } else {
      setTimeout(() => {
        setShowLandingContent(true);
      }, 100);
    }
  }, [enableIntro]);

  return (
    <div className="relative w-full bg-black text-white font-sans overflow-x-hidden">

      <div className="bg-noise"></div>

      <TopNav show={showLandingContent} />

      {/* 1. HERO SECTION */}
      <section
        ref={heroRef}
        className="relative h-screen w-full overflow-hidden"
        style={{ '--mx': '-9999px', '--my': '-9999px', '--spot': 0 }}
      >
        {/* RGB channel-split used by the glitch animation (see .hero-glitch in index.css) */}
        <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
          <filter id="rgb-split" x="-5%" y="0" width="110%" height="100%" colorInterpolationFilters="sRGB">
            <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="r" dx="-8" dy="0" result="r2" />
            <feOffset in="b" dx="8" dy="0" result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
        </svg>

        {/* Background Image (Static, Clean) */}
        <div className={`absolute inset-0 z-0 ${glitch ? 'hero-glitch' : ''}`}>
          <div className={`relative w-full h-full transition-transform duration-[20s] ease-linear transform ${showLandingContent ? 'scale-110' : 'scale-100'}`}>
            <img
              src={heroImage}
              alt="Background"
              className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75" // Increased darkness slightly
            />
            {/* Spotlight: the same painting, brighter, revealed only under the cursor */}
            <img
              src={heroImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 w-full h-full object-cover object-center filter grayscale contrast-150 brightness-[1.8] transition-opacity duration-500"
              style={{ opacity: 'var(--spot)', WebkitMaskImage: spotMask, maskImage: spotMask }}
            />
          </div>
          {glitch && <div className="hero-glitch-band" />}
        </div>

        {/* Soft glow that rides with the spotlight */}
        <div
          className="pointer-events-none absolute inset-0 z-10 mix-blend-screen transition-opacity duration-500"
          style={{
            opacity: 'var(--spot)',
            background: 'radial-gradient(circle 340px at var(--mx) var(--my), rgba(34,211,238,0.22), transparent 70%)',
          }}
        />

        {/* Gradient Overlay: Darker on the LEFT to make text readable */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-r from-black via-black/65 to-transparent transition-opacity duration-2000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
        {/* Glow in the dead area under the CTAs (cyan source: the site's hue overlay shifts it to purple) */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 10% 90%, rgb(8 145 178 / 0.28), transparent 60%)' }}
        />

        {/* Scroll cue */}
        <div className="pointer-events-none absolute bottom-6 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">scroll</span>
          <span className="relative h-12 w-px bg-white/15">
            <span className="scroll-cue-dot absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-cyan-400" />
          </span>
        </div>

        {/* Intro Overlay Text (z-40) */}
        {enableIntro && (
          <div className={`absolute inset-0 z-40 flex items-center justify-center transition-all duration-1000 ${introFinished ? 'opacity-0 blur-lg scale-110 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
            <h1 className="text-4xl md:text-7xl font-mono font-bold tracking-tighter text-white">
              <HyperText text="vrishank.warrier" triggerOnLoad={true} className="inline-block" />
            </h1>
          </div>
        )}

        {/* Main Hero Content (z-20) 
            LAYOUT FIX: Changed to 'items-start' (Left Align) to balance the face on the right.
        */}
        <div className={`relative z-20 h-full w-full flex flex-col justify-end items-start px-8 pb-12 md:px-16 lg:px-24 md:justify-center md:pt-32 md:pb-56 transition-all duration-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>

          <main className="max-w-6xl text-left">
            <p className={`text-[11px] md:text-xs text-cyan-400 font-bold mb-4 tracking-[0.35em] uppercase transition-all duration-1000 delay-500 ${showLandingContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Software Engineer · Systems & Infrastructure
            </p>

            {/* Focal point: the name */}
            <h1 className={`text-5xl md:text-7xl lg:text-7xl xl:text-8xl lg:whitespace-nowrap font-black tracking-tighter leading-[0.95] mb-5 transition-all duration-1000 delay-[600ms] ${showLandingContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              <HyperText text="Vrishank" className="inline-block" />{' '}
              <br className="lg:hidden" />
              <HyperText text="Warrier" className="inline-block" />
              <span className="text-cyan-400 animate-pulse drop-shadow-[0_0_10px_currentColor]">.</span>
            </h1>

            {/* Rotating tagline (fixed height so the scramble never shifts the layout) */}
            <div className="relative h-[3.75rem] md:h-[3rem] lg:h-[3.5rem] mb-6 flex justify-start w-full">
              <h2 className="text-lg md:text-xl lg:text-3xl font-medium leading-relaxed text-white">
                <FlickeringHeadline
                  phrases={HERO_PHRASES}
                  className="block glitch-text"
                />
              </h2>
            </div>

            {/* Calls to action */}
            <div className={`flex flex-wrap items-center gap-3 transition-all duration-1000 delay-[900ms] ${showLandingContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <a
                href="#projects"
                className="px-7 py-3 rounded-full bg-white text-black font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:bg-cyan-400"
              >
                View projects
              </a>
              <a
                href={resumeFile}
                download="Vrishank_Warrier_Resume.pdf"
                className="px-7 py-3 rounded-full border border-white/30 text-white font-mono text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-cyan-400 hover:text-cyan-400"
              >
                Resume
              </a>
            </div>
          </main>
        </div>
      </section>

      {/* --- MARQUEE --- */}
      <div className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
        <VelocityMarquee />
      </div>

      {/* 2. VELOCITY ZONE */}
      <VelocityWrapper className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
        <div id="projects">
          <ProjectSection />
        </div>

        <div id="stack">
          <StackPage />
        </div>

        <div id="experience">
          <ExperienceSection />
        </div>
      </VelocityWrapper>

      {/* 3. STATIC ZONE */}
      <div className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
        <div id="about">
          <AboutSection />
        </div>

        <div id="footer">
          <Footer />
        </div>
      </div>

    </div>
  );
};

export default LandingPage;