import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import CourseDetail from '@/components/courses/CourseDetail';
import { useFirebaseCourse } from '@/hooks/useFirebaseCourse';

const CourseDetails: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, loading, error } = useFirebaseCourse(courseId);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Redirect if course not found and we're done loading
    if (!loading && !course) {
      navigate('/courses', { replace: true });
    }
  }, [course, loading, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <Container>
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          ) : course ? (
            <CourseDetail course={course} />
          ) : (
            <div className="py-16 text-center">
              <h2 className="text-2xl font-bold">Course not found</h2>
              <p className="mt-2 text-gray-600">
                {error || "The course you're looking for doesn't exist."}
              </p>
            </div>
          )}
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetails;
