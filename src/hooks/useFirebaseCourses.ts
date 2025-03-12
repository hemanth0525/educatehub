import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // assumes firebase is initialized
import { Course } from '@/data/courses';

export const useFirebaseCourses = (filters: Partial<Course> = {}) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCourses() {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'courses'));
                let coursesData = querySnapshot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id // Ensure the ID is included in the data
                })) as Course[];

                // Apply simple filter if provided
                coursesData = coursesData.filter((c) => {
                    return Object.entries(filters).every(([key, value]) => c[key as keyof Course] === value);
                });
                setCourses(coursesData);
            } catch (error) {
                console.error('Error fetching courses:', error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        }
        fetchCourses();
    }, [filters]);

    return { courses, loading };
};
