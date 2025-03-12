import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

// Initialize Firebase Auth
const auth = getAuth();

// User registration with additional profile data
export async function registerUser(email: string, password: string, name: string, role: 'student' | 'tutor') {
  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user profile in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email,
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// User login
export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// User logout
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get user profile data
export async function getUserProfile(userId: string) {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return userDoc.data();
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Subscribe to auth state changes
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}