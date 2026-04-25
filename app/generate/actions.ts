"use server";

import type { Answer, DecisionAnalysis } from "../data/newtypes";
import { generateDecisionAnalysisWithGemini } from "../lib/gemini";

export async function generateDecisionAnalysisAction(answer: Answer): Promise<DecisionAnalysis> {
    const requestId = `sa-${Date.now()}`;
    console.log("[GenerateAction] Start", {
        requestId,
        destination: answer.destination,
        budget: answer.budget,
    });

    try {
        const result = await generateDecisionAnalysisWithGemini(answer);
        console.log("[GenerateAction] Success", {
            requestId,
            analysisId: result.analysisId,
            optionCount: result.options.length,
        });
        return result;
    } catch (error) {
        console.error("[GenerateAction] Failed", { requestId, error });
        throw error;
    }
}
