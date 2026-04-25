"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import BottomNav from "../../components/BottomNav";
import type { DecisionAnalysis, Itinerary } from "../../data/newtypes";
import { readDecisionAnalysisByKey } from "../../lib/decision-analysis-storage";

function primaryOption(analysis: DecisionAnalysis): Itinerary {
  return analysis.options.find((option) => option.id === analysis.primaryRecommendationId) ?? analysis.options[0];
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

export default function ItineraryPage() {
  const params = useParams<{ id: string }>();
  const key = Array.isArray(params.id) ? params.id[0] : params.id;
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const analysis = useMemo(() => {
    if (!key) return null;
    return readDecisionAnalysisByKey(key);
  }, [key]);

  if (!analysis) {
    return (
      <div className="app-shell pb-24 px-5 pt-16">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Itinerary not found</h1>
        <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>
          This itinerary key is not in local storage. Generate and save a trip first.
        </p>
        <Link
          href="/saved"
          className="inline-flex items-center mt-6 px-4 py-2 rounded-xl text-sm font-semibold"
          style={{ background: "var(--blue-light)", color: "var(--blue)" }}
        >
          Go to Saved
        </Link>
        <BottomNav />
      </div>
    );
  }

  const chosen = primaryOption(analysis);
  const selectedOption =
    analysis.options.find((option) => option.id === selectedOptionId) ?? chosen;

  return (
    <div className="app-shell pb-24">
      <div className={`relative h-64 bg-linear-to-br ${chosen.gradient}`}>
        <div className="absolute inset-0 bg-linear-to-t from-black/65 to-transparent" />

        <Link
          href="/saved"
          className="absolute top-12 left-5 flex items-center gap-1.5 text-sm font-semibold"
          style={{
            color: "#fff",
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
            padding: "6px 12px",
            borderRadius: "999px",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <div className="absolute top-12 right-5 px-3 py-1.5 rounded-full text-xs font-bold" style={{ background: "rgba(255,255,255,0.22)", color: "#fff" }}>
          Key: {key}
        </div>

        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg">{chosen.coverEmoji}</div>

        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {chosen.vibe.map((v) => (
              <span
                key={v}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {v}
              </span>
            ))}
          </div>
          <h1 className="text-lg font-bold text-white leading-snug drop-shadow">{chosen.title}</h1>
          <p className="text-xs mt-1 text-white/70">{chosen.tagline}</p>
        </div>
      </div>

      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {analysis.economicRationale}
        </p>
      </div>

      <div className="px-5 pt-4 pb-2 grid grid-cols-3 gap-3">
        {[
          {
            icon: "💰",
            title: "Budget",
            value: `$${formatMoney(analysis.userBudget)}`,
            tone: { background: "#e8f4fd", border: "#bddff5", color: "#1f4f73" },
          },
          {
            icon: "🛡️",
            title: "Savings",
            value: `$${formatMoney(analysis.hiddenCostsAvoided)}`,
            tone: { background: "#e9f9f0", border: "#bde7cd", color: "#1f6a46" },
          },
          {
            icon: "🧠",
            title: "Options",
            value: String(analysis.options.length),
            tone: { background: "#fff4e5", border: "#f1d9af", color: "#825100" },
          },
        ].map((s) => (
          <div
            key={s.title}
            className="rounded-2xl px-3 py-2.5"
            style={{
              background: s.tone.background,
              border: `1px solid ${s.tone.border}`,
              color: s.tone.color,
            }}
          >
            <p className="text-[11px] font-bold tracking-wide uppercase flex items-center gap-1">
              <span>{s.icon}</span>
              <span>{s.title}</span>
            </p>
            <p className="text-sm font-extrabold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="px-5 pt-1 pb-1">
        <p className="text-[11px] font-bold tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
          Compare plans
        </p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {analysis.options.map((option) => {
            const isActive = option.id === selectedOption.id;
            const isPrimary = option.id === analysis.primaryRecommendationId;
            const optionIndex = analysis.options.findIndex((item) => item.id === option.id) + 1;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setSelectedOptionId(option.id)}
                className="shrink-0 min-w-44 px-3.5 py-3 rounded-2xl text-left"
                style={{
                  background: isActive ? "var(--blue)" : "var(--white)",
                  color: isActive ? "#fff" : "var(--text)",
                  border: `1px solid ${isActive ? "var(--blue)" : "var(--border)"}`,
                  boxShadow: isActive ? "0 8px 20px rgba(59,158,222,0.22)" : "none",
                }}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{
                      background: isActive ? "rgba(255,255,255,0.2)" : "var(--surface2)",
                      color: isActive ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    Option {optionIndex}
                  </span>
                  {isPrimary ? (
                    <span
                      className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{
                        background: isActive ? "rgba(255,255,255,0.2)" : "#eaf5ff",
                        color: isActive ? "#fff" : "var(--blue)",
                      }}
                    >
                      Primary
                    </span>
                  ) : null}
                </div>
                <p className="text-xs font-bold mt-2 leading-snug">{option.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 pt-2 flex flex-col gap-8">
        <section key={selectedOption.id}>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4"
            style={{ background: "var(--blue-light)" }}
          >
            <span className="text-xs font-bold" style={{ color: "var(--blue)" }}>
              {selectedOption.id === analysis.primaryRecommendationId ? "Primary recommendation" : "Alternative"}
            </span>
          </div>

          <div className="rounded-2xl p-4 mb-4" style={{ background: "var(--white)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold" style={{ color: "var(--text)" }}>{selectedOption.title}</h2>
                <p className="text-xs mt-1" style={{ color: "var(--muted)" }}>{selectedOption.tagline}</p>
              </div>
              <span className="text-sm font-bold" style={{ color: "var(--blue)" }}>${selectedOption.totalCost}</span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {selectedOption.days.map((day) => (
              <div key={day.label}>
                <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "var(--muted)" }}>
                  {day.label}
                </p>
                <div className="flex flex-col gap-3">
                  {day.stops.map((stop, index) => (
                    <article
                      key={`${day.label}-${stop.name}-${index}`}
                      className="rounded-2xl p-4"
                      style={{ background: "var(--white)", border: "1px solid var(--border)" }}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-lg"
                            style={{ background: "var(--blue-light)", color: "var(--blue)" }}
                          >
                            {stop.time}
                          </span>
                          <h3 className="text-sm font-bold mt-1.5" style={{ color: "var(--text)" }}>
                            {stop.name}
                          </h3>
                        </div>
                        <span
                          className="shrink-0 text-[10px] font-semibold px-2.5 py-1 rounded-full"
                          style={{ background: "var(--surface2)", color: "var(--text-secondary)" }}
                        >
                          {stop.category}
                        </span>
                      </div>

                      <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                        {stop.aiInsight ?? "AI selected this stop for timing and budget trade-offs."}
                      </p>

                      <div className="flex items-center justify-between pt-3 mt-3 border-t" style={{ borderColor: "var(--border)" }}>
                        <span className="text-xs" style={{ color: "var(--muted)" }}>⏱ {stop.duration}</span>
                        <span className="text-xs font-semibold" style={{ color: "var(--blue)" }}>
                          ${stop.costEstimate} {stop.isLocalSme ? "· SME" : ""}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <BottomNav />
    </div>
  );
}
