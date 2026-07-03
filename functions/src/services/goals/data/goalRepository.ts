import { db } from "../../../config/firebase";
import { GoalDocument } from "../models/schemas";

export const persistGoal = async (goal: GoalDocument): Promise<string> => {
    const docRef = db.collection("goals").doc();
    
    await docRef.set({
        ...goal,
        id: docRef.id
    });

    return docRef.id;
};

export const getActiveGoals = async (uid: string): Promise<GoalDocument[]> => {
    const snapshot = await db.collection("goals")
        .where("uid", "==", uid)
        .where("status", "==", "ACTIVE")
        .get();
        
    return snapshot.docs.map(doc => doc.data() as GoalDocument);
};
