"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getDailyQuestion, getTodayKey } from "@/lib/questions";

const TIMER_DURATION = 5 * 60;

function getReflectionKey() {
  return `askthevoid_reflection_${getTodayKey()}`;
}

export default function Home() {
  const [question, setQuestion] = useState("");
  const [qIndex, setQIndex] = useState(0);
  const [qTotal, setQTotal] = useState(100);
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [time, setTime] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(TIMER_DURATION);
  const [timerActive, setTimerActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const { question: q, index, total } = getDailyQuestion();
    setQuestion(q);
    setQIndex(index);
    setQTotal(total);
    const stored = localStorage.getItem(getReflectionKey());
    if (stored) {
      setReflection(stored);
      setRevealed(true);
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const startTimer = useCallback(() => {
    if (timerActive || timerDone) return;
    setTimerActive(true);
    setGlowing(true);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          setTimerDone(true);
          setGlowing(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [timerActive, timerDone]);

  const handleReveal = () => {
    setRevealed(true);
    setTimeout(() => {
      textareaRef.current?.focus();
      startTimer();
    }, 400);
  };

  const handleSave = () => {
    localStorage.setItem(getReflectionKey(), reflection);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const timerProgress = 1 - secondsLeft / TIMER_DURATION;
  const r = 20;
  const circumference = 2 * Math.PI * r;
  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <main style={{ minHeight: "100svh", display: "flex", flexDirection: "column", backgroundColor: "#1a1712" }}>

      {/* Top bar */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 24px 12px",
        color: "#6b6158",
        fontSize: "12px",
        letterSpacing: "0.04em",
      }}>
        <span style={{ textTransform: "capitalize" }}>{date}</span>
        <span style={{ fontVariantNumeric: "tabular-nums", color: "#8a7a6a" }}>{time}</span>
      </div>

      {/* Progress bar */}
      <div style={{ padding: "0 24px", marginBottom: "4px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
          <span style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#5a4f44" }}>
            ask the void
          </span>
          <span style={{ fontSize: "10px", color: "#5a4f44" }}>
            {qIndex} / {qTotal}
          </span>
        </div>
        <div style={{ height: "1px", backgroundColor: "#2e2920", borderRadius: "1px" }}>
          <div style={{
            height: "100%",
            width: `${(qIndex / qTotal) * 100}%`,
            background: "linear-gradient(90deg, #c4621a, #e8902a)",
            borderRadius: "1px",
            transition: "width 1s ease",
          }} />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "24px 24px 32px" }}>

        {/* Question block */}
        <div style={{ flex: revealed ? "0 0 auto" : "1", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          {!revealed ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
              <div>
                <p style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontSize: "clamp(13px, 3.5vw, 16px)",
                  color: "#3a342e",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  marginBottom: "20px",
                }}>
                  Ta question du matin
                </p>
                <p style={{
                  fontFamily: "'Lora', Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(22px, 6vw, 36px)",
                  lineHeight: 1.55,
                  color: "#3d3530",
                  userSelect: "none",
                }}>
                  Prends un moment.<br />Respire.
                </p>
              </div>

              <button
                onClick={handleReveal}
                style={{
                  alignSelf: "flex-start",
                  padding: "14px 28px",
                  borderRadius: "100px",
                  border: "1px solid #c4621a",
                  backgroundColor: "transparent",
                  color: "#e8902a",
                  fontSize: "14px",
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  boxShadow: "0 0 20px rgba(196, 98, 26, 0.2), inset 0 0 20px rgba(196, 98, 26, 0.04)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={e => {
                  (e.target as HTMLButtonElement).style.boxShadow = "0 0 35px rgba(196, 98, 26, 0.45), inset 0 0 20px rgba(196, 98, 26, 0.08)";
                  (e.target as HTMLButtonElement).style.backgroundColor = "rgba(196, 98, 26, 0.08)";
                }}
                onMouseLeave={e => {
                  (e.target as HTMLButtonElement).style.boxShadow = "0 0 20px rgba(196, 98, 26, 0.2), inset 0 0 20px rgba(196, 98, 26, 0.04)";
                  (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                Révéler la question
              </button>

              <p style={{
                fontSize: "12px",
                color: "#3a342e",
                fontStyle: "italic",
                lineHeight: 1.7,
                marginTop: "16px",
              }}>
                &ldquo;La vie non examinée ne vaut pas d&apos;être vécue.&rdquo;
                <br />
                <span style={{ fontStyle: "normal", color: "#2e2920" }}>— Socrate</span>
              </p>
            </div>
          ) : (
            <div style={{ marginBottom: "28px" }}>
              <p style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#5a4f44",
                marginBottom: "14px",
              }}>
                Ta question du jour
              </p>
              <p style={{
                fontFamily: "'Lora', Georgia, serif",
                fontSize: "clamp(22px, 5.5vw, 32px)",
                lineHeight: 1.6,
                color: "#f0e4d4",
                letterSpacing: "-0.01em",
              }}>
                {question}
              </p>
            </div>
          )}
        </div>

        {/* Writing area */}
        {revealed && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "16px" }}>

            {/* Timer row */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <svg width="48" height="48" viewBox="0 0 48 48" style={{ flexShrink: 0 }}>
                <circle cx="24" cy="24" r={r} fill="none" stroke="#2e2920" strokeWidth="2" />
                <circle
                  cx="24" cy="24" r={r}
                  fill="none"
                  stroke={timerDone ? "#7aaa72" : "#e8902a"}
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - timerProgress)}
                  strokeLinecap="round"
                  transform="rotate(-90 24 24)"
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                    filter: timerActive ? "drop-shadow(0 0 6px rgba(232, 144, 42, 0.6))" : "none",
                  }}
                />
                <text x="24" y="28" textAnchor="middle" style={{
                  fontSize: "10px",
                  fill: timerDone ? "#7aaa72" : "#8a7a6a",
                  fontVariantNumeric: "tabular-nums",
                }}>
                  {timerDone ? "✓" : formatTime(secondsLeft)}
                </text>
              </svg>
              <span style={{ fontSize: "12px", color: "#5a4f44", lineHeight: 1.5 }}>
                {timerDone
                  ? "Bien. Prends le temps de relire."
                  : timerActive
                  ? "Écris sans t'arrêter."
                  : "5 minutes pour toi."}
              </span>
            </div>

            {/* Textarea */}
            <div style={{
              flex: 1,
              position: "relative",
              borderRadius: "12px",
              backgroundColor: "#201d18",
              border: `1px solid ${glowing ? "rgba(196, 98, 26, 0.4)" : "#2e2920"}`,
              boxShadow: glowing ? "0 0 30px rgba(196, 98, 26, 0.08), inset 0 0 30px rgba(196, 98, 26, 0.03)" : "none",
              transition: "border-color 0.4s ease, box-shadow 0.4s ease",
              minHeight: "220px",
            }}>
              <textarea
                ref={textareaRef}
                onFocus={startTimer}
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Écris ce qui vient, sans censure, sans jugement…"
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  padding: "18px",
                  fontSize: "16px",
                  lineHeight: 1.75,
                  color: "#d4c8b8",
                  fontWeight: 300,
                  caretColor: "#e8902a",
                }}
              />
            </div>

            {/* Bottom row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "11px", color: "#3a342e" }}>
                {reflection.trim().length > 0
                  ? `${reflection.trim().split(/\s+/).length} mots`
                  : ""}
              </span>
              <button
                onClick={handleSave}
                style={{
                  padding: "12px 28px",
                  borderRadius: "100px",
                  border: saved ? "1px solid #7aaa72" : "1px solid #c4621a",
                  backgroundColor: saved ? "rgba(122, 170, 114, 0.12)" : "rgba(196, 98, 26, 0.1)",
                  color: saved ? "#7aaa72" : "#e8902a",
                  fontSize: "14px",
                  letterSpacing: "0.04em",
                  cursor: "pointer",
                  boxShadow: saved
                    ? "0 0 20px rgba(122, 170, 114, 0.2)"
                    : "0 0 20px rgba(196, 98, 26, 0.15)",
                  transition: "all 0.4s ease",
                }}
              >
                {saved ? "Enregistré ✓" : "Sauvegarder"}
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
