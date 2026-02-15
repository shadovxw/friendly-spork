import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopNav from '../components/layout/TopNav';
import ProjectSection from '../components/sections/ProjectSection';
import ExperienceSection from '../components/sections/ExperienceSection';
import AboutSection from '../components/sections/AboutSection';
import Footer from '../components/layout/Footer';
import HyperText from '../components/effects/HyperText';
import heroImage from '../assets/hero.jpg';
import VelocityWrapper from '../components/layout/VelocityWrapper';
import VelocityMarquee from '../components/effects/VelocityMarquee';
import FlickeringHeadline from '../components/effects/FlickeringHeadline';
import StackPage from '../components/sections/StackPage';

const LandingPage = () => {
  const { enableIntro } = useOutletContext();
  const [showLandingContent, setShowLandingContent] = useState(!enableIntro);
  const [introFinished, setIntroFinished] = useState(!enableIntro);

  const HERO_PHRASES = [
    "still deciding what to put here.",
    "this was supposed to be profound.",
    "measured cha—",
    "no, not that.",
    "something meaningful, maybe.",
    "work in progress.",
    "thinking… give it a second.",
    "draft zero.",
    "placeholder, but intentional.",
    "unfinished on purpose.",
    "words loading.",
    "this will make sense later.",
    "still forming a thought.",
    "not settled yet.",
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
        <div className={`absolute inset-0 z-10 bg-gradient-to-r from-black via-black/50 to-transparent transition-opacity duration-2000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`} />

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
        <div className={`relative z-20 h-full w-full flex flex-col justify-end items-start p-8 md:p-20 transition-all duration-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>

          <main className="max-w-4xl mb-10 md:mb-0 text-left">
            <div className="overflow-hidden flex flex-col items-start">
              <p className={`text-sm md:text-base text-cyan-400 font-bold mb-4 tracking-[0.2em] uppercase transition-transform duration-1000 delay-500 ${showLandingContent ? 'translate-y-0' : 'translate-y-full'}`}>
                Software Engineer · Systems & Infrastructure
              </p>
              <p className={`text-xs md:text-sm text-gray-400 mb-6 max-w-xl leading-relaxed transition-opacity duration-1000 delay-700 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
                Early-career engineer focused on fundamentals, real systems, and long-term mastery.
              </p>
            </div>

            {/* Headline Alignment */}
            <div className="relative h-[2.5rem] md:h-[3rem] lg:h-[3.5rem] mb-3 flex justify-start w-full">
              <h2 className="text-lg md:text-xl lg:text-3xl font-medium leading-relaxed text-white">
                <FlickeringHeadline
                  phrases={HERO_PHRASES}
                  className="block glitch-text"
                />
              </h2>
            </div>

            <p className="text-xs md:text-sm text-gray-500 max-w-md">
              While it decides, feel free to explore the portfolio.
            </p>
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