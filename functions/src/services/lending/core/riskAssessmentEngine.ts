import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { getUnifiedTrustScore } from "../../reputation/core/trustService";

export const calculateRisk = async (uid: string): Promise<"low" | "moderate" | "high" | "extreme"> => {
    const intel = await getLatestIntelligence(uid);
    const trustScore = await getUnifiedTrustScore(uid);

    if (!intel) return "extreme"; // No financial data = extreme risk

    // Extreme conditions
    if (intel.signals.incomeStability === "volatile" && trustScore < 40) return "extreme";

    // High conditions
    if (intel.features.riskLevel === "high" || trustScore < 60) return "high";

    // Moderate conditions
    if (intel.features.riskLevel === "moderate" || (trustScore >= 60 && trustScore < 80)) return "moderate";

    // Low conditions
    return "low";
};
