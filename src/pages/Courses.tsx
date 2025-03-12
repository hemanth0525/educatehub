import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import CourseGrid from '@/components/courses/CourseGrid';
import CourseFilters from '@/components/courses/CourseFilters';
import { useFirebaseCourses } from '@/hooks/useFirebaseCourses'; // updated hook import
import { Course } from '@/data/courses';

const Courses: React.FC = () => {
  const [filters, setFilters] = useState<Partial<Course>>({});
  const { courses, loading } = useFirebaseCourses(filters); // use firebase courses

  // Extract unique categories for filter dropdown
  const categories = Array.from(
    new Set(courses.map((course: Course) => course.category))
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold mb-2">All Courses</h1>
            <p className="text-gray-600">Browse our full catalog of courses</p>
          </div>

          <CourseFilters
            categories={categories}
            onFilterChange={setFilters}
          />

          <CourseGrid courses={courses} loading={loading} />
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
