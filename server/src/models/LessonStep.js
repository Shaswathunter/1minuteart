const mongoose = require("mongoose");

const lessonStepSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
      index: true
    },
    stepNo: {
      type: Number,
      required: true,
      min: 1
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    imageUrl: {
      type: String,
      default: ""
    },
    sec: {
      type: Number,
      default: 15
    }
  },
  { timestamps: false }
);

lessonStepSchema.index({ lessonId: 1, stepNo: 1 }, { unique: true });

module.exports = mongoose.model("LessonStep", lessonStepSchema);
