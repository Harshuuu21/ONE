import { db } from "../../../config/firebase";
import { CommunityDocument, CommunityMemberDocument, CommunityPostDocument } from "../models/schemas";

export const persistCommunity = async (community: CommunityDocument): Promise<string> => {
    const docRef = db.collection("communities").doc();
    await docRef.set({ ...community, id: docRef.id });
    return docRef.id;
};

export const persistCommunityMember = async (member: CommunityMemberDocument): Promise<string> => {
    const docRef = db.collection("community_members").doc();
    await docRef.set({ ...member, id: docRef.id });
    
    // Increment member count
    const communityRef = db.collection("communities").doc(member.communityId);
    await communityRef.update({ memberCount: FirebaseFirestore.FieldValue.increment(1) });
    
    return docRef.id;
};

export const persistPost = async (post: CommunityPostDocument): Promise<string> => {
    const docRef = db.collection("community_posts").doc();
    await docRef.set({ ...post, id: docRef.id });
    return docRef.id;
};

export const getCommunityPosts = async (communityId: string): Promise<CommunityPostDocument[]> => {
    const snapshot = await db.collection("community_posts")
        .where("communityId", "==", communityId)
        .orderBy("createdAt", "desc")
        .limit(100)
        .get();
        
    return snapshot.docs.map(doc => doc.data() as CommunityPostDocument);
};
