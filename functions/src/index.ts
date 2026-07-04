import { setGlobalOptions } from "firebase-functions/v2";

// Global Cost Control & Configuration
setGlobalOptions({ maxInstances: 10 });

// Export Modules
export * as identity from "./services/identity";
export * as financial from "./services/financial";
export * as intelligence from "./services/intelligence";
export * as goals from "./services/goals";
export * as planning from "./services/planning";
export * as travel from "./services/travel";
export * as community from "./services/community";
export * as reputation from "./services/reputation";
export * as lending from "./services/lending";
