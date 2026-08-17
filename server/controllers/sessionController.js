const crypto = require("crypto");
const AnalysisSession = require("../models/AnalysisSession");
const { generateHoneypotFieldName } = require("../services/honeypotAnalysis");

function isMongoReady() {
  return AnalysisSession.db && AnalysisSession.db.readyState === 1;
}

async function startSession(req, res) {
  try {
    const sessionId = crypto.randomUUID();
    const honeypotFieldName = generateHoneypotFieldName();

    if (isMongoReady()) {
      await AnalysisSession.create({
        sessionId,
        honeypotFieldName,
        decision: "PENDING",
      });
    }

    return res.status(201).json({
      sessionId,
      honeypotFieldName,
      persisted: isMongoReady(),
    });
  } catch (error) {
    return res.status(500).json({ error: "Unable to start session." });
  }
}

module.exports = {
  startSession,
};
