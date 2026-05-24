import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const CosmeticsAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-rose-50 dark:bg-zinc-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_26%_22%,rgba(244,114,182,0.22),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(251,191,36,0.16),transparent_34%)] dark:bg-[radial-gradient(circle_at_26%_22%,rgba(251,207,232,0.14),transparent_34%),radial-gradient(circle_at_78%_78%,rgba(253,230,138,0.10),transparent_34%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img key={mediaSrc} src={mediaSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.17] mix-blend-multiply dark:mix-blend-screen" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 0.17, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.45 }} />
      )}
    </AnimatePresence>
    {[0, 1, 2, 3].map((item) => (
      <motion.span key={item} className="absolute h-1.5 w-1.5 rounded-full bg-amber-300/70 shadow-[0_0_18px_rgba(251,191,36,0.55)]" style={{ left: `${18 + item * 18}%`, top: `${28 + (item % 2) * 30}%` }} animate={active ? { scale: [1, 1.8, 1], opacity: [0.35, 0.9, 0.35] } : { scale: 1, opacity: 0.35 }} transition={{ duration: 2.8 + item * 0.4, repeat: active ? Infinity : 0, ease: 'easeInOut' }} />
    ))}
  </div>
);
