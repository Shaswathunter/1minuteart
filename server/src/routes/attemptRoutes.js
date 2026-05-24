const express = require("express");
const { createAttempt } = require("../controllers/attemptController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, createAttempt);

module.exports = router;
