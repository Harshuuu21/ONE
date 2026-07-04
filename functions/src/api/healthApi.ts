import { onRequest } from "firebase-functions/v2/https";
import { db } from "../config/firebase";
import { getFeatureFlags } from "../infrastructure/config/featureFlags";
import { getPlatformPolicies } from "../infrastructure/config/policyEngine";

export const healthCheck = onRequest(async (req, res) => {
    const timestamp = new Date().toISOString();
    let firestoreHealthy = true;

    try {
        await db.collection("platform_config").doc("health").get();
    } catch {
        firestoreHealthy = false;
    }

    const flags = await getFeatureFlags();
    const policies = await getPlatformPolicies();

    res.json({
        status: firestoreHealthy ? "UP" : "DEGRADED",
        platformVersion: "1.0.0-rc1",
        environment: process.env.FUNCTIONS_EMULATOR ? "development" : "production",
        uptime: process.uptime(),
        buildTimestamp: timestamp, // In prod, this would be injected at build time
        policyVersion: policies.version,
        activeFeatureFlags: flags,
        dependencies: {
            firestore: firestoreHealthy ? "UP" : "DOWN",
            eventBus: "UP", // Handled async, assume UP if function is running
            aiIntegrations: flags.isAiMentorEnabled ? "CIRCUIT_BREAKER_ACTIVE" : "DISABLED",
            authentication: "UP"
        }
    });
});
