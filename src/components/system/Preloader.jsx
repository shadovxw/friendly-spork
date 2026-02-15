import React, { useEffect, useState } from 'react';

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING...");
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // 1. Progress Counter
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        // Random jump in numbers for "hacker" feel
        return prev + Math.floor(Math.random() * 10) + 1; 
      });
    }, 150);

    // 2. Text Scramble
    const texts = ["LOADING ASSETS", "DECRYPTING DATA", "ESTABLISHING CONNECTION", "RENDERING CHAOS", "SYSTEM READY"];
    let textIndex = 0;
    const textTimer = setInterval(() => {
        if(textIndex < texts.length) {
            setText(texts[textIndex]);
            textIndex++;
        }
    }, 400);

    // 3. Finish sequence
    const finishTimer = setTimeout(() => {
        setIsFinished(true);
        // Wait for slide-up animation to finish before unmounting
        setTimeout(onComplete, 1000); 
    }, 2500);

    return () => {
        clearInterval(timer);
        clearInterval(textTimer);
        clearTimeout(finishTimer);
    };
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-black text-white transition-transform duration-1000 ease-in-out ${isFinished ? '-translate-y-full' : 'translate-y-0'}`}>
        
        {/* Progress Number */}
        <div className="text-9xl font-black font-mono tracking-tighter mb-4">
            {Math.min(progress, 100)}%
        </div>

        {/* Loading Text */}
        <div className="text-sm font-bold tracking-[0.5em] text-cyan-500 uppercase animate-pulse">
            {text}
        </div>

        {/* Loading Bar */}
        <div className="absolute bottom-0 left-0 h-2 bg-neutral-800 w-full">
            <div 
                className="h-full bg-cyan-500 transition-all duration-200 ease-out shadow-[0_0_20px_cyan]"
                style={{ width: `${progress}%` }}
            />
        </div>

    </div>
  );
};

export default Preloader;