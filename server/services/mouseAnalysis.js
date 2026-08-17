const {
  mean,
  variance,
  stddev,
  coefficientOfVariation,
  max,
  clamp,
  round,
} = require("../utils/statistics");

function sanitizePoints(rawPoints) {
  if (!Array.isArray(rawPoints)) return [];

  return rawPoints
    .map((point) => ({
      x: Number(point.x),
      y: Number(point.y),
      timestamp: Number(point.timestamp),
    }))
    .filter(
      (point) =>
        Number.isFinite(point.x) &&
        Number.isFinite(point.y) &&
        Number.isFinite(point.timestamp)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

function emptyMouseResult(pointCount) {
  return {
    features: {
      movementCount: pointCount,
      totalDistance: 0,
      averageDistance: 0,
      averageVelocity: 0,
      maxVelocity: 0,
      velocityVariance: 0,
      averageAcceleration: 0,
      accelerationVariance: 0,
      directionChangeRatio: 0,
      xVariance: 0,
      yVariance: 0,
      jitterFrequency: 0,
    },
    scores: {
      velocity: 0.85,
      acceleration: 0.85,
      trajectory: 0.85,
      jitter: 0.85,
      mouseScore: 0.85,
    },
    labels: {
      velocity: "Insufficient data",
      acceleration: "Insufficient data",
      trajectory: "Insufficient data",
      jitter: "Insufficient data",
    },
    insufficientData: true,
  };
}

function analyzeMouse(rawPoints) {
  const points = sanitizePoints(rawPoints);
  if (points.length < 3) {
    return emptyMouseResult(points.length);
  }

  const derived = deriveMouseSignals(points);
  const velocityScore = scoreVelocity(
    derived.averageVelocity,
    derived.velocityCv,
    derived.maxVelocity
  );
  const accelerationScore = scoreAcceleration(
    derived.averageAcceleration,
    derived.accelerationVariance
  );
  const trajectoryScore = scoreTrajectory(
    derived.directionChangeRatio,
    derived.averageTurn
  );
  const jitterScore = scoreJitter(
    derived.jitterFrequency,
    derived.localJitter,
    derived.xVariance,
    derived.yVariance
  );

  const mouseScore = clamp(
    velocityScore * 0.3 +
      accelerationScore * 0.25 +
      trajectoryScore * 0.25 +
      jitterScore * 0.2
  );

  return {
    features: {
      movementCount: Math.max(0, points.length - 1),
      totalDistance: round(derived.totalDistance, 2),
      averageDistance: round(derived.averageDistance, 3),
      averageVelocity: round(derived.averageVelocity, 4),
      maxVelocity: round(derived.maxVelocity, 4),
      velocityVariance: round(derived.velocityVariance, 6),
      averageAcceleration: round(derived.averageAcceleration, 6),
      accelerationVariance: round(derived.accelerationVariance, 8),
      directionChangeRatio: round(derived.directionChangeRatio, 4),
      xVariance: round(derived.xVariance, 2),
      yVariance: round(derived.yVariance, 2),
      jitterFrequency: round(derived.jitterFrequency, 4),
    },
    scores: {
      velocity: round(velocityScore),
      acceleration: round(accelerationScore),
      trajectory: round(trajectoryScore),
      jitter: round(jitterScore),
      mouseScore: round(mouseScore),
    },
    labels: {
      velocity: labelFromScore(velocityScore, "velocity"),
      acceleration: labelFromScore(accelerationScore, "acceleration"),
      trajectory: labelFromScore(trajectoryScore, "trajectory"),
      jitter: labelFromScore(jitterScore, "jitter"),
    },
    insufficientData: false,
  };
}

function deriveMouseSignals(points) {
  const distances = [];
  const velocities = [];
  const accelerations = [];
  const angles = [];
  const microMoves = [];

  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dt = Math.max(curr.timestamp - prev.timestamp, 1);
    const distance = Math.sqrt(dx * dx + dy * dy);
    distances.push(distance);
    velocities.push(distance / dt);
    angles.push(Math.atan2(dy, dx));
    microMoves.push(distance > 0 && distance < 4 ? 1 : 0);
  }

  for (let i = 1; i < velocities.length; i += 1) {
    const dt = Math.max(points[i + 1].timestamp - points[i].timestamp, 1);
    accelerations.push((velocities[i] - velocities[i - 1]) / dt);
  }

  let directionChanges = 0;
  const turnAngles = [];
  for (let i = 1; i < angles.length; i += 1) {
    let delta = angles[i] - angles[i - 1];
    while (delta > Math.PI) delta -= 2 * Math.PI;
    while (delta < -Math.PI) delta += 2 * Math.PI;
    const absDelta = Math.abs(delta);
    turnAngles.push(absDelta);
    if (absDelta > 0.18) directionChanges += 1;
  }

  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);

  return {
    totalDistance: distances.reduce((sum, value) => sum + value, 0),
    averageDistance: mean(distances),
    averageVelocity: mean(velocities),
    maxVelocity: max(velocities),
    velocityVariance: variance(velocities),
    velocityCv: coefficientOfVariation(velocities),
    averageAcceleration: mean(accelerations.map(Math.abs)),
    accelerationVariance: variance(accelerations),
    directionChangeRatio:
      turnAngles.length === 0 ? 0 : directionChanges / turnAngles.length,
    averageTurn: mean(turnAngles),
    xVariance: variance(xs),
    yVariance: variance(ys),
    jitterFrequency: mean(microMoves),
    localJitter: stddev(distances.slice(0, Math.min(distances.length, 20))),
  };
}

function scoreVelocity(averageVelocity, velocityCv, maxVelocity) {
  let suspicion = 0;
  if (averageVelocity > 4.5) suspicion += 0.45;
  else if (averageVelocity > 2.8) suspicion += 0.25;
  else if (averageVelocity < 0.02) suspicion += 0.2;
  if (velocityCv < 0.12) suspicion += 0.4;
  else if (velocityCv < 0.25) suspicion += 0.2;
  else if (velocityCv > 0.35 && velocityCv < 1.8) suspicion -= 0.08;
  if (maxVelocity > 12) suspicion += 0.15;
  return clamp(suspicion);
}

function scoreAcceleration(averageAcceleration, accelerationVariance) {
  let suspicion = 0;
  if (averageAcceleration < 0.0004) suspicion += 0.35;
  if (accelerationVariance < 0.000002) suspicion += 0.4;
  else if (accelerationVariance > 0.00005) suspicion -= 0.08;
  if (averageAcceleration > 0.08) suspicion += 0.2;
  return clamp(suspicion);
}

function scoreTrajectory(directionChangeRatio, averageTurn) {
  let suspicion = 0;
  if (directionChangeRatio < 0.08) suspicion += 0.45;
  else if (directionChangeRatio < 0.18) suspicion += 0.22;
  if (averageTurn < 0.08) suspicion += 0.35;
  else if (averageTurn > 0.25 && averageTurn < 1.4) suspicion -= 0.08;
  return clamp(suspicion);
}

function scoreJitter(jitterFrequency, localJitter, xVariance, yVariance) {
  let suspicion = 0;
  if (jitterFrequency < 0.08) suspicion += 0.35;
  if (localJitter < 0.4) suspicion += 0.3;
  if (xVariance + yVariance < 80) suspicion += 0.15;
  if (jitterFrequency > 0.18 && localJitter > 1.2) suspicion -= 0.08;
  return clamp(suspicion);
}

function labelFromScore(score, kind) {
  if (kind === "trajectory") {
    if (score >= 0.7) return "Highly mechanical";
    if (score >= 0.45) return "Straight / low curvature";
    return "Natural curvature";
  }
  if (kind === "jitter") {
    if (score >= 0.7) return "Very low";
    if (score >= 0.45) return "Low";
    return "Human-like micro-movement";
  }
  if (kind === "velocity") {
    if (score >= 0.7) return "Suspicious";
    if (score >= 0.45) return "Somewhat uniform";
    return "Variable";
  }
  if (score >= 0.7) return "Suspicious";
  if (score >= 0.45) return "Somewhat uniform";
  return "Natural variation";
}

module.exports = {
  analyzeMouse,
};



