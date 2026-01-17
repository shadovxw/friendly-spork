import React from 'react';
import HoloCard from './HoloCard';
import { useSystem } from '../hooks/useSystem';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';

const projects = [
  {
    title: "SHADOVXW_CLOUD",
    category: "DevOps & Cloud Infrastructure",
    desc: "Converted a legacy laptop into a production-grade Kubernetes cluster using MicroK8s and Ubuntu Server. Implemented Zero Trust architecture via Cloudflare Tunnels and configured Nginx Ingress for secure, multi-subdomain routing.",
    tech: ["MicroK8s", "Ubuntu", "Cloudflare", "Docker", "Nginx"],
    github: "https://github.com/shadovxw",
    website: "https://portfolio.shadovxw.me"
  },
  {
    title: "AUTONOMOUS_DRONE",
    category: "Robotics & Embedded Systems",
    desc: "A Pixhawk-based quadrotor drone designed, assembled, and flight-tested from scratch with stable manual flight, real-time telemetry, and ongoing vision-based autonomy work using a companion computer.",
    tech: ["Pixhawk", "ArduPilot", "Raspberry Pi", "Python", "C++"],
    github: "https://github.com/shadovxw",
    website: "#"
  },
  {
    title: "WAVE_DRIVE",
    category: "Computer Vision & IoT",
    desc: "A gesture-controlled robotic car powered by a microservices architecture, enabling real-time hand gesture recognition and low-latency command execution over WebSockets and MediaPipe.",
    tech: ["React.js", "Node.js", "Flask", "MediaPipe", "OpenCV"],
    github: "https://github.com/shadovxw/wavedrive/tree/version3",
    website: "#"
  },
  {
    title: "BLABLAVERSE",
    category: "Full-Stack Web Application",
    desc: "A real-time chat application built using the MERN stack, supporting secure authentication, instant messaging, and scalable backend APIs for seamless multi-user communication.",
    tech: ["MongoDB", "Express", "React", "Node", "Socket.IO"],
    github: "https://github.com/shadovxw",
    website: "#"
  }
];

const ProjectSection = () => {
  const { playClick, playHover } = useSystem();

  return (
    <section id="projects" className="relative w-full min-h-screen py-32 px-6 md:px-20 bg-black z-10">
      
      {/* Section Header with Dynamic Counter */}
      <div className="mb-20">
        <div className="flex items-center gap-4 mb-4">
            <h2 className="text-sm font-bold tracking-[0.5em] text-cyan-400 uppercase">Archives</h2>
            <div className="h-[1px] w-12 bg-cyan-900" />
            <span className="text-[10px] font-mono text-cyan-500/50">
                TOTAL_RECORDS: {projects.length.toString().padStart(2, '0')}
            </span>
        </div>
        <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
            Selected <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">Works</span>
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {projects.map((proj, index) => (
          <HoloCard key={index} className="w-full bg-neutral-900/40 rounded-xl overflow-hidden group border border-white/5 transition-all duration-700 ease-in-out hover:bg-neutral-900/80">
            <div 
              onMouseEnter={() => playHover()}
              className="relative block h-full p-8 md:p-10 flex flex-col min-h-[300px] group-hover:min-h-[550px] transition-all duration-700 ease-in-out"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                    <span className="text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase py-1 border-b border-cyan-500/30">
                        [{index + 1}] // {proj.category}
                    </span>
                    <div className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                        <ArrowRight size={18} className="-rotate-45 transition-transform group-hover:rotate-0" />
                    </div>
                </div>

                <h4 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white group-hover:text-cyan-400 transition-all duration-500 tracking-tighter uppercase mb-4">
                    {proj.title}
                </h4>

                {/* Expanded Content */}
                <div className="max-h-0 opacity-0 group-hover:max-h-[450px] group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                    <div className="pt-6 mt-6 border-t border-white/10 space-y-6">
                        <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                            {proj.desc}
                        </p>
                        
                        {/* Action Links */}
                        <div className="flex flex-wrap gap-4">
                            {proj.github !== "#" && (
                                <a href={proj.github} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); playClick(); }} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all">
                                    <Github size={14} /> GitHub
                                </a>
                            )}
                            {proj.website !== "#" && (
                                <a href={proj.website} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.stopPropagation(); playClick(); }} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold uppercase tracking-wider text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all">
                                    <ExternalLink size={14} /> Live Demo
                                </a>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                            {proj.tech.map(t => (
                                <span key={t} className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-600 group-hover:text-cyan-200 transition-colors">
                                    #{t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </HoloCard>
        ))}

        {/* --- GITHUB CALL TO ACTION CARD --- */}
        <HoloCard className="w-full bg-gradient-to-br from-cyan-900/10 to-purple-900/10 rounded-xl overflow-hidden group border border-cyan-500/20 flex items-center justify-center">
            <a 
              href="https://github.com/shadovxw" 
              target="_blank" 
              rel="noopener noreferrer"
              onClick={() => playClick()}
              onMouseEnter={() => playHover()}
              className="w-full h-full p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]"
            >
                <div className="p-4 bg-cyan-500/10 rounded-full text-cyan-400 group-hover:scale-110 group-hover:bg-cyan-500 group-hover:text-black transition-all duration-500">
                    <Github size={40} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-xl font-black text-white uppercase tracking-widest">More Artifacts</h4>
                    <p className="text-gray-400 text-[11px] font-mono tracking-tighter max-w-[220px]">
                        Explore the full repository of experimental builds and open-source contributions.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:gap-4 transition-all">
                    Access Terminal <ArrowRight size={14} />
                </div>
            </a>
        </HoloCard>
      </div>
    </section>
  );
};

export default ProjectSection;