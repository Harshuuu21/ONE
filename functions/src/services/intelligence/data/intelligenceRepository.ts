import { db } from "../../../config/firebase";
import { FinancialIntelligenceSnapshot } from "../models/schemas";

export const persistIntelligenceSnapshot = async (snapshot: FinancialIntelligenceSnapshot): Promise<void> => {
    // Generate a compound ID to ensure we overwrite the exact snapshot for the given period
    const docId = `${snapshot.uid}_${snapshot.type}_${snapshot.periodId}`;
    
    // Persist to the handbook-defined financial_intelligence collection
    await db.collection("financial_intelligence").doc(docId).set(snapshot, { merge: true });
};

// Helper to fetch the most recent 'current' snapshot for a user to use in calculations
export const getLatestIntelligence = async (uid: string): Promise<FinancialIntelligenceSnapshot | null> => {
    const docId = `${uid}_current_latest`;
    const doc = await db.collection("financial_intelligence").doc(docId).get();
    if (!doc.exists) return null;
    return doc.data() as FinancialIntelligenceSnapshot;
};
