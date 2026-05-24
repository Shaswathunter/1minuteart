import { Link } from "react-router-dom";
import { motion } from "motion/react";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/45 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to="/home"
          className="group relative overflow-hidden rounded-2xl border border-white/20 bg-slate-950/70 px-4 py-2 shadow-xl shadow-blue-900/20"
        >
          <p className="neo-logo text-xl sm:text-2xl">1 Minute</p>
          <p className="neo-subbrand mt-1">NEOROX Arts</p>
          <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-sky-400 to-violet-400 transition group-hover:scale-x-100" />
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          <Link className="btn-ghost" to="/home">
            Lessons
          </Link>
          <Link className="btn-ghost" to="/progress">
            Progress
          </Link>

          {isAuthenticated ? (
            <>
              <motion.span
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-100"
              >
                {user?.name}
              </motion.span>
              <button type="button" className="btn-secondary" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="btn-ghost" to="/login">
                Login
              </Link>
              <Link className="btn-primary" to="/register">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
