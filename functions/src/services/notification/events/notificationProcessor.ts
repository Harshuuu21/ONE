import { createIdempotentProcessor } from "../../../infrastructure/orchestration/eventManager";
import { SystemEvents } from "../../../infrastructure/orchestration/eventBus";
import { logger } from "firebase-functions/v2";
import { db } from "../../../config/firebase";

interface NotificationPayload {
    uid: string;
    title: string;
    body: string;
    priority: "LOW" | "NORMAL" | "HIGH" | "URGENT";
    scheduledFor?: string; 
    status: "PENDING" | "DELIVERED" | "FAILED";
}

const persistNotification = async (payload: NotificationPayload) => {
    // Deduplication strategy: Query for recent identical notifications to prevent spam
    const recent = await db.collection("notifications")
        .where("uid", "==", payload.uid)
        .where("title", "==", payload.title)
        .where("status", "==", "PENDING")
        .limit(1)
        .get();

    if (!recent.empty) {
        logger.info("Deduplicated notification", { title: payload.title });
        return;
    }

    await db.collection("notifications").add(payload);
    // In a real system, an async worker would pick up PENDING notifications and deliver them via FCM/Email
};

export const processNotifications = createIdempotentProcessor(
    {
        eventType: "one-events",
        // Wildcard or no filter, we will handle specific events here
    },
    async (event) => {
        const { type, data } = event.data;

        switch (type) {
            case SystemEvents.LENDING_LOAN_ACTIVE:
                await persistNotification({
                    uid: data.borrowerUid,
                    title: "Loan Approved & Active",
                    body: "Your community loan has been fully activated.",
                    priority: "URGENT",
                    status: "PENDING"
                });
                break;
            case SystemEvents.LENDING_PENALTY_APPLIED:
                await persistNotification({
                    uid: data.borrowerUid,
                    title: "Penalty Applied",
                    body: "A penalty has been applied to your loan due to missed payment.",
                    priority: "URGENT",
                    status: "PENDING"
                });
                break;
            case SystemEvents.GOAL_ACHIEVED:
                await persistNotification({
                    uid: data.uid,
                    title: "Goal Achieved!",
                    body: `Congratulations! You reached your goal.`,
                    priority: "NORMAL",
                    status: "PENDING"
                });
                break;
        }
    }
);
