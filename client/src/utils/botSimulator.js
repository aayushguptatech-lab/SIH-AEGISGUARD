function createStraightPath(startX, startY, endX, endY, steps, startTime, interval) {
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = i / steps;
    points.push({
      x: startX + (endX - startX) * t,
      y: startY + (endY - startY) * t,
      timestamp: startTime + i * interval,
    });
  }
  return points;
}

export function generateBotMousePoints(now = Date.now()) {
  const first = createStraightPath(40, 40, 720, 80, 24, now, 8);
  const second = createStraightPath(720, 80, 80, 420, 24, now + 200, 8);
  const third = createStraightPath(80, 420, 640, 460, 24, now + 400, 8);
  return [...first, ...second, ...third];
}

export function generateBotKeyboardEvents(now = Date.now()) {
  const events = [];
  const dwell = 40;
  const flight = 25;
  for (let i = 0; i < 18; i += 1) {
    const keyDownTime = now + i * (dwell + flight);
    events.push({
      keyDownTime,
      keyUpTime: keyDownTime + dwell,
    });
  }
  return events;
}

export function generateBotHoneypotValue() {
  return "http://automated-filler.invalid";
}
