const AnalysisSession = require("../models/AnalysisSession");
const { analyzeMouse } = require("../services/mouseAnalysis");
const { analyzeKeyboard } = require("../services/keyboardAnalysis");
const { analyzeHoneypot } = require("../services/honeypotAnalysis");
const { fuseRisk } = require("../services/riskEngine");

function isMongoReady() {
  return AnalysisSession.db && AnalysisSession.db.readyState === 1;
}

async function analyzeInteraction(req, res) {
  try {
    const {
      sessionId,
      mousePoints,
      keyboardEvents,
      honeypotValue,
      mode,
    } = req.body || {};

    if (!sessionId) {
      return res.status(400).json({ error: "sessionId is required." });
    }

    const mouse = analyzeMouse(mousePoints);
    const keyboard = analyzeKeyboard(keyboardEvents);
    const honeypot = analyzeHoneypot(honeypotValue);
    const risk = fuseRisk({ mouse, keyboard, honeypot });

    if (isMongoReady()) {
      await AnalysisSession.findOneAndUpdate(
        { sessionId },
        {
          timestamp: new Date(),
          mouseFeatures: mouse.features,
          keyboardFeatures: keyboard.features,
          honeypotTriggered: honeypot.triggered,
          mouseScore: mouse.scores.mouseScore,
          keyboardScore: keyboard.scores.keyboardScore,
          riskScore: risk.riskScore,
          decision: risk.decision,
          mode: mode === "bot" ? "bot" : mode === "human" ? "human" : "unknown",
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    return res.json({
      riskScore: risk.riskScore,
      decision: risk.decision,
      threshold: risk.threshold,
      weights: risk.weights,
      analysis: {
        mouse: {
          score: mouse.scores.mouseScore,
          velocity: mouse.scores.velocity,
          acceleration: mouse.scores.acceleration,
          trajectory: mouse.scores.trajectory,
          jitter: mouse.scores.jitter,
          labels: mouse.labels,
          features: mouse.features,
          insufficientData: mouse.insufficientData,
        },
        keyboard: {
          score: keyboard.scores.keyboardScore,
          typingSpeed: keyboard.scores.typingSpeed,
          dwell: keyboard.scores.dwell,
          flight: keyboard.scores.flight,
          variance: keyboard.scores.variance,
          labels: keyboard.labels,
          features: keyboard.features,
          insufficientData: keyboard.insufficientData,
        },
        honeypot: {
          triggered: honeypot.triggered,
          score: honeypot.honeypotScore,
        },
      },
      persisted: isMongoReady(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Analysis failed." });
  }
}

module.exports = {
  analyzeInteraction,
};
