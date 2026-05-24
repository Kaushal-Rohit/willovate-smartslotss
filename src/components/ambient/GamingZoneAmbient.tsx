import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const GamingZoneAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-slate-100 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.12)_1px,transparent_1px)] bg-[size:22px_22px]" />
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_28%,rgba(124,58,237,0.20),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(6,182,212,0.18),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img key={mediaSrc} src={mediaSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-screen" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 0.16, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.45 }} />
      )}
    </AnimatePresence>
    <motion.div className="absolute left-10 top-10 h-24 w-24 rounded-2xl border border-cyan-400/25" animate={active ? { rotate: [0, 8, 0], scale: [1, 1.06, 1] } : { rotate: 0, scale: 1 }} transition={{ duration: 4, repeat: active ? Infinity : 0, ease: 'easeInOut' }} />
  </div>
);
