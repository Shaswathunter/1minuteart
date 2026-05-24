const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/authRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const attemptRoutes = require("./routes/attemptRoutes");
const progressRoutes = require("./routes/progressRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || "*";
const allowedOrigins = corsOrigin === "*" ? true : corsOrigin.split(",").map((item) => item.trim());

app.use(
  cors({
    origin: allowedOrigins
  })
);
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/lessons", lessonRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/progress", progressRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
