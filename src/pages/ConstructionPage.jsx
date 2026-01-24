import React from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you use React Router
import { ArrowLeft, Hammer, Terminal, Cpu } from 'lucide-react';

const ConstructionPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col items-center justify-center p-6 text-center">
      
      {/* BACKGROUND ELEMENTS (Decorative) */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[10%] left-[5%] text-cyan-900/50 text-9xl font-black select-none animate-pulse">
          BUILDING
        </div>
        <div className="absolute bottom-[10%] right-[5%] text-purple-900/50 text-9xl font-black select-none animate-pulse delay-700">
          LOADING
        </div>
        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* MAIN CONTENT CARD */}
      <div className="relative z-10 max-w-2xl w-full bg-neutral-900/50 border border-white/10 backdrop-blur-sm p-12 rounded-2xl flex flex-col items-center shadow-2xl shadow-cyan-900/20">
        
        {/* Animated Icon */}
        <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-500 blur-xl opacity-20 animate-pulse" />
            <div className="relative w-20 h-20 bg-black border border-cyan-500/50 rounded-full flex items-center justify-center text-cyan-400">
                <Hammer size={32} className="animate-bounce" />
            </div>
            {/* Spinning ring */}
            <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin" />
        </div>

        {/* Text Content */}
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4">
            System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Under Construction</span>
        </h1>
        
        <p className="text-gray-400 font-mono text-sm md:text-base leading-relaxed max-w-lg mb-8">
            <span className="text-cyan-500">root@user:~$</span> The archive database is currently being indexed. I am manually migrating my project history, video assets, and documentation to this new interface.
        </p>

        {/* Fake Terminal Logs */}
        <div className="w-full bg-black/80 border border-white/5 rounded-lg p-4 font-mono text-xs text-left mb-8 h-32 overflow-hidden flex flex-col justify-end">
            <div className="text-gray-600">Initializing build sequence...</div>
            <div className="text-gray-600">Loading assets/images... <span className="text-green-500">DONE</span></div>
            <div className="text-gray-600">Compiling gallery components... <span className="text-green-500">DONE</span></div>
            <div className="text-yellow-500">Warning: Content migration pending.</div>
            <div className="text-cyan-500 animate-pulse">_ cursor_waiting_for_input</div>
        </div>

        {/* Action Button */}
        <button 
            onClick={() => navigate('/')} // Or window.location.href = '/' if not using Router
            className="group relative px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-cyan-400 transition-all duration-300 flex items-center gap-2"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Return to Base
        </button>

      </div>

      {/* Footer System Status */}
      <div className="absolute bottom-6 font-mono text-[10px] text-gray-600 uppercase tracking-widest">
        System Status: <span className="text-yellow-500">MAINTENANCE_MODE</span>
      </div>

    </div>
  );
};

export default ConstructionPage;