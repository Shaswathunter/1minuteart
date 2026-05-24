import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

import PageLoader from "../components/branding/PageLoader";
import StepCard from "../components/lesson/StepCard";
import { fetchLessonBySlug } from "../services/lessonService";

export default function LessonDetail() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchLessonBySlug(slug);
        setLesson(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load lesson");
      } finally {
        setLoading(false);
      }
    };

    loadLesson();
  }, [slug]);

  if (loading) {
    return <PageLoader label="Preparing visual breakdown..." />;
  }

  if (error) {
    return <p className="glass-card border-ember/30 text-ember">{error}</p>;
  }

  if (!lesson) {
    return <p className="glass-card border-ember/30 text-ember">Lesson not found.</p>;
  }

  return (
    <section className="space-y-6">
      <motion.div
        className="glass-card overflow-hidden bg-gradient-to-br from-slate-900/65 via-slate-950/55 to-indigo-950/50"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <span className="tag-pill">{lesson.category}</span>
          <span className="tag-pill">{lesson.difficulty}</span>
          <span className="tag-pill">{lesson.durationSec}s total</span>
        </div>
        <h1 className="mb-2 font-logo text-4xl uppercase tracking-[0.1em] text-slate-100">{lesson.title}</h1>
        <p className="text-sm text-slate-300">
          4 quick steps. Har step ko roughly 15 seconds do. Shape se start karo, details end me.
        </p>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-2">
        {lesson.steps?.map((step) => (
          <StepCard key={step._id} step={step} />
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link className="btn-primary" to={`/practice/${lesson.slug}`}>
          Start 1-Min Practice
        </Link>
        <Link className="btn-ghost" to="/home">
          Back to Lessons
        </Link>
      </div>
    </section>
  );
}
