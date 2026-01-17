import React from 'react';
import HoloCard from './HoloCard'; // <--- Import
import { useSystem } from '../hooks/useSystem';

// const projects = [
//   {
//     title: "INFRABOT",
//     category: "DevOps Automation",
//     desc: "An Ansible-driven autonomous bot for server infrastructure management.",
//     tech: ["Python", "Ansible", "Docker"],
//     link: "#"
//   },
//   {
//     title: "NEURAL_DASH",
//     category: "Data Visualization",
//     desc: "A futuristic dashboard using React Grid Layout for real-time neural network monitoring.",
//     tech: ["React.js", "D3.js", "Tailwind"],
//     link: "#"
//   },
//   {
//     title: "ECHO_CHAMBER",
//     category: "Audio Processing",
//     desc: "Web-based audio synthesizer generating ambient soundscapes from user input.",
//     tech: ["Web Audio API", "Three.js", "Canvas"],
//     link: "#"
//   },
//   {
//     title: "VOID_GALLERY",
//     category: "Photography Portfolio",
//     desc: "A WebGL accelerated image gallery with distortion effects and kinetic typography.",
//     tech: ["WebGL", "GLSL", "GSAP"],
//     link: "#"
//   }
// ];

const projects = [
  {
    title: "AUTONOMOUS_DRONE",
    category: "Robotics & Embedded Systems",
    desc: "A Pixhawk-based quadrotor drone designed, assembled, and flight-tested from scratch with stable manual flight, real-time telemetry, and ongoing vision-based autonomy work using a companion computer.",
    tech: [
      "Pixhawk Cube Orange",
      "ArduPilot",
      "Raspberry Pi",
      "Python",
      "Embedded Systems"
    ],
    link: "#"
  },
  {
    title: "WAVE_DRIVE",
    category: "Computer Vision & IoT",
    desc: "A gesture-controlled robotic car powered by a microservices architecture, enabling real-time hand gesture recognition and low-latency command execution over WebSockets.",
    tech: [
      "React.js",
      "Node.js",
      "Flask",
      "MediaPipe",
      "OpenCV",
      "Raspberry Pi"
    ],
    link: "https://github.com/shadovxw/wavedrive/tree/version3"
  },
  {
    title: "BLABLAVERSE",
    category: "Full-Stack Web Application",
    desc: "A real-time chat application built using the MERN stack, supporting secure authentication, instant messaging, and scalable backend APIs for seamless multi-user communication.",
    tech: [
      "MongoDB",
      "Express.js",
      "React.js",
      "Node.js",
      "Socket.IO"
    ],
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        {projects.map((proj, index) => (
          
          // WRAP CARD IN HOLOCARD
          <HoloCard key={index} className="w-full bg-neutral-900 rounded-xl overflow-hidden group">
            
            <a href={proj.link} onClick={() => playClick()} className="block h-full p-8 md:p-12 flex flex-col justify-between min-h-[400px]">
                
                {/* Card Header */}
                <div className="flex justify-between items-start">
                    <span className="text-xs font-mono text-cyan-500/80 border border-cyan-500/20 px-2 py-1 rounded">
                        0{index + 1} // {proj.category}
                    </span>
                    
                    {/* Arrow Icon */}
                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17L17 7M17 7H7M17 7V17"/></svg>
                    </div>
                </div>

                {/* Card Body */}
                <div className="mt-auto">
                    <h4 className="text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">
                        {proj.title}
                    </h4>
                    <p className="text-gray-400 mb-8 leading-relaxed text-sm md:text-base">
                        {proj.desc}
                    </p>
                    
                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2">
                        {proj.tech.map(t => (
                            <span key={t} className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 group-hover:text-white transition-colors">
                                #{t}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Decorative Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-bl-[100px] -mr-8 -mt-8 blur-2xl group-hover:bg-cyan-500/20 transition-all duration-500" />
            </a>

          </HoloCard>

        ))}
      </div>

    </section>
  );
};

export default ProjectSection;