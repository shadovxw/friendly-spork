import React from 'react';
import { Link } from 'react-router-dom';
import HackerText from '../components/HackerText';

const NotFoundPage = () => {
  return (
    <div className="h-screen w-full bg-black text-red-500 font-mono flex flex-col items-center justify-center relative overflow-hidden">
      
      {/* Glitch Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
          {[...Array(20)].map((_, i) => (
              <div key={i} className="w-full h-[1px] bg-red-500 my-10 animate-pulse" style={{ animationDuration: `${Math.random()}s`}} />
          ))}
      </div>

      <h1 className="text-9xl font-black mb-4 relative glitch-text" data-text="404">
        404
      </h1>
      
      <div className="text-xl uppercase tracking-[0.5em] mb-8">
        <HackerText label="SYSTEM_FAILURE // PAGE_NOT_FOUND" />
      </div>

      <p className="max-w-md text-center text-gray-500 mb-8 text-sm">
        The requested trajectory contains invalid coordinates. The link you followed may be broken, or the page may have been removed from the mainframe.
      </p>

      <Link 
        to="/" 
        className="px-8 py-3 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-colors uppercase font-bold tracking-widest text-xs"
      >
        Return to Safety
      </Link>

    </div>
  );
};

export default NotFoundPage;