import { db } from "../../../config/firebase";
import { TripDocument } from "../models/schemas";

export const persistTrip = async (trip: TripDocument): Promise<string> => {
    const docRef = db.collection("trips").doc();
    
    await docRef.set({
        ...trip,
        id: docRef.id
    });

    return docRef.id;
};
