import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import BlurReveal from '../effects/BlurReveal';
import STACK_ICONS from './stackIcons';
import { projects } from './ProjectSection';

// `match` lists the project tags (see ProjectSection) that mean "this skill was used there".
// Infrastructure leads and is the widest card.
const STACK_DATA = [
  {
    category: "Infrastructure",
    featured: true,
    skills: [
      { name: "Docker", match: ["Docker"] },
      { name: "Kubernetes", match: [] },
      { name: "OpenShift", match: [] },
      { name: "CI/CD", match: [] },
      { name: "Ansible", match: [] },
      { name: "Terraform", match: [] },
      { name: "ELK Stack", match: [] },
      { name: "HashiCorp Vault", match: [] },
      { name: "Linux (Ubuntu)", match: ["Ubuntu Server"] },
    ]
  },
  {
    category: "Backend & Systems",
    skills: [
      { name: "Go (Golang)", match: ["Golang"] },
      { name: "Python", match: [] },
      { name: "Node.js", match: ["Node", "Node.js"] },
      { name: "PostgreSQL", match: [] },
      { name: "MongoDB", match: ["MongoDB"] },
      { name: "FastAPI", match: [] },
    ]
  },
  {
    category: "Frontend & Design",
    skills: [
      { name: "React.js", match: ["React", "React.js"] },
      { name: "Next.js", match: ["Next.js"] },
      { name: "Tailwind CSS", match: ["Tailwind CSS"] },
      { name: "Spline", match: [] },
      { name: "Blender", match: [] },
    ]
  }
];

const MODULE_COUNT = STACK_DATA.reduce((n, g) => n + g.skills.length, 0);

// Projects whose tech tags include any of the skill's aliases.
const projectsUsing = (skill) =>
  projects.filter((p) => p.tech.some((t) => skill.match.includes(t))).map((p) => p.title);

const SkillIcon = ({ name }) => {
  const icon = STACK_ICONS[name];
  if (!icon) {
    // no brand mark (CI/CD, Spline): a terminal-style marker keeps the rows aligned
    return <span aria-hidden="true" className="w-7 shrink-0 text-center font-mono text-lg text-white/30 transition-colors group-hover/skill:text-cyan-400">&gt;_</span>;
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 shrink-0 fill-white/35 transition-colors duration-300 group-hover/skill:fill-[var(--brand)]"
      style={{ '--brand': icon.color }}
    >
      <path d={icon.path} />
    </svg>
  );
};

const TiltCard = ({ group, delay }) => {
  const ref = useRef(null);

  // Mouse coordinates relative to the card
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out the movement
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  // Map mouse position to a gentle rotation (text-heavy cards, so keep it small)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["6deg", "-6deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-6deg", "6deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
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
      className="relative h-full p-8 rounded-2xl bg-white/[0.03] border border-white/10 transition-colors duration-500 hover:bg-white/[0.06] hover:border-cyan-500/30 shadow-2xl shadow-cyan-500/10"
    >
      <div style={{ transform: "translateZ(50px)" }} className="relative">
        <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-cyan-400 mb-8">
          // {group.category}
        </h3>
        <ul className={`gap-x-8 gap-y-4 ${group.featured ? 'grid sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}`}>
          {group.skills.map((skill, i) => {
            const usedIn = projectsUsing(skill);
            return (
              <motion.li
                key={skill.name}
                // each row ticks in like a terminal printing lines
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: delay + i * 0.03, duration: 0.35 }}
                tabIndex={usedIn.length ? 0 : undefined}
                className="group/skill relative flex items-center gap-3 text-xl lg:text-2xl font-bold text-white/80 transition-colors hover:text-cyan-400 focus-visible:text-cyan-400 outline-none cursor-default"
              >
                <SkillIcon name={skill.name} />
                <span>{skill.name}</span>
                {usedIn.length > 0 && (
                  <span className="absolute left-9 top-full z-10 mt-1 whitespace-nowrap font-mono text-[10px] font-normal uppercase tracking-[0.2em] text-white/70 opacity-0 transition-opacity duration-200 group-hover/skill:opacity-100 group-focus-visible/skill:opacity-100">
                    used in → {usedIn.join(', ')}
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </motion.div>
  );
};

const StackPage = () => {
  return (
    <section
      className="text-white px-6 md:px-12 lg:px-24 py-24 overflow-hidden"
      // soft tint that fades into the shared page colour, so the section edges don't read as hard seams
      style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgb(255 255 255 / 0.035), transparent 70%), #0b0a0d' }}
    >
      {/* Header Section (same shape as Projects) */}
      <BlurReveal className="mb-16" blur={4} y={16} duration={0.7}>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-sm font-bold tracking-[0.5em] text-cyan-400 uppercase">Toolchain</h2>
          <div className="h-[1px] w-12 bg-cyan-900" />
          <span className="text-[10px] font-mono text-cyan-500/50">
            MODULES: {MODULE_COUNT.toString().padStart(2, '0')}
          </span>
        </div>
        <h3 className="text-5xl md:text-8xl font-black text-white uppercase tracking-tighter">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-purple-600">Stack</span>
        </h3>
        <p className="font-mono text-sm text-cyan-400/80 mt-6">$ stack --list --verbose</p>
        <p className="text-white/70 max-w-2xl text-lg md:text-xl mt-3">
          A collection of technologies I’ve learned, worked with, and continue to improve through hands-on projects.
        </p>
      </BlurReveal>

      {/* 3D Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 [perspective:1000px]">
        {STACK_DATA.map((group, idx) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            className={group.featured ? 'lg:col-span-2' : ''}
          >
            <TiltCard group={group} delay={idx * 0.1 + 0.2} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default StackPage;
