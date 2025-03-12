
import { useState, useEffect, useMemo } from "react";
import { courses, Course } from "../data/courses";

type Filters = {
  category?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  minPrice?: number;
  maxPrice?: number;
  search?: string;
};

export function useCourses(filters: Filters = {}) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Apply category filter
      if (filters.category && course.category !== filters.category) {
        return false;
      }
      
      // Apply level filter
      if (filters.level && course.level !== filters.level) {
        return false;
      }
      
      // Apply price filter
      if (filters.minPrice !== undefined && course.price < filters.minPrice) {
        return false;
      }
      
      if (filters.maxPrice !== undefined && course.price > filters.maxPrice) {
        return false;
      }
      
      // Apply search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          course.title.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
        );
      }
      
      return true;
    });
  }, [filters]);
  
  const getCourseById = (id: string): Course | undefined => {
    return courses.find((course) => course.id === id);
  };
  
  return {
    courses: filteredCourses,
    loading,
    getCourseById,
  };
}
