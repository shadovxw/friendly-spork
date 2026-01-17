import React from 'react';
import HoloCard from './HoloCard';
import { useSystem } from '../hooks/useSystem';

const projects = [
  {
    title: "SHADOVXW_CLOUD",
    category: "DevOps & Cloud Infrastructure",
    desc: "Converted a legacy laptop into a production-grade Kubernetes cluster using MicroK8s and Ubuntu Server. Implemented Zero Trust architecture via Cloudflare Tunnels and configured Nginx Ingress for secure, multi-subdomain routing.",
    tech: ["MicroK8s", "Ubuntu", "Cloudflare", "Docker", "Nginx"],
    link: "#"
  },
  {
    title: "AUTONOMOUS_DRONE",
    category: "Robotics & Embedded Systems",
    desc: "A Pixhawk-based quadrotor drone designed, assembled, and flight-tested from scratch with stable manual flight, real-time telemetry, and ongoing vision-based autonomy work using a companion computer.",
    tech: ["Pixhawk", "ArduPilot", "Raspberry Pi", "Python", "C++"],
    link: "#"
  },
  {
    title: "WAVE_DRIVE",
    category: "Computer Vision & IoT",
    desc: "A gesture-controlled robotic car powered by a microservices architecture, enabling real-time hand gesture recognition and low-latency command execution over WebSockets and MediaPipe.",
    tech: ["React.js", "Node.js", "Flask", "MediaPipe", "OpenCV"],
    link: "https://github.com/shadovxw/wavedrive/tree/version3"
  },
  {
    title: "BLABLAVERSE",
    category: "Full-Stack Web Application",
    desc: "A real-time chat application built using the MERN stack, supporting secure authentication, instant messaging, and scalable backend APIs for seamless multi-user communication.",
    tech: ["MongoDB", "Express", "React", "Node", "Socket.IO"],
    link: "#"
  }
];

const ProjectSection = () => {
  const { playClick } = useSystem();

  return (
    <section id="projects" className="relative w-full min-h-screen py-32 px-6 md:px-20 bg-black z-10">
      
      {/* Section Header */}
      <div className="mb-20">
        <h2 className="text-sm font-bold tracking-[0.5em] text-cyan-400 uppercase mb-4">Archives</h2>
        <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">Works</span>
        </h3>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {projects.map((proj, index) => (
          
          <HoloCard key={index} className="w-full bg-neutral-900/50 rounded-xl overflow-hidden group border border-white/5">
            
            <a 
              href={proj.link} 
              onClick={() => playClick()} 
              className="relative block h-full p-8 md:p-10 flex flex-col min-h-[480px] transition-all duration-500"
            >
                
                {/* 1. Card Top: Category & Index */}
                <div className="flex justify-between items-start mb-12">
                    <span className="text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase py-1 border-b border-cyan-500/30">
                        [{index + 1}] // {proj.category}
                    </span>
                    
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 transform group-hover:-rotate-45">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </div>
                </div>

                {/* 2. Card Middle: Title & Description (Flex-Grow pushes bottom content down) */}
                <div className="flex-grow flex flex-col justify-center">
                    <h4 className="text-3xl md:text-4xl font-black text-white mb-6 group-hover:text-cyan-400 transition-colors tracking-tighter uppercase">
                        {proj.title}
                    </h4>
                    {/* line-clamp-4 ensures all descriptions take up the same visual space */}
                    <p className="text-gray-400 leading-relaxed text-sm md:text-base line-clamp-4 font-medium mb-8">
                        {proj.desc}
                    </p>
                </div>

                {/* 3. Card Bottom: Tech Stack */}
                <div className="pt-6 border-t border-white/5">
                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        {proj.tech.map(t => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 group-hover:text-cyan-200 transition-colors">
                                #{t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Ambient Glow */}
                <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] group-hover:bg-cyan-500/10 transition-all duration-700 pointer-events-none" />
            </a>

          </HoloCard>

        ))}
      </div>

    </section>
  );
};

export default ProjectSection;