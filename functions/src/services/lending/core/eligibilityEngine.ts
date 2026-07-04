import { getReputationProfile } from "../../reputation/data/reputationRepository";
import { getUserById } from "../../identity/data/userRepository";

export const checkBorrowerEligibility = async (uid: string): Promise<{ eligible: boolean; reason?: string }> => {
    const user = await getUserById(uid);
    if (!user) return { eligible: false, reason: "User not found." };
    if (!user.emailVerified) return { eligible: false, reason: "Email not verified." };
    if (user.status !== "ACTIVE") return { eligible: false, reason: "Account is not active." };

    const reputation = await getReputationProfile(uid);
    if (!reputation) return { eligible: false, reason: "No reputation profile found." };
    if (reputation.unifiedTrustScore < 30) return { eligible: false, reason: "Trust score is below minimum threshold." };
    
    // Future KYC compatibility could be checked here against user.kycStatus
    
    return { eligible: true };
};
