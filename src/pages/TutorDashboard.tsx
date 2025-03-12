
import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { PlusCircle, BookOpen, Users, BarChart3, FileText } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const TutorDashboard: React.FC = () => {
  const { user, loading } = useAuth();
  
  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Tutor Dashboard</h1>
            <p className="text-gray-600">
              Create and manage your courses and track student engagement
            </p>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Courses</h2>
            <Link to="/create-course">
              <Button className="flex items-center gap-2">
                <PlusCircle size={16} />
                Create New Course
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {/* Placeholder for courses - in a real app this would be dynamically populated */}
            <div className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gray-100 h-40 flex items-center justify-center">
                <BookOpen className="text-gray-400" size={48} />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2">Create Your First Course</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Start by adding course details, lessons, and materials
                </p>
                <Link to="/create-course">
                  <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                    <PlusCircle size={16} />
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 p-3 rounded-lg mr-4">
                  <BookOpen className="text-blue-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600">Published Courses</div>
                </div>
              </div>
              <div className="h-2 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full w-0"></div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 p-3 rounded-lg mr-4">
                  <Users className="text-green-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
              </div>
              <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600 rounded-full w-0"></div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="bg-purple-100 p-3 rounded-lg mr-4">
                  <BarChart3 className="text-purple-600" size={20} />
                </div>
                <div>
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-gray-600">AI Assistant Interactions</div>
                </div>
              </div>
              <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full w-0"></div>
              </div>
            </div>
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default TutorDashboard;
