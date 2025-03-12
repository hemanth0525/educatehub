
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import { useAuth } from '@/context/AuthContext';

const Dashboard: React.FC = () => {
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

  // Redirect tutors to tutor dashboard
  if (user.role === 'tutor') {
    return <Navigate to="/tutor-dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <StudentDashboard />
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
