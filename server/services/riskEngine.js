const { clamp, round } = require("../utils/statistics");
const {
  getWeights,
  getHoneypotBoost,
  getRiskThreshold,
} = require("../config/weights");

function fuseRisk({ mouse, keyboard, honeypot }) {
  const weights = getWeights();
  const honeypotBoost = getHoneypotBoost();
  const threshold = getRiskThreshold();

  const mouseSuspicion = mouse.insufficientData
    ? 0.55
    : mouse.scores.mouseScore;
  const keyboardSuspicion = keyboard.insufficientData
    ? 0.55
    : keyboard.scores.keyboardScore;
  const honeypotSuspicion = honeypot.honeypotScore;

  let fused =
    mouseSuspicion * weights.mouse +
    keyboardSuspicion * weights.keyboard +
    honeypotSuspicion * weights.honeypot;

  if (honeypot.triggered) {
    fused = clamp(fused + honeypotBoost);
  }

  const riskScore = Math.round(fused * 100);
  const decision = riskScore >= threshold ? "BLOCK" : "ALLOW";

  return {
    riskScore,
    decision,
    threshold,
    weights: {
      mouse: round(weights.mouse, 3),
      keyboard: round(weights.keyboard, 3),
      honeypot: round(weights.honeypot, 3),
      honeypotBoost: round(honeypotBoost, 3),
    },
    components: {
      mouse: round(mouseSuspicion),
      keyboard: round(keyboardSuspicion),
      honeypot: honeypotSuspicion,
    },
  };
}

module.exports = {
  fuseRisk,
};
