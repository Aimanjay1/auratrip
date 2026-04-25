import Link from "next/link";
import type { Itinerary } from "../data/itineraries";

export default function ItineraryCard({ it, size = "md" }: { it: Itinerary; size?: "sm" | "md" | "lg" }) {
  const isLg = size === "lg";
  const isSm = size === "sm";
  return (
    <Link href={`/itinerary/${it.id}`} className="block group">
      <div
        className={`relative rounded-3xl overflow-hidden shadow-sm ${
          isLg ? "h-60" : isSm ? "h-40 min-w-50" : "h-52"
        }`}
        style={{ background: "#e8f4fd" }}
      >
        {/* Soft gradient bg */}
        <div className={`absolute inset-0 bg-linear-to-br ${it.gradient} opacity-90`} />

        {/* Big emoji */}
        <div
          className={`absolute ${
            isLg ? "top-5 right-5 text-6xl" : isSm ? "top-3 right-3 text-3xl" : "top-4 right-4 text-5xl"
          }`}
        >
          {it.coverEmoji}
        </div>

        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-4 bg-linear-to-t from-black/60 via-black/10 to-transparent">
          <div className="flex flex-wrap gap-1 mb-2">
            {it.vibe.map((v) => (
              <span
                key={v}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {v}
              </span>
            ))}
          </div>
          <h3
            className={`font-bold leading-tight text-white drop-shadow-sm ${
              isLg ? "text-xl" : isSm ? "text-sm" : "text-base"
            }`}
          >
            {it.title}
          </h3>
          {!isSm && (
            <p className="text-xs mt-1 text-white/75">
              {it.city}, {it.country} · {it.duration}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
