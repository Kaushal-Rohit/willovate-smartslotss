import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const ActivityCenterAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-sky-50 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_26%,rgba(14,165,233,0.18),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(245,158,11,0.16),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img key={mediaSrc} src={mediaSrc} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-[0.16] mix-blend-multiply dark:mix-blend-screen" initial={{ opacity: 0, scale: 1.06 }} animate={{ opacity: 0.16, scale: 1 }} exit={{ opacity: 0, scale: 1.03 }} transition={{ duration: 0.45 }} />
      )}
    </AnimatePresence>
    <motion.div className="absolute left-12 top-10 h-24 w-24 rounded-full border border-sky-500/20" animate={active ? { rotate: 360 } : { rotate: 0 }} transition={{ duration: 9, repeat: active ? Infinity : 0, ease: 'linear' }}>
      <span className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-amber-400/70" />
    </motion.div>
  </div>
);
