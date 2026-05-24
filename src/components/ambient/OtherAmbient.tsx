import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface AmbientProps {
  active?: boolean;
  mediaSrc?: string;
  className?: string;
}

export const OtherAmbient: React.FC<AmbientProps> = ({ active = false, mediaSrc, className = '' }) => (
  <div className={`absolute inset-0 overflow-hidden bg-slate-100 dark:bg-slate-950 ${className}`} aria-hidden="true">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_24%,rgba(59,130,246,0.16),transparent_34%),radial-gradient(circle_at_78%_72%,rgba(20,184,166,0.14),transparent_36%)]" />
    <AnimatePresence>
      {active && mediaSrc && (
        <motion.img
          key={mediaSrc}
          src={mediaSrc}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.18] mix-blend-multiply dark:mix-blend-screen"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 0.18, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.45 }}
        />
      )}
    </AnimatePresence>
    {[0, 1, 2].map((item) => (
      <motion.span
        key={item}
        className="absolute h-16 w-16 rounded-full border border-slate-400/20 dark:border-white/10"
        style={{ left: `${18 + item * 27}%`, top: `${22 + item * 12}%` }}
        animate={active ? { y: [0, -8, 0], opacity: [0.35, 0.65, 0.35] } : { y: 0, opacity: 0.35 }}
        transition={{ duration: 3.2 + item, repeat: active ? Infinity : 0, ease: 'easeInOut' }}
      />
    ))}
  </div>
);
