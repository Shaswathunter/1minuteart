const Lesson = require("../models/Lesson");
const LessonStep = require("../models/LessonStep");

const getLessons = async (req, res, next) => {
  try {
    const lessons = await Lesson.find({})
      .sort({ createdAt: -1 })
      .select("title slug category difficulty durationSec thumbnail");

    return res.status(200).json({ lessons });
  } catch (error) {
    return next(error);
  }
};

const getLessonBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const lesson = await Lesson.findOne({ slug });
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const steps = await LessonStep.find({ lessonId: lesson._id }).sort({ stepNo: 1 });

    return res.status(200).json({
      lesson: {
        ...lesson.toObject(),
        steps
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getLessons, getLessonBySlug };
