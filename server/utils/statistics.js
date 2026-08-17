function mean(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function variance(values) {
  if (values.length < 2) return 0;
  const average = mean(values);
  const squared = values.reduce((sum, value) => sum + (value - average) ** 2, 0);
  return squared / (values.length - 1);
}

function stddev(values) {
  return Math.sqrt(variance(values));
}

function coefficientOfVariation(values) {
  const average = mean(values);
  if (average === 0) return 0;
  return stddev(values) / Math.abs(average);
}

function min(values) {
  if (!values.length) return 0;
  return Math.min(...values);
}

function max(values) {
  if (!values.length) return 0;
  return Math.max(...values);
}

function clamp(value, lo = 0, hi = 1) {
  return Math.min(hi, Math.max(lo, value));
}

function round(value, digits = 4) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function linearMap(value, inMin, inMax, outMin = 0, outMax = 1) {
  if (inMax === inMin) return outMin;
  const ratio = (value - inMin) / (inMax - inMin);
  return clamp(outMin + ratio * (outMax - outMin));
}

module.exports = {
  mean,
  variance,
  stddev,
  coefficientOfVariation,
  min,
  max,
  clamp,
  round,
  linearMap,
};
