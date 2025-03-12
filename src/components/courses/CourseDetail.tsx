import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, BarChart2, Award, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/data/courses';
import CourseContentAccordion from './CourseContentAccordion';
import CourseAIAssistant from './CourseAIAssistant';

interface CourseDetailProps {
  course: Course;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course }) => {
  return (
    <>
      <Link to="/courses" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
        <ArrowLeft size={16} className="mr-1" />
        Back to Courses
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2 animate-fade-in">{course.title}</h1>
          <p className="text-gray-600 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {course.description}
          </p>

          <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3">
                <Clock className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                <h3 className="text-sm font-medium">Duration</h3>
                <p className="text-gray-500 text-sm">{course.duration || 'Self-paced'}</p>
              </div>
              <div className="text-center p-3">
                <Award className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                <h3 className="text-sm font-medium">Level</h3>
                <p className="text-gray-500 text-sm">{course.level || 'All Levels'}</p>
              </div>
              <div className="text-center p-3">
                <Users className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                <h3 className="text-sm font-medium">Enrolled</h3>
                <p className="text-gray-500 text-sm">
                  {course.students ? course.students.toLocaleString() : '0'} students
                </p>
              </div>
              <div className="text-center p-3">
                <BarChart2 className="mx-auto h-6 w-6 text-blue-600 mb-2" />
                <h3 className="text-sm font-medium">Rating</h3>
                <p className="text-gray-500 text-sm">{course.rating || 'Not rated'}</p>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">What you'll learn</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {course.learningOutcomes ? (
                  course.learningOutcomes.map((outcome, index) => (
                    <div key={index} className="flex items-start">
                      <CheckCircle size={16} className="text-green-500 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm">{outcome}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Learning outcomes not specified</p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Course Content</h2>
              {course.lessons && course.lessons.length > 0 ? (
                <CourseContentAccordion lessons={course.lessons} />
              ) : (
                <p className="text-sm text-gray-500">No lessons available</p>
              )}
            </div>

            {course.aiSystemPrompt && (
              <div>
                <h2 className="text-lg font-semibold mb-3">AI Assistant</h2>
                <CourseAIAssistant courseId={course.id} systemPrompt={course.aiSystemPrompt} />
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden sticky top-24 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <img
              src={course.image || 'https://placehold.co/600x400?text=Course+Image'}
              alt={course.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.currentTarget.src = 'https://placehold.co/600x400?text=Course+Image';
              }}
            />
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold">${course.price ? course.price.toFixed(2) : '0.00'}</span>
              </div>
              <Button className="w-full mb-4">Enroll Now</Button>

              <div className="text-sm text-gray-600 space-y-3">
                <div className="flex justify-between">
                  <span>Instructor:</span>
                  <span className="font-medium">{course.instructor || 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lessons:</span>
                  <span className="font-medium">{course.lessons ? course.lessons.length : 0}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span>
                  <span className="font-medium">{course.category || 'Uncategorized'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span className="font-medium">
                    {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString() :
                      course.createdAt ? new Date(course.createdAt).toLocaleDateString() :
                        'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CourseDetail;
