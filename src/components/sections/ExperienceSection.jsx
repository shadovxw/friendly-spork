import React, { Component, Suspense, lazy, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import BlurReveal from '../effects/BlurReveal';
import HoloCard from '../ui/HoloCard';

// three.js + the cable scene only load once the section is near the viewport
const ExperienceRail = lazy(() => import('./ExperienceRail'));

const timelineData = [
  {
    id: 1,
    period: "2025 – Present",
    badge: "CCS",
    // a promotion: both steps are at the same company
    roles: [
      { title: "Consultant", when: "2025 – 2026" },
      { title: "Associate Software Engineer", when: "July 2026 – Present" },
    ],
    company: "Citius Cloud Services LLP",
    description:
      "Worked on enterprise-grade backend systems, Kubernetes & OpenShift deployments, CI/CD pipelines, centralized logging with ELK Stack, and secure secret management using HashiCorp Vault.",
    tech: ["Kubernetes", "OpenShift", "CI/CD", "ELK Stack", "HashiCorp Vault"],
    type: "work"
  },
  {
    id: 2,
    period: "2023",
    badge: "DC",
    roles: [{ title: "Drone Crafters / Co-Captain" }],
    company: "Drone Crafters – KJ Somaiya College of Engineering",
    description:
      "Designed, assembled, and flight-tested a Pixhawk-based quadrotor drone. Integrated ArduPilot, Herelink telemetry, and Raspberry Pi companion computer while leading technical execution and team coordination.",
    tech: ["Pixhawk", "ArduPilot", "Herelink", "Raspberry Pi"],
    type: "work"
  },
  {
    id: 3,
    period: "2022 – 2026",
    badge: "KJ",
    roles: [{ title: "B.Tech in Electronics & Computer Engineering" }],
    company: "KJ Somaiya College of Engineering",
    description:
      "Honors in Artificial Intelligence, Computer Vision, and Robotics. CGPA: 9.39. Strong focus on embedded systems, robotics, and full-stack backend development.",
    tech: ["AI", "Computer Vision", "Robotics", "Embedded Systems"],
    type: "education"
  },
  {
    id: 4,
    period: "2020",
    badge: "CB",
    roles: [{ title: "Secondary & Higher Secondary Education" }],
    company: "CBSE & HSC Boards",
    description:
      "Completed CBSE (10th) and HSC (12th) education",
    tech: [],
    type: "education"
  }
];

// If WebGL is unavailable the plain CSS line still works, so a failure here just drops the 3D cable.
class RailBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? null : this.props.children; }
}

const TimelineCard = ({ item, side, active, animate }) => {
  const rowRef = useRef(null);
  // swing in from the centre line as the row scrolls into view
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ['start 0.95', 'start 0.5'] });
  const rotateY = useTransform(scrollYProgress, [0, 1], [side * 32, 0]);
  const x = useTransform(scrollYProgress, [0, 1], [side * -40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={rowRef} className="w-full md:w-[45%] pl-12 md:pl-0 md:px-12 [perspective:1200px]">
      <motion.div
        style={animate ? { rotateY, x, opacity, transformOrigin: side > 0 ? 'right center' : 'left center' } : undefined}
      >
        <HoloCard maxTilt={4} className="rounded-xl">
          <div
            className={`rounded-xl border bg-black/50 p-8 backdrop-blur-sm transition-all duration-700 ${
              active
                ? 'border-cyan-500/60 shadow-[0_0_40px_-10px_rgba(6,182,212,0.45)]'
                : 'border-white/10'
            }`}
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-mono text-[11px] font-bold tracking-wider transition-colors duration-700 ${
                    active ? 'border-cyan-500/60 text-cyan-400' : 'border-white/10 text-white/40'
                  }`}
                >
                  {item.badge}
                </span>
                <span className={`font-mono text-xs uppercase tracking-[0.2em] transition-colors duration-700 ${active ? 'text-white' : 'text-white/50'}`}>
                  {item.period}
                </span>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                {item.type}
              </span>
            </div>

            {/* one role, or a promotion path */}
            {item.roles.length === 1 ? (
              <h3 className="mb-2 text-xl font-bold text-white transition-colors group-hover:text-cyan-400 md:text-2xl">
                {item.roles[0].title}
              </h3>
            ) : (
              <ol className="mb-3 space-y-1">
                {item.roles.map((r, i) => (
                  <li key={r.title} className="flex gap-3">
                    <span aria-hidden="true" className="w-4 shrink-0 pt-1 font-mono text-cyan-400 md:pt-1.5">{i === 0 ? '○' : '↳'}</span>
                    <div>
                      <h3 className="text-xl font-bold leading-tight text-white md:text-2xl">{r.title}</h3>
                      <span className="font-mono text-[11px] uppercase tracking-widest text-white/50">{r.when}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}

            <p className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-400">{item.company}</p>
            <p className="text-sm leading-relaxed text-gray-400">{item.description}</p>

            {item.tech.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {item.tech.map((t) => (
                  <li key={t} className="rounded-full border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan-200/80">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </HoloCard>
      </motion.div>
    </div>
  );
};

const ExperienceSection = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const headDotRef = useRef(null);
  const dotRefs = useRef([]);
  const headRef = useRef(0); // px from the top of the track; read by the 3D cable every frame

  const reduced = useReducedMotion();
  const [active, setActive] = useState(() => timelineData.map(() => false));
  const [nearScreen, setNearScreen] = useState(false); // mount the 3D cable
  const [onScreen, setOnScreen] = useState(false); // keep it rendering
  const [wide, setWide] = useState(false); // desktop only

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting);
        if (entry.isIntersecting) setNearScreen(true);
      },
      { rootMargin: '300px 0px' }
    );
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // The line's head sits just below the middle of the screen; a card lights up when the head reaches its dot.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const track = trackRef.current;
      if (!track) return;
      const rect = track.getBoundingClientRect();
      const head = Math.min(Math.max(window.innerHeight * 0.55 - rect.top, 0), rect.height);
      headRef.current = head;
      if (fillRef.current) fillRef.current.style.height = `${head}px`;
      // fade the head dot over the same 220px the rail mask (.rail-fade) uses
      if (headDotRef.current) {
        const left = rect.height - head; // px of rail remaining below the head
        headDotRef.current.style.opacity = String(Math.min(1, Math.max(0, left / 220)));
      }

      const next = dotRefs.current.map((dot) => {
        if (!dot) return false;
        const d = dot.getBoundingClientRect();
        return head >= d.top + d.height / 2 - rect.top;
      });
      setActive((prev) => (prev.every((v, i) => v === next[i]) ? prev : next));
    };
    const schedule = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const showRail = wide && !reduced && nearScreen;

  return (
    <section id="experience" ref={sectionRef} className="relative w-full bg-[#0b0a0d] py-24 px-4 overflow-hidden">

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

      {/* pb-40: empty track after the last card, where the rail dissolves */}
      <div ref={trackRef} className="relative max-w-5xl mx-auto pb-40">

        {/* everything rail-related fades out over the last 220px */}
        <div aria-hidden="true" className="rail-fade pointer-events-none absolute inset-0">

        {/* --- BACKGROUND TRACK --- */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-neutral-900 transform md:-translate-x-1/2 rounded-full"></div>

        {/* --- 3D CABLE (desktop, lazy, pauses off screen) --- */}
        {showRail && (
          <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 top-0 z-[5] w-48 -translate-x-1/2">
            <RailBoundary>
              <Suspense fallback={null}>
                <ExperienceRail headRef={headRef} active={onScreen} />
              </Suspense>
            </RailBoundary>
          </div>
        )}

        {/* --- GLOWING LINE (progress). Written straight to the DOM from the scroll handler. --- */}
        <div
          ref={fillRef}
          className="absolute left-4 md:left-1/2 top-0 w-1 bg-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.8)] transform md:-translate-x-1/2 rounded-full z-0"
          style={{ height: 0 }}
        >
          <div ref={headDotRef} className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]"></div>
        </div>

        </div>{/* /rail-fade */}

        {/* --- TIMELINE NODES --- */}
        <div className="relative z-10">
          {timelineData.map((item, index) => {
            const left = index % 2 === 0; // card on the left of the line
            return (
              <div
                key={item.id}
                // later rows start while the previous card is still on screen
                className={`group relative flex w-full flex-col items-start md:flex-row md:items-center ${left ? 'md:flex-row-reverse' : ''} ${index > 0 ? 'mt-12 md:-mt-14' : ''}`}
              >
                <TimelineCard item={item} side={left ? 1 : -1} active={active[index]} animate={!reduced && wide} />

                {/* CENTER NODE */}
                <div className="absolute left-4 md:left-1/2 z-10 -translate-x-1/2 flex items-center justify-center">
                  <div
                    ref={(el) => { dotRefs.current[index] = el; }}
                    className={`h-4 w-4 rounded-full border-2 transition-all duration-500 ${active[index] ? 'bg-black border-cyan-500 shadow-[0_0_10px_cyan] scale-125' : 'bg-black border-neutral-800'}`}
                  ></div>
                </div>

                {/* EMPTY SPACE (for alignment) */}
                <div className="hidden w-[45%] md:block"></div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default ExperienceSection;
