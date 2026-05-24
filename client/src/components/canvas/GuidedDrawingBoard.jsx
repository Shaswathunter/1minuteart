import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

import { getLessonVisualGuide } from "../../utils/lessonVisualGuides";

const BOARD_WIDTH = 640;
const BOARD_HEIGHT = 420;

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const distance = (a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return Math.sqrt(dx * dx + dy * dy);
};

const distanceSq = (a, b) => {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  return dx * dx + dy * dy;
};

const scaledPoint = ([x, y]) => [x * BOARD_WIDTH, y * BOARD_HEIGHT];

const flattenGuidePoints = (steps) =>
  steps.flatMap((step) => step.strokes.flatMap((stroke) => stroke.points || []));

const calculateDrawingScore = (userPoints, targetPoints) => {
  if (!userPoints.length || !targetPoints.length) {
    return 0;
  }

  const coverageRadiusSq = 0.035 * 0.035;
  const precisionRadiusSq = 0.04 * 0.04;

  let coverageHits = 0;
  for (let i = 0; i < targetPoints.length; i += 1) {
    const target = targetPoints[i];
    let matched = false;

    for (let j = 0; j < userPoints.length; j += 1) {
      if (distanceSq(target, userPoints[j]) <= coverageRadiusSq) {
        matched = true;
        break;
      }
    }

    if (matched) {
      coverageHits += 1;
    }
  }

  let precisionHits = 0;
  for (let i = 0; i < userPoints.length; i += 1) {
    const point = userPoints[i];
    let onShape = false;

    for (let j = 0; j < targetPoints.length; j += 1) {
      if (distanceSq(point, targetPoints[j]) <= precisionRadiusSq) {
        onShape = true;
        break;
      }
    }

    if (onShape) {
      precisionHits += 1;
    }
  }

  const coverage = coverageHits / targetPoints.length;
  const precision = precisionHits / userPoints.length;
  const density = clamp(userPoints.length / Math.max(targetPoints.length * 0.75, 1), 0, 1);
  const oversketch = clamp((userPoints.length - targetPoints.length * 1.35) / Math.max(targetPoints.length, 1), 0, 1);
  const undersketch = clamp((targetPoints.length * 0.45 - userPoints.length) / Math.max(targetPoints.length, 1), 0, 1);
  const cleanliness = clamp(1 - oversketch * 0.7 - undersketch * 0.8, 0, 1);

  const rawScore = coverage * 0.56 + precision * 0.27 + density * 0.1 + cleanliness * 0.07;
  const scaled = rawScore * 98;
  return Math.round(clamp(scaled, 0, 98));
};

const drawStrokeUntilProgress = (ctx, stroke, progress = 1, alpha = 1, color = "#55beff") => {
  const points = (stroke.points || []).map(scaledPoint);
  if (points.length < 2) {
    return;
  }

  let totalLength = 0;
  for (let i = 1; i < points.length; i += 1) {
    totalLength += distance(points[i - 1], points[i]);
  }

  const target = totalLength * clamp(progress, 0, 1);
  let drawn = 0;

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = stroke.width || 4;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 1; i < points.length; i += 1) {
    const segmentLength = distance(points[i - 1], points[i]);
    if (drawn + segmentLength <= target) {
      ctx.lineTo(points[i][0], points[i][1]);
      drawn += segmentLength;
      continue;
    }

    const remain = target - drawn;
    const ratio = segmentLength === 0 ? 0 : remain / segmentLength;
    const x = points[i - 1][0] + (points[i][0] - points[i - 1][0]) * ratio;
    const y = points[i - 1][1] + (points[i][1] - points[i - 1][1]) * ratio;
    ctx.lineTo(x, y);
    break;
  }

  ctx.stroke();
  ctx.restore();
};

const drawFullStroke = (ctx, stroke, alpha = 1, color = "#8aa5d6") => {
  drawStrokeUntilProgress(ctx, stroke, 1, alpha, color);
};

const clearCanvas = (canvas) => {
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const drawPath = (ctx, normalizedPoints, width, color = "#f1f5ff") => {
  if (!normalizedPoints || normalizedPoints.length < 2) {
    return;
  }

  const points = normalizedPoints.map(scaledPoint);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);

  for (let i = 1; i < points.length; i += 1) {
    ctx.lineTo(points[i][0], points[i][1]);
  }

  ctx.stroke();
  ctx.restore();
};

export default function GuidedDrawingBoard({
  lessonSlug,
  lessonStepsCount = 4,
  onStepChange,
  onScoreChange,
  onDrawingActivity,
  onSubmit,
  submitLabel = "Submit Score",
  submitDisabled = false
}) {
  const guide = useMemo(() => getLessonVisualGuide(lessonSlug, lessonStepsCount), [lessonSlug, lessonStepsCount]);
  const totalSteps = guide.steps.length;
  const allTargetPoints = useMemo(() => flattenGuidePoints(guide.steps), [guide.steps]);

  const userCanvasRef = useRef(null);
  const ghostCanvasRef = useRef(null);
  const guideCanvasRef = useRef(null);
  const currentStrokeRef = useRef([]);
  const playbackRef = useRef({
    stepIndex: 0,
    progress: 0
  });
  const lastTimeRef = useRef(null);
  const rafRef = useRef(null);
  const isDrawingRef = useRef(false);

  const [strokeHistory, setStrokeHistory] = useState([]);
  const [brushSize, setBrushSize] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepProgress, setStepProgress] = useState(0);
  const [showGhost, setShowGhost] = useState(true);
  const [traceMode, setTraceMode] = useState(true);
  const activeStep = guide.steps[activeStepIndex] || guide.steps[0];

  const syncExternalStep = (stepIndex) => {
    if (typeof onStepChange === "function") {
      onStepChange(stepIndex);
    }
  };

  const syncExternalScore = (score) => {
    if (typeof onScoreChange === "function") {
      onScoreChange(score);
    }
  };

  const notifyDrawingActivity = () => {
    if (typeof onDrawingActivity === "function") {
      onDrawingActivity();
    }
  };

  const setupCanvasSize = () => {
    [userCanvasRef.current, ghostCanvasRef.current, guideCanvasRef.current].forEach((canvas) => {
      if (!canvas) {
        return;
      }
      canvas.width = BOARD_WIDTH;
      canvas.height = BOARD_HEIGHT;
    });
  };

  useEffect(() => {
    setupCanvasSize();
    clearCanvas(userCanvasRef.current);
    clearCanvas(ghostCanvasRef.current);
    clearCanvas(guideCanvasRef.current);
    setStrokeHistory([]);
    setActiveStepIndex(0);
    setStepProgress(0);
    setIsPlaying(true);
    playbackRef.current = { stepIndex: 0, progress: 0 };
    currentStrokeRef.current = [];
    syncExternalStep(0);
    syncExternalScore(0);
  }, [lessonSlug]);

  useEffect(() => {
    clearCanvas(ghostCanvasRef.current);
    if (!showGhost) {
      return;
    }

    const ghostCanvas = ghostCanvasRef.current;
    if (!ghostCanvas) {
      return;
    }
    const ctx = ghostCanvas.getContext("2d");

    guide.steps.forEach((step) => {
      step.strokes.forEach((stroke) => {
        drawFullStroke(ctx, stroke, 0.2, "#788ab8");
      });
    });
  }, [guide.steps, showGhost]);

  useEffect(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) {
      return;
    }

    clearCanvas(canvas);
    const ctx = canvas.getContext("2d");

    if (!activeStep) {
      return;
    }

    if (traceMode) {
      activeStep.strokes.forEach((stroke) => {
        drawFullStroke(ctx, stroke, 0.25, "#8a80ff");
      });
    }

    activeStep.strokes.forEach((stroke) => {
      drawStrokeUntilProgress(ctx, stroke, stepProgress, 0.95, "#58d0ff");
    });
  }, [activeStep, stepProgress, traceMode]);

  useEffect(() => {
    if (!isPlaying) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      return undefined;
    }

    const durationPerStep = 2600 / playbackSpeed;

    const animate = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const delta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const state = playbackRef.current;
      let nextProgress = state.progress + delta / durationPerStep;
      let nextStep = state.stepIndex;

      if (nextProgress >= 1) {
        if (nextStep < totalSteps - 1) {
          nextStep += 1;
          nextProgress = 0;
        } else {
          nextProgress = 1;
          setIsPlaying(false);
        }
      }

      playbackRef.current = {
        stepIndex: nextStep,
        progress: nextProgress
      };

      setActiveStepIndex(nextStep);
      setStepProgress(nextProgress);
      syncExternalStep(nextStep);

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      lastTimeRef.current = null;
    };
  }, [isPlaying, playbackSpeed, totalSteps]);

  useEffect(() => {
    const canvas = userCanvasRef.current;
    if (!canvas) {
      return;
    }
    clearCanvas(canvas);
    const ctx = canvas.getContext("2d");
    strokeHistory.forEach((stroke) => drawPath(ctx, stroke.points, stroke.width));

    const flattenedUserPoints = strokeHistory.flatMap((stroke) => stroke.points);
    const score = calculateDrawingScore(flattenedUserPoints, allTargetPoints);
    syncExternalScore(score);
  }, [strokeHistory, allTargetPoints]);

  const pointFromEvent = (event) => {
    const canvas = userCanvasRef.current;
    if (!canvas) {
      return [0, 0];
    }
    const rect = canvas.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    return [x, y];
  };

  const startDrawing = (event) => {
    const canvas = userCanvasRef.current;
    if (!canvas) {
      return;
    }
    isDrawingRef.current = true;
    const startPoint = pointFromEvent(event);
    currentStrokeRef.current = [startPoint];

    const ctx = canvas.getContext("2d");
    drawPath(ctx, [startPoint, startPoint], brushSize);
  };

  const drawUserStroke = (event) => {
    if (!isDrawingRef.current) {
      return;
    }

    const canvas = userCanvasRef.current;
    if (!canvas) {
      return;
    }

    const nextPoint = pointFromEvent(event);
    const points = currentStrokeRef.current;
    points.push(nextPoint);

    if (points.length < 2) {
      return;
    }

    const ctx = canvas.getContext("2d");
    const from = points[points.length - 2];
    const to = points[points.length - 1];
    drawPath(ctx, [from, to], brushSize);
  };

  const stopDrawing = () => {
    if (!isDrawingRef.current) {
      return;
    }
    isDrawingRef.current = false;

    const strokePoints = currentStrokeRef.current;
    currentStrokeRef.current = [];

    if (strokePoints.length < 2) {
      return;
    }

    setStrokeHistory((prev) => [
      ...prev,
      {
        points: strokePoints,
        width: brushSize
      }
    ]);
    notifyDrawingActivity();
  };

  const undo = () => {
    setStrokeHistory((prev) => prev.slice(0, -1));
    notifyDrawingActivity();
  };

  const clear = () => {
    setStrokeHistory([]);
    notifyDrawingActivity();
  };

  const jumpToStep = (targetStep) => {
    const nextStep = clamp(targetStep, 0, totalSteps - 1);
    setActiveStepIndex(nextStep);
    setStepProgress(0);
    playbackRef.current = {
      stepIndex: nextStep,
      progress: 0
    };
    syncExternalStep(nextStep);
  };

  const replayCurrentStep = () => {
    setStepProgress(0);
    playbackRef.current = {
      stepIndex: activeStepIndex,
      progress: 0
    };
    setIsPlaying(true);
  };

  return (
    <section className="space-y-4">
      <div className="glass-card space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-primary flex-1 sm:flex-none" onClick={() => setIsPlaying((prev) => !prev)}>
            {isPlaying ? "Pause Playback" : "Auto Play"}
          </button>
          <button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={replayCurrentStep}>
            Replay Step
          </button>
          <button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={() => jumpToStep(activeStepIndex - 1)}>
            Prev
          </button>
          <button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={() => jumpToStep(activeStepIndex + 1)}>
            Next
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <label className="space-y-1 text-sm">
            <span className="font-semibold text-slate-200">Playback Speed</span>
            <input
              type="range"
              min={0.6}
              max={2}
              step={0.1}
              value={playbackSpeed}
              onChange={(event) => setPlaybackSpeed(Number(event.target.value))}
              className="w-full accent-accent"
            />
            <p className="text-xs text-slate-400">{playbackSpeed.toFixed(1)}x</p>
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-200">
            <input type="checkbox" checked={traceMode} onChange={(event) => setTraceMode(event.target.checked)} />
            Trace Mode
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-white/20 bg-slate-900/70 px-3 py-2 text-sm font-semibold text-slate-200">
            <input type="checkbox" checked={showGhost} onChange={(event) => setShowGhost(event.target.checked)} />
            Ghost Overlay
          </label>
        </div>

        <div className="grid gap-2 rounded-2xl border border-white/15 bg-slate-900/65 p-3 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
              Artist Playback: Step {activeStepIndex + 1}/{totalSteps} - {activeStep?.label || "Guide"}
            </p>
            <p className="text-sm text-slate-300">{activeStep?.tip}</p>
          </div>
          <div className="flex items-center justify-start sm:justify-end">
            <div className="rounded-xl border border-sky-300/35 bg-sky-500/10 px-4 py-2 text-right">
              <p className="text-[11px] uppercase tracking-[0.18em] text-sky-200">Scoring</p>
              <p className="text-sm text-slate-100">Score submit ke baad dikhega</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="brush-size" className="text-sm font-semibold text-slate-200">
            Brush
          </label>
          <input
            id="brush-size"
            type="range"
            min={1}
            max={14}
            value={brushSize}
            onChange={(event) => setBrushSize(Number(event.target.value))}
            className="w-36 accent-accent sm:w-44"
          />
          <button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={undo}>
            Undo
          </button>
          <button type="button" className="btn-ghost flex-1 sm:flex-none" onClick={clear}>
            Clear
          </button>
          <button
            type="button"
            className="btn-primary flex-1 sm:flex-none"
            onClick={onSubmit}
            disabled={submitDisabled}
          >
            {submitLabel}
          </button>
        </div>

        <motion.div
          whileHover={{ scale: 1.003 }}
          className="relative overflow-hidden rounded-2xl border border-white/20 bg-[#0c1020] shadow-inner shadow-black/50"
        >
          <canvas ref={ghostCanvasRef} className="pointer-events-none absolute inset-0 h-72 w-full sm:h-[420px]" />
          <canvas ref={guideCanvasRef} className="pointer-events-none absolute inset-0 h-72 w-full sm:h-[420px]" />
          <canvas
            ref={userCanvasRef}
            className="canvas-stroke relative z-10 block h-72 w-full sm:h-[420px]"
            onPointerDown={startDrawing}
            onPointerMove={drawUserStroke}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </motion.div>
      </div>
    </section>
  );
}
