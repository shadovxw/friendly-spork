import React from 'react';
import { STAGES, pad } from './stages';

// "01 · $ build": the pipeline stage a section belongs to, shown next to its heading
// so the headings, the bridges and the rail all speak the same language.
const StageTag = ({ index, className = '' }) => {
  const stage = STAGES[index];
  if (!stage) return null;
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap font-mono text-[10px] md:text-[11px] uppercase tracking-[0.25em] text-white/40 ${className}`}>
      <span className="rounded-sm border border-cyan-500/40 px-1.5 py-0.5 text-cyan-400">{pad(index)}</span>
      <span>$ {stage.cmd}</span>
    </span>
  );
};

export default StageTag;
