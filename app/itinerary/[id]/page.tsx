import { notFound } from "next/navigation";
import Link from "next/link";
import { ITINERARIES } from "../../data/itineraries";
import BottomNav from "../../components/BottomNav";

export function generateStaticParams() {
  return ITINERARIES.map((it) => ({ id: it.id }));
}

export default async function ItineraryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const it = ITINERARIES.find((i) => i.id === id);
  if (!it) notFound();

  return (
    <div className="app-shell pb-24">

      {/* Hero */}
      <div className={`relative h-60 bg-linear-to-br ${it.gradient}`}>
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />

        {/* Back */}
        <Link
          href="/"
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

        {/* Save */}
        <button
          className="absolute top-12 right-5 w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(8px)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M5 3h14a1 1 0 011 1v17l-8-4-8 4V4a1 1 0 011-1z" />
          </svg>
        </button>

        {/* Emoji */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-5xl drop-shadow-lg">
          {it.coverEmoji}
        </div>

        {/* Title block */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {it.vibe.map((v) => (
              <span
                key={v}
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {v}
              </span>
            ))}
          </div>
          <h1 className="text-lg font-bold text-white leading-snug drop-shadow">{it.title}</h1>
          <p className="text-xs mt-1 text-white/70">{it.city}, {it.country} · {it.duration}</p>
        </div>
      </div>

      {/* Tagline */}
      <div className="px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
        <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{it.tagline}</p>
      </div>

      {/* Quick stats */}
      <div className="px-5 py-4 flex gap-3">
        {[
          { icon: "📅", label: it.duration },
          { icon: "📍", label: `${it.days.reduce((n, d) => n + d.stops.length, 0)} stops` },
          { icon: "🌏", label: it.city },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium"
            style={{ background: "var(--blue-light)", color: "var(--blue)" }}
          >
            <span>{s.icon}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="px-5 pt-2 flex flex-col gap-8">
        {it.days.map((day) => (
          <section key={day.label}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl mb-4"
              style={{ background: "var(--blue-light)" }}
            >
              <span className="text-xs font-bold" style={{ color: "var(--blue)" }}>{day.label}</span>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div
                className="absolute left-1.75 top-2 bottom-2 w-0.5 rounded-full"
                style={{ background: "var(--blue-border)" }}
              />
              <div className="flex flex-col gap-4">
                {day.stops.map((stop, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Dot */}
                    <div className="shrink-0 pt-1.5">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 z-10"
                        style={{ borderColor: "var(--blue)", background: "var(--white)" }}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className="flex-1 rounded-2xl p-4"
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

                      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
                        {stop.note}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--border)" }}>
                        <span className="text-xs flex items-center gap-1" style={{ color: "var(--muted)" }}>
                          <span>⏱</span> {stop.duration}
                        </span>
                        <a
                          href={stop.mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: "var(--blue-light)", color: "var(--blue)" }}
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          Open map
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 pt-8">
        <button
          className="w-full py-4 rounded-2xl text-base font-bold text-white"
          style={{ background: "linear-gradient(135deg, #3b9ede 0%, #5ab0e8 100%)" }}
        >
          Start this trip ✈️
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
