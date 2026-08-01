/* ==========================================================================
   TaskFlow Firebase Service & SDK Initialization
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { 
  getFirestore, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

import { config } from "./config.js";

// Firebase web app configuration dynamically loaded from environment
const firebaseConfig = config.firebase;

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth & Providers
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore Database
const db = getFirestore(app);

export {
  app,
  auth,
  googleProvider,
  db,
  // Auth Functions
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  // Firestore Functions
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
};
