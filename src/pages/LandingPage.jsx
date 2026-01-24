import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import TopNav from '../components/TopNav';
import ProjectSection from '../components/ProjectSection'; 
import ExperienceSection from '../components/ExperienceSection'; 
import AboutSection from '../components/AboutSection';
import Footer from '../components/Footer';
import HyperText from '../components/HyperText'; 
import GlowCursor from '../components/GlowCursor';
import MagneticButton from '../components/MagneticButton'; 
import heroImage from '../assets/hero.jpg'; 
import VelocityWrapper from '../components/VelocityWrapper'; 
import VelocityMarquee from '../components/VelocityMarquee';
import SystemStatus from '../components/SystemStatus';
import FlickeringHeadline from '../components/FlickeringHeadline';

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
      
      <GlowCursor />
      <div className="bg-noise"></div>
      
      <TopNav show={showLandingContent} />

      {/* 1. HERO (Static - No Skew) */}
      <section className="relative h-screen w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className={`w-full h-full transition-transform duration-[20s] ease-linear transform ${showLandingContent ? 'scale-110' : 'scale-100'}`}>
                <img src={heroImage} alt="Background" className="w-full h-full object-cover object-center filter grayscale contrast-125 brightness-90"/>
            </div>
          </div>
          <div className={`absolute inset-0 z-10 bg-gradient-to-r from-black via-black/60 to-transparent transition-opacity duration-2000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`} />
          
          {enableIntro && (
              <div className={`absolute inset-0 z-40 flex items-center justify-center transition-all duration-1000 ${introFinished ? 'opacity-0 blur-lg scale-110 pointer-events-none' : 'opacity-100 blur-0 scale-100'}`}>
                <h1 className="text-4xl md:text-7xl font-mono font-bold tracking-tighter text-white">
                    <HyperText text="vrishank.warrier" triggerOnLoad={true} className="inline-block" />
                </h1>
              </div>
          )}

          <div className={`relative z-20 h-full w-full flex flex-col justify-end p-8 md:p-20 transition-all duration-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
            <main className="max-w-4xl mb-10 md:mb-0">
                <div className="overflow-hidden">
                    <p className={`text-sm md:text-base text-gray-400 mb-4 tracking-[0.2em] uppercase transition-transform duration-1000 delay-500 ${showLandingContent ? 'translate-y-0' : 'translate-y-full'}`}>
                        Software Engineer · Systems & Infrastructure
                    </p>
                    <p className={`text-xs md:text-sm text-gray-500 mb-6 max-w-xl transition-opacity duration-1000 delay-700 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
                        Early-career engineer focused on fundamentals, real systems, and long-term mastery.
                    </p>

                </div>
                
                <div className="relative h-[2.5rem] md:h-[3rem] lg:h-[3.5rem] mb-3">
  <h2 className="absolute inset-0 text-lg md:text-xl lg:text-2xl font-medium leading-relaxed">
    <FlickeringHeadline
      phrases={HERO_PHRASES}
      className="block glitch-text"
    />
  </h2>
</div>


                <p className="text-xs md:text-sm text-gray-300 max-w-md">
                While it decides, feel free to explore the portfolio.
                </p>

                {/* <div className={`transition-all duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
                    <MagneticButton href="#projects" className="group relative inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden rounded-md">
                       <div className="absolute inset-0 w-full h-full bg-neutral-800 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                       <span className="relative z-10 group-hover:text-white transition-colors duration-300">View Projects</span>
                    </MagneticButton>
                </div> */}
            </main>
          </div>
      </section>

          {/* --- INSERT MARQUEE BETWEEN HERO AND PROJECTS --- */}
      <div className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
         <VelocityMarquee />
      </div>

      {/* 2. VELOCITY ZONE (Only wrap Projects & Experience) */}
      <VelocityWrapper className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
          <div id="projects">
             <ProjectSection />
          </div>

          <div id="experience">
             <ExperienceSection />
          </div>
      </VelocityWrapper>

      {/* 3. STATIC ZONE (About needs 'position: fixed' to work, so it CANNOT be skewed) */}
      <div className={`transition-opacity duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
          <div id="about">
             <AboutSection />
          </div>

          <div id="footer">
             <Footer />
          </div>
      </div>

      <SystemStatus />

    </div>
  );
};

export default LandingPage;