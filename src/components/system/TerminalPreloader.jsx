import React, { useEffect, useState, useRef } from 'react';

const TerminalPreloader = ({ onComplete }) => {
  const [text, setText] = useState("");
  const [logs, setLogs] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  
  const targetText = "vrishank.warrier";
  
  const bootSequence = [
    "INITIALIZING KERNEL...",
    "LOADING MODULES: [ REACT, NEXT.JS, GO, FASTAPI ]",
    "ESTABLISHING NEURAL LINK...",
    "MOUNTING DISTRIBUTED_SYSTEMS...",
    "SECURE SHELL READY."
  ];

  const scrollRef = useRef(null);

  useEffect(() => {
    let timeoutIds = [];

    // Phase 1: Boot Logs
    let logDelay = 0;
    bootSequence.forEach((log, index) => {
      const delay = 100 + Math.random() * 150; 
      logDelay += delay;
      const id = setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, logDelay);
      timeoutIds.push(id);
    });

    // Phase 2: Typing
    const startTypingDelay = logDelay + 400; 
    targetText.split("").forEach((char, index) => {
      const id = setTimeout(() => {
        setText(prev => prev + char);
      }, startTypingDelay + (index * 80)); 
      timeoutIds.push(id);
    });

    // Phase 3: Enter & Cleanup
    const finishDelay = startTypingDelay + (targetText.length * 80) + 500; 
    const id = setTimeout(() => {
      setLogs(prev => [...prev, `user@vrishank:~$ ${targetText}`]);
      
      setTimeout(() => {
         setLogs(prev => [...prev, "STATUS: ACCESS_GRANTED", "INITIALIZING PORTFOLIO ENGINE..."]);
         setTimeout(() => {
             setIsFinished(true);
             setTimeout(onComplete, 1100); 
         }, 800);
      }, 150);
    }, finishDelay);

    timeoutIds.push(id);
    return () => timeoutIds.forEach(clearTimeout);
  }, [onComplete]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, text]);

  return (
    <div className={`fixed inset-0 z-[100] bg-[#0a0a0a] text-green-500 font-mono flex flex-col transition-transform duration-1000 ease-in-out will-change-transform ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}>
      
      {/* Screen Effects */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_3px,3px_100%]" />
      <div className="absolute inset-0 pointer-events-none z-10 shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />

      {/* Main Terminal Container */}
      <div className="relative z-20 flex flex-col h-full max-w-5xl mx-auto w-full p-6 md:p-12 lg:p-20 overflow-hidden">
        
        {/* Scrollable Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-hide flex flex-col justify-end pb-4">
            
            {/* Historical Logs */}
            <div className="flex flex-col gap-1.5 opacity-60 text-[10px] sm:text-xs md:text-sm lg:text-base mb-6">
                {logs.map((log, i) => (
                    <div key={i} className={`break-all ${log.includes("ACCESS_GRANTED") ? "text-cyan-400 font-bold" : ""}`}>
                        {log.startsWith("user@") ? (
                            <p><span className="text-green-600">user@vrishank:~$</span> <span className="text-white">{log.split("$ ")[1]}</span></p>
                        ) : (
                            <p>{`> ${log}`}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Current Active Input */}
            {!isFinished && logs.length >= bootSequence.length && (
                <div className="flex items-start sm:items-center text-base sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight">
                    <span className="mr-2 sm:mr-4 text-green-600 shrink-0 select-none">user@vrishank:~$</span>
                    <span className="text-white break-all">{text}</span>
                    <span className="inline-block w-[8px] h-[1.2em] bg-green-500 ml-2 animate-[pulse_0.8s_infinite] align-middle" />
                </div>
            )}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default TerminalPreloader;