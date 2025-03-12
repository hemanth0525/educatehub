
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import CourseCard from '../courses/CourseCard';
import { useCourses } from '@/hooks/use-courses';
import { ArrowRight } from 'lucide-react';

const FeaturedCourses: React.FC = () => {
  const { courses, loading } = useCourses();
  const featuredCourses = courses.slice(0, 3);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add('in-view');
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div 
          ref={sectionRef}
          className="section-transition"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Courses</h2>
            <p className="text-gray-600">
              Explore our most popular courses designed by industry experts
            </p>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-white rounded-xl p-4 shadow-sm animate-pulse">
                  <div className="bg-gray-200 w-full h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-6 w-3/4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
                  <div className="bg-gray-200 h-10 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredCourses.map((course, index) => (
                <CourseCard 
                  key={course.id} 
                  course={course}
                  delay={index * 0.1}
                />
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link
              to="/courses"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              View All Courses 
              <ArrowRight size={18} className="ml-1" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default FeaturedCourses;
