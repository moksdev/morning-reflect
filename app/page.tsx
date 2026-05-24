"use client";

import { useState, useEffect } from "react";
import { getDailyQuestion, getQuestionIndex, questions } from "@/lib/questions";

function getStorageKey(index: number) {
  return `reflect_${new Date().toISOString().slice(0, 10)}_${index}`;
}

export default function Home() {
  const [question] = useState(() => getDailyQuestion());
  const [questionIndex] = useState(() => getQuestionIndex());
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [time, setTime] = useState("");

  useEffect(() => {
    const key = getStorageKey(questionIndex);
    const stored = localStorage.getItem(key);
    if (stored) setReflection(stored);

    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 60000);
    return () => clearInterval(id);
  }, [questionIndex]);

  const handleSave = () => {
    const key = getStorageKey(questionIndex);
    localStorage.setItem(key, reflection);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const date = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl flex flex-col gap-12">

        {/* Header */}
        <div className="flex justify-between items-start text-sm" style={{ color: "#8a7f74" }}>
          <span className="capitalize">{date}</span>
          <span>{time}</span>
        </div>

        {/* Question */}
        <div
          className="cursor-pointer select-none"
          onClick={() => setRevealed(true)}
        >
          {!revealed ? (
            <div className="flex flex-col gap-4">
              <p className="text-xs tracking-widest uppercase" style={{ color: "#c4a882" }}>
                ta question du matin
              </p>
              <div className="h-px w-12" style={{ backgroundColor: "#c4a882" }} />
              <p
                className="text-lg"
                style={{ color: "#c4a882", fontFamily: "var(--font-lora), serif", fontStyle: "italic" }}
              >
                Touche pour révéler…
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-xs tracking-widest uppercase" style={{ color: "#c4a882" }}>
                ta question du matin
              </p>
              <div className="h-px w-12" style={{ backgroundColor: "#c4a882" }} />
              <p
                className="text-2xl leading-relaxed"
                style={{ fontFamily: "var(--font-lora), serif", color: "#2a2520" }}
              >
                {question}
              </p>
            </div>
          )}
        </div>

        {/* Reflection area */}
        {revealed && (
          <div className="flex flex-col gap-4">
            <textarea
              className="w-full h-40 bg-transparent border-b text-base leading-relaxed placeholder-stone-400 transition-colors"
              style={{
                borderColor: "#d6cfc4",
                color: "#2a2520",
                fontFamily: "inherit",
                fontWeight: 300,
                outline: "none",
                resize: "none",
              }}
              placeholder="Écris ce qui vient, sans jugement…"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs" style={{ color: "#b0a898" }}>
                {questions.length} questions · #{questionIndex + 1} aujourd&apos;hui
              </span>
              <button
                onClick={handleSave}
                className="text-sm px-4 py-2 rounded-full transition-all"
                style={{
                  backgroundColor: saved ? "#c4a882" : "#ede8df",
                  color: saved ? "#f5f0e8" : "#8a7f74",
                }}
              >
                {saved ? "Enregistré ✓" : "Garder"}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-xs text-center" style={{ color: "#c4a882" }}>
          Reviens demain pour une nouvelle question.
        </p>
      </div>
    </main>
  );
}
