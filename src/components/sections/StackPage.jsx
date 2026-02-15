import React from 'react';
import BlurReveal from '../effects/BlurReveal';

const STACK_DATA = [
  {
    category: "Infrastructure",
    color: "text-cyan-500",
    skills: ["Docker", "Kubernetes", "Ansible", "Linux (Ubuntu/Debian)", "MicroK8s"]
  },
  {
    category: "Backend & Systems",
    color: "text-purple-500",
    skills: ["Go (Golang)", "Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB"]
  },
  {
    category: "Frontend & Design",
    color: "text-white",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Spline", "Blender"]
  }
];

const StackPage = () => {
  return (
    <main className="min-h-screen bg-neutral-900 text-white px-6 md:px-20 py-32">
      <BlurReveal>
        <h1 className="text-5xl md:text-8xl font-black uppercase mb-4">The Stack.</h1>
        <p className="text-gray-500 max-w-2xl text-lg md:text-xl mb-20">
          A breakdown of the tools and environments I use to turn architectural concepts into functional systems.
        </p>
      </BlurReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {STACK_DATA.map((group, idx) => (
          <div key={idx} className="border-t border-neutral-800 pt-8 group">
            <BlurReveal delay={idx * 0.1}>
              <h2 className={`text-xs tracking-[0.3em] uppercase font-bold ${group.color} mb-8`}>
                // {group.category}
              </h2>
              <ul className="space-y-4">
                {group.skills.map((skill, i) => (
                  <li key={i} className="text-2xl md:text-4xl font-bold text-neutral-400 hover:text-white transition-colors cursor-default">
                    {skill}
                  </li>
                ))}
              </ul>
            </BlurReveal>
          </div>
        ))}
      </div>
    </main>
  );
};

export default StackPage;