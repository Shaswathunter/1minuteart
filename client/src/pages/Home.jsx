import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import PageLoader from "../components/branding/PageLoader";
import SketchStage from "../components/scene/SketchStage";
import { fetchLessons } from "../services/lessonService";

export default function Home() {
  const sectionRef = useRef(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadLessons = async () => {
      try {
        setLoading(true);
        const list = await fetchLessons();
        setLessons(list);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load lessons");
      } finally {
        setLoading(false);
      }
    };

    loadLessons();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      gsap.fromTo(
        ".js-reveal",
        { opacity: 0, y: 34 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%"
          }
        }
      );

      gsap.to(".js-parallax", {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          scrub: true
        }
      });
    }, sectionRef);

    return () => context.revert();
  }, [lessons.length]);

  return (
    <section ref={sectionRef} className="space-y-10">
      <div className="grid items-center gap-8 lg:grid-cols-2">
        <motion.div className="space-y-5" initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}>
          <span className="neo-subbrand">NEOROX Arts Edition</span>
          <h1 className="panel-title">
            1 Minute
            <span className="block bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
              Guided Drawing Engine
            </span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-slate-300">
            Har lesson me 60-second challenge hai. 4 clear steps, live timer, animated guidance aur drawing canvas ke
            saath speed + confidence dono improve hote hain. Watch, trace, repeat.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link className="btn-primary" to={lessons[0] ? `/practice/${lessons[0].slug}` : "/home"}>
              Enter Studio
            </Link>
            <Link className="btn-ghost" to="/progress">
              Track Progress
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="js-parallax"
          initial={{ opacity: 0, scale: 0.95, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8 }}
        >
          <SketchStage />
        </motion.div>
      </div>

      <div className="js-reveal mb-2 flex items-end justify-between">
        <h2 className="font-logo text-3xl uppercase tracking-[0.12em]">Practice Missions</h2>
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-400">Animated Artist Walkthrough</p>
      </div>

      {loading ? <PageLoader label="Loading lesson missions..." /> : null}
      {error ? <p className="glass-card js-reveal border-ember/30 text-ember">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson, index) => (
          <motion.article
            key={lesson._id}
            className="glass-card js-reveal flex h-full flex-col justify-between overflow-hidden"
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 210, damping: 18 }}
          >
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="tag-pill">{lesson.category}</span>
                <span className="tag-pill">{lesson.difficulty}</span>
                <span className="tag-pill">{lesson.durationSec}s</span>
              </div>
              <h3 className="mb-2 font-logo text-2xl uppercase tracking-[0.08em] text-slate-100">{lesson.title}</h3>
              <p className="mb-4 text-sm text-slate-300">
                NEOROX drill #{String(index + 1).padStart(2, "0")}. Follow, trace, then freestyle complete.
              </p>
            </div>
            <div className="mt-auto flex flex-wrap gap-2">
              <Link className="btn-secondary" to={`/lessons/${lesson.slug}`}>
                Open Lesson
              </Link>
              <Link className="btn-primary" to={`/practice/${lesson.slug}`}>
                Practice
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
