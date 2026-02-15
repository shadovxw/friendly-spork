import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import TerminalPreloader from '../system/TerminalPreloader';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 1. If it's the Home Page, we start with the Terminal showing.
  // 2. If it's NOT Home, we start with Terminal hidden.
  const [showTerminal, setShowTerminal] = useState(isHomePage);

  // Reset state when route changes (optional, but good for full reloads)
  useEffect(() => {
    if (isHomePage) {
      setShowTerminal(true);
    } else {
      setShowTerminal(false);
    }
  }, [location.pathname, isHomePage]);

  return (
    <>
      {/* Show Terminal ONLY if we are on Home Page AND it hasn't finished yet */}
      {showTerminal && isHomePage && (
        <TerminalPreloader onComplete={() => setShowTerminal(false)} />
      )}

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