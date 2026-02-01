import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';

const PulsingCore = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="w-full h-full relative"
      onWheel={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      style={{ touchAction: 'pan-y' }}
    >
      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Spline Scene */}
      <Spline
        scene="https://prod.spline.design/6TCirOsvq3fj6lWh/scene.splinecode"
        onLoad={() => setLoading(false)}
        className="w-full h-full"
      />

      {/* --- LOGO REMOVER --- */}
      {/* A small box absolutely positioned to cover the logo in bottom-right */}
      <div className="absolute bottom-4 right-4 w-36 h-12 bg-neutral-900 z-50 pointer-events-none" />
    </div>
  );
};

export default PulsingCore;