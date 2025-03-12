
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/context/AuthContext';

const Register: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center mb-8 animate-fade-in">
              Create Your Account
            </h1>
            <AuthForm type="register" />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
