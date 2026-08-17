const API_BASE = "/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

export function getHealth() {
  return request("/health");
}

export function startSession() {
  return request("/session/start", { method: "POST", body: JSON.stringify({}) });
}

export function analyzeSession(body) {
  return request("/analyze", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
