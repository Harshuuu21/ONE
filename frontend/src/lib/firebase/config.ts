import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);

if (process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
  if (!(auth as any)._emulatorConfigured) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    (auth as any)._emulatorConfigured = true;
  }
  if (!(db as any)._emulatorConfigured) {
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
    (db as any)._emulatorConfigured = true;
  }
  if (!(functions as any)._emulatorConfigured) {
    connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    (functions as any)._emulatorConfigured = true;
  }
}

export { app, auth, db, functions };
