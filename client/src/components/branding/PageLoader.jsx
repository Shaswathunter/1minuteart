import { motion } from "motion/react";

export default function PageLoader({ label = "Syncing creative studio..." }) {
  return (
    <div className="glass-card flex items-center gap-4">
      <motion.div
        className="h-9 w-9 rounded-full border-2 border-sky-300/60 border-t-transparent"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <div>
        <p className="font-logo text-lg uppercase tracking-[0.12em] text-slate-100">1 Minute</p>
        <p className="text-sm text-slate-300">{label}</p>
      </div>
    </div>
  );
}
