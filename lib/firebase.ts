import { getApps, getApp, initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  type Firestore,
} from "firebase/firestore";
import type { DatePlan } from "./types";

// Firebase web config is safe to be public — access is controlled by
// Firestore security rules (see firestore.rules), not by hiding these values.
// Env vars override the defaults so you can point at a different project.
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ??
    "AIzaSyDYQJ3zW6JeuOXk0SFGFs7GynbeS5p-pcg",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ??
    "kjojjh-604b1.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? "kjojjh-604b1",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ??
    "kjojjh-604b1.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? "636810235731",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ??
    "1:636810235731:web:d423cee7c478a910db1ba6",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId
);

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!isFirebaseConfigured) return null;
  if (!db) {
    const app: FirebaseApp = getApps().length
      ? getApp()
      : initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

/**
 * Persists the chosen coffee plan to Firestore ("coffeeDates" collection).
 * Never throws — returns a small status so the UI can carry on either way.
 */
export async function savePlan(
  plan: DatePlan
): Promise<{ saved: boolean; reason?: string }> {
  const database = getDb();
  if (!database) {
    console.info("[savePlan] Firebase not configured — skipping save.", plan);
    return { saved: false, reason: "not-configured" };
  }
  try {
    await addDoc(collection(database, "coffeeDates"), plan);
    return { saved: true };
  } catch (err) {
    console.error("[savePlan] Failed to save plan:", err);
    return { saved: false, reason: "error" };
  }
}
