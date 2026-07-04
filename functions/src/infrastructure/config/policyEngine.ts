import { db } from "../../config/firebase";

export interface PlatformPolicies {
    version: string;
    createdAt: string;
    updatedAt: string;
    lending: {
        maxExposurePercentage: number;
        defaultTermMonths: number;
        lateFeePercentage: number;
        trustMultiplierBase: number;
        interestRates: {
            lowRisk: number;
            moderateRisk: number;
            highRisk: number;
        }
    };
    trust: {
        minimumScoreForVerified: number;
        fraudScoreThreshold: number;
    }
}

let cachedPolicies: PlatformPolicies | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 300000; // 5 minutes

export const getPlatformPolicies = async (): Promise<PlatformPolicies> => {
    const now = Date.now();
    
    if (cachedPolicies && (now - lastFetchTime) < CACHE_TTL) {
        return cachedPolicies;
    }

    try {
        const doc = await db.collection("platform_config").doc("policies").get();
        if (doc.exists) {
            cachedPolicies = doc.data() as PlatformPolicies;
            lastFetchTime = now;
            return cachedPolicies;
        }
    } catch (e) {
        // Log error
    }

    // Deterministic Default Policies (Fallback)
    const timestamp = new Date().toISOString();
    return {
        version: "1.0.0",
        createdAt: timestamp,
        updatedAt: timestamp,
        lending: {
            maxExposurePercentage: 0.20,
            defaultTermMonths: 6,
            lateFeePercentage: 0.10,
            trustMultiplierBase: 0.5,
            interestRates: {
                lowRisk: 0.05,
                moderateRisk: 0.08,
                highRisk: 0.15
            }
        },
        trust: {
            minimumScoreForVerified: 80,
            fraudScoreThreshold: 50
        }
    };
};
