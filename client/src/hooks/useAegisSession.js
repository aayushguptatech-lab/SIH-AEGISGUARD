import { useCallback, useEffect, useRef, useState } from "react";
import { analyzeSession, startSession } from "../services/api.js";
import {
  generateBotHoneypotValue,
  generateBotKeyboardEvents,
  generateBotMousePoints,
} from "../utils/botSimulator.js";

export const emptyForm = { name: "", email: "", service: "" };

export function useAegisSession() {
  const [sessionId, setSessionId] = useState("");
  const [honeypotFieldName, setHoneypotFieldName] = useState("");
  const [honeypotValue, setHoneypotValue] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [mouseCount, setMouseCount] = useState(0);
  const [keyCount, setKeyCount] = useState(0);

  const mouseRef = useRef([]);
  const keyMapRef = useRef(new Map());
  const keyEventsRef = useRef([]);

  useEffect(() => {
    startSession()
      .then((session) => {
        setSessionId(session.sessionId);
        setHoneypotFieldName(session.honeypotFieldName);
      })
      .catch(() => setError("Unable to start AegisGuard session."));
  }, []);

  useEffect(() => {
    const onMove = (event) => {
      mouseRef.current.push({
        x: event.clientX,
        y: event.clientY,
        timestamp: Date.now(),
      });
      if (mouseRef.current.length > 800) {
        mouseRef.current = mouseRef.current.slice(-800);
      }
      setMouseCount(mouseRef.current.length);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const handleKeyDown = (event) => {
    if (event.repeat) return;
    keyMapRef.current.set(event.code, Date.now());
  };

  const handleKeyUp = (event) => {
    const keyDownTime = keyMapRef.current.get(event.code);
    if (!keyDownTime) return;
    keyMapRef.current.delete(event.code);
    keyEventsRef.current.push({ keyDownTime, keyUpTime: Date.now() });
    setKeyCount(keyEventsRef.current.length);
  };

  const resetTelemetry = () => {
    mouseRef.current = [];
    keyEventsRef.current = [];
    keyMapRef.current.clear();
    setMouseCount(0);
    setKeyCount(0);
    setHoneypotValue("");
    setResult(null);
    setForm(emptyForm);
  };

  const runAnalysis = useCallback(
    async ({ mousePoints, keyboardEvents, trapValue, mode }) => {
      setSubmitting(true);
      setError("");
      try {
        const payload = await analyzeSession({
          sessionId,
          mousePoints,
          keyboardEvents,
          honeypotValue: trapValue,
          mode,
        });
        setResult(payload);
      } catch (err) {
        setError(err.message);
      } finally {
        setSubmitting(false);
      }
    },
    [sessionId]
  );

  const submitHuman = async (event) => {
    event.preventDefault();
    await runAnalysis({
      mousePoints: mouseRef.current,
      keyboardEvents: keyEventsRef.current,
      trapValue: honeypotValue,
      mode: "human",
    });
  };

  const simulateBot = async () => {
    const now = Date.now();
    const botMouse = generateBotMousePoints(now);
    const botKeys = generateBotKeyboardEvents(now);
    const trapValue = generateBotHoneypotValue();
    mouseRef.current = botMouse;
    keyEventsRef.current = botKeys;
    setMouseCount(botMouse.length);
    setKeyCount(botKeys.length);
    setHoneypotValue(trapValue);
    await runAnalysis({
      mousePoints: botMouse,
      keyboardEvents: botKeys,
      trapValue,
      mode: "bot",
    });
  };

  return {
    honeypotFieldName,
    honeypotValue,
    setHoneypotValue,
    form,
    setForm,
    result,
    error,
    submitting,
    mouseCount,
    keyCount,
    handleKeyDown,
    handleKeyUp,
    resetTelemetry,
    submitHuman,
    simulateBot,
  };
}
