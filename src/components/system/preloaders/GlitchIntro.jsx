import React, { useEffect, useState } from 'react';
import IntroShell from './IntroShell';
import useBootProgress from './useBootProgress';

const NAME = 'vrishank.warrier';
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*<>?/';
const SEGMENTS = 24;

const hex = (bytes) =>
  Array.from({ length: bytes }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0'),
  ).join(' ');

// The name scrambles into place as the page really loads, RGB-split while it
// resolves, with HUD corners, a scan beam, a hex stream and random glitch bursts.
const GlitchIntro = ({ onComplete }) => {
  const { progress, complete: loaded, tasks } = useBootProgress(1100);
  const [skipped, setSkipped] = useState(false);
  const complete = loaded || skipped;
  const [, setTick] = useState(0);
  const [jitter, setJitter] = useState(0);
  const [session] = useState(() => hex(3).replace(/ /g, '').toUpperCase());

  // re-render ~16x/s so the scramble, clock and hex stream keep moving
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60);
    return () => clearInterval(id);
  }, []);

  // any click or key press skips the intro
  useEffect(() => {
    const skip = () => setSkipped(true);
    window.addEventListener('keydown', skip);
    window.addEventListener('pointerdown', skip);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
    };
  }, []);

  // occasional horizontal glitch burst
  useEffect(() => {
    let reset;
    const id = setInterval(() => {
      if (Math.random() < 0.4) {
        setJitter((Math.random() < 0.5 ? -1 : 1) * (2 + Math.random() * 8));
        reset = setTimeout(() => setJitter(0), 90);
      }
    }, 450);
    return () => {
      clearInterval(id);
      clearTimeout(reset);
    };
  }, []);

  const revealed = complete ? NAME.length : Math.floor((progress / 100) * NAME.length);
  const display = NAME.split('')
    .map((c, i) => (i < revealed || c === '.' ? c : CHARS[Math.floor(Math.random() * CHARS.length)]))
    .join('');

  const current = tasks.find((t) => t.ms === undefined);
  const status = complete ? 'ACCESS GRANTED' : `${current ? current.label : 'FINALIZING'}...`;
  const filled = Math.round((progress / 100) * SEGMENTS);
  const clock = new Date().toLocaleTimeString('en-GB', { timeZone: 'Asia/Kolkata' });

  return (
    <IntroShell complete={complete} onComplete={onComplete} holdMs={skipped ? 0 : 300}>
      <div className={`relative h-full w-full overflow-hidden ${complete ? 'animate-[shake_0.4s_ease-out]' : ''}`}>
        {/* scan beam */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-transparent via-fuchsia-500/10 to-transparent animate-[scan_3s_linear_infinite]" />

        {/* HUD corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-white/30" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-white/30" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-white/30" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-white/30" />

        {/* top bar */}
        <div className="absolute top-8 inset-x-8 md:inset-x-12 flex justify-between text-xs md:text-sm tracking-[0.2em] text-white/75">
          <span>
            <span className="font-sans font-black tracking-tighter text-white text-lg md:text-xl">
              vw<span className="text-fuchsia-400">.</span>
            </span>
          </span>
          <span className="hidden sm:inline">SESSION::0x{session}</span>
          <span className="tabular-nums">IST {clock}</span>
        </div>

        {/* centre: name + segmented bar */}
        <div
          className="h-full flex flex-col items-center justify-center gap-10 px-6"
          style={{ transform: `translateX(${jitter}px) skewX(${jitter ? -3 : 0}deg)` }}
        >
          <h1
            data-text={display}
            className={`relative inline-block text-2xl sm:text-5xl md:text-7xl font-bold tracking-tighter transition-colors duration-300 ${complete ? 'text-cyan-300' : 'glitch-text'}`}
          >
            {display}
          </h1>

          <div className="w-64 md:w-96">
            <div className="flex gap-[3px]">
              {Array.from({ length: SEGMENTS }, (_, i) => (
                <div
                  key={i}
                  className={`h-3 flex-1 ${i < filled ? 'bg-fuchsia-400 shadow-[0_0_8px_#e879f9]' : 'bg-white/10'}`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-3 text-xs md:text-sm tracking-[0.2em]">
              <span className={complete ? 'text-cyan-300 font-bold' : 'text-white/80 animate-pulse'}>
                {status}
              </span>
              <span className="tabular-nums text-fuchsia-400">{progress}%</span>
            </div>
          </div>

          {/* teaser for the swarm rebuild that follows (it only runs on desktop-sized screens) */}
          <p className="hidden md:block text-center text-xs md:text-sm uppercase tracking-[0.3em] leading-relaxed animate-[fadeIn_1.2s_0.3s_ease-out_both]">
            <span className="text-white/60">Stay a few seconds</span>
            <br />
            <span className="text-cyan-300">and watch this website build itself</span>
            <span className="animate-pulse text-cyan-300">_</span>
          </p>
        </div>

        {/* hex stream */}
        <div
          className={`absolute bottom-8 left-8 md:left-12 text-[9px] md:text-[10px] leading-4 text-green-500/40 hidden sm:block animate-[fadeIn_1.2s_ease-out_both] transition-opacity duration-500 ${complete ? 'opacity-0' : ''}`}
        >
          {[0, 1, 2, 3].map((i) => (
            <div key={i}>{hex(8)}</div>
          ))}
        </div>
        <div className="absolute bottom-8 right-8 md:right-12 text-xs tracking-[0.2em] text-white/50">
          SHADOVXW // V.2
        </div>
      </div>
    </IntroShell>
  );
};

export default GlitchIntro;
