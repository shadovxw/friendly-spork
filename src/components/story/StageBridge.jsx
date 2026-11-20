import React, { useEffect, useRef, useState } from 'react';
import { STAGES, LAST_STAGE, pad, scrollToStage } from './stages';

// The connective tissue between two sections: closes the stage you just read
// ("✓ projects — artifacts built") and tells you what's coming next, so every
// section hands off to the next one instead of just stopping.
const StageBridge = ({ from, note }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  const done = STAGES[from];
  const next = STAGES[from + 1];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (!next) return null;

  return (
    <div ref={ref} className="relative z-10 flex justify-center bg-[#0b0a0d] px-6 py-10 md:py-14">
      <div className="flex flex-col items-center text-center font-mono uppercase">
        {/* closing line for the stage just read */}
        <p
          className={`text-[10px] md:text-[11px] tracking-[0.25em] text-white/35 transition-all duration-700 ${seen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
        >
          <span className="text-cyan-400">✓</span> {pad(from)} {done.label}
          <span className="text-white/20"> · </span>
          <span className="normal-case tracking-[0.1em]">{note}</span>
        </p>

        {/* connector that draws itself as you arrive */}
        <span className="relative my-4 h-14 md:h-16 w-px overflow-hidden bg-white/10">
          <span
            className={`absolute inset-x-0 top-0 bg-gradient-to-b from-cyan-400 to-fuchsia-500 transition-[height] duration-[1200ms] ease-out delay-200 ${seen ? 'h-full' : 'h-0'}`}
          />
        </span>

        {/* what's next (clickable) */}
        <button
          type="button"
          onClick={() => scrollToStage(from + 1)}
          className={`group text-[11px] md:text-xs tracking-[0.25em] text-white transition-all duration-700 delay-500 hover:text-cyan-300 ${seen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
        >
          <span className="text-white/35">stage {pad(from + 1)}/{pad(LAST_STAGE)}</span>
          <span className="mx-2 text-cyan-400">▸</span>
          {next.label}
          <span className="story-caret ml-1 text-cyan-400">_</span>
        </button>
        <span
          className={`mt-2 text-[10px] normal-case tracking-[0.1em] text-white/30 transition-opacity duration-700 delay-700 ${seen ? 'opacity-100' : 'opacity-0'}`}
        >
          $ {next.cmd} — {next.teaser}
        </span>
      </div>
    </div>
  );
};

export default StageBridge;
