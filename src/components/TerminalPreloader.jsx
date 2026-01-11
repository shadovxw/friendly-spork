import React, { useEffect, useState, useRef } from 'react';

const TerminalPreloader = ({ onComplete }) => {
  const [text, setText] = useState(""); // The command being typed
  const [logs, setLogs] = useState([]); // System boot logs
  const [isFinished, setIsFinished] = useState(false);
  
  // The command we want to type
  const targetText = "vrishank.warrier";
  
  // Fake system boot messages
  const bootSequence = [
    "INITIALIZING KERNEL...",
    "LOADING MODULES: [ REACT, THREE.JS, TAILWIND ]",
    "ALLOCATING MEMORY...",
    "OPTIMIZING SHADERS...",
    "MOUNTING VIRTUAL DOM...",
    "SYSTEM READY."
  ];

  const bottomRef = useRef(null);

  useEffect(() => {
    let timeoutIds = [];

    // --- PHASE 1: SYSTEM BOOT LOGS ---
    let logDelay = 0;
    bootSequence.forEach((log, index) => {
      // Randomize log speed slightly
      const delay = 150 + Math.random() * 200; 
      logDelay += delay;

      const id = setTimeout(() => {
        setLogs(prev => [...prev, log]);
        // Scroll to bottom
        if (bottomRef.current) bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }, logDelay);
      
      timeoutIds.push(id);
    });

    // --- PHASE 2: TYPING THE NAME ---
    // Start typing after logs are done
    const startTypingDelay = logDelay + 500; 
    
    // Split the name into characters and schedule them
    targetText.split("").forEach((char, index) => {
      const id = setTimeout(() => {
        setText(prev => prev + char);
      }, startTypingDelay + (index * 100)); // 100ms per keystroke
      timeoutIds.push(id);
    });

    // --- PHASE 3: ENTER KEY & EXIT ---
    const finishDelay = startTypingDelay + (targetText.length * 100) + 600; // Wait 600ms after typing
    
    const id = setTimeout(() => {
      // Add the final command to logs to simulate "Enter"
      setLogs(prev => [...prev, `user@portfolio:~$ ${targetText}`]);
      setText(""); // Clear input line (optional, or keep it)
      
      // Add Success Message
      setTimeout(() => {
         setLogs(prev => [...prev, "ACCESS GRANTED. LAUNCHING..."]);
         
         // Trigger Slide Up Animation
         setTimeout(() => {
             setIsFinished(true);
             // Unmount component after animation
             setTimeout(onComplete, 1000); 
         }, 800);

      }, 200);

    }, finishDelay);
    timeoutIds.push(id);

    return () => timeoutIds.forEach(clearTimeout);
  }, []);

  return (
    <div className={`fixed inset-0 z-[99999] bg-black text-green-500 font-mono p-8 md:p-20 overflow-hidden transition-transform duration-1000 ease-in-out ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}>
        
        <div className="max-w-4xl mx-auto w-full h-full flex flex-col justify-end pb-20">
            
            {/* Logs Output */}
            <div className="flex flex-col gap-1 mb-4 opacity-70 text-sm md:text-base">
                {logs.map((log, i) => (
                    <div key={i} className={log.includes("ACCESS GRANTED") ? "text-cyan-400 font-bold" : "text-gray-400"}>
                        {log.startsWith("user@") ? (
                            <span><span className="text-green-500">user@portfolio:~$</span> <span className="text-white">{log.split("$ ")[1]}</span></span>
                        ) : (
                            <span>{`> ${log}`}</span>
                        )}
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>

            {/* The Active Input Line (Only visible before "Enter" is pressed) */}
            {!isFinished && !logs.includes(`user@portfolio:~$ ${targetText}`) && logs.length >= bootSequence.length && (
                <div className="flex items-center text-xl md:text-3xl font-bold">
                    <span className="mr-3 text-green-500">user@portfolio:~$</span>
                    <span className="text-white">{text}</span>
                    <span className="w-3 h-8 bg-white ml-2 animate-pulse" />
                </div>
            )}

        </div>

        {/* Scanline Effect (Optional Retro Vibe) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] pointer-events-none opacity-20"></div>

    </div>
  );
};

export default TerminalPreloader;