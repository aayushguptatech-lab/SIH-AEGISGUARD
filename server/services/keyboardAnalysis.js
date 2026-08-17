const {
  mean,
  variance,
  coefficientOfVariation,
  clamp,
  round,
} = require("../utils/statistics");

function sanitizeEvents(rawEvents) {
  if (!Array.isArray(rawEvents)) return [];

  return rawEvents
    .map((event) => ({
      keyDownTime: Number(event.keyDownTime),
      keyUpTime: Number(event.keyUpTime),
    }))
    .filter(
      (event) =>
        Number.isFinite(event.keyDownTime) &&
        Number.isFinite(event.keyUpTime) &&
        event.keyUpTime >= event.keyDownTime
    )
    .sort((a, b) => a.keyDownTime - b.keyDownTime);
}

function analyzeKeyboard(rawEvents) {
  const events = sanitizeEvents(rawEvents);

  if (events.length < 3) {
    return {
      features: {
        keystrokeCount: events.length,
        typingSpeed: 0,
        averageDwell: 0,
        dwellVariance: 0,
        averageFlight: 0,
        flightVariance: 0,
        dwellCv: 0,
        flightCv: 0,
      },
      scores: {
        typingSpeed: 0.8,
        dwell: 0.8,
        flight: 0.8,
        variance: 0.8,
        keyboardScore: 0.8,
      },
      labels: {
        typingSpeed: "Insufficient data",
        dwell: "Insufficient data",
        flight: "Insufficient data",
        variance: "Insufficient data",
      },
      insufficientData: true,
    };
  }

  const dwellTimes = events.map((event) => event.keyUpTime - event.keyDownTime);
  const flightTimes = [];

  for (let i = 1; i < events.length; i += 1) {
    flightTimes.push(events[i].keyDownTime - events[i - 1].keyUpTime);
  }

  const firstDown = events[0].keyDownTime;
  const lastUp = events[events.length - 1].keyUpTime;
  const totalTypingTime = Math.max(lastUp - firstDown, 1);
  const typingSpeed = events.length / (totalTypingTime / 1000);

  const averageDwell = mean(dwellTimes);
  const dwellVariance = variance(dwellTimes);
  const dwellCv = coefficientOfVariation(dwellTimes);
  const averageFlight = mean(flightTimes);
  const flightVariance = variance(flightTimes);
  const flightCv = coefficientOfVariation(flightTimes);

  const typingSpeedScore = scoreTypingSpeed(typingSpeed);
  const dwellScore = scoreDwell(averageDwell, dwellCv);
  const flightScore = scoreFlight(averageFlight, flightCv);
  const varianceScore = scoreVariance(dwellCv, flightCv, dwellVariance, flightVariance);

  const keyboardScore = clamp(
    typingSpeedScore * 0.3 +
      dwellScore * 0.25 +
      flightScore * 0.2 +
      varianceScore * 0.25
  );

  return {
    features: {
      keystrokeCount: events.length,
      typingSpeed: round(typingSpeed, 3),
      averageDwell: round(averageDwell, 2),
      dwellVariance: round(dwellVariance, 2),
      averageFlight: round(averageFlight, 2),
      flightVariance: round(flightVariance, 2),
      dwellCv: round(dwellCv, 4),
      flightCv: round(flightCv, 4),
    },
    scores: {
      typingSpeed: round(typingSpeedScore),
      dwell: round(dwellScore),
      flight: round(flightScore),
      variance: round(varianceScore),
      keyboardScore: round(keyboardScore),
    },
    labels: {
      typingSpeed: speedLabel(typingSpeed, typingSpeedScore),
      dwell: timingLabel(dwellScore, "dwell"),
      flight: timingLabel(flightScore, "flight"),
      variance: varianceLabel(varianceScore),
    },
    insufficientData: false,
  };
}

function scoreTypingSpeed(keysPerSecond) {
  if (keysPerSecond >= 14) return 0.95;
  if (keysPerSecond >= 10) return 0.8;
  if (keysPerSecond >= 7) return 0.55;
  if (keysPerSecond < 0.4) return 0.35;
  return clamp((keysPerSecond - 5) / 12);
}

function scoreDwell(averageDwell, dwellCv) {
  let suspicion = 0;
  if (averageDwell < 35) suspicion += 0.35;
  if (averageDwell > 420) suspicion += 0.2;
  if (dwellCv < 0.08) suspicion += 0.5;
  else if (dwellCv < 0.18) suspicion += 0.25;
  else if (dwellCv > 0.28) suspicion -= 0.08;
  return clamp(suspicion);
}

function scoreFlight(averageFlight, flightCv) {
  let suspicion = 0;
  if (averageFlight < 20) suspicion += 0.35;
  if (flightCv < 0.08) suspicion += 0.5;
  else if (flightCv < 0.2) suspicion += 0.22;
  else if (flightCv > 0.35) suspicion -= 0.08;
  return clamp(suspicion);
}

function scoreVariance(dwellCv, flightCv, dwellVariance, flightVariance) {
  let suspicion = 0;
  const avgCv = (dwellCv + flightCv) / 2;
  if (avgCv < 0.08) suspicion += 0.6;
  else if (avgCv < 0.18) suspicion += 0.3;
  if (dwellVariance < 40 && flightVariance < 80) suspicion += 0.25;
  return clamp(suspicion);
}

function speedLabel(keysPerSecond, score) {
  if (keysPerSecond >= 12) return "Extremely fast";
  if (score >= 0.55) return "Fast";
  if (keysPerSecond < 1) return "Very slow";
  return "Normal";
}

function timingLabel(score) {
  if (score >= 0.7) return "Highly uniform";
  if (score >= 0.45) return "Somewhat uniform";
  return "Natural variation";
}

function varianceLabel(score) {
  if (score >= 0.7) return "Highly uniform";
  if (score >= 0.45) return "Low variance";
  return "Human-like variance";
}

module.exports = {
  analyzeKeyboard,
};
