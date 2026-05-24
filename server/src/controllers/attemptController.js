const Attempt = require("../models/Attempt");
const Lesson = require("../models/Lesson");
const User = require("../models/User");

const toStartOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const createAttempt = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { lessonId, timeTaken = 60, score = null } = req.body;
    const safeScore = Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null;

    if (!lessonId) {
      return res.status(400).json({ message: "lessonId is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    const previousAttempt = await Attempt.findOne({ userId }).sort({ completedAt: -1 });

    const attempt = await Attempt.create({
      userId,
      lessonId,
      timeTaken,
      score: safeScore
    });

    const user = await User.findById(userId);
    if (user) {
      const today = toStartOfDay(new Date());
      let nextStreak = 1;

      if (previousAttempt) {
        const previousDay = toStartOfDay(new Date(previousAttempt.completedAt));
        const diffInDays = Math.round((today - previousDay) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
          nextStreak = user.streak || 1;
        } else if (diffInDays === 1) {
          nextStreak = (user.streak || 0) + 1;
        }
      }

      user.streak = nextStreak;
      if (!user.completedLessons.some((completed) => completed.toString() === lessonId)) {
        user.completedLessons.push(lessonId);
      }
      await user.save();
    }

    return res.status(201).json({ attempt });
  } catch (error) {
    return next(error);
  }
};

module.exports = { createAttempt };
