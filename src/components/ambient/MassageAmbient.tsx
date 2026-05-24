import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const MassageAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-teal-50 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_24%,rgba(45,212,191,0.18),transparent_34%),radial-gradient(circle_at_78%_76%,rgba(125,211,252,0.14),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img key={mediaSrc} src={mediaSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply dark:mix-blend-screen" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 0.16, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.45 }} />
      )}
    </AnimatePresence>
    {[0, 1, 2].map((item) => (
      <motion.div key={item} className="absolute h-20 w-44 rounded-[999px] border border-teal-400/20 dark:border-teal-100/10" style={{ left: `${-10 + item * 30}%`, top: `${25 + item * 16}%` }} animate={active ? { x: [0, 18, 0], opacity: [0.25, 0.55, 0.25] } : { x: 0, opacity: 0.25 }} transition={{ duration: 5 + item, repeat: active ? Infinity : 0, ease: 'easeInOut' }} />
    ))}
  </div>
);
