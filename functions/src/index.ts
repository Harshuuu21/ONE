import { setGlobalOptions } from "firebase-functions/v2";

// Global Cost Control & Configuration
setGlobalOptions({ maxInstances: 10 });

// Export Modules
export * as identity from "./services/identity";
export * as financial from "./services/financial";
