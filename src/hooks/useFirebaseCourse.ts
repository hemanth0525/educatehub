import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course } from '@/data/courses';

export const useFirebaseCourse = (courseId: string | undefined) => {
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCourse() {
            if (!courseId) {
                setCourse(null);
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const docRef = doc(db, 'courses', courseId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    // Merge the document ID with the data since Firebase stores them separately
                    const courseData = {
                        ...docSnap.data(),
                        id: docSnap.id // Ensure the ID is included in the data
                    } as Course;

                    setCourse(courseData);
                    console.log("Course data retrieved:", courseData); // Debug log
                } else {
                    console.log("No course found with ID:", courseId); // Debug log
                    setCourse(null);
                    setError('Course not found');
                }
            } catch (err) {
                console.error('Error fetching course:', err);
                setCourse(null);
                setError('Error fetching course');
            } finally {
                setLoading(false);
            }
        }

        fetchCourse();
    }, [courseId]);

    return { course, loading, error };
};
