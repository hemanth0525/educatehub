import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// Firebase configuration replaced with Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // added measurementId
};

// Initialize Firebase only if no app exists
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Function to get course materials for AI training
export async function getCourseMaterials(courseId: string) {
  try {
    const materialsRef = collection(db, 'course_materials');
    const q = query(materialsRef, where('course_id', '==', courseId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching course materials:', error);
    return [];
  }
}

// Fetch course transcripts
export async function getCourseTranscripts(courseId: string) {
  try {
    const transcriptsRef = collection(db, 'course_materials');
    const q = query(transcriptsRef,
      where('course_id', '==', courseId),
      where('type', '==', 'transcript')
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching course transcripts:', error);
    return [];
  }
}

// Function to log a question and response for analytics
export async function logChatInteraction(courseId: string, userId: string | null, question: string, response: string) {
  try {
    const interactionsRef = collection(db, 'chat_interactions');
    await addDoc(interactionsRef, {
      course_id: courseId,
      user_id: userId,
      question,
      response,
      created_at: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error logging chat interaction:', error);
    return false;
  }
}
