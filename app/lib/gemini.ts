import "server-only";

import type { Answer, DecisionAnalysis, Itinerary, Stop } from "../data/newtypes";
import { ITINERARIES } from "../data/itineraries";
import { searchNearbyStops } from "../helper/placesAPI";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const DEFAULT_STOPS_POOL_LIMIT = 16;

type LatLng = {
    lat: number;
    lng: number;
};

type GeocodeApiResponse = {
    results?: {
        geometry?: {
            location?: LatLng;
        };
    }[];
};

function buildPrompt(answer: Answer, rawDataPool: string): string {
    return [
        "You are AuraTrip's economic trade-off analyzer for travelers.",
        "Treat this as a financial decision engine, not a generic planner.",
        "travelWith, tripLength, and budget are numeric and must be used in calculations.",
        "Budget is the hard maximum in MYR for the entire trip and must not be exceeded for the optimized route.",
        `User destination: ${answer.destination}`,
        `Party size: ${answer.travelWith}`,
        `Trip length (days): ${answer.tripLength}`,
        `Budget (MYR): ${answer.budget}`,
        `Accommodation preference: ${answer.accommodation}`,
        `Food style: ${answer.foodStyle}`,
        `Avoids: ${answer.avoids.join(", ") || "None"}`,
        `Interests: ${answer.interests.join(", ") || "None"}`,
        "Use ONLY places from the provided data pool for itinerary stops.",
        "Data pool contains structured pricing/distance proxies and AI review summaries.",
        "You must identify hidden cost traps (queue delays, surge-prone transport, tourist trap pricing).",
        "Generate exactly 3 options with distinct trade-offs: optimized, naive, austerity.",
        "Compute hiddenCostsAvoided as naive.totalCost - optimized.totalCost (never negative).",
        "Maximize local SME allocation in optimized and austerity variants when feasible.",
        "Return ONLY JSON that matches this TypeScript type:",
        "{ analysisId: string; userBudget: number; primaryRecommendationId: string; economicRationale: string; hiddenCostsAvoided: number; options: Itinerary[] }",
        "Where Itinerary is:",
        "{ id: string; title: string; tagline: string; totalCost: number; vibe: string[]; coverEmoji: string; gradient: string; days: { label: string; stops: { time: string; name: string; category: string; duration: string; mapUrl: string; address: string; costEstimate: number; isLocalSme: boolean; aiInsight?: string }[] }[] }",
        "Every itinerary must include at least one day and at least three stops.",
        "Input user answers JSON:",
        JSON.stringify(answer),
        "Live place data pool JSON:",
        rawDataPool,
    ].join("\n");
}

async function geocodeDestination(destination: string, apiKey: string): Promise<LatLng | null> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${apiKey}`;
    const response = await fetch(url);

    if (!response.ok) {
        console.warn("[GeminiHelper] Geocode request failed.", {
            status: response.status,
            destination,
        });
        return null;
    }

    const payload = (await response.json()) as GeocodeApiResponse;
    const location = payload.results?.[0]?.geometry?.location;
    if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
        console.warn("[GeminiHelper] Geocode returned no usable location.", { destination });
        return null;
    }

    return location;
}

async function fetchNearbyDataPool(answer: Answer): Promise<Stop[]> {
    const placesApiKey = process.env.GOOGLE_PLACES_KEY ?? process.env.GOOGLE_MAPS_API_KEY;
    const destination = answer.destination.trim();

    if (!placesApiKey || !destination) {
        console.log("[GeminiHelper] Places API key or destination missing. Skipping Places enrichment.");
        return [];
    }

    const location = await geocodeDestination(destination, placesApiKey);
    if (!location) {
        return [];
    }

    try {
        const [restaurants, hotels, attractions] = await Promise.all([
            searchNearbyStops(placesApiKey, location.lat, location.lng, "restaurant", 2000, 5),
            searchNearbyStops(placesApiKey, location.lat, location.lng, "lodging", 3000, 3),
            searchNearbyStops(placesApiKey, location.lat, location.lng, "tourist_attraction", 4000, 4),
        ]);

        return [...restaurants, ...hotels, ...attractions]
            .filter((stop) => Boolean(stop.name && stop.mapUrl))
            .slice(0, DEFAULT_STOPS_POOL_LIMIT);
    } catch (error) {
        console.warn("[GeminiHelper] Places enrichment failed. Continuing without live places pool.", error);
        return [];
    }
}

function extractJson(text: string): string {
    const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    if (fencedMatch?.[1]) {
        return fencedMatch[1].trim();
    }

    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace >= 0 && lastBrace > firstBrace) {
        return text.slice(firstBrace, lastBrace + 1);
    }

    return text.trim();
}

function toFinancialStop(stop: {
    time: string;
    name: string;
    category: string;
    duration: string;
    mapUrl: string;
    address: string;
}): Stop {
    const baseCost = stop.category.toLowerCase().includes("cafe") || stop.category.toLowerCase().includes("lunch")
        ? 18
        : stop.category.toLowerCase().includes("dinner")
            ? 30
            : 8;

    return {
        ...stop,
        costEstimate: baseCost,
        isLocalSme: !stop.category.toLowerCase().includes("museum"),
        aiInsight: `Planned for lower queue pressure and better value around ${stop.time}.`,
    };
}

function toDecisionItinerary(source: (typeof ITINERARIES)[number], variant: "optimized" | "naive" | "austerity"): Itinerary {
    const multiplier = variant === "optimized" ? 0.9 : variant === "naive" ? 1.2 : 0.75;

    const days = source.days.map((day) => ({
        label: day.label,
        stops: day.stops.map((stop) => toFinancialStop(stop)),
    }));

    const totalCost = Math.round(
        days.reduce((acc, day) => acc + day.stops.reduce((sum, stop) => sum + stop.costEstimate, 0), 0) * multiplier,
    );

    const tagByVariant: Record<typeof variant, string> = {
        optimized: "AI Optimized",
        naive: "Convenience First",
        austerity: "Frugal Local",
    };

    return {
        id: `${source.id}-${variant}`,
        title: `${source.title} (${tagByVariant[variant]})`,
        tagline:
            variant === "optimized"
                ? "Balanced cost and experience with detours to avoid hidden expenses."
                : variant === "naive"
                    ? "Fastest path with premium convenience and less price filtering."
                    : "Lowest spend route with strong local SME support.",
        totalCost,
        vibe: [...source.vibe.slice(0, 2), tagByVariant[variant]],
        coverEmoji: source.coverEmoji,
        gradient: source.gradient,
        days,
    };
}

function fallbackDecisionAnalysis(answer: Answer): DecisionAnalysis {
    const baseOptions: Itinerary[] = [
        toDecisionItinerary(ITINERARIES[0], "optimized"),
        toDecisionItinerary(ITINERARIES[1], "naive"),
        toDecisionItinerary(ITINERARIES[2], "austerity"),
    ];

    const partySize = Math.max(1, Math.floor(answer.travelWith || 1));
    const tripDays = Math.max(1, Math.floor(answer.tripLength || 1));
    const userBudget = Math.max(100, Math.floor(answer.budget || 1200));

    const partyMultiplier = 0.6 + partySize * 0.4;
    const durationMultiplier = Math.max(1, tripDays / 2);
    const options = baseOptions.map((option) => ({
        ...option,
        totalCost: Math.round(option.totalCost * partyMultiplier * durationMultiplier),
    }));

    const primaryRecommendation = options[0];
    const hiddenCostsAvoided = Math.max(0, options[1].totalCost - primaryRecommendation.totalCost);

    return {
        analysisId: `analysis-${Date.now()}`,
        userBudget,
        primaryRecommendationId: primaryRecommendation.id,
        economicRationale:
            "The optimized route lowers queue-time spending and transport backtracking while preserving your key interests.",
        hiddenCostsAvoided,
        options,
    };
}

function isDecisionAnalysis(value: unknown): value is DecisionAnalysis {
    if (!value || typeof value !== "object") return false;
    const candidate = value as DecisionAnalysis;

    return (
        typeof candidate.analysisId === "string" &&
        typeof candidate.userBudget === "number" &&
        typeof candidate.primaryRecommendationId === "string" &&
        typeof candidate.economicRationale === "string" &&
        typeof candidate.hiddenCostsAvoided === "number" &&
        Array.isArray(candidate.options)
    );
}

export async function generateDecisionAnalysisWithGemini(answer: Answer): Promise<DecisionAnalysis> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.log("[GeminiHelper] GEMINI_API_KEY missing. Using fallback decision analysis.");
        return fallbackDecisionAnalysis(answer);
    }

    const nearbyStops = await fetchNearbyDataPool(answer);
    const prompt = buildPrompt(answer, JSON.stringify(nearbyStops));
    console.log("[GeminiHelper] Sending generateContent request", {
        model: GEMINI_MODEL,
        destination: answer.destination,
        budget: answer.budget,
        nearbyStopCount: nearbyStops.length,
    });

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [{ role: "user", parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.4,
                    },
                }),
            },
        );

        console.log("[GeminiHelper] Received generateContent response", {
            ok: response.ok,
            status: response.status,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn("[GeminiHelper] Non-OK Gemini response. Using fallback decision analysis.", {
                status: response.status,
                body: errorText,
            });
            return fallbackDecisionAnalysis(answer);
        }

        const payload = (await response.json()) as {
            candidates?: { content?: { parts?: { text?: string }[] } }[];
        };

        const text = payload.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) {
            console.warn("[GeminiHelper] Empty Gemini response text. Using fallback decision analysis.");
            return fallbackDecisionAnalysis(answer);
        }

        const parsed = JSON.parse(extractJson(text)) as unknown;
        if (!isDecisionAnalysis(parsed)) {
            console.warn("[GeminiHelper] Gemini JSON did not match DecisionAnalysis shape. Using fallback decision analysis.");
            return fallbackDecisionAnalysis(answer);
        }

        console.log("[GeminiHelper] Returning Gemini decision analysis", {
            analysisId: parsed.analysisId,
            optionCount: parsed.options.length,
        });

        return parsed;
    } catch (error) {
        console.error("[GeminiHelper] Request failed. Using fallback decision analysis.", error);
        return fallbackDecisionAnalysis(answer);
    }
}
