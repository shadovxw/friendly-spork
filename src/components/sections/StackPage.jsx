import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const STACK_DATA = [

  {
    category: "Backend & Systems",
    color: "text-purple-500",
    glow: "shadow-purple-500/20",
    skills: ["Go (Golang)", "Python", "Node.js", "PostgreSQL", "MongoDB", "FastAPI"]
  },
  {
    category: "Frontend & Design",
    color: "text-white",
    glow: "shadow-white/10",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Spline", "Blender"]
  },
    {
    category: "Infrastructure",
    color: "text-cyan-500",
    glow: "shadow-cyan-500/20",
    skills: ["Docker", "Kubernetes", "Ansible", "Linux (Ubuntu)", "Terraform"]
  }
];

const TiltCard = ({ group }) => {
  const ref = useRef(null);

  // Mouse coordinates relative to the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Map mouse position to rotation (-15 to 15 degrees)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Normalize values between -0.5 and 0.5
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
      }}
      className={`relative h-full p-8 rounded-2xl bg-neutral-800/50 border border-neutral-700/50 transition-all duration-500 hover:bg-neutral-800 hover:border-neutral-600 shadow-2xl ${group.glow}`}
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative">
        <h2 className={`text-xs tracking-[0.3em] uppercase font-bold ${group.color} mb-8`}>
          // {group.category}
        </h2>
        <ul className="space-y-4">
          {group.skills.map((skill, i) => (
            <li 
              key={i} 
              className="text-2xl lg:text-4xl font-bold text-neutral-400 hover:text-white transition-colors cursor-default"
            >
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

const StackPage = () => {
  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 md:px-12 lg:px-24 py-24 md:py-32 overflow-hidden">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-16 md:mb-24"
      >
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase leading-tight">
           The Stack
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg md:text-xl mt-6">
          A collection of technologies I’ve learned, worked with, and continue to improve through hands-on projects.
        </p>
      </motion.div>

      {/* 3D Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 perspective-1000">
        {STACK_DATA.map((group, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
          >
            <TiltCard group={group} />
          </motion.div>
        ))}
      </div>
    </main>
  );
};

export default StackPage;