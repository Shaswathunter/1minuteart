import { useEffect, useState } from "react";
import { motion } from "motion/react";

const LIKE_COUNT_KEY = "neorox_like_count";
const LIKED_KEY = "neorox_like_state";

const getInitialCount = () => {
  const value = Number(localStorage.getItem(LIKE_COUNT_KEY));
  return Number.isFinite(value) && value >= 0 ? value : 0;
};

const getInitialLiked = () => localStorage.getItem(LIKED_KEY) === "1";

export default function Footer() {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setLikeCount(getInitialCount());
    setLiked(getInitialLiked());
  }, []);

  const toggleLike = () => {
    setLikeCount((prev) => {
      const next = liked ? Math.max(prev - 1, 0) : prev + 1;
      localStorage.setItem(LIKE_COUNT_KEY, String(next));
      return next;
    });

    setLiked((prev) => {
      const next = !prev;
      localStorage.setItem(LIKED_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <footer className="relative mt-12 border-t border-white/10 bg-black/40 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-7 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="neo-logo text-lg sm:text-xl">1 Minute</p>
            <p className="neo-subbrand mt-1">NEOROX Arts</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              className="btn-ghost text-xs sm:text-sm"
              href="https://www.instagram.com/neorox_gaming/?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              Instagram
            </a>
            <a
              className="btn-ghost text-xs sm:text-sm"
              href="https://www.youtube.com/@NeoroxLive"
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>
           
          </div>
        </div>

        <div className="glass-card flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-slate-200">
            If you like this app then touch this heart
          </p>

          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border transition ${
                liked
                  ? "border-pink-300/60 bg-pink-500/20 shadow-lg shadow-pink-500/35"
                  : "border-white/30 bg-slate-900/60"
              }`}
              whileTap={{ scale: 0.9 }}
              onClick={toggleLike}
              aria-label="Like app"
            >
              <svg
                viewBox="0 0 24 24"
                className={`h-5 w-5 ${liked ? "fill-pink-300 text-pink-200" : "fill-none text-slate-100"}`}
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path d="M12 20.4c-3.4-3-7.2-6-7.2-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.2 3.4c0 4-3.8 7-7.2 10z" />
              </svg>
            </motion.button>
            <div>
              <p className="text-sm font-semibold text-slate-100">Likes: {likeCount}</p>
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
                {liked ? "You liked this app" : "Tap to like"}
              </p>
            </div>
          </div>
        </div>

        <p className="text-center text-xs uppercase tracking-[0.14em] text-slate-400 sm:text-left">
          Copyright @codershaswat 2026
        </p>
      </div>
    </footer>
  );
}
