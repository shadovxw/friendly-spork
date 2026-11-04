import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { withViewTransition } from '../../utils/viewTransition';
import HoloCard from '../ui/HoloCard';
import BlurReveal from '../effects/BlurReveal';
import { useSystem } from '../../hooks/useSystem';
import { Github, ExternalLink, ArrowRight, LayoutGrid, Cloud, AudioLines, Hand, MessageSquare } from 'lucide-react';

export const projects = [
  {
    title: "SHADOVXW_CLOUD",
    category: "DevOps & Cloud Infrastructure",
    desc: "Designed and deployed a hybrid cloud platform combining Oracle Cloud (IaaS) with an on-prem Ubuntu server. Engineered secure connectivity using SSH reverse tunneling to overcome CGNAT, deployed containerized Nextcloud with NAS Storage, and implemented Nginx reverse proxy with SSL termination. Developed a portable VPN client for zero-trust remote access. Delivered a fully self-hosted, zero-cost cloud solution with complete data ownership and privacy.",
    tech: ["Ubuntu Server", "Docker", "Nextcloud", "Nginx", "SSH", "Oracle Cloud (OCI)", "Cloudflare"],
    github: "https://github.com/shadovxw",
    website: "https://console.shadovxw.me"
  },
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

// Placeholder artwork per project until real screenshots or clips exist.
// Add `image: someImport` to a project above to show that instead.
const GRID = 'linear-gradient(rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.06) 1px, transparent 1px)';
const VISUALS = {
  SHADOVXW_CLOUD: { icon: Cloud, gradient: 'from-cyan-500/30 via-blue-700/20', pattern: GRID, size: '24px 24px' },
  Echo: { icon: AudioLines, gradient: 'from-blue-500/30 via-sky-700/20', pattern: 'repeating-linear-gradient(90deg, rgb(255 255 255 / 0.12) 0 3px, transparent 3px 9px)', size: 'auto' },
  'WAVE DRIVE': { icon: Hand, gradient: 'from-emerald-500/25 via-cyan-700/20', pattern: 'radial-gradient(rgb(255 255 255 / 0.2) 1px, transparent 1px)', size: '14px 14px' },
  BLABLAVERSE: { icon: MessageSquare, gradient: 'from-sky-500/30 via-cyan-700/20', pattern: 'repeating-linear-gradient(45deg, rgb(255 255 255 / 0.06) 0 1px, transparent 1px 10px)', size: 'auto' },
};

const FADE_MASK = 'radial-gradient(ellipse at center, #000 30%, transparent 85%)';

const ProjectVisual = ({ proj, className = '' }) => {
  const v = VISUALS[proj.title] || VISUALS.SHADOVXW_CLOUD;
  const Icon = v.icon;

  return (
    <div className={`relative overflow-hidden bg-neutral-950 ${className}`} aria-hidden="true">
      {proj.image ? (
        <img src={proj.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <>
          <div className={`absolute inset-0 bg-gradient-to-br ${v.gradient} to-transparent`} />
          <div
            className="absolute inset-0"
            style={{ backgroundImage: v.pattern, backgroundSize: v.size, maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }}
          />
          <Icon
            size={72}
            strokeWidth={1.25}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70 transition-transform duration-500 group-hover:scale-110"
          />
        </>
      )}
      <span className="absolute bottom-3 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/50">
        {proj.tech.slice(0, 3).join(' · ')}
      </span>
    </div>
  );
};

// Anchor id for a project card (the Stack section links to these).
export const projectAnchor = (title) => `project-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

const ProjectSection = () => {
  const { playClick } = useSystem();
  const navigate = useNavigate();
  // tags lit up while a Stack item is hovered
  const [litTags, setLitTags] = useState([]);

  useEffect(() => {
    const onHighlight = (e) => setLitTags(e.detail || []);
    window.addEventListener('stack-highlight', onHighlight);
    return () => window.removeEventListener('stack-highlight', onHighlight);
  }, []);

  return (
    <section id="projects" className="relative w-full py-24 px-6 md:px-20 bg-[#0b0a0d] z-10">

      {/* Section Header */}
      <BlurReveal className="mb-20" blur={4} y={16} duration={0.7}>
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
      </BlurReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

        {/* --- PROJECTS: first one is the full-width feature card --- */}
        {projects.map((proj, index) => {
          const featured = index === 0;

          return (
            <BlurReveal
              key={proj.title}
              className={`h-full ${featured ? 'md:col-span-3' : ''}`}
              delay={featured ? 0.1 : 0.15 + index * 0.07}
              blur={4}
              y={16}
              duration={0.7}
            >
            <HoloCard
              glow
              maxTilt={featured ? 2 : 4}
              className="w-full h-full bg-neutral-900/40 rounded-xl overflow-hidden group border border-white/5 transition-colors duration-500 hover:bg-neutral-900/80"
            >
              <article id={projectAnchor(proj.title)} className={`flex h-full scroll-mt-32 flex-col ${featured ? 'md:flex-row' : ''}`}>
                <ProjectVisual
                  proj={proj}
                  className={featured ? 'h-44 md:h-auto md:w-2/5 md:min-h-[340px]' : 'h-40'}
                />

                <div className={`flex flex-1 flex-col p-6 ${featured ? 'md:p-10' : 'md:p-7'}`}>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="text-[10px] font-mono text-cyan-500/80 tracking-widest uppercase py-1 border-b border-cyan-500/30">
                      [{index + 1}] // {proj.category}
                    </span>
                    <div className="shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:bg-cyan-500 group-hover:text-black group-hover:border-cyan-500">
                      <ArrowRight size={18} className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
                    </div>
                  </div>

                  {featured && (
                    <span className="mb-3 self-start rounded-full border border-cyan-500/30 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                      Featured
                    </span>
                  )}

                  <h4 className={`font-black uppercase tracking-tighter text-white transition-colors duration-500 group-hover:text-cyan-400 mb-4 ${featured ? 'text-3xl lg:text-5xl' : 'text-2xl lg:text-3xl'}`}>
                    {proj.title}
                  </h4>

                  <p className="text-gray-400 leading-relaxed text-sm md:text-base mb-5">
                    {proj.desc}
                  </p>

                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-6">
                    {proj.tech.map(t => (
                      <span key={t} className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-200 ${litTags.includes(t) ? 'text-white underline decoration-cyan-400 underline-offset-4' : 'text-cyan-200/80'}`}>
                        #{t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-wrap gap-3">
                    {proj.github !== "#" && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" onClick={() => playClick()} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-wider text-white hover:bg-white hover:text-black transition-all">
                        <Github size={14} /> GitHub
                      </a>
                    )}
                    {proj.website !== "#" && (
                      <a href={proj.website} target="_blank" rel="noopener noreferrer" onClick={() => playClick()} className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-xs font-bold uppercase tracking-wider text-cyan-400 hover:bg-cyan-500 hover:text-white transition-all">
                        <ExternalLink size={14} /> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </article>
            </HoloCard>
            </BlurReveal>
          );
        })}

        {/* --- CTA CARDS --- */}
        <BlurReveal className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" delay={0.3} blur={4} y={16} duration={0.7}>

          {/* --- CARD 5: GITHUB CTA --- */}
          <HoloCard className="w-full bg-gradient-to-br from-cyan-900/10 to-blue-900/10 rounded-xl overflow-hidden group border border-cyan-500/20 flex items-center justify-center transition-all hover:border-cyan-500/50">
            <a
              href="https://github.com/shadovxw"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => playClick()}
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

          {/* --- CARD 6: ARCHIVE CTA --- */}
          <HoloCard className="archive-card w-full bg-gradient-to-br from-purple-900/10 to-fuchsia-900/10 rounded-xl overflow-hidden group border border-purple-500/20 flex items-center justify-center transition-all hover:border-purple-500/50">
            <Link
              to="/projects"
              // warm the lazy /projects chunk so the transition never waits on the network
              onPointerEnter={() => import('../../pages/ConstructionPage')}
              onFocus={() => import('../../pages/ConstructionPage')}
              onClick={(e) => {
                playClick();
                // remembered so "Return to base" can put the visitor back where they were
                sessionStorage.setItem('landingScroll', String(Math.round(window.scrollY)));
                // plain left-click: animate the route change; modified clicks keep default behaviour
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                withViewTransition(() => navigate('/projects'));
              }}
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
            </Link>
          </HoloCard>

        </BlurReveal>
      </div>
    </section>
  );
};

export default ProjectSection;
