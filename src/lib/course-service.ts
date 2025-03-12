import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

// Function to store course data in Firestore
export async function storeCourse(courseData: any) {
    try {
        const coursesRef = collection(db, 'courses');
        const docRef = await addDoc(coursesRef, courseData);
        return docRef.id;
    } catch (error) {
        console.error('Error storing course in Firebase:', error);
        throw error;
    }
}
