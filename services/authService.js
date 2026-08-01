/* ==========================================================================
   TaskFlow Firebase Authentication Service
   ========================================================================== */

import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from './firebase.js';
import { storage, STORAGE_KEYS } from '../utils/storage.js';

export const authService = {
  // Trigger Google OAuth Popup Sign-In
  async loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      const formattedUser = {
        uid: user.uid,
        name: user.displayName || 'Google User',
        email: user.email || '',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        department: 'Engineering',
        role: 'Team Member'
      };

      storage.set(STORAGE_KEYS.CURRENT_USER, formattedUser);
      return formattedUser;
    } catch (error) {
      throw error;
    }
  },

  // Firebase Sign Out
  async logout() {
    try {
      await signOut(auth);
      storage.remove(STORAGE_KEYS.CURRENT_USER);
    } catch (error) {
      storage.remove(STORAGE_KEYS.CURRENT_USER);
    }
  },

  // Get Active Logged In User
  getCurrentUser() {
    const firebaseUser = auth.currentUser;
    if (firebaseUser) {
      return {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || 'Google User',
        email: firebaseUser.email || '',
        avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        department: 'Engineering',
        role: 'Team Member'
      };
    }
    return storage.get(STORAGE_KEYS.CURRENT_USER, null);
  },

  // Subscribe to Firebase Auth State Changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        const formattedUser = {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email || '',
          avatar: user.photoURL || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
          department: 'Engineering',
          role: 'Team Member'
        };
        storage.set(STORAGE_KEYS.CURRENT_USER, formattedUser);
        callback(formattedUser);
      } else {
        storage.remove(STORAGE_KEYS.CURRENT_USER);
        callback(null);
      }
    });
  }
};
