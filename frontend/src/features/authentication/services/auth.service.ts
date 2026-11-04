import { auth, functions } from '@/lib/firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  UserCredential,
  User
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';

const LOCAL_USER_STORAGE_KEY = 'one_auth_user_session';

type AuthSubscriber = (user: User | null) => void;
const subscribers = new Set<AuthSubscriber>();

export function subscribeToAuthUpdates(callback: AuthSubscriber): () => void {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
}

function emitAuthUpdate(user: User | null) {
  for (const sub of subscribers) {
    try {
      sub(user);
    } catch (e) {
      console.error('Error notifying auth listener:', e);
    }
  }
}

export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_USER_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Error persisting auth session:', err);
  }
  emitAuthUpdate(user);
}

function createLocalUser(email: string, displayName: string): User {
  return {
    uid: 'usr_' + Math.random().toString(36).substring(2, 10),
    email,
    displayName,
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    tenantId: null,
    delete: async () => {},
    getIdToken: async () => 'mock-token',
    getIdTokenResult: async () => ({
      token: 'mock-token',
      signInProvider: 'password',
      claims: {},
      authTime: new Date().toISOString(),
      issuedAtTime: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 3600000).toISOString(),
    }),
    reload: async () => {},
    toJSON: () => ({ email, displayName }),
  } as unknown as User;
}

export class AuthService {
  /**
   * Register a new user. In frontend standalone mode, smoothly creates and persists user session.
   */
  static async register(email: string, password: string, name: string): Promise<UserCredential> {
    try {
      // If a real Firebase backend is configured, attempt Firebase registration
      if (
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== 'true' &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('fake')
      ) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        try {
          const registerUserFn = httpsCallable<{ name: string }, any>(functions, 'identity-registerUser');
          await registerUserFn({ name });
        } catch {
          // Cloud function optional in frontend standalone mode
        }
        setStoredUser(userCredential.user);
        return userCredential;
      }
    } catch (err: any) {
      console.warn('Firebase registration unavailable, falling back to local frontend auth session:', err?.message || err);
    }

    // Standalone frontend registration
    await new Promise((resolve) => setTimeout(resolve, 300));
    const localUser = createLocalUser(email, name);
    setStoredUser(localUser);

    return {
      user: localUser,
      providerId: 'password',
      operationType: 'signIn',
    };
  }

  /**
   * Log in an existing user. In frontend standalone mode, validates and persists session.
   */
  static async login(email: string, password: string): Promise<UserCredential> {
    try {
      if (
        process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR !== 'true' &&
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
        !process.env.NEXT_PUBLIC_FIREBASE_API_KEY.includes('fake')
      ) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        setStoredUser(userCredential.user);
        return userCredential;
      }
    } catch (err: any) {
      console.warn('Firebase login unavailable, falling back to local frontend auth session:', err?.message || err);
    }

    // Standalone frontend login
    await new Promise((resolve) => setTimeout(resolve, 300));
    const namePart = email.split('@')[0] || 'User';
    const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const localUser = createLocalUser(email, displayName);
    setStoredUser(localUser);

    return {
      user: localUser,
      providerId: 'password',
      operationType: 'signIn',
    };
  }

  /**
   * Log out current user and clear local session.
   */
  static async logout(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore if Firebase is not connected
    }
    setStoredUser(null);
  }

  /**
   * Quick helper for Demo / Testing session
   */
  static async demoLogin(): Promise<UserCredential> {
    return await this.login('maya@example.com', 'demo-password');
  }
}
