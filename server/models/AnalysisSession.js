const mongoose = require("mongoose");

const analysisSessionSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, unique: true, index: true },
    honeypotFieldName: { type: String },
    timestamp: { type: Date, default: Date.now },
    mouseFeatures: { type: mongoose.Schema.Types.Mixed },
    keyboardFeatures: { type: mongoose.Schema.Types.Mixed },
    honeypotTriggered: { type: Boolean, default: false },
    mouseScore: { type: Number },
    keyboardScore: { type: Number },
    riskScore: { type: Number },
    decision: { type: String, enum: ["ALLOW", "BLOCK", "PENDING"], default: "PENDING" },
    mode: { type: String, enum: ["human", "bot", "unknown"], default: "unknown" },
  },
  { versionKey: false }
);

module.exports = mongoose.model("AnalysisSession", analysisSessionSchema);
