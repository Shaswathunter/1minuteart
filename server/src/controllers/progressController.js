const Attempt = require("../models/Attempt");
const Lesson = require("../models/Lesson");
const User = require("../models/User");

const getMyProgress = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const [user, totalLessons, attemptedLessonIds, recentAttempts] = await Promise.all([
      User.findById(userId).select("streak completedLessons"),
      Lesson.countDocuments({}),
      Attempt.distinct("lessonId", { userId }),
      Attempt.find({ userId })
        .sort({ completedAt: -1 })
        .limit(5)
        .populate("lessonId", "title slug")
    ]);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const completedCount = user.completedLessons.length;
    const attemptedCount = attemptedLessonIds.length;
    const completionPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return res.status(200).json({
      progress: {
        streak: user.streak,
        completedCount,
        attemptedCount,
        totalLessons,
        completionPercent,
        recentAttempts
      }
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMyProgress };
