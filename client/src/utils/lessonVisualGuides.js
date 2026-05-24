const arcPoints = (cx, cy, radius, startDeg, endDeg, segments = 24) => {
  const points = [];
  const start = (startDeg * Math.PI) / 180;
  const end = (endDeg * Math.PI) / 180;
  const step = (end - start) / Math.max(segments, 1);

  for (let i = 0; i <= segments; i += 1) {
    const angle = start + step * i;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }

  return points;
};

const linePoints = (x1, y1, x2, y2, segments = 2) => {
  const points = [];
  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    points.push([x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]);
  }
  return points;
};

const lessonGuides = {
  "draw-skull-1-minute": {
    steps: [
      {
        label: "Head Block",
        tip: "Top skull ko round rakho, neeche jaw shape drop karo.",
        strokes: [
          { width: 5, points: arcPoints(0.5, 0.36, 0.2, 190, 350, 30) },
          { width: 5, points: linePoints(0.7, 0.36, 0.65, 0.62, 8) },
          { width: 5, points: linePoints(0.65, 0.62, 0.35, 0.62, 10) },
          { width: 5, points: linePoints(0.35, 0.62, 0.3, 0.36, 8) }
        ]
      },
      {
        label: "Guidelines",
        tip: "Center line aur eye line proportion set karte hain.",
        strokes: [
          { width: 3, points: linePoints(0.5, 0.18, 0.5, 0.64, 10) },
          { width: 3, points: linePoints(0.32, 0.42, 0.68, 0.42, 10) }
        ]
      },
      {
        label: "Features",
        tip: "Sockets ko dark aur nose ko triangular cavity do.",
        strokes: [
          { width: 4, points: arcPoints(0.42, 0.44, 0.06, 180, 360, 14) },
          { width: 4, points: arcPoints(0.58, 0.44, 0.06, 180, 360, 14) },
          { width: 4, points: [[0.5, 0.46], [0.46, 0.54], [0.54, 0.54], [0.5, 0.46]] }
        ]
      },
      {
        label: "Finish",
        tip: "Jaw teeth hint aur quick shadows add karo.",
        strokes: [
          { width: 3, points: linePoints(0.36, 0.58, 0.64, 0.58, 12) },
          { width: 2, points: linePoints(0.42, 0.58, 0.42, 0.64, 4) },
          { width: 2, points: linePoints(0.5, 0.58, 0.5, 0.64, 4) },
          { width: 2, points: linePoints(0.58, 0.58, 0.58, 0.64, 4) },
          { width: 2, points: linePoints(0.37, 0.39, 0.45, 0.45, 6) },
          { width: 2, points: linePoints(0.55, 0.45, 0.63, 0.39, 6) }
        ]
      }
    ]
  },
  "draw-eye-1-minute": {
    steps: [
      {
        label: "Eye Outline",
        tip: "Almond shape pehle banao, corners soft rakho.",
        strokes: [
          { width: 5, points: arcPoints(0.5, 0.48, 0.18, 200, 340, 30) },
          { width: 4, points: arcPoints(0.5, 0.5, 0.17, 20, 160, 24) }
        ]
      },
      {
        label: "Iris + Pupil",
        tip: "Iris center me circle, pupil darker center me.",
        strokes: [
          { width: 3, points: arcPoints(0.5, 0.5, 0.08, 0, 360, 24) },
          { width: 6, points: arcPoints(0.5, 0.5, 0.03, 0, 360, 18) }
        ]
      },
      {
        label: "Lids + Lashes",
        tip: "Upper lid ko thicker stroke do for depth.",
        strokes: [
          { width: 5, points: arcPoints(0.5, 0.46, 0.19, 200, 340, 24) },
          { width: 3, points: linePoints(0.32, 0.47, 0.27, 0.44, 4) },
          { width: 3, points: linePoints(0.68, 0.47, 0.73, 0.44, 4) }
        ]
      },
      {
        label: "Shading",
        tip: "Upper iris shadow aur lower lid cast shadow add karo.",
        strokes: [
          { width: 2, points: linePoints(0.44, 0.5, 0.56, 0.5, 8) },
          { width: 2, points: linePoints(0.4, 0.56, 0.6, 0.56, 8) },
          { width: 2, points: linePoints(0.46, 0.38, 0.54, 0.38, 8) }
        ]
      }
    ]
  },
  "draw-rose-1-minute": {
    steps: [
      {
        label: "Center Spiral",
        tip: "Beech me tight spiral se flower core start karo.",
        strokes: [{ width: 4, points: arcPoints(0.5, 0.46, 0.05, 0, 680, 40) }]
      },
      {
        label: "Inner Petals",
        tip: "C-shaped petals spiral ke around wrap karo.",
        strokes: [
          { width: 4, points: arcPoints(0.46, 0.47, 0.1, 250, 60, 20) },
          { width: 4, points: arcPoints(0.56, 0.48, 0.1, 120, 300, 20) }
        ]
      },
      {
        label: "Outer Petals",
        tip: "Outer petals ko uneven rakho for natural look.",
        strokes: [
          { width: 4, points: arcPoints(0.5, 0.5, 0.18, 200, 340, 24) },
          { width: 4, points: arcPoints(0.5, 0.56, 0.16, 20, 160, 24) }
        ]
      },
      {
        label: "Stem + Shadow",
        tip: "Ek clean stem aur neeche halka ground shadow do.",
        strokes: [
          { width: 3, points: linePoints(0.5, 0.64, 0.5, 0.85, 8) },
          { width: 2, points: linePoints(0.42, 0.67, 0.58, 0.67, 8) },
          { width: 2, points: linePoints(0.44, 0.86, 0.58, 0.88, 8) }
        ]
      }
    ]
  },
  "draw-anime-face-1-minute": {
    steps: [
      {
        label: "Face Base",
        tip: "Circle + V chin se face block set karo.",
        strokes: [
          { width: 5, points: arcPoints(0.5, 0.35, 0.2, 185, 355, 30) },
          { width: 5, points: linePoints(0.32, 0.35, 0.5, 0.7, 12) },
          { width: 5, points: linePoints(0.5, 0.7, 0.68, 0.35, 12) }
        ]
      },
      {
        label: "Guides",
        tip: "Center line aur eye line set karo.",
        strokes: [
          { width: 3, points: linePoints(0.5, 0.16, 0.5, 0.72, 12) },
          { width: 3, points: linePoints(0.34, 0.44, 0.66, 0.44, 12) }
        ]
      },
      {
        label: "Eyes + Nose + Mouth",
        tip: "Eyes large rakho, nose-mouth minimal.",
        strokes: [
          { width: 4, points: arcPoints(0.42, 0.46, 0.06, 200, 340, 16) },
          { width: 4, points: arcPoints(0.58, 0.46, 0.06, 200, 340, 16) },
          { width: 3, points: linePoints(0.5, 0.54, 0.49, 0.57, 2) },
          { width: 3, points: linePoints(0.47, 0.62, 0.53, 0.62, 5) }
        ]
      },
      {
        label: "Hair Silhouette",
        tip: "Forehead pe layered bangs aur side locks add karo.",
        strokes: [
          { width: 4, points: arcPoints(0.5, 0.27, 0.24, 200, 340, 26) },
          { width: 4, points: linePoints(0.36, 0.25, 0.4, 0.52, 10) },
          { width: 4, points: linePoints(0.64, 0.25, 0.6, 0.52, 10) }
        ]
      }
    ]
  }
};

const createFallbackGuide = (stepsCount = 4) => ({
  steps: Array.from({ length: stepsCount }).map((_, index) => {
    const step = index + 1;
    const offset = 0.08 * index;
    return {
      label: `Step ${step}`,
      tip: "Shape observe karo, slow tracing ke saath confidence build karo.",
      strokes: [
        { width: 4, points: linePoints(0.22 + offset, 0.25 + offset, 0.78 - offset, 0.25 + offset, 12) },
        { width: 4, points: linePoints(0.78 - offset, 0.25 + offset, 0.78 - offset, 0.75 - offset, 12) },
        { width: 4, points: linePoints(0.78 - offset, 0.75 - offset, 0.22 + offset, 0.75 - offset, 12) },
        { width: 4, points: linePoints(0.22 + offset, 0.75 - offset, 0.22 + offset, 0.25 + offset, 12) }
      ]
    };
  })
});

export const getLessonVisualGuide = (slug, stepsCount = 4) => lessonGuides[slug] || createFallbackGuide(stepsCount);
