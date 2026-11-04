import React, { useState, useEffect } from 'react';
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
      <section className="relative h-screen w-full overflow-hidden">

        {/* Background Image (Static, Clean) */}
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-transform duration-[20s] ease-linear transform ${showLandingContent ? 'scale-110' : 'scale-100'}`}>
            <img
              src={heroImage}
              alt="Background"
              className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-75" // Increased darkness slightly
            />
          </div>
        </div>

        {/* Gradient Overlay: Darker on the LEFT to make text readable */}
        <div className={`absolute inset-0 z-10 bg-gradient-to-r from-black via-black/65 to-transparent transition-opacity duration-2000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

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

          <main className="max-w-4xl text-left">
            <p className={`text-[11px] md:text-xs text-cyan-400 font-bold mb-4 tracking-[0.35em] uppercase transition-all duration-1000 delay-500 ${showLandingContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              Software Engineer · Systems & Infrastructure
            </p>

            {/* Focal point: the name */}
            <h1 className={`text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.95] mb-5 transition-all duration-1000 delay-[600ms] ${showLandingContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
              Vrishank<br />Warrier<span className="text-cyan-400">.</span>
            </h1>

            {/* Rotating tagline (fixed height so the scramble never shifts the layout) */}
            <div className="relative h-[2.5rem] md:h-[3rem] lg:h-[3.5rem] mb-2 flex justify-start w-full">
              <h2 className="text-lg md:text-xl lg:text-3xl font-medium leading-relaxed text-white">
                <FlickeringHeadline
                  phrases={HERO_PHRASES}
                  className="block glitch-text"
                />
              </h2>
            </div>

            <p className={`text-xs md:text-sm text-gray-300 mb-8 max-w-xl leading-relaxed transition-opacity duration-1000 delay-700 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
              Backend &amp; DevOps intern at Citius Cloud Services in 2025: Kubernetes and OpenShift deployments, CI/CD pipelines, ELK logging and Vault-managed secrets.
            </p>

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