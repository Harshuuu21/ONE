import { auth } from '@/lib/firebase/config';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  UserCredential
} from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase/config';

export class AuthService {
  /**
   * Register a new user and call the backend registerUser function to provision their profile.
   */
  static async register(email: string, password: string, name: string): Promise<UserCredential> {
    // 1. Create Firebase Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // 2. Call backend registerUser Cloud Function
    const registerUserFn = httpsCallable<{ name: string }, any>(functions, 'identity-registerUser');
    await registerUserFn({ name });

    return userCredential;
  }

  /**
   * Log in an existing user.
   */
  static async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password);
  }

  /**
   * Log out the current user.
   */
  static async logout(): Promise<void> {
    await firebaseSignOut(auth);
  }
}
