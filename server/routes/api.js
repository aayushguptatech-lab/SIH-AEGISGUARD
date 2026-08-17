const express = require("express");
const { startSession } = require("../controllers/sessionController");
const { analyzeInteraction } = require("../controllers/analyzeController");

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AegisGuard",
    role: "anti-bot-middleware",
    timestamp: new Date().toISOString(),
  });
});

router.post("/session/start", startSession);
router.post("/analyze", analyzeInteraction);

module.exports = router;
