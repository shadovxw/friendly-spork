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

const LandingPage = () => {
  const { enableIntro } = useOutletContext(); 
  const [showLandingContent, setShowLandingContent] = useState(!enableIntro);
  const [introFinished, setIntroFinished] = useState(!enableIntro);

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
                        Full Stack Developer & Artist
                    </p>
                </div>
                
                <h2 className={`text-6xl md:text-9xl font-black leading-[0.9] mb-8 transition-all duration-1000 delay-300 transform ${showLandingContent ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <span className="block glitch-text" data-text="DIGITAL">
                        <HyperText text="DIGITAL" />
                    </span>
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                        CHAOS.
                    </span>
                </h2>
                
                <div className={`transition-all duration-1000 delay-1000 ${showLandingContent ? 'opacity-100' : 'opacity-0'}`}>
                    <MagneticButton href="#projects" className="group relative inline-block px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden rounded-md">
                       <div className="absolute inset-0 w-full h-full bg-neutral-800 transform translate-y-full transition-transform duration-300 group-hover:translate-y-0"></div>
                       <span className="relative z-10 group-hover:text-white transition-colors duration-300">View Projects</span>
                    </MagneticButton>
                </div>
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