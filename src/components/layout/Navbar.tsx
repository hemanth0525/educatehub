
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import Container from '@/components/ui/Container';
import { Menu, X, User } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
  ];

  const authLinks = user 
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Log Out', path: '#', onClick: logout },
      ]
    : [
        { name: 'Log In', path: '/login' },
        { name: 'Register', path: '/register' },
      ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300',
        isScrolled 
          ? 'bg-white/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-xl font-medium tracking-tight"
          >
            Educate<span className="text-blue-600">Hub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-blue-600',
                    location.pathname === link.path 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center space-x-4">
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={link.onClick}
                  className={cn(
                    'text-sm font-medium transition-all px-4 py-2 rounded-full',
                    link.name === 'Log In' || link.name === 'Log Out'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  {link.name === 'Dashboard' ? (
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      {link.name}
                    </div>
                  ) : (
                    link.name
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden flex items-center"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-gray-700" />
            ) : (
              <Menu size={24} className="text-gray-700" />
            )}
          </button>
        </div>
      </Container>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white absolute top-full left-0 right-0 shadow-lg animate-fade-in">
          <Container className="py-4 flex flex-col space-y-6">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    'text-base font-medium py-2',
                    location.pathname === link.path 
                      ? 'text-blue-600' 
                      : 'text-gray-600'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col space-y-3">
              {authLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={link.onClick}
                  className={cn(
                    'text-center py-2 rounded-md transition-colors',
                    link.name === 'Log In' || link.name === 'Log Out'
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </Container>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
