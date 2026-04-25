import type { DecisionAnalysis } from "../data/newtypes";

export const DECISION_ANALYSIS_STORAGE_KEY = "auratrip.decisionAnalysisById";
const DECISION_ANALYSIS_ITEM_PREFIX = "auratrip.decisionAnalysis.";

export type DecisionAnalysisDictionary = Record<string, DecisionAnalysis>;

function toItemStorageKey(key: string): string {
    return `${DECISION_ANALYSIS_ITEM_PREFIX}${key}`;
}

function parseDecisionAnalysis(raw: string): DecisionAnalysis | null {
    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return null;
        }
        return parsed as DecisionAnalysis;
    } catch {
        return null;
    }
}

function readLegacyDecisionAnalysisDictionary(): DecisionAnalysisDictionary {
    const raw = localStorage.getItem(DECISION_ANALYSIS_STORAGE_KEY);
    if (!raw) return {};

    try {
        const parsed = JSON.parse(raw) as unknown;
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
            return {};
        }

        return parsed as DecisionAnalysisDictionary;
    } catch {
        localStorage.removeItem(DECISION_ANALYSIS_STORAGE_KEY);
        return {};
    }
}

function migrateLegacyDictionaryIfNeeded(): void {
    const legacy = readLegacyDecisionAnalysisDictionary();
    const entries = Object.entries(legacy);
    if (entries.length === 0) return;

    for (const [key, analysis] of entries) {
        localStorage.setItem(toItemStorageKey(key), JSON.stringify(analysis));
    }

    localStorage.removeItem(DECISION_ANALYSIS_STORAGE_KEY);
}

export function readDecisionAnalysisDictionary(): DecisionAnalysisDictionary {
    if (typeof window === "undefined") return {};

    migrateLegacyDictionaryIfNeeded();

    const result: DecisionAnalysisDictionary = {};
    for (let index = 0; index < localStorage.length; index += 1) {
        const storageKey = localStorage.key(index);
        if (!storageKey || !storageKey.startsWith(DECISION_ANALYSIS_ITEM_PREFIX)) {
            continue;
        }

        const itemValue = localStorage.getItem(storageKey);
        if (!itemValue) {
            continue;
        }

        const analysis = parseDecisionAnalysis(itemValue);
        if (!analysis) {
            localStorage.removeItem(storageKey);
            continue;
        }

        const key = storageKey.slice(DECISION_ANALYSIS_ITEM_PREFIX.length);
        if (key) {
            result[key] = analysis;
        }
    }

    return result;
}

export function writeDecisionAnalysisDictionary(data: DecisionAnalysisDictionary): void {
    if (typeof window === "undefined") return;

    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
        const storageKey = localStorage.key(index);
        if (storageKey && storageKey.startsWith(DECISION_ANALYSIS_ITEM_PREFIX)) {
            localStorage.removeItem(storageKey);
        }
    }

    for (const [key, analysis] of Object.entries(data)) {
        localStorage.setItem(toItemStorageKey(key), JSON.stringify(analysis));
    }

    localStorage.removeItem(DECISION_ANALYSIS_STORAGE_KEY);
}

export function upsertDecisionAnalysis(analysis: DecisionAnalysis): string {
    const key = analysis.analysisId;
    if (typeof window !== "undefined") {
        migrateLegacyDictionaryIfNeeded();
        localStorage.setItem(toItemStorageKey(key), JSON.stringify(analysis));
    }
    return key;
}

export function readDecisionAnalysisByKey(key: string): DecisionAnalysis | null {
    if (typeof window === "undefined") return null;

    migrateLegacyDictionaryIfNeeded();

    const raw = localStorage.getItem(toItemStorageKey(key));
    if (!raw) return null;

    const analysis = parseDecisionAnalysis(raw);
    if (!analysis) {
        localStorage.removeItem(toItemStorageKey(key));
        return null;
    }

    return analysis;
}
