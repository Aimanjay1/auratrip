import "server-only";

import type { Answer, DecisionAnalysis, Itinerary, Stop } from "../data/newtypes";
import { ITINERARIES } from "../data/itineraries";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

function buildPrompt(answer: Answer): string {
    return [
        "You are an itinerary optimization assistant.",
        "Return ONLY JSON that matches this TypeScript type:",
        "{ analysisId: string; userBudget: number; primaryRecommendationId: string; economicRationale: string; hiddenCostsAvoided: number; options: Itinerary[] }",
        "Where Itinerary is:",
        "{ id: string; title: string; tagline: string; totalCost: number; vibe: string[]; coverEmoji: string; gradient: string; days: { label: string; stops: { time: string; name: string; category: string; duration: string; mapUrl: string; address: string; costEstimate: number; isLocalSme: boolean; aiInsight?: string }[] }[] }",
        "Create 3 options with distinct trade-offs: optimized, naive, austerity.",
        "Input user answers JSON:",
        JSON.stringify(answer),
    ].join("\n");
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
    const options: Itinerary[] = [
        toDecisionItinerary(ITINERARIES[0], "optimized"),
        toDecisionItinerary(ITINERARIES[1], "naive"),
        toDecisionItinerary(ITINERARIES[2], "austerity"),
    ];

    const budgetMap: Record<string, number> = {
        "Budget-friendly": 600,
        "Mid-range": 1200,
        "Comfortable splurge": 2200,
        "Go all out": 4000,
    };

    const userBudget = budgetMap[answer.budget] ?? 1200;
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

    const prompt = buildPrompt(answer);
    console.log("[GeminiHelper] Sending generateContent request", {
        model: GEMINI_MODEL,
        destination: answer.destination,
        budget: answer.budget,
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
