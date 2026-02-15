import React from 'react';
import HoloCard from '../ui/HoloCard';
import { useSystem } from '../../hooks/useSystem';
import { Github, ExternalLink, ArrowRight, LayoutGrid } from 'lucide-react'; // Added LayoutGrid

const projects = [
  // {
  //   title: "SHADOVXW_CLOUD",
  //   category: "DevOps & Cloud Infrastructure",
  //   desc: "Converted a legacy laptop into a production-grade Kubernetes cluster using MicroK8s and Ubuntu Server. Implemented Zero Trust architecture via Cloudflare Tunnels and configured Nginx Ingress for secure, multi-subdomain routing.",
  //   tech: ["MicroK8s", "Ubuntu", "Cloudflare", "Docker", "Nginx"],
  //   github: "https://github.com/shadovxw",
  //   website: "https://console.shadovxw.me"
  // },
  {
    title: "SHADOVXW_CLOUD",
    category: "DevOps & Cloud Infrastructure",
    desc: "Designed and deployed a hybrid cloud platform combining Oracle Cloud (IaaS) with an on-prem Ubuntu server. Engineered secure connectivity using SSH reverse tunneling to overcome CGNAT, deployed containerized Nextcloud with NAS Storage, and implemented Nginx reverse proxy with SSL termination. Developed a portable VPN client for zero-trust remote access. Delivered a fully self-hosted, zero-cost cloud solution with complete data ownership and privacy.",
    tech: ["Ubuntu Server", "Docker", "Nextcloud", "Nginx", "SSH", "Oracle Cloud (OCI)", "Cloudflare"],
    github: "https://github.com/shadovxw",
    website: "https://console.shadovxw.me"
  },

  // {
  //   title: "ECHO",
  //   category: "Robotics & Embedded Systems",
  //   desc: "A Pixhawk-based quadrotor drone designed, assembled, and flight-tested from scratch with stable manual flight, real-time telemetry, and ongoing vision-based autonomy work using a companion computer.",
  //   tech: ["Pixhawk", "ArduPilot", "Raspberry Pi", "Python", "C++"],
  //   github: "https://github.com/shadovxw",
  //   website: "#"
  // },
  {
    title: "Echo",
    category: "Full-Stack AI Application",
    desc: "A personal AI-powered meeting assistant that records, transcribes, summarizes, and structures meetings in real time. Built with a modern Next.js frontend and a high-performance Go backend integrated with Groq and Gemini APIs for intelligent summarization and formatting.",
    tech: ["Next.js", "Tailwind CSS", "Golang", "Groq API", "Gemini API"],
    github: "https://github.com/shadovxw/redesigned-fortnight",
    website: "https://echo.shadovxw.me"
  },
  {
    title: "WAVE DRIVE",
    category: "Computer Vision & IoT",
    desc: "A gesture-controlled robotic car powered by a microservices architecture, enabling real-time hand gesture recognition and low-latency command execution over WebSockets and MediaPipe.",
    tech: ["React.js", "Node.js", "Flask", "MediaPipe", "OpenCV"],
    github: "https://github.com/shadovxw/wavedrive/tree/version3",
    website: "https://wavedrive.shadovxw.me"
  },
  {
    title: "BLABLAVERSE",
    category: "Full-Stack Web Application",
    desc: "A real-time chat application built using the MERN stack, supporting secure authentication, instant messaging, and scalable backend APIs for seamless multi-user communication.",
    tech: ["MongoDB", "Express", "React", "Node", "Socket.IO"],
    github: "https://github.com/shadovxw",
    website: "https://blablaverse.shadovxw.me"
  }
];

const ProjectSection = () => {
  const { playClick, playHover } = useSystem();

  return (
    <section id="projects" className="relative w-full min-h-screen py-32 px-6 md:px-20 bg-black z-10">

      {/* Section Header */}
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

        {/* --- MAIN PROJECTS LOOP --- */}
        {projects.map((proj, index) => (
          <HoloCard
            key={index}
            className="w-full bg-neutral-900/40 rounded-xl overflow-hidden group border border-white/5 transition-all duration-700 ease-in-out hover:bg-neutral-900/80 h-auto md:h-full"
          >
            <div
              onMouseEnter={() => playHover()}
              className="relative block p-8 md:p-10 flex flex-col h-full min-h-auto md:min-h-[300px] md:group-hover:min-h-[550px] transition-all duration-700 ease-in-out"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <span className="text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase py-1 border-b border-cyan-500/30">
                  [{index + 1}] // {proj.category}
                </span>
                <div className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-cyan-500 text-black md:bg-transparent md:text-white md:group-hover:bg-cyan-500 md:group-hover:text-black transition-all duration-500">
                  <ArrowRight size={18} className="rotate-0 md:-rotate-45 transition-transform md:group-hover:rotate-0" />
                </div>
              </div>

              <h4 className="text-2xl sm:text-3xl lg:text-5xl font-black text-cyan-400 md:text-white md:group-hover:text-cyan-400 transition-all duration-500 tracking-tighter uppercase mb-4">
                {proj.title}
              </h4>

              {/* Expanded Content Wrapper */}
              <div className="max-h-full opacity-100 md:max-h-0 md:opacity-0 md:group-hover:max-h-[450px] md:group-hover:opacity-100 transition-all duration-700 ease-in-out overflow-hidden">
                <div className="pt-6 mt-6 border-t border-white/10 space-y-6">
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base font-medium">
                    {proj.desc}
                  </p>

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
                      <span key={t} className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 md:text-neutral-600 md:group-hover:text-cyan-200 transition-colors">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </HoloCard>
        ))}

        {/* --- CARD 5: GITHUB CTA --- */}
        <HoloCard className="w-full bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-xl overflow-hidden group border border-cyan-500/20 flex items-center justify-center transition-all hover:border-cyan-500/50">
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
              <h4 className="text-xl font-black text-white uppercase tracking-widest">Git Repos</h4>
              <p className="text-gray-400 text-[11px] font-mono tracking-tighter max-w-[220px]">
                Access the source code for all experimental builds.
              </p>
            </div>
          </a>
        </HoloCard>

        {/* --- CARD 6: ARCHIVE CTA (NEW) --- */}
        <HoloCard className="w-full bg-gradient-to-br from-purple-900/10 to-fuchsia-900/10 rounded-xl overflow-hidden group border border-purple-500/20 flex items-center justify-center transition-all hover:border-purple-500/50">
          <a
            href="/projects"
            onClick={(e) => { e.stopPropagation(); playClick(); }}
            onMouseEnter={() => playHover()}
            className="w-full h-full p-10 flex flex-col items-center justify-center text-center space-y-6 min-h-[300px]"
          >
            {/* Purple Icon Container */}
            <div className="p-4 bg-purple-500/10 rounded-full text-purple-400 group-hover:scale-110 group-hover:bg-purple-500 group-hover:text-white transition-all duration-500">
              <LayoutGrid size={40} />
            </div>
            <div className="space-y-2">
              <h4 className="text-xl font-black text-white uppercase tracking-widest">Full Archive</h4>
              <p className="text-gray-400 text-[11px] font-mono tracking-tighter max-w-[220px]">
                View the complete database of projects, videos, and galleries.
              </p>
            </div>
            <div className="flex items-center gap-2 text-purple-400 text-[10px] font-bold uppercase tracking-[0.3em] group-hover:gap-4 transition-all">
              Open Database <ArrowRight size={14} />
            </div>
          </a>
        </HoloCard>

      </div>
    </section>
  );
};

export default ProjectSection;