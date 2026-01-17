import React, { useEffect, useRef, useState } from 'react';
import BlurReveal from './BlurReveal'; // <--- Import BlurReveal

const timelineData = [
  {
    id: 1,
    year: "2025",
    title: "Backend & DevOps Engineering Intern",
    company: "Citius Cloud Services LLP",
    description:
      "Worked on enterprise-grade backend systems, Kubernetes & OpenShift deployments, CI/CD pipelines, centralized logging with ELK Stack, and secure secret management using HashiCorp Vault.",
    type: "work"
  },
  {
    id: 2,
    year: "2023",
    title: "Drone Crafters / Co-Captain",
    company: "Drone Crafters – KJ Somaiya College of Engineering",
    description:
      "Designed, assembled, and flight-tested a Pixhawk-based quadrotor drone. Integrated ArduPilot, Herelink telemetry, and Raspberry Pi companion computer while leading technical execution and team coordination.",
    type: "work"
  },
  {
    id: 3,
    year: "2022",
    title: "B.Tech in Electronics & Computer Engineering",
    company: "KJ Somaiya College of Engineering",
    description:
      "Honors in Artificial Intelligence, Computer Vision, and Robotics. CGPA: 9.35. Strong focus on embedded systems, robotics, and full-stack backend development.",
    type: "education"
  },
  {
    id: 4,
    year: "2020",
    title: "Secondary & Higher Secondary Education",
    company: "CBSE & HSC Boards",
    description:
      "Completed CBSE (10th) and HSC (12th) education",
    type: "education"
  }
];

const ExperienceSection = () => {
  const containerRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle Scroll Logic to animate the line
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const { top, height } = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Calculate how much of the section is visible
      const startOffset = windowHeight / 2;
      const progress = Math.min(Math.max((windowHeight - top - startOffset) / (height - startOffset), 0), 1);
      
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="experience" ref={containerRef} className="relative w-full bg-black py-32 px-4 overflow-hidden">
      
      {/* Title */}
      <div className="relative z-10 mb-24 text-center">
        <BlurReveal>
            <h2 className="text-sm font-bold tracking-[0.5em] text-gray-500 uppercase mb-4">The Journey</h2>
        </BlurReveal>
        <BlurReveal delay={0.2}>
            <div className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
            Experience <span className="text-neutral-700">& Education</span>
            </div>
        </BlurReveal>
      </div>

      <div className="relative max-w-5xl mx-auto">
        
        {/* --- THE 3D LINE (Background Track) --- */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-neutral-900 transform md:-translate-x-1/2 rounded-full"></div>

        {/* --- THE GLOWING LINE (Active Progress) --- */}
        <div 
            className="absolute left-4 md:left-1/2 top-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] transform md:-translate-x-1/2 rounded-full transition-all duration-75 ease-linear z-0"
            style={{ height: `${scrollProgress * 100}%` }}
        >
            {/* The "Head" of the line (Glowing tip) */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]"></div>
        </div>

        {/* --- TIMELINE NODES --- */}
        <div className="relative z-10 space-y-20 md:space-y-32">
          {timelineData.map((item, index) => {
            // Determine if this node should be "active" (lit up) based on scroll progress
            const threshold = (index + 0.5) / timelineData.length;
            const isActive = scrollProgress > threshold;

            return (
              // Wrap the whole row in BlurReveal so it fades in when scrolling down
              <BlurReveal key={item.id} className="w-full">
                  <div className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                    
                    {/* 1. CONTENT CARD */}
                    <div className="w-full md:w-[45%] pl-12 md:pl-0 md:px-12">
                        <div className={`p-8 border border-neutral-800 bg-black/50 backdrop-blur-sm transition-all duration-500 group hover:border-cyan-500/30 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-10'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className={`text-5xl font-black transition-colors duration-500 ${isActive ? 'text-white' : 'text-neutral-800'}`}>
                                {item.year}
                            </span>
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500 border border-neutral-800 px-3 py-1 rounded-full">
                                {item.type}
                            </span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                            {item.title}
                        </h3>
                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
                            {item.company}
                        </p>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {item.description}
                        </p>
                        </div>
                    </div>

                    {/* 2. CENTER NODE (The Dot) */}
                    <div className="absolute left-4 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-500 ${isActive ? 'bg-black border-cyan-500 shadow-[0_0_10px_cyan] scale-125' : 'bg-black border-neutral-800'}`}></div>
                    </div>

                    {/* 3. EMPTY SPACE (For alignment) */}
                    <div className="hidden md:block w-[45%]"></div>

                  </div>
              </BlurReveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;