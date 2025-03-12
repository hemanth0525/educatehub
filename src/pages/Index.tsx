
import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import FeaturedCourses from '@/components/home/FeaturedCourses';
import TestimonialSection from '@/components/home/TestimonialSection';
import { useIsMobile } from '@/hooks/use-mobile';
import Container from '@/components/ui/Container';
import { BookOpen, Users, Globe } from 'lucide-react';

const Index: React.FC = () => {
  const isMobile = useIsMobile();

  useEffect(() => {
    // Initialize page animations and intersection observers
    const handleIntersection = () => {
      const callback = (entries: IntersectionObserverEntry[]) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          }
        });
      };

      const observer = new IntersectionObserver(callback, {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      });

      const elements = document.querySelectorAll('.section-transition');
      elements.forEach(element => observer.observe(element));

      return () => {
        elements.forEach(element => observer.unobserve(element));
      };
    };

    handleIntersection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <section className="py-16">
          <Container>
            <div className="section-transition">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { 
                    icon: BookOpen, 
                    title: "Quality Courses", 
                    description: "Expert-led courses designed to help you master modern skills." 
                  },
                  { 
                    icon: Users, 
                    title: "Expert Instructors", 
                    description: "Learn from industry professionals with real-world experience." 
                  },
                  { 
                    icon: Globe, 
                    title: "Lifetime Access", 
                    description: "Purchase once and access your courses anytime, anywhere." 
                  },
                ].map((feature, index) => (
                  <div 
                    key={feature.title}
                    className={`bg-white glass p-6 rounded-xl flex flex-col items-center text-center opacity-0 animate-fade-in`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="bg-blue-50 p-3 rounded-full mb-4">
                      <feature.icon size={24} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </section>
        
        <FeaturedCourses />
        
        <TestimonialSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
