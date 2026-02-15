import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import { inject } from '@vercel/analytics';

inject(); // This starts tracking page views automatically

// Components
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import CommandPalette from './components/ui/CommandPalette';
import MatrixRain from './components/effects/MatrixRain';

// Hook
import { useSystem } from './hooks/useSystem';
import CyberGrid from './components/effects/CyberGrid';
import ScrollProgress from './components/effects/ScrollProgress';
import SystemMonitor from './components/system/SystemMonitor';
import GlowCursor from './components/system/GlowCursor';
import NotFoundPage from './pages/NotFoundPage';
import ConstructionPage from './pages/ConstructionPage';

const App = () => {
  const { matrixMode } = useSystem();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <div className="min-h-screen transition-all duration-1000 ease-in-out cursor-auto lg:cursor-none">

      <GlowCursor />

      {/* 1. MATRIX RAIN (Only shows when triggered) */}
      {matrixMode && <MatrixRain />}

      {!matrixMode && <CyberGrid />}

      {/* 2. COLOR CONTROLLER (The Overlay) 
            - IF Matrix Mode is OFF (Default): We use 'backdrop-hue-rotate-90' (The Green/Purple look you liked).
            - IF Matrix Mode is ON: We switch to 'backdrop-hue-rotate-[280deg]' (A Deep Red/Gold "Hacked" look).
        */}
      <div
        className={`fixed inset-0 pointer-events-none z-[100] transition-all duration-1000 ${matrixMode
          ? 'backdrop-hue-rotate-[280deg] bg-red-900/10'  // <--- Active "Matrix" Color (Red/Hacked)
          : 'backdrop-hue-rotate-90 bg-transparent'       // <--- Default Color (The Green/Purple you liked)
          }`}
      />

      <ScrollProgress />
      <SystemMonitor />

      <Router>
        <CommandPalette />

        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/projects" element={<ConstructionPage />} />
          </Route>
        </Routes>
      </Router>

    </div>
  );
};

export default App;