function parseWeight(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const weights = {
  mouse: parseWeight(process.env.WEIGHT_MOUSE, 0.4),
  keyboard: parseWeight(process.env.WEIGHT_KEYBOARD, 0.35),
  honeypot: parseWeight(process.env.WEIGHT_HONEYPOT, 0.25),
};

const honeypotBoost = parseWeight(process.env.HONEYPOT_BOOST, 0.25);
const riskThreshold = parseWeight(process.env.RISK_THRESHOLD, 50);

function getWeights() {
  const total = weights.mouse + weights.keyboard + weights.honeypot;
  if (total <= 0) {
    return { mouse: 0.4, keyboard: 0.35, honeypot: 0.25 };
  }

  return {
    mouse: weights.mouse / total,
    keyboard: weights.keyboard / total,
    honeypot: weights.honeypot / total,
  };
}

function getHoneypotBoost() {
  return honeypotBoost;
}

function getRiskThreshold() {
  return riskThreshold;
}

module.exports = {
  getWeights,
  getHoneypotBoost,
  getRiskThreshold,
};
