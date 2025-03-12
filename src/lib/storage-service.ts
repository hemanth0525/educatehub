import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const storage = getStorage();

// Upload course material file
export async function uploadCourseMaterial(
  courseId: string,
  file: File,
  type: 'transcript' | 'notes' | 'pdf'
) {
  try {
    // Create storage reference
    const storageRef = ref(storage, `courses/${courseId}/materials/${file.name}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Read file content for AI training purposes
    let content = '';
    if (type === 'transcript' || (type === 'notes' && file.type.includes('text'))) {
      try {
        content = await file.text();
      } catch (error) {
        console.error('Error reading file content:', error);
      }
    }

    // Store material metadata and content in Firestore
    const materialRef = collection(db, 'course_materials');
    const docRef = await addDoc(materialRef, {
      course_id: courseId,
      type,
      filename: file.name,
      url: downloadURL,
      content: content, // Store the actual content for AI training
      created_at: new Date(),
      size: file.size,
      content_type: file.type
    });

    return {
      id: docRef.id,
      url: downloadURL
    };
  } catch (error: any) {
    throw new Error(`Failed to upload material: ${error.message}`);
  }
}

// Store course embeddings
export async function storeCourseEmbeddings(
  courseId: string,
  embeddings: Array<{
    content: string;
    vector: number[];
    type: 'transcript' | 'material';
  }>
) {
  try {
    const embeddingsRef = collection(db, 'course_embeddings');

    // Store each embedding
    const promises = embeddings.map(embedding =>
      addDoc(embeddingsRef, {
        course_id: courseId,
        content: embedding.content,
        vector: embedding.vector,
        type: embedding.type,
        created_at: new Date()
      })
    );

    await Promise.all(promises);
    return true;
  } catch (error: any) {
    throw new Error(`Failed to store embeddings: ${error.message}`);
  }
}

// Get stored embeddings
export async function getStoredEmbeddings(courseId: string) {
  try {
    const embeddingsRef = collection(db, 'course_embeddings');
    const q = query(embeddingsRef, where('course_id', '==', courseId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error: any) {
    throw new Error(`Failed to get embeddings: ${error.message}`);
  }
}