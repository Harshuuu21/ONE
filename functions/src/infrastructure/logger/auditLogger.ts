import { db } from "../../config/firebase";

export const logAuditAction = async (action: string, uid: string, details: any = {}, correlationId?: string) => {
    await db.collection("audit_logs").add({
        action,
        uid,
        details,
        correlationId: correlationId || "none",
        timestamp: new Date().toISOString()
    });
};
