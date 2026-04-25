"use client";
import { useState } from "react";
import Link from "next/link";
import BottomNav from "../components/BottomNav";

/* ─── Types ─────────────────────────────────────────────────── */
type FlowStep = "quiz" | "loading" | "result";

type Answer = {
  destination: string;
  travelWith: string;
  tripLength: string;
  pace: string;
  budget: string;
  interests: string[];
  accommodation: string;
  foodStyle: string;
  avoids: string[];
};

/* ─── Quiz questions ─────────────────────────────────────────── */
const QUESTIONS = [
  {
    id: "destination",
    step: 1,
    emoji: "🌍",
    title: "Where are you heading?",
    subtitle: "Type a city, country, or region.",
    type: "text" as const,
    placeholder: "e.g. Tokyo, Bali, Paris…",
  },
  {
    id: "travelWith",
    step: 2,
    emoji: "👥",
    title: "Who are you travelling with?",
    subtitle: "This shapes the whole trip.",
    type: "single" as const,
    options: [
      { label: "Just me", icon: "🙋" },
      { label: "My partner", icon: "💑" },
      { label: "Friends", icon: "🤝" },
      { label: "Family", icon: "👨‍👩‍👧" },
    ],
  },
  {
    id: "tripLength",
    step: 3,
    emoji: "📅",
    title: "How long is your trip?",
    subtitle: "We'll pack in just the right amount.",
    type: "single" as const,
    options: [
      { label: "Weekend (2 days)", icon: "⚡" },
      { label: "Short trip (3–4 days)", icon: "🎒" },
      { label: "One week", icon: "✈️" },
      { label: "Two weeks+", icon: "🗺️" },
    ],
  },
  {
    id: "pace",
    step: 4,
    emoji: "🕐",
    title: "What's your travel pace?",
    subtitle: "We won't overload your schedule.",
    type: "single" as const,
    options: [
      { label: "Slow & relaxed", icon: "🌿" },
      { label: "Balanced", icon: "⚖️" },
      { label: "Action-packed", icon: "🔥" },
    ],
  },
  {
    id: "budget",
    step: 5,
    emoji: "💳",
    title: "What's your budget feel?",
    subtitle: "No judgement — just helps us pick the right spots.",
    type: "single" as const,
    options: [
      { label: "Budget-friendly", icon: "🪙" },
      { label: "Mid-range", icon: "💵" },
      { label: "Comfortable splurge", icon: "✨" },
      { label: "Go all out", icon: "💎" },
    ],
  },
  {
    id: "interests",
    step: 6,
    emoji: "❤️",
    title: "What do you love most?",
    subtitle: "Pick everything that applies.",
    type: "multi" as const,
    options: [
      { label: "Food & cafés", icon: "☕" },
      { label: "Nature & outdoors", icon: "🌿" },
      { label: "Art & museums", icon: "🎨" },
      { label: "Architecture", icon: "🏛️" },
      { label: "Shopping", icon: "🛍️" },
      { label: "Nightlife", icon: "🌙" },
      { label: "Wellness & spa", icon: "🧘" },
      { label: "Local culture", icon: "🎎" },
    ],
  },
  {
    id: "accommodation",
    step: 7,
    emoji: "🏨",
    title: "Where do you like to stay?",
    subtitle: "Sets the tone for the whole trip.",
    type: "single" as const,
    options: [
      { label: "Boutique hotel", icon: "🏩" },
      { label: "Hostel / social", icon: "🛏️" },
      { label: "Airbnb / apartment", icon: "🏠" },
      { label: "Luxury resort", icon: "🌴" },
    ],
  },
  {
    id: "foodStyle",
    step: 8,
    emoji: "🍽️",
    title: "How do you eat when travelling?",
    subtitle: "We'll match your dining style.",
    type: "single" as const,
    options: [
      { label: "Street food all the way", icon: "🌮" },
      { label: "Local hidden gems", icon: "🔍" },
      { label: "Mix of casual & fine", icon: "🍷" },
      { label: "Fine dining only", icon: "🥂" },
    ],
  },
  {
    id: "avoids",
    step: 9,
    emoji: "🚫",
    title: "Anything you want to avoid?",
    subtitle: "We'll filter these out completely.",
    type: "multi" as const,
    options: [
      { label: "Crowded tourist spots", icon: "😵" },
      { label: "Long queues", icon: "⏳" },
      { label: "Loud / busy areas", icon: "📢" },
      { label: "Expensive restaurants", icon: "💸" },
      { label: "Party scenes", icon: "🎉" },
      { label: "Nothing — show me everything", icon: "👀" },
    ],
  },
];

const TOTAL_STEPS = QUESTIONS.length;

/* ─── Hardcoded result ───────────────────────────────────────── */
const RESULT = {
  id: "tokyo-introvert",
  title: "The Introvert's 48-Hour Tokyo Cafe Run",
  tagline: "Quiet corners, third-wave coffee, and zero tourist traps.",
  summary:
    "Based on your answers, AuraTrip built a slow-paced, solo-friendly Tokyo weekend that skips Shibuya entirely. Every stop flows into the next — no backtracking, no crowds, maximum atmosphere.",
  match: 97,
  highlights: [
    "Bear Pond Espresso → Shimokitazawa drift",
    "Nakameguro canal walk at golden hour",
    "Kayaba Coffee in a 1938 kissaten",
    "Yanaka Cemetery at noon (trust the vibe)",
    "Fuglen Tokyo for the last pour-over",
  ],
  stats: { stops: 11, days: 2, walkingKm: "8.4", cafes: 5 },
  tags: ["Solo", "Minimal", "Cozy"],
};

/* ─── Default answers ────────────────────────────────────────── */
const defaultAnswers: Answer = {
  destination: "",
  travelWith: "",
  tripLength: "",
  pace: "",
  budget: "",
  interests: [],
  accommodation: "",
  foodStyle: "",
  avoids: [],
};

/* ─── Component ──────────────────────────────────────────────── */
export default function GeneratePage() {
  const [flowStep, setFlowStep] = useState<FlowStep>("quiz");
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer>({ ...defaultAnswers });

  const question = QUESTIONS[qIndex];
  const isLast = qIndex === QUESTIONS.length - 1;

  /* Helpers */
  function getAnswer(id: string): string | string[] {
    return answers[id as keyof Answer] ?? (QUESTIONS[qIndex].type === "multi" ? [] : "");
  }
  function setAnswer(id: string, value: string | string[]) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }
  function toggleMulti(id: string, value: string) {
    const current = (answers[id as keyof Answer] as string[]) || [];
    const next = current.includes(value)
      ? current.filter((x) => x !== value)
      : [...current, value];
    setAnswer(id, next);
  }
  function canAdvance(): boolean {
    const val = getAnswer(question.id);
    if (question.type === "text") return (val as string).trim().length > 0;
    if (question.type === "multi") return (val as string[]).length > 0;
    return (val as string).length > 0;
  }
  function goNext() {
    if (isLast) {
      setFlowStep("loading");
      setTimeout(() => setFlowStep("result"), 3000);
    } else {
      setQIndex((i) => i + 1);
    }
  }
  function goBack() {
    if (qIndex > 0) setQIndex((i) => i - 1);
  }
  function restart() {
    setAnswers({ ...defaultAnswers });
    setQIndex(0);
    setFlowStep("quiz");
  }

  /* ── Quiz screen ── */
  if (flowStep === "quiz") {
    return (
      <div className="app-shell pb-24 flex flex-col">
        {/* Top bar */}
        <div className="px-5 pt-12 pb-4 flex items-center gap-3">
          {qIndex > 0 ? (
            <button onClick={goBack} className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ background: "var(--white)", borderColor: "var(--border)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                style={{ color: "var(--text-secondary)" }}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          ) : (
            <div className="w-9 h-9" />
          )}
          <div className="flex-1">
            <p className="text-xs font-semibold text-center mb-1.5" style={{ color: "var(--muted)" }}>
              Step {question.step} of {TOTAL_STEPS}
            </p>
            {/* Progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--blue-light)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${(question.step / TOTAL_STEPS) * 100}%`, background: "var(--blue)" }}
              />
            </div>
          </div>
          <div className="w-9 h-9" />
        </div>

        {/* Question */}
        <div className="px-5 pt-2 pb-6 flex-1">
          <div className="text-4xl mb-4">{question.emoji}</div>
          <h2 className="text-xl font-bold leading-snug mb-1" style={{ color: "var(--text)" }}>
            {question.title}
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
            {question.subtitle}
          </p>

          {/* Text input */}
          {question.type === "text" && (
            <input
              type="text"
              placeholder={question.placeholder}
              value={getAnswer(question.id) as string}
              onChange={(e) => setAnswer(question.id, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && canAdvance() && goNext()}
              autoFocus
              className="w-full px-4 py-4 rounded-2xl text-base outline-none border-2 transition-colors"
              style={{
                background: "var(--white)",
                color: "var(--text)",
                borderColor: (getAnswer(question.id) as string).trim()
                  ? "var(--blue)"
                  : "var(--border)",
              }}
            />
          )}

          {/* Single select */}
          {question.type === "single" && (
            <div className="flex flex-col gap-3">
              {question.options!.map((opt) => {
                const selected = getAnswer(question.id) === opt.label;
                return (
                  <button
                    key={opt.label}
                    onClick={() => setAnswer(question.id, opt.label)}
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl border-2 text-left transition-all"
                    style={{
                      background: selected ? "var(--blue-light)" : "var(--white)",
                      borderColor: selected ? "var(--blue)" : "var(--border)",
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span
                      className="text-base font-semibold"
                      style={{ color: selected ? "var(--blue)" : "var(--text)" }}
                    >
                      {opt.label}
                    </span>
                    {selected && (
                      <span className="ml-auto">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          style={{ color: "var(--blue)" }}>
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* Multi select */}
          {question.type === "multi" && (
            <div className="grid grid-cols-2 gap-3">
              {question.options!.map((opt) => {
                const selected = ((getAnswer(question.id) as string[]) || []).includes(opt.label);
                return (
                  <button
                    key={opt.label}
                    onClick={() => toggleMulti(question.id, opt.label)}
                    className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border-2 transition-all"
                    style={{
                      background: selected ? "var(--blue-light)" : "var(--white)",
                      borderColor: selected ? "var(--blue)" : "var(--border)",
                    }}
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span
                      className="text-xs font-semibold text-center leading-snug"
                      style={{ color: selected ? "var(--blue)" : "var(--text-secondary)" }}
                    >
                      {opt.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Next button — fixed above bottom nav */}
        <div className="px-5 pb-6">
          <button
            onClick={goNext}
            disabled={!canAdvance()}
            className="w-full py-4 rounded-2xl text-base font-bold text-white transition-opacity disabled:opacity-35"
            style={{ background: "linear-gradient(135deg, #3b9ede 0%, #5ab0e8 100%)" }}
          >
            {isLast ? "Build my itinerary ✨" : "Continue →"}
          </button>
        </div>

        <BottomNav />
      </div>
    );
  }

  /* ── Loading screen ── */
  if (flowStep === "loading") {
    return (
      <div className="app-shell pb-24 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-6"
          style={{ background: "var(--blue-light)" }}
        >
          ✈️
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text)" }}>
          Curating your trip…
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
          This takes just a moment.
        </p>
        <div className="w-full max-w-xs flex flex-col gap-3">
          {[
            { text: "Reading your preferences", delay: "0ms" },
            { text: "Filtering 2,400+ travel sources", delay: "700ms" },
            { text: "Sequencing your route", delay: "1400ms" },
            { text: "Removing tourist traps", delay: "2100ms" },
          ].map(({ text, delay }) => (
            <div
              key={text}
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "var(--white)",
                border: "1px solid var(--border)",
                animation: `fadeIn 0.4s ease ${delay} both`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: "var(--blue)", animation: `pulse-dot 1.4s ease ${delay} infinite` }}
              />
              <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{text}</span>
            </div>
          ))}
        </div>
        <BottomNav />
      </div>
    );
  }

  /* ── Result screen ── */
  return (
    <div className="app-shell pb-24">
      <header className="px-5 pt-12 pb-5">
        <button
          onClick={restart}
          className="flex items-center gap-1.5 text-sm font-medium mb-4"
          style={{ color: "var(--muted)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Start over
        </button>

        {/* Match badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-3"
          style={{ background: "var(--blue-light)" }}
        >
          <span className="text-sm font-bold" style={{ color: "var(--blue)" }}>
            {RESULT.match}% match
          </span>
          <span className="text-sm">🎯</span>
        </div>

        <h1 className="text-xl font-bold leading-snug mb-1" style={{ color: "var(--text)" }}>
          {RESULT.title}
        </h1>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{RESULT.tagline}</p>
      </header>

      <div className="px-5 flex flex-col gap-5">

        {/* Summary */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--blue-xlight)", border: "1px solid var(--blue-border)" }}
        >
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {RESULT.summary}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Stops", value: RESULT.stats.stops, icon: "📍" },
            { label: "Days", value: RESULT.stats.days, icon: "📅" },
            { label: "km walk", value: RESULT.stats.walkingKm, icon: "🚶" },
            { label: "Cafés", value: RESULT.stats.cafes, icon: "☕" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{ background: "var(--white)", border: "1px solid var(--border)" }}
            >
              <p className="text-base mb-0.5">{s.icon}</p>
              <p className="text-lg font-bold" style={{ color: "var(--blue)" }}>{s.value}</p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Your answers recap */}
        <div
          className="rounded-2xl p-4"
          style={{ background: "var(--white)", border: "1px solid var(--border)" }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--muted)" }}>
            Based on your answers
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              answers.destination,
              answers.travelWith,
              answers.pace,
              answers.budget,
              ...answers.interests.slice(0, 3),
            ]
              .filter(Boolean)
              .map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-semibold"
                  style={{ background: "var(--blue-light)", color: "var(--blue)" }}
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--muted)" }}>
            What's included
          </p>
          <div className="flex flex-col gap-2">
            {RESULT.highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-3 px-4 rounded-2xl"
                style={{ background: "var(--white)", border: "1px solid var(--border)" }}
              >
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                  style={{ background: "var(--blue-light)", color: "var(--blue)" }}
                >
                  {i + 1}
                </span>
                <span className="text-sm" style={{ color: "var(--text)" }}>{h}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <Link href={`/itinerary/${RESULT.id}`}>
          <button
            className="w-full py-4 rounded-2xl text-base font-bold text-white"
            style={{ background: "linear-gradient(135deg, #3b9ede 0%, #5ab0e8 100%)" }}
          >
            View full itinerary →
          </button>
        </Link>
        <button
          onClick={restart}
          className="w-full py-4 rounded-2xl text-sm font-semibold border-2"
          style={{ borderColor: "var(--blue-border)", color: "var(--blue)", background: "var(--white)" }}
        >
          Try different answers
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
