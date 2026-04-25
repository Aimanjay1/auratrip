// this should be new app/data/itineraries.ts

export type Answer = {
    destination: string;
    travelWith: number;
    tripLength: number;
    pace: string;
    budget: number;
    interests: string[];
    accommodation: string;
    foodStyle: string;
    avoids: string[];
};

export type Stop = {
    time: string;
    name: string;
    category: string;
    duration: string;
    mapUrl: string;
    address: string;
    // --- NEW FINANCIAL/AI FIELDS ---
    costEstimate: number;
    isLocalSme: boolean; // Highlights if this supports the local economy
    aiInsight?: string; // e.g., "Reddit warns of 1hr queues here at noon. Diverted to alternative."
};

export type Itinerary = {
    id: string;
    title: string;         // e.g., "The GLM Optimized Route"
    tagline: string;       // e.g., "Maximum savings, high local SME support."
    totalCost: number;     // The calculated cost of this specific route
    vibe: string[];        // Keep your aesthetic tags! (e.g., ["Budget", "Local", "Walking"])
    coverEmoji: string;
    gradient: string;
    days: { label: string; stops: Stop[] }[];
};

// --- NEW PARENT WRAPPER FOR THE BACKEND MAPPING ---
export type DecisionAnalysis = {
    analysisId: string;
    userBudget: number;
    primaryRecommendationId: string; // Points to the winning itinerary
    economicRationale: string;       // The GLM's explanation of the trade-offs
    hiddenCostsAvoided: number;      // Core hackathon metric
    options: Itinerary[];            // Array of the 3 routes (Optimized, Naive, Austerity)
};