
import React from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 py-12 mt-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="text-xl font-medium tracking-tight">
              Educate<span className="text-blue-600">Hub</span>
            </Link>
            <p className="mt-4 text-sm text-gray-600 max-w-xs">
              Empowering learners worldwide with accessible, high-quality education.
            </p>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Account</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/login" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-sm font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            © {new Date().getFullYear()} EducateHub. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
