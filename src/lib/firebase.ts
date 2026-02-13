import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth as _getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type Auth,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Demo mode: true when Firebase env vars are not configured
export const isDemoMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === "your_api_key";

let app: FirebaseApp | undefined;
let auth: Auth | undefined;

function getFirebaseApp() {
  if (isDemoMode) return undefined;
  if (!app) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  }
  return app;
}

function getFirebaseAuth() {
  if (isDemoMode) return null;
  if (!auth) {
    const firebaseApp = getFirebaseApp();
    if (!firebaseApp) return null;
    auth = _getAuth(firebaseApp);
  }
  return auth;
}

const googleProvider = isDemoMode ? null : new GoogleAuthProvider();

export {
  getFirebaseAuth as getAuth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
};
