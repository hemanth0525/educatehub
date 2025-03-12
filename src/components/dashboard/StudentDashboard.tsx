
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Book, Clock, Award, BarChart3, ArrowRight, Bot } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Mock enrolled courses (in a real app, this would come from an API)
  const enrolledCourses = [
    {
      id: "1",
      title: "Web Development Fundamentals",
      instructor: "Sarah Johnson",
      progress: 45,
      image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2831&auto=format&fit=crop",
      nextLesson: "JavaScript Basics",
    },
    {
      id: "5",
      title: "Advanced JavaScript and React",
      instructor: "David Wilson",
      progress: 20,
      image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?q=80&w=2940&auto=format&fit=crop",
      nextLesson: "React Fundamentals",
    },
  ];
  
  const stats = [
    { label: "Enrolled Courses", value: "2", icon: Book, color: "bg-blue-100 text-blue-600" },
    { label: "Hours Learning", value: "15", icon: Clock, color: "bg-green-100 text-green-600" },
    { label: "Certificates", value: "0", icon: Award, color: "bg-purple-100 text-purple-600" },
    { label: "Progress", value: "32%", icon: BarChart3, color: "bg-orange-100 text-orange-600" },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-blue-50 rounded-xl p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600">
              Continue learning and track your progress.
            </p>
          </div>
          <Link
            to="/courses"
            className="mt-4 md:mt-0 inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-medium transition-colors hover:bg-blue-700"
          >
            Browse More Courses
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center"
          >
            <div className={cn("rounded-full p-3 mr-4", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      {/* AI Assistant Card */}
      <div className="mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl overflow-hidden shadow-md">
        <div className="p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-start mb-4 md:mb-0">
              <div className="bg-white rounded-full p-3 mr-4 text-blue-600">
                <Bot size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold mb-1">AI Learning Assistant</h2>
                <p className="text-blue-100">
                  Get instant help with your courses, concepts, and questions
                </p>
              </div>
            </div>
            <Link
              to="/ai-assistant"
              className="inline-flex items-center bg-white text-blue-600 px-4 py-2 rounded-full font-medium transition-colors hover:bg-blue-50"
            >
              Ask a Question
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">My Courses</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <div 
              key={course.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover-scale"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 sm:w-2/3">
                  <h3 className="font-medium mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">by {course.instructor}</p>
                  
                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-blue-600 h-2.5 rounded-full" 
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <Link
                    to={`/courses/${course.id}`}
                    className="inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-700"
                  >
                    Continue: {course.nextLesson}
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
