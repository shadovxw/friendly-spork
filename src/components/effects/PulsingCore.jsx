import React, { useEffect, useRef, useState } from 'react';
import Spline from '@splinetool/react-spline';

// The object we steer. The exported scene already has a "Group" holding the knot; if you re-export with an
// empty group named "Rig" around it, that one is preferred. The knot's own built-in animation keeps playing.
const RIG_NAMES = ['Rig', 'Group'];
const SCENE = 'https://prod.spline.design/6TCirOsvq3fj6lWh/scene.splinecode';

export default function PulsingCore() {
  const [loading, setLoading] = useState(true);
  const wrapRef = useRef(null);
  const appRef = useRef(null);
  const rigRef = useRef(null);

  const onLoad = (app) => {
    appRef.current = app;
    rigRef.current = RIG_NAMES.map((n) => app.findObjectByName(n)).find(Boolean) || null;
    setLoading(false);
  };

  // Stop rendering while it's off-screen
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      const app = appRef.current;
      if (app) e.isIntersecting ? app.play() : app.stop();
    });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  // Cursor + scroll steer the rig, eased
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf;
    const base = { x: null, y: null };
    const onMove = (e) => {
      tx = (e.clientY / window.innerHeight - 0.5) * 0.6;
      ty = (e.clientX / window.innerWidth - 0.5) * 0.9;
    };
    const tick = () => {
      const rig = rigRef.current;
      if (rig) {
        if (base.x === null) { base.x = rig.rotation.x; base.y = rig.rotation.y; }
        cx += (tx - cx) * 0.06;
        cy += (ty - cy) * 0.06;
        rig.rotation.x = base.x + cx + window.scrollY * 0.0006;
        rig.rotation.y = base.y + cy;
      }
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('pointermove', onMove); cancelAnimationFrame(raf); };
  }, []);

  return (
    // pointer-events-none: the page always scrolls and the camera can never be zoomed by the wheel
    <div ref={wrapRef} className="pointer-events-none relative h-full w-full">
      {loading && (
        <div className="absolute inset-0 grid place-items-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400 border-t-transparent" />
        </div>
      )}
      <Spline scene={SCENE} onLoad={onLoad} className="h-full w-full" />

      {/* Covers the Spline badge in the bottom-right corner. Same colour as the page (#0b0a0d) and feathered,
          so it doesn't show up as a box. */}
      <div aria-hidden="true" className="absolute bottom-4 right-4 z-50 h-12 w-36 bg-[#0b0a0d] shadow-[0_0_22px_16px_#0b0a0d]" />
    </div>
  );
}
