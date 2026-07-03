import { db } from "../../../config/firebase";
import { TransactionDocument } from "../models/schemas";

export const persistTransaction = async (transaction: TransactionDocument): Promise<string> => {
    // Standardize to the exact 'transactions' collection as required by Handbook
    const docRef = db.collection("transactions").doc();
    
    await docRef.set({
        ...transaction,
        id: docRef.id
    });

    return docRef.id;
};
