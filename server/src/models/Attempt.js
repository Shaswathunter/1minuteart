const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    timeTaken: {
      type: Number,
      default: 60,
      min: 0,
      max: 600
    },
    score: {
      type: Number,
      default: null,
      min: 0,
      max: 100
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attempt", attemptSchema);
