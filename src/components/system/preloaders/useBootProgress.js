import { useEffect, useRef, useState } from 'react';
import heroImage from '../../../assets/hero.jpg';

// Real work the intro waits on, so the progress is honest instead of faked.
const TASKS = [
  {
    id: 'assets',
    label: 'LOADING ASSETS',
    run: () =>
      new Promise((resolve) => {
        const img = new Image();
        img.onload = img.onerror = resolve;
        img.src = heroImage;
      }),
  },
  {
    id: 'fonts',
    label: 'LOADING FONTS',
    run: () => (document.fonts ? document.fonts.ready : Promise.resolve()),
  },
  {
    id: 'page',
    label: 'PAGE READY',
    run: () =>
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise((resolve) => window.addEventListener('load', resolve, { once: true })),
  },
];

// progress eases 0 -> 100, capped by real completion and by a minimum duration
// (so a cached reload doesn't flash the intro for a single frame).
const useBootProgress = (minMs = 1800) => {
  const [doneAt, setDoneAt] = useState({});
  const [progress, setProgress] = useState(0);
  const startRef = useRef(performance.now());

  useEffect(() => {
    let alive = true;
    TASKS.forEach((t) =>
      t.run().then(() => {
        if (alive) setDoneAt((d) => ({ ...d, [t.id]: Math.round(performance.now() - startRef.current) }));
      }),
    );
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const real = (Object.keys(doneAt).length / TASKS.length) * 100;
    // interval, not rAF: still ticks if the tab is in the background
    const id = setInterval(() => {
      const time = Math.min(100, ((performance.now() - startRef.current) / minMs) * 100);
      const target = Math.min(real, time);
      setProgress((p) => (p >= target ? p : Math.min(target, p + 1.5)));
    }, 16);
    return () => clearInterval(id);
  }, [doneAt, minMs]);

  return {
    progress: Math.floor(progress),
    complete: progress >= 100,
    tasks: TASKS.map((t) => ({ label: t.label, ms: doneAt[t.id] })),
  };
};

export default useBootProgress;
