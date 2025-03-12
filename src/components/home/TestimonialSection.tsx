
import React, { useEffect, useRef } from 'react';
import Container from '@/components/ui/Container';
import { cn } from '@/lib/utils';

type Testimonial = {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar: string;
};

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Software Developer",
    content: "The courses have been instrumental in taking my coding skills to the next level. The instructors explain complex concepts in a way that's easy to understand.",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: 2,
    name: "Sophia Chen",
    role: "UX Designer",
    content: "As someone switching careers into design, these courses provided exactly what I needed. The practical projects helped me build a portfolio that got me hired.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Marcus Williams",
    role: "Data Scientist",
    content: "The data science track is comprehensive and up-to-date with industry standards. I appreciated the hands-on approach and real-world datasets.",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
  },
];

const TestimonialSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            sectionRef.current?.classList.add('in-view');
          }
        },
        { threshold: 0.1 }
      );
      
      observer.observe(sectionRef.current);
      
      return () => {
        if (sectionRef.current) {
          observer.unobserve(sectionRef.current);
        }
      };
    }
  }, []);

  return (
    <section className="py-16">
      <Container>
        <div 
          ref={sectionRef}
          className="section-transition"
        >
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Students Say</h2>
            <p className="text-gray-600">
              Success stories from students who have transformed their careers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={testimonial.id}
                className={cn(
                  "bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow",
                  "opacity-0 animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{testimonial.content}</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i}
                      className="w-5 h-5 text-yellow-400 fill-current"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default TestimonialSection;
