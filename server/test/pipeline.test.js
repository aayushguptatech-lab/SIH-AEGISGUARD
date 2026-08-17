const { analyzeMouse } = require("../services/mouseAnalysis");
const { analyzeKeyboard } = require("../services/keyboardAnalysis");
const { analyzeHoneypot } = require("../services/honeypotAnalysis");
const { fuseRisk } = require("../services/riskEngine");

function humanMouse() {
  const points = [];
  let x = 120;
  let y = 160;
  let t = 1_000_000;
  for (let i = 0; i < 80; i += 1) {
    x += 4 + Math.sin(i / 3) * 9 + (i % 5) - 2;
    y += Math.cos(i / 4) * 7 + ((i * 3) % 5) - 2;
    t += 16 + (i % 7) * 3;
    points.push({ x, y, timestamp: t });
  }
  return points;
}

function botMouse() {
  const points = [];
  for (let i = 0; i <= 60; i += 1) {
    points.push({ x: 40 + i * 10, y: 50, timestamp: 2_000_000 + i * 8 });
  }
  return points;
}

function humanKeys() {
  const events = [];
  let t = 3_000_000;
  const dwells = [92, 118, 84, 141, 76, 129, 101, 155, 88, 134, 97, 162];
  const flights = [68, 142, 55, 210, 73, 188, 61, 124, 96, 175, 82];
  for (let i = 0; i < dwells.length; i += 1) {
    events.push({ keyDownTime: t, keyUpTime: t + dwells[i] });
    t += dwells[i] + (flights[i] || 0);
  }
  return events;
}

function botKeys() {
  const events = [];
  let t = 4_000_000;
  for (let i = 0; i < 18; i += 1) {
    events.push({ keyDownTime: t, keyUpTime: t + 40 });
    t += 65;
  }
  return events;
}

function run(label, mousePoints, keyboardEvents, honeypotValue) {
  const mouse = analyzeMouse(mousePoints);
  const keyboard = analyzeKeyboard(keyboardEvents);
  const honeypot = analyzeHoneypot(honeypotValue);
  const risk = fuseRisk({ mouse, keyboard, honeypot });
  console.log(`\n=== ${label} ===`);
  console.log("mouseScore", mouse.scores.mouseScore, mouse.labels);
  console.log("keyboardScore", keyboard.scores.keyboardScore, keyboard.labels);
  console.log("honeypot", honeypot);
  console.log("risk", risk.riskScore, risk.decision);
  return risk;
}

const human = run("HUMAN", humanMouse(), humanKeys(), "");
const bot = run("BOT", botMouse(), botKeys(), "http://bot.invalid");

if (human.riskScore >= bot.riskScore) {
  console.error("\nFAIL: human risk should be lower than bot risk");
  process.exit(1);
}
if (bot.decision !== "BLOCK") {
  console.error("\nFAIL: bot simulation should BLOCK");
  process.exit(1);
}
if (human.decision !== "ALLOW") {
  console.error("\nFAIL: human simulation should ALLOW");
  process.exit(1);
}

console.log("\nPASS: pipeline distinguishes human vs bot without hardcoded scores");
