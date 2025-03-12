import React from 'react';
import { Link } from 'react-router-dom';
import { Course } from '@/data/courses';
import { cn } from '@/lib/utils';
import { Users, Clock, BarChart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  delay?: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, delay = 0 }) => {
  return (
    <Link
      to={`/courses/${course.id}`}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all hover-scale",
        "opacity-0 animate-fade-in group"
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={course.image || 'https://placehold.co/300x200?text=No+Image'}
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = 'https://placehold.co/300x200?text=Course+Image';
          }}
        />
        <div className="absolute top-3 right-3 bg-white text-sm font-medium px-2 py-1 rounded-lg shadow">
          ${course.price?.toFixed(2) || '0.00'}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center mb-2">
          <span className={cn(
            "text-xs font-medium mr-2 px-2.5 py-0.5 rounded",
            course.level === "Beginner" ? "bg-green-100 text-green-800" :
              course.level === "Intermediate" ? "bg-blue-100 text-blue-800" :
                "bg-purple-100 text-purple-800"
          )}>
            {course.level || 'All Levels'}
          </span>
          <span className="text-xs text-gray-500">
            {course.category || 'Uncategorized'}
          </span>
        </div>

        <h3 className="font-semibold text-lg mb-1 transition-colors group-hover:text-blue-600">
          {course.title}
        </h3>

        <p className="text-sm text-gray-500 mb-3">
          by {course.instructor || 'Unknown Instructor'}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          {course.duration && (
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              {course.duration}
            </div>
          )}

          {course.students !== undefined && (
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              {course.students.toLocaleString()}
            </div>
          )}

          {course.rating !== undefined && (
            <div className="flex items-center">
              <BarChart size={16} className="mr-1" />
              {course.rating}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {course.lessons?.length || 0} lessons
          </span>
          <span className="text-blue-600 text-sm font-medium">
            View Details
          </span>
        </div>
        <div>
          {course.createdAt ? new Date(course.createdAt).toLocaleString() : ''}
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;
