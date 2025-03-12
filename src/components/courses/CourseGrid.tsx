
import React from 'react';
import CourseCard from './CourseCard';
import { Course } from '@/data/courses';

interface CourseGridProps {
  courses: Course[];
  loading: boolean;
}

const CourseGrid: React.FC<CourseGridProps> = ({ courses, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
            <div className="bg-gray-200 w-full h-48 rounded-md mb-4"></div>
            <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
            <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
            <div className="bg-gray-200 h-10 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-medium text-gray-900">No courses found</h3>
        <p className="mt-2 text-gray-500">Try adjusting your filters or search term</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, index) => (
        <CourseCard 
          key={course.id} 
          course={course}
          delay={index * 0.1 % 0.5} // Stagger animations but cap delay at 0.5s
        />
      ))}
    </div>
  );
};

export default CourseGrid;
