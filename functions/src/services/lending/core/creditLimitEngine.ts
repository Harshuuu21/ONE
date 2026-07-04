import { getLatestIntelligence } from "../../intelligence/data/intelligenceRepository";
import { getUnifiedTrustScore } from "../../reputation/core/trustService";

export const calculateCreditLimit = async (uid: string): Promise<number> => {
    const intel = await getLatestIntelligence(uid);
    const trustScore = await getUnifiedTrustScore(uid);

    if (!intel) return 0;

    // Base credit limit is 50% of monthly free cashflow
    let baseLimit = intel.features.cashflow * 0.50;

    // Trust modifier: Trust score acts as a multiplier (0.5x to 1.5x)
    const trustMultiplier = 0.5 + (trustScore / 100);

    return Math.floor(baseLimit * trustMultiplier);
};
