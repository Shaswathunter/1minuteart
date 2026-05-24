const express = require("express");
const { getLessons, getLessonBySlug } = require("../controllers/lessonController");

const router = express.Router();

router.get("/", getLessons);
router.get("/:slug", getLessonBySlug);

module.exports = router;
