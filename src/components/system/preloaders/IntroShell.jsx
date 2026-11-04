import React, { useEffect, useRef, useState } from 'react';

// Shared frame: full-screen black panel that lifts away once `complete` is true.
const LIFT_MS = 700;

const IntroShell = ({ complete, onComplete, holdMs = 300, children }) => {
  const [leaving, setLeaving] = useState(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!complete) return;
    const lift = setTimeout(() => setLeaving(true), holdMs);
    const done = setTimeout(() => onCompleteRef.current(), holdMs + LIFT_MS + 100);
    return () => {
      clearTimeout(lift);
      clearTimeout(done);
    };
  }, [complete, holdMs]);

  return (
    <div
      className={`fixed inset-0 z-[250] bg-[#0a0a0a] text-white font-mono transition-transform duration-700 ease-in-out will-change-transform ${leaving ? '-translate-y-full' : 'translate-y-0'}`}
    >
      {/* scanlines + vignette, same as the old terminal */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_3px]" />
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
      <div className="relative z-20 h-full w-full">{children}</div>
    </div>
  );
};

export default IntroShell;
