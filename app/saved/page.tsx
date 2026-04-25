import BottomNav from "../components/BottomNav";
import ItineraryCard from "../components/ItineraryCard";
import { ITINERARIES } from "../data/itineraries";

export default function SavedPage() {
  const saved = [ITINERARIES[0], ITINERARIES[2]];

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
