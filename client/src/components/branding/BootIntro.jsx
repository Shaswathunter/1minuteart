import { motion } from "motion/react";

export default function BootIntro() {
  return (
    <motion.div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-[#05060b]"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.015, filter: "blur(8px)" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <div className="w-full max-w-md px-8">
        <motion.p
          className="mb-3 text-center font-logo text-3xl font-extrabold uppercase tracking-[0.24em] text-white"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          1 Minute
        </motion.p>
        <motion.p
          className="mb-8 text-center text-xs uppercase tracking-[0.28em] text-cyan-200/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.28, duration: 0.45 }}
        >
          NEOROX Arts
        </motion.p>

        <div className="h-1.5 overflow-hidden rounded-full border border-white/20 bg-white/10">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-sky-400 via-indigo-400 to-violet-400"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
