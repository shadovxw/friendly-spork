import React, { useState, useEffect } from 'react';

const SystemStatus = () => {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 w-full p-4 z-50 pointer-events-none">
      <div className="flex flex-wrap justify-between items-center bg-black/40 backdrop-blur-md border-t border-white/5 px-6 py-2 rounded-t-xl">
        
        {/* Left Side: Identity & Time */}
        {/* <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-white/80">SYSTEM_ONLINE</span>
          </div>
          <div className="hidden md:block text-neutral-500">
            LOC_TIME: <span className="text-white">{time}</span>
          </div>
        </div> */}

        {/* Right Side: Visitor Logic & Version */}
        <div className="flex items-center gap-6 font-mono text-[10px] tracking-widest uppercase">
          <div className="text-neutral-500">
            NODE_OS: <span className="text-cyan-400">V.2.0.stable</span>
          </div>
          
          {/* Note: Real-time visitor counts usually require a database or 
              Vercel's dashboard, so we label this as an 'Encrypted' metric 
              to maintain your aesthetic. */}
          <div className="hidden sm:block text-neutral-500">
            TRAFFIC: <span className="text-white/80">[ENCRYPTED_LINK]</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SystemStatus;