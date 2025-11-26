// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "VITE_KEY_FIREBASE",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "modul4-1747b.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "modul4-1747b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "modul4-1747b.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "784858061545",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:784858061545:web:27cf15a60a8f28fc72ae78",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-850N3PFX0Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

const storage = getStorage(app);

export { storage, analytics };