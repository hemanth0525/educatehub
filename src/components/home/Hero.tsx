
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from '@/components/ui/Container';
import { ArrowRight } from 'lucide-react';

const Hero: React.FC = () => {
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroImg = document.querySelector('.hero-image') as HTMLElement;
      if (heroImg) {
        heroImg.style.transform = `translateY(${scrollY * 0.1}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="pt-32 pb-16 md:pb-24 overflow-hidden">
      <Container>
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 pb-10 md:pb-0 md:pr-10">
            <div className="max-w-xl space-y-6 animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                Elevate Your Future Through <span className="text-blue-600">Education</span>
              </h1>
              <p className="text-lg text-gray-600">
                Discover expert-led courses designed to help you master in-demand skills, 
                advance your career, and achieve your learning goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link
                  to="/courses"
                  className="hover-scale inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-full font-medium transition-colors hover:bg-blue-700"
                >
                  Explore Courses
                  <ArrowRight size={18} className="ml-2" />
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center bg-gray-100 text-gray-800 px-6 py-3 rounded-full font-medium transition-colors hover:bg-gray-200"
                >
                  Join Now
                </Link>
              </div>
              <div className="pt-4 flex items-center space-x-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600">50+</span>
                  <span className="ml-2 text-sm text-gray-600">Expert instructors</span>
                </div>
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-blue-600">200+</span>
                  <span className="ml-2 text-sm text-gray-600">Quality courses</span>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 relative">
            <div className="overflow-hidden rounded-xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=3271&auto=format&fit=crop"
                alt="Students learning"
                className="hero-image w-full h-auto object-cover hover-scale"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white glass p-4 rounded-lg shadow-lg opacity-0 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 rounded-full w-12 h-12 flex items-center justify-center text-white font-bold">
                  4.9
                </div>
                <div>
                  <p className="font-medium">Excellent Rating</p>
                  <p className="text-xs text-gray-500">Based on 15,000+ reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Hero;
