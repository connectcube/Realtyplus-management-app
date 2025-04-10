// app/firebase/config.ts

import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  GithubAuthProvider,
  GoogleAuthProvider,
  setPersistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// Your Firebase configuration object
const firebaseConfig = {
  apiKey: import.meta.env.FIREBASE_API_KEY,
  authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.FIREBASE_APP_ID,
  measurementId: import.meta.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Auth and Google Provider
const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log("Persistence set to browserLocalPersistence"))
  .catch((error) => console.error("Error setting persistence: ", error));
// Initialize Firestore
const fireDataBase = getFirestore(firebaseApp);
const fireStorage = getStorage(firebaseApp);
export {
  firebaseApp,
  auth,
  googleProvider,
  githubProvider,
  fireDataBase,
  fireStorage,
};
