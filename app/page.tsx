import Link from "next/link";
import BottomNav from "./components/BottomNav";
import ItineraryCard from "./components/ItineraryCard";
import { ITINERARIES } from "./data/itineraries";

export default function Home() {
  const featured = ITINERARIES[0];
  const rest = ITINERARIES.slice(1);

  return (
    <div className="app-shell pb-24">

      {/* Header */}
      <header className="px-5 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{ background: "var(--blue)" }}
            >
              A
            </div>
            <span className="text-base font-bold" style={{ color: "var(--text)" }}>AuraTrip</span>
          </div>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border"
            style={{ background: "var(--white)", borderColor: "var(--border)", color: "var(--blue)" }}
          >
            FS
          </button>
        </div>
        <h1 className="text-2xl font-bold leading-snug" style={{ color: "var(--text)" }}>
          Good morning! ☀️<br />
          <span style={{ color: "var(--blue)" }}>Where to next?</span>
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Curated trips, zero research needed.
        </p>
      </header>

      {/* Search bar */}
      <div className="px-5 mt-4 mb-5">
        <Link href="/explore">
          <div
            className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border"
            style={{ background: "var(--white)", borderColor: "var(--border)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={{ color: "var(--muted)" }}>
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            <span className="text-sm" style={{ color: "var(--muted)" }}>Search destinations, vibes…</span>
          </div>
        </Link>
      </div>

      {/* Category pills */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Solo", "Couples", "Food", "Nature", "Urban", "Cozy"].map((v, i) => (
            <button
              key={v}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border"
              style={{
                background: i === 0 ? "var(--blue)" : "var(--white)",
                color: i === 0 ? "#fff" : "var(--text-secondary)",
                borderColor: i === 0 ? "var(--blue)" : "var(--border)",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      <section className="px-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Featured Trip</h2>
          <Link href="/explore" className="text-sm font-medium" style={{ color: "var(--blue)" }}>
            See all →
          </Link>
        </div>
        <ItineraryCard it={featured} size="lg" />
      </section>

      {/* Trending */}
      <section className="px-5 mb-6">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>Trending Now</h2>
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
          {rest.map((it) => (
            <ItineraryCard key={it.id} it={it} size="sm" />
          ))}
        </div>
      </section>

      {/* Plan CTA card */}
      <section className="px-5 mb-6">
        <Link href="/generate">
          <div
            className="rounded-3xl p-5 flex items-center justify-between"
            style={{ background: "linear-gradient(135deg, #3b9ede 0%, #5ab0e8 100%)" }}
          >
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-white/70 mb-1">AI-Powered</p>
              <p className="text-lg font-bold text-white leading-snug">Build your own<br />perfect trip</p>
              <p className="text-xs text-white/70 mt-1">Answer a few questions →</p>
            </div>
            <div className="text-5xl">✈️</div>
          </div>
        </Link>
      </section>

      {/* All itineraries */}
      <section className="px-5">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--text)" }}>All Itineraries</h2>
        <div className="flex flex-col gap-3">
          {ITINERARIES.map((it) => (
            <ItineraryCard key={it.id} it={it} size="md" />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
