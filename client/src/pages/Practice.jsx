import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "motion/react";

import PageLoader from "../components/branding/PageLoader";
import GuidedDrawingBoard from "../components/canvas/GuidedDrawingBoard";
import StepCard from "../components/lesson/StepCard";
import useTimer from "../hooks/useTimer";
import { useAuth } from "../context/AuthContext";
import { fetchLessonBySlug } from "../services/lessonService";
import { createAttempt } from "../services/attemptService";
import { DEFAULT_DURATION } from "../utils/constants";

export default function Practice() {
  const { slug } = useParams();
  const { isAuthenticated } = useAuth();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [doneText, setDoneText] = useState("");
  const [practiceMode, setPracticeMode] = useState("learn");
  const [guidedStepIndex, setGuidedStepIndex] = useState(0);
  const [liveScore, setLiveScore] = useState(0);
  const [finalScore, setFinalScore] = useState(null);
  const completionRef = useRef(false);

  const duration = lesson?.durationSec || DEFAULT_DURATION;
  const { timeLeft, isRunning, start, pause, reset } = useTimer(duration);

  useEffect(() => {
    const loadLesson = async () => {
      try {
        setError("");
        const data = await fetchLessonBySlug(slug);
        setLesson(data);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load lesson");
      }
    };

    loadLesson();
  }, [slug]);

  useEffect(() => {
    if (lesson?.durationSec) {
      reset(lesson.durationSec);
      completionRef.current = false;
      setDoneText("");
      setGuidedStepIndex(0);
      setLiveScore(0);
      setFinalScore(null);
    }
  }, [lesson, reset]);

  const challengeStep = useMemo(() => {
    if (!lesson?.steps?.length) {
      return 0;
    }
    const elapsed = duration - timeLeft;
    const perStep = Math.max(Math.floor(duration / lesson.steps.length), 1);
    return Math.min(Math.floor(elapsed / perStep), lesson.steps.length - 1);
  }, [duration, lesson, timeLeft]);

  const activeStep = practiceMode === "learn" ? guidedStepIndex : challengeStep;

  const resetSubmissionState = (message = "") => {
    completionRef.current = false;
    setFinalScore(null);
    setDoneText(message);
  };

  const submitAttempt = async () => {
    if (!lesson || completionRef.current) {
      return;
    }

    completionRef.current = true;
    setSaving(true);
    const score = Math.max(0, Math.min(100, Math.round(liveScore || 0)));
    const timeTaken = duration - timeLeft;
    setFinalScore(score);

    try {
      if (isAuthenticated) {
        await createAttempt({
          lessonId: lesson._id,
          timeTaken,
          score
        });
        setDoneText(`Great work. Score ${score}/100 saved to your account.`);
      } else {
        setDoneText(`Your score is ${score}/100. Login to save this score.`);
      }
    } catch (err) {
      setDoneText(err?.response?.data?.message || "Attempt save failed.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (practiceMode === "challenge" && timeLeft === 0 && lesson && !completionRef.current) {
      pause();
      submitAttempt();
    }
  }, [lesson, pause, practiceMode, timeLeft]);

  if (error) {
    return <p className="glass-card border-ember/30 text-ember">{error}</p>;
  }

  if (!lesson) {
    return <PageLoader label="Loading guided practice board..." />;
  }

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <motion.div className="glass-card space-y-5" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
        <div className="space-y-3">
          <p className="neo-subbrand mb-3">NEOROX Arts Training</p>
          <h2 className="mb-2 font-logo text-3xl uppercase tracking-[0.1em] leading-tight">{lesson.title}</h2>
          <p className="text-sm text-slate-300">
            Learn mode me artist autoplay stroke guide dekhte jao. Challenge mode me 60-second speed practice karo.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              className={practiceMode === "learn" ? "btn-primary" : "btn-ghost"}
              onClick={() => setPracticeMode("learn")}
            >
              Learn Mode
            </button>
            <button
              type="button"
              className={practiceMode === "challenge" ? "btn-secondary" : "btn-ghost"}
              onClick={() => setPracticeMode("challenge")}
            >
              Challenge Mode
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-gradient-to-r from-sky-600/60 via-indigo-600/55 to-violet-700/60 p-4 text-white">
          <div className="absolute inset-0 animate-pulse-soft bg-white/10" />
          <div className="relative flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em]">Time Left</p>
              <p className="text-4xl font-extrabold leading-none sm:text-5xl">{timeLeft}s</p>
            </div>
            <div className="rounded-xl border border-white/30 bg-black/20 px-3 py-1.5 text-right">
              <p className="text-[11px] uppercase tracking-[0.16em] text-sky-100">Scoring</p>
              <p className="text-sm text-white">Submit ke baad score show hoga</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
          <button
            type="button"
            className="btn-primary"
            onClick={start}
            disabled={practiceMode !== "challenge" || isRunning || timeLeft === 0}
          >
            Start
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={pause}
            disabled={practiceMode !== "challenge" || !isRunning}
          >
            Pause
          </button>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => {
              resetSubmissionState("");
              reset(duration);
            }}
            disabled={practiceMode !== "challenge"}
          >
            Reset
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={submitAttempt}
            disabled={saving || completionRef.current}
          >
            {saving ? "Submitting..." : isAuthenticated ? "Submit Score" : "Show Score"}
          </button>
        </div>

        {!isAuthenticated ? (
          <p className="text-sm text-slate-300">
            Attempt save karne ke liye please <Link to="/login">login</Link> karo.
          </p>
        ) : null}
        {doneText ? <p className="text-sm font-medium text-sky-200">{doneText}</p> : null}
        {finalScore !== null ? (
          <div className="rounded-2xl border border-sky-300/30 bg-sky-500/10 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">Submitted Score</p>
            <p className="font-logo text-4xl text-white">{finalScore}/100</p>
            <button
              type="button"
              className="btn-ghost mt-3"
              onClick={() => resetSubmissionState("Draw update hua to phir se submit karo.")}
            >
              Recalculate & Submit Again
            </button>
          </div>
        ) : null}

        <h3 className="text-xl">Guided Steps ({practiceMode === "learn" ? "Auto Playback" : "Timer Sync"})</h3>
        <div className="grid gap-3">
          {lesson.steps?.map((step, index) => (
            <StepCard key={step._id} step={step} isActive={index === activeStep} />
          ))}
        </div>
      </motion.div>

      <motion.div
        className="glass-card space-y-3"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="font-logo text-2xl uppercase tracking-[0.08em]">Practice Canvas</h3>
        <p className="text-sm text-slate-300">
          Auto artist strokes ke saath watch + trace flow follow karo. Ghost overlay aur trace mode beginner learning
          ke liye optimized hain.
        </p>
        <GuidedDrawingBoard
          lessonSlug={lesson.slug}
          lessonStepsCount={lesson.steps?.length || 4}
          onStepChange={setGuidedStepIndex}
          onScoreChange={(score) => {
            setLiveScore(score);
            if (completionRef.current) {
              completionRef.current = false;
              setDoneText("Drawing update detect hua. Naya score submit kar sakte ho.");
              setFinalScore(null);
            }
          }}
          onDrawingActivity={() => {
            if (completionRef.current) {
              completionRef.current = false;
              setFinalScore(null);
            }
          }}
          onSubmit={submitAttempt}
          submitLabel={saving ? "Submitting..." : isAuthenticated ? "Submit Score" : "Show Score"}
          submitDisabled={saving || completionRef.current}
        />
      </motion.div>
    </section>
  );
}
