require("dotenv").config();

const connectDB = require("../config/db");
const Lesson = require("../models/Lesson");
const LessonStep = require("../models/LessonStep");

const lessonData = [
  {
    title: "How to draw a skull in 1 minute",
    slug: "draw-skull-1-minute",
    category: "anatomy",
    difficulty: "beginner"
  },
  {
    title: "How to draw an eye in 1 minute",
    slug: "draw-eye-1-minute",
    category: "facial-features",
    difficulty: "beginner"
  },
  {
    title: "How to draw a rose in 1 minute",
    slug: "draw-rose-1-minute",
    category: "nature",
    difficulty: "beginner"
  },
  {
    title: "How to draw anime face in 1 minute",
    slug: "draw-anime-face-1-minute",
    category: "anime",
    difficulty: "intermediate"
  }
];

const stepTemplates = {
  "draw-skull-1-minute": [
    "Draw a rough circle and flatten the bottom for jaw area.",
    "Add center and eye-line guidelines for symmetry.",
    "Sketch eye sockets, nose cavity and jaw outline.",
    "Darken key lines and add quick shading in sockets."
  ],
  "draw-eye-1-minute": [
    "Draw a light almond shape for the eye outer contour.",
    "Mark iris and pupil with a tiny highlight space.",
    "Add eyelids and a few lashes for depth.",
    "Shade upper lid and iris lightly for volume."
  ],
  "draw-rose-1-minute": [
    "Start with a tiny spiral for the center bud.",
    "Add surrounding petal curves in loose C-shapes.",
    "Expand with larger outer petals unevenly.",
    "Add stem hint and light shadow under petals."
  ],
  "draw-anime-face-1-minute": [
    "Draw a circle with tapered chin to form face base.",
    "Add centerline and eye guideline slightly low.",
    "Place big anime eyes and a minimal nose-mouth.",
    "Add quick hair silhouette and clean main lines."
  ]
};

const seed = async () => {
  try {
    await connectDB();

    await LessonStep.deleteMany({});
    await Lesson.deleteMany({});

    const insertedLessons = await Lesson.insertMany(lessonData);
    const stepsToInsert = [];

    insertedLessons.forEach((lesson) => {
      const template = stepTemplates[lesson.slug] || [];

      template.forEach((text, index) => {
        stepsToInsert.push({
          lessonId: lesson._id,
          stepNo: index + 1,
          text,
          sec: 15
        });
      });
    });

    await LessonStep.insertMany(stepsToInsert);

    console.log(`Seed complete: ${insertedLessons.length} lessons and ${stepsToInsert.length} steps inserted.`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
