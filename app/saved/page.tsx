"use client";

import { useMemo } from "react";
import BottomNav from "../components/BottomNav";
import ItineraryCard from "../components/ItineraryCard";
import type { Itinerary as CardItinerary } from "../data/itineraries";
import type { DecisionAnalysis } from "../data/newtypes";
import { readDecisionAnalysisDictionary } from "../lib/decision-analysis-storage";

function toCardItinerary(key: string, analysis: DecisionAnalysis): CardItinerary {
  const primary =
    analysis.options.find((option) => option.id === analysis.primaryRecommendationId) ?? analysis.options[0];

  return {
    id: key,
    title: primary?.title ?? "AI Generated Itinerary",
    tagline: primary?.tagline ?? analysis.economicRationale,
    city: "AI Generated",
    country: "From Your Answers",
    duration: `${primary?.days.length ?? 0} days`,
    vibe: primary?.vibe ?? ["AI"],
    coverEmoji: primary?.coverEmoji ?? "🧭",
    gradient: primary?.gradient ?? "from-cyan-700 to-blue-800",
    days: [],
  };
}

export default function SavedPage() {
  const saved = useMemo(() => {
    const dictionary = readDecisionAnalysisDictionary();
    return Object.entries(dictionary).map(([key, analysis]) => toCardItinerary(key, analysis));
  }, []);

  return (
    <div className="app-shell pb-24">
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Saved</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Your personal travel shortlist.
        </p>
      </header>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 px-8 pt-20 text-center">
          <div className="text-5xl mb-4">🗂️</div>
          <p className="text-lg font-bold mb-1" style={{ color: "var(--text)" }}>Nothing saved yet</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Tap the bookmark on any itinerary to save it here.
          </p>
        </div>
      ) : (
        <section className="px-5 flex flex-col gap-4">
          {saved.map((it) => (
            <ItineraryCard key={it.id} it={it} size="md" />
          ))}
        </section>
      )}

      <BottomNav />
    </div>
  );
}
