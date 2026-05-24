import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

import PageLoader from "../components/branding/PageLoader";
import { fetchMyProgress } from "../services/progressService";

export default function Progress() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProgress = async () => {
      try {
        setLoading(true);
        const data = await fetchMyProgress();
        setProgress(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load progress");
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, []);

  if (loading) {
    return <PageLoader label="Loading your NEOROX stats..." />;
  }

  if (error) {
    return (
      <div className="glass-card border-ember/30">
        <p className="mb-3 text-ember">{error}</p>
        <Link className="btn-ghost" to="/login">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <section className="space-y-8">
      <div className="glass-card">
        <span className="neo-subbrand mb-3">NEOROX Arts Stats</span>
        <h1 className="panel-title">Practice Progress</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.article whileHover={{ y: -4 }} className="glass-card">
          <h3 className="font-logo text-4xl text-slate-50">{progress?.streak || 0}</h3>
          <p className="text-sm text-slate-300">Current Streak (days)</p>
        </motion.article>
        <motion.article whileHover={{ y: -4 }} className="glass-card">
          <h3 className="font-logo text-4xl text-slate-50">{progress?.completedCount || 0}</h3>
          <p className="text-sm text-slate-300">Completed Lessons</p>
        </motion.article>
        <motion.article whileHover={{ y: -4 }} className="glass-card">
          <h3 className="font-logo text-4xl text-slate-50">{progress?.attemptedCount || 0}</h3>
          <p className="text-sm text-slate-300">Attempted Lessons</p>
        </motion.article>
        <motion.article whileHover={{ y: -4 }} className="glass-card">
          <h3 className="font-logo text-4xl text-slate-50">{progress?.completionPercent || 0}%</h3>
          <p className="text-sm text-slate-300">Overall Completion</p>
        </motion.article>
      </div>

      <h2 className="font-logo text-3xl uppercase tracking-[0.1em]">Recent Attempts</h2>
      <div className="grid gap-3">
        {progress?.recentAttempts?.length ? (
          progress.recentAttempts.map((item) => (
            <article key={item._id} className="glass-card">
              <h4 className="mb-1 text-xl text-slate-100">{item.lessonId?.title || "Lesson"}</h4>
              <p className="mb-1 text-sm font-semibold text-sky-200">
                Score: {typeof item.score === "number" ? `${item.score}/100` : "N/A"}
              </p>
              <p className="text-sm text-slate-300">
                Time: {item.timeTaken}s | {new Date(item.completedAt).toLocaleString()}
              </p>
            </article>
          ))
        ) : (
          <p className="glass-card text-sm text-slate-300">No attempts yet. Start your first 1-minute practice.</p>
        )}
      </div>
    </section>
  );
}
