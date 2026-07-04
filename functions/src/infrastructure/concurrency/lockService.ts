import { db } from "../../config/firebase";
import { logger } from "firebase-functions/v2";

export interface LockOptions {
    resourceId: string;
    ttlMs?: number; 
}

// Abstract Lock Interface for scalability (e.g. moving to Redis later)
export interface ILockService {
    acquireLock(options: LockOptions): Promise<boolean>;
    releaseLock(resourceId: string): Promise<void>;
    withLock<T>(options: LockOptions, callback: () => Promise<T>): Promise<T>;
}

class FirestoreLockService implements ILockService {
    private collection = "system_locks";
    private defaultTtl = 30000; // 30 seconds

    async acquireLock(options: LockOptions): Promise<boolean> {
        const { resourceId, ttlMs = this.defaultTtl } = options;
        const lockRef = db.collection(this.collection).doc(resourceId);

        try {
            return await db.runTransaction(async (transaction: any) => {
                const doc = await transaction.get(lockRef);
                const now = Date.now();

                if (doc.exists) {
                    const data = doc.data();
                    const expiresAt = data?.expiresAt || 0;
                    
                    // Lock is active and hasn't expired
                    if (now < expiresAt) {
                        return false;
                    }
                }

                // Acquire or override expired lock
                transaction.set(lockRef, {
                    acquiredAt: now,
                    expiresAt: now + ttlMs,
                    status: "LOCKED"
                });

                return true;
            });
        } catch (error) {
            logger.error(`Error acquiring lock for ${resourceId}`, error);
            return false;
        }
    }

    async releaseLock(resourceId: string): Promise<void> {
        const lockRef = db.collection(this.collection).doc(resourceId);
        try {
            await lockRef.delete();
        } catch (error) {
            logger.error(`Error releasing lock for ${resourceId}`, error);
        }
    }

    async withLock<T>(options: LockOptions, callback: () => Promise<T>): Promise<T> {
        const acquired = await this.acquireLock(options);
        if (!acquired) {
            throw new Error(`ResourceLocked: Could not acquire lock for ${options.resourceId}`);
        }

        try {
            return await callback();
        } finally {
            await this.releaseLock(options.resourceId);
        }
    }
}

// Export a singleton instance of the abstraction
export const lockService: ILockService = new FirestoreLockService();
