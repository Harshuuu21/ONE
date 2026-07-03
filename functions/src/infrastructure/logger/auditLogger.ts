import { db } from "../../config/firebase";

export const logAuditAction = async (action: string, uid: string, details: any = {}) => {
    await db.collection("audit_logs").add({
        action,
        uid,
        details,
        timestamp: new Date().toISOString()
    });
};
