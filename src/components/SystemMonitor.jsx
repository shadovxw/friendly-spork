import React, { useState, useEffect } from 'react';

const SystemMonitor = () => {
  const [time, setTime] = useState("");
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // 1. Update Time Every Second
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata', // Set to your timezone
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    // 2. Listen for Network Status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed bottom-8 left-8 z-40 hidden md:flex flex-col gap-2 font-mono text-[10px] uppercase tracking-widest pointer-events-none select-none mix-blend-difference">
      
      {/* HEADER */}
      <div className="flex items-center gap-2 text-gray-500 mb-1">
        <span className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" />
        SYSTEM_STATUS // V.2.0
      </div>

      {/* DATA ROW 1: LOCATION */}
      <div className="flex items-center gap-4 text-gray-400">
        <span className="text-gray-600">LOC::</span>
        <span>MUMBAI, IN</span>
        <span className="text-cyan-500">[{time}]</span>
      </div>

      {/* DATA ROW 2: NETWORK */}
      <div className="flex items-center gap-4 text-gray-400">
        <span className="text-gray-600">NET::</span>
        <span className={isOnline ? "text-green-500" : "text-red-500"}>
          {isOnline ? "ONLINE_SECURE" : "CONNECTION_LOST"}
        </span>
        <span className="text-gray-600">
            {isOnline ? "PING: 14ms" : "PING: --"}
        </span>
      </div>

      {/* DATA ROW 3: AVAILABILITY (Hardcoded or API) */}
      <div className="flex items-center gap-4 text-gray-400">
        <span className="text-gray-600">MODE::</span>
        <span className="text-purple-400 animate-pulse">
            DEEP_WORK
        </span>
      </div>

      {/* DECORATIVE BARCODE */}
      <div className="mt-2 flex items-end gap-[2px] h-4 opacity-50">
          {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-[2px] bg-gray-500 transition-all duration-500" 
                style={{ 
                    height: `${Math.random() * 100}%`,
                    opacity: Math.random() 
                }} 
              />
          ))}
      </div>

    </div>
  );
};

export default SystemMonitor;