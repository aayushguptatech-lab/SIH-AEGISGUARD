const HONEYPOT_PREFIXES = [
  "website",
  "contact_verify",
  "form_check",
  "company_url",
  "profile_link",
  "homepage",
];

function randomToken(length = 4) {
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < length; i += 1) {
    token += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return token;
}

function generateHoneypotFieldName() {
  const prefix =
    HONEYPOT_PREFIXES[Math.floor(Math.random() * HONEYPOT_PREFIXES.length)];
  return `${prefix}_${randomToken(4)}`;
}

function analyzeHoneypot(honeypotValue) {
  const value = typeof honeypotValue === "string" ? honeypotValue.trim() : "";
  const triggered = value.length > 0;

  return {
    triggered,
    honeypotScore: triggered ? 1 : 0,
  };
}

module.exports = {
  generateHoneypotFieldName,
  analyzeHoneypot,
};
