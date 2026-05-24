import { motion } from "motion/react";

export default function StepCard({ step, isActive = false }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className={`glass-card js-reveal ${
        isActive
          ? "border-accent/70 bg-gradient-to-br from-sky-900/45 via-indigo-900/35 to-violet-900/35 shadow-blue-600/20"
          : "border-white/15"
      }`}
    >
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-sky-200">Step {step.stepNo}</p>
      <p className="mb-3 text-sm leading-relaxed text-slate-200">{step.text}</p>
      <span className="tag-pill">{step.sec || 15}s</span>
    </motion.article>
  );
}
