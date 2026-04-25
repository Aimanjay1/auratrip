import BottomNav from "../components/BottomNav";
import ItineraryCard from "../components/ItineraryCard";
import { ITINERARIES } from "../data/itineraries";

export default function ExplorePage() {
  return (
    <div className="app-shell pb-24">
      <header className="px-5 pt-12 pb-4">
        <h1 className="text-2xl font-bold" style={{ color: "var(--text)" }}>Explore</h1>
        <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
          Find your perfect trip by vibe.
        </p>
      </header>

      {/* Search */}
      <div className="px-5 mb-4">
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
      </div>

      {/* Category chips */}
      <div className="px-5 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", "Solo", "Couples", "Architecture", "Food", "Nature", "Urban", "Slow Travel"].map((c, i) => (
            <button
              key={c}
              className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold border"
              style={{
                background: i === 0 ? "var(--blue)" : "var(--white)",
                color: i === 0 ? "#fff" : "var(--text-secondary)",
                borderColor: i === 0 ? "var(--blue)" : "var(--border)",
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <section className="px-5">
        <p className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>
          {ITINERARIES.length} itineraries found
        </p>
        <div className="flex flex-col gap-4">
          {ITINERARIES.map((it) => (
            <ItineraryCard key={it.id} it={it} size="md" />
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  );
}
