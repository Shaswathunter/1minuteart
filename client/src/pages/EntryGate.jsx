import { Link } from "react-router-dom";
import { motion } from "motion/react";

export default function EntryGate() {
  return (
    <section className="mx-auto flex min-h-[70vh] w-full max-w-5xl items-center justify-center px-2 py-6 sm:px-4">
      <motion.div
        className="glass-card w-full max-w-4xl overflow-hidden"
        initial={{ opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
      >
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <p className="neo-subbrand">NEOROX Arts Entry</p>
            <h1 className="panel-title">
              1 Minute
              <span className="block bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                Choose Your Mode
              </span>
            </h1>
            <p className="text-sm leading-relaxed text-slate-300 sm:text-base">
              Start as guest for instant practice, ya login/register karke scores aur progress save karo.
            </p>
            <div className="rounded-2xl border border-white/15 bg-slate-900/65 p-3 text-xs uppercase tracking-[0.16em] text-slate-300">
              Responsive • Animated • Guided Learning
            </div>
          </div>

          <div className="grid gap-3 self-center">
            <Link className="btn-primary w-full justify-center py-3 text-sm sm:text-base" to="/home">
              Play as Guest
            </Link>
            <Link className="btn-secondary w-full justify-center py-3 text-sm sm:text-base" to="/login">
              Login
            </Link>
            <Link className="btn-ghost w-full justify-center py-3 text-sm sm:text-base" to="/register">
              Register
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
