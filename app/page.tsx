"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getDailyQuestion, getTodayKey } from "@/lib/questions";

const TIMER_DURATION = 5 * 60; // 5 minutes in seconds

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
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          setTimerActive(false);
          setTimerDone(true);
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
    }, 300);
  };

  const handleTextareaFocus = () => {
    startTimer();
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
  const circumference = 2 * Math.PI * 18;

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#f5f0e8", color: "#2a2520" }}
    >
      {/* Top bar */}
      <div
        className="flex justify-between items-center px-6 pt-8 pb-4"
        style={{ color: "#9a9088", fontSize: "13px", letterSpacing: "0.02em" }}
      >
        <span className="capitalize">{date}</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>{time}</span>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between px-6 pb-10">

        {/* Progress + label */}
        <div className="flex flex-col gap-3 mt-6">
          <div className="flex items-center justify-between">
            <span
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#c4a882",
              }}
            >
              question du jour
            </span>
            <span style={{ fontSize: "11px", color: "#c4a882" }}>
              {qIndex} / {qTotal}
            </span>
          </div>
          {/* Progress bar */}
          <div
            style={{
              height: "1px",
              backgroundColor: "#e8e0d4",
              borderRadius: "1px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(qIndex / qTotal) * 100}%`,
                backgroundColor: "#c4a882",
                transition: "width 0.8s ease",
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center py-10">
          {!revealed ? (
            <button
              onClick={handleReveal}
              className="text-left w-full"
              style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
            >
              <p
                style={{
                  fontFamily: "var(--font-lora), Georgia, serif",
                  fontStyle: "italic",
                  fontSize: "clamp(18px, 5vw, 28px)",
                  lineHeight: 1.6,
                  color: "#d4c5b0",
                  userSelect: "none",
                }}
              >
                Touche pour commencer…
              </p>
              <p style={{ fontSize: "12px", color: "#c4a882", marginTop: "24px" }}>
                Prends un moment. Respire.
              </p>
            </button>
          ) : (
            <p
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontSize: "clamp(20px, 5.5vw, 30px)",
                lineHeight: 1.65,
                color: "#2a2520",
                letterSpacing: "-0.01em",
              }}
            >
              {question}
            </p>
          )}
        </div>

        {/* Reflection + timer */}
        {revealed && (
          <div className="flex flex-col gap-5">
            {/* Timer */}
            <div className="flex items-center gap-3">
              <svg width="44" height="44" viewBox="0 0 44 44">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#e8e0d4"
                  strokeWidth="2"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke={timerDone ? "#a8c8a0" : "#c4a882"}
                  strokeWidth="2"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - timerProgress)}
                  strokeLinecap="round"
                  transform="rotate(-90 22 22)"
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
                <text
                  x="22"
                  y="26"
                  textAnchor="middle"
                  style={{
                    fontSize: "9px",
                    fill: timerDone ? "#a8c8a0" : "#9a9088",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {timerDone ? "✓" : formatTime(secondsLeft)}
                </text>
              </svg>
              <span style={{ fontSize: "12px", color: "#b0a898" }}>
                {timerDone
                  ? "Prends le temps de relire avant de sauvegarder."
                  : timerActive
                  ? "Écris sans t'arrêter."
                  : "5 minutes pour toi."}
              </span>
            </div>

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              onFocus={handleTextareaFocus}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Écris ce qui vient, sans censure, sans jugement…"
              rows={6}
              style={{
                width: "100%",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: `1px solid ${timerActive ? "#c4a882" : "#ddd5c8"}`,
                outline: "none",
                resize: "none",
                fontSize: "16px",
                lineHeight: 1.7,
                color: "#2a2520",
                fontFamily: "inherit",
                fontWeight: 300,
                paddingBottom: "12px",
                transition: "border-color 0.3s ease",
              }}
            />

            {/* Save */}
            <div className="flex justify-between items-center">
              <span style={{ fontSize: "11px", color: "#c4a882" }}>
                {reflection.length > 0 ? `${reflection.split(/\s+/).filter(Boolean).length} mots` : ""}
              </span>
              <button
                onClick={handleSave}
                style={{
                  fontSize: "13px",
                  padding: "10px 20px",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: saved ? "#c4a882" : "#ede8df",
                  color: saved ? "#f5f0e8" : "#8a7f74",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.03em",
                }}
              >
                {saved ? "Enregistré" : "Garder"}
              </button>
            </div>
          </div>
        )}

        {/* Footer quote */}
        {!revealed && (
          <p
            style={{
              fontSize: "11px",
              color: "#c4a882",
              textAlign: "center",
              fontStyle: "italic",
              lineHeight: 1.6,
              paddingTop: "20px",
            }}
          >
            &ldquo;La vie non examinée ne vaut pas d&apos;être vécue.&rdquo;
            <br />
            <span style={{ fontStyle: "normal", opacity: 0.7 }}>— Socrate</span>
          </p>
        )}
      </div>
    </main>
  );
}
