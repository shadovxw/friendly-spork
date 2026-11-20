import React, { useEffect, useRef, useState, useCallback } from 'react';
import { STAGES, LAST_STAGE, pad, scrollToStage } from './stages';
import { sfx } from '../../utils/sfx';
import { useSystem } from '../../hooks/useSystem';

// Themed scrollbar: a vertical "build pipeline" pinned to the right edge.
// Each section is a stage node placed where that section really starts in the page,
// so the rail is a true map of the scroll. Drag the track to scrub, click a node to jump.
// Replaces the native scrollbar on desktop (see html.rail-active in index.css);
// on phones it collapses into a thin progress bar at the top.
const StoryRail = ({ show = true }) => {
  const [tops, setTops] = useState(() => STAGES.map(() => 0)); // section start, px
  const [maxScroll, setMaxScroll] = useState(1);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);
  const topsRef = useRef(tops);
  const maxRef = useRef(1);
  const { muted, toggleSound } = useSystem();

  // Swarm intro (SwarmRebuild.jsx) -> rail header: "building 42%" while agents build the page,
  // then a short "build ok ✓" flash, after which the pipeline is "live".
  const [build, setBuild] = useState(() => window.__swarmStatus || { status: 'idle', done: 0, total: 0 });
  const [buildFlash, setBuildFlash] = useState(false);
  useEffect(() => {
    let wasBuilding = window.__swarmStatus?.status === 'running';
    let flashTimer = 0;
    const onStatus = (e) => {
      const { status } = e.detail;
      setBuild(e.detail);
      if (status === 'running') { wasBuilding = true; return; }
      if (wasBuilding && (status === 'complete' || status === 'live')) {
        wasBuilding = false;
        setBuildFlash(true);
        sfx.play('complete');
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => setBuildFlash(false), 2600);
      }
    };
    window.addEventListener('swarm-status', onStatus);
    return () => { window.removeEventListener('swarm-status', onStatus); clearTimeout(flashTimer); };
  }, []);
  const building = build.status === 'running';
  const buildPct = build.total ? Math.round((build.done / build.total) * 100) : 0;

  // The rail takes over from the native scrollbar while it's mounted.
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add('rail-active');
    return () => html.classList.remove('rail-active');
  }, []);

  const update = useCallback(() => {
    const y = window.scrollY;
    const max = maxRef.current;
    setProgress(Math.min(1, Math.max(0, y / max)));
    const probe = y + window.innerHeight * 0.4;
    let idx = 0;
    topsRef.current.forEach((t, i) => { if (t <= probe) idx = i; });
    // the last stage is shorter than a screen: count it once you hit the bottom
    if (y >= max - 4) idx = LAST_STAGE;
    setActive(idx);
  }, []);

  // A soft pluck each time a new stage lights up (silent until the visitor has clicked once; see sfx.js)
  const lastActive = useRef(0);
  useEffect(() => {
    if (active !== lastActive.current) {
      lastActive.current = active;
      sfx.play('stage');
    }
  }, [active]);

  // Measure where each section starts. Sections resize (pinned About scroller, lazy
  // images, fonts), so re-measure whenever the document's size changes.
  useEffect(() => {
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const next = STAGES.map((s, i) => {
          if (i === 0) return 0;
          const el = document.getElementById(s.id);
          return el ? Math.min(max, el.getBoundingClientRect().top + window.scrollY) : max;
        });
        maxRef.current = max;
        topsRef.current = next;
        setMaxScroll(max);
        setTops(next);
        update();
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [update]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; update(); });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, [update]);

  // Scrub: pointer position on the track -> scroll position.
  const scrubTo = (clientY) => {
    const r = trackRef.current?.getBoundingClientRect();
    if (!r) return;
    const f = Math.min(1, Math.max(0, (clientY - r.top) / r.height));
    const y = f * maxRef.current;
    if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
    else window.scrollTo(0, y);
  };
  const onPointerDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    scrubTo(e.clientY);
  };
  const onPointerMove = (e) => { if (dragging) scrubTo(e.clientY); };
  const endDrag = () => setDragging(false);

  const frac = (px) => `${(Math.min(1, px / maxScroll) * 100).toFixed(3)}%`;
  const atStart = progress < 0.015;
  const current = STAGES[active];

  return (
    <>
      {/* ---------- Desktop: vertical pipeline rail ---------- */}
      <nav
        data-swarm-skip=""
        aria-label="Page sections"
        className={`story-rail group/rail fixed right-3 lg:right-5 top-1/2 z-[60] hidden h-[62vh] -translate-y-1/2 md:flex flex-col items-end transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* header */}
        <div
          aria-live="polite"
          className={`mb-3 mr-[3px] font-mono text-[9px] uppercase tracking-[0.3em] select-none transition-colors duration-500 ${
            buildFlash ? 'text-cyan-300' : building ? 'text-white/60' : 'text-white/30'
          }`}
        >
          {buildFlash ? 'build ok ✓' : building ? (
            <><span className="story-pulse inline-block text-cyan-400">●</span> building {buildPct}%</>
          ) : 'pipeline'}
        </div>

        <div className="relative flex-1 w-6">
          {/* Track (the hit area is wider than the line) */}
          <div
            ref={trackRef}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
            className={`absolute inset-y-0 right-0 w-6 touch-none ${dragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          >
            <span className="absolute inset-y-0 right-[11px] w-px bg-white/10" />
            {/* Fill: how much of the site has been "built" */}
            <span
              className="absolute top-0 right-[11px] w-px bg-gradient-to-b from-cyan-400 via-cyan-300 to-fuchsia-500 shadow-[0_0_8px_rgba(34,211,238,0.7)]"
              style={{ height: `${progress * 100}%` }}
            />
            {/* Playhead */}
            <span
              className="absolute right-[7px] h-[9px] w-[9px] -translate-y-1/2 rounded-full border border-cyan-300 bg-black shadow-[0_0_10px_rgba(34,211,238,0.9)]"
              style={{ top: `${progress * 100}%` }}
            >
              <span className={`absolute inset-[2px] rounded-full bg-cyan-300 ${dragging ? '' : 'story-pulse'}`} />
            </span>
          </div>

          {/* Stage nodes */}
          {STAGES.map((s, i) => {
            const done = i < active;
            const isActive = i === active;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToStage(i)}
                aria-label={`Stage ${pad(i)}: ${s.label}`}
                aria-current={isActive ? 'step' : undefined}
                className="group/node absolute right-0 flex -translate-y-1/2 items-center gap-3 py-1 pl-2 outline-none"
                style={{ top: frac(tops[i]) }}
              >
                {/* label: active one always shows; the rest appear while hovering the rail */}
                <span
                  className={`pointer-events-none whitespace-nowrap rounded bg-[#0b0a0d]/85 px-1.5 py-0.5 backdrop-blur-sm font-mono text-[10px] uppercase tracking-[0.2em] transition-all duration-300 ${
                    isActive
                      ? 'opacity-100 translate-x-0 text-white'
                      : 'opacity-0 translate-x-2 text-white/50 group-hover/rail:opacity-100 group-hover/rail:translate-x-0 group-hover/node:text-white group-focus-visible/node:opacity-100'
                  }`}
                >
                  <span className={isActive ? 'text-cyan-400' : 'text-white/30'}>{pad(i)}</span>{' '}
                  <span className="text-white/35">{s.cmd}</span>{' '}
                  {s.label}
                </span>
                {i === 0 && buildFlash && (
                  <span className="story-ping pointer-events-none absolute right-[3px] h-[17px] w-[17px] rounded-full border border-cyan-300" />
                )}
                <span
                  className={`relative mr-[7px] h-[9px] w-[9px] rotate-45 border transition-all duration-300 ${
                    isActive
                      ? 'border-cyan-300 bg-cyan-400 scale-125 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                      : done
                        ? 'border-cyan-400/80 bg-cyan-400/80'
                        : 'border-white/30 bg-[#0b0a0d] group-hover/node:border-white/70'
                  }`}
                />
              </button>
            );
          })}

          {/* First-visit hint, sitting under the first node */}
          <div
            className={`pointer-events-none absolute right-8 top-[5%] whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-300/80 transition-all duration-700 ${atStart && show ? 'opacity-100' : 'opacity-0 -translate-y-2'}`}
          >
            <span className="story-bob inline-block">scroll to start ↓</span>
          </div>
        </div>

        {/* footer readout */}
        <div className="mt-3 mr-[3px] text-right font-mono text-[9px] uppercase tracking-[0.25em] text-white/35 select-none">
          <span className="text-cyan-400">{pad(active)}</span>/{pad(LAST_STAGE)}
          <span className="block text-white/25">{active === LAST_STAGE ? 'shipped ✓' : current.cmd}</span>
          <button
            type="button"
            onClick={toggleSound}
            aria-pressed={!muted}
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
            className="mt-2 inline-flex items-center gap-1 tracking-[0.25em] text-white/30 transition-colors hover:text-cyan-300"
          >
            <span className={muted ? 'line-through' : ''}>sfx</span>
            <span className={muted ? 'text-white/20' : 'text-cyan-400'}>{muted ? 'off' : 'on'}</span>
          </button>
        </div>
      </nav>

      {/* ---------- Phones: segmented progress bar at the very top ----------
          Sits above the nav (z-200) and therefore above the site's hue-rotate overlay (z-100),
          so it uses the already-shifted colours (violet/rose) instead of cyan/fuchsia. */}
      <div
        data-swarm-skip=""
        aria-hidden="true"
        className={`fixed inset-x-0 top-0 z-[220] h-[3px] bg-white/5 md:hidden transition-opacity duration-1000 ${show ? 'opacity-100' : 'opacity-0'}`}
      >
        <span
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-400 to-rose-500"
          style={{ width: `${progress * 100}%` }}
        />
        {tops.slice(1).map((t, i) => (
          <span key={i} className="absolute top-0 h-full w-[2px] bg-black/80" style={{ left: frac(t) }} />
        ))}
      </div>
    </>
  );
};

export default StoryRail;
