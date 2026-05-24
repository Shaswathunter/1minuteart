const express = require("express");
const { getMyProgress } = require("../controllers/progressController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getMyProgress);

module.exports = router;
