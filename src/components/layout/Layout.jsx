import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import GlitchIntro from '../system/preloaders/GlitchIntro';

const SEEN_KEY = 'introSeen';

// The intro plays once per session, and never for reduced-motion visitors.
const shouldSkipIntro = () => {
  try {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      sessionStorage.getItem(SEEN_KEY) === '1'
    );
  } catch {
    return false;
  }
};

const markIntroSeen = () => {
  try {
    sessionStorage.setItem(SEEN_KEY, '1');
  } catch {
    // storage blocked: the intro just replays next time
  }
};

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 1. If it's the Home Page (and not skipped), we start with the intro showing.
  // 2. If it's NOT Home, we start with the intro hidden.
  const [showTerminal, setShowTerminal] = useState(isHomePage && !shouldSkipIntro());

  // Reset state when route changes (optional, but good for full reloads)
  useEffect(() => {
    setShowTerminal(isHomePage && !shouldSkipIntro());
  }, [location.pathname, isHomePage]);

  const finishIntro = () => {
    markIntroSeen();
    setShowTerminal(false);
  };

  return (
    <>
      {/* Show Terminal ONLY if we are on Home Page AND it hasn't finished yet */}
      {showTerminal && isHomePage && <GlitchIntro onComplete={finishIntro} />}

      {/* Render the actual page (Home, About, etc.) 
        We pass a special prop 'enableIntro' to the page.
        - If we just showed the Terminal (isHomePage), enableIntro is FALSE.
        - If we skipped the Terminal (not HomePage), enableIntro is TRUE.
      */}
      <Outlet context={{ enableIntro: !isHomePage }} />
    </>
  );
};

export default Layout;