
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import AIChatAssistant from '@/components/assistant/AIChatAssistant';
import { BookOpen, Lightbulb, Zap } from 'lucide-react';

const AIAssistant: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-4">AI Learning Assistant</h1>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Get instant help with your course material, clarify concepts, or find the right resources to accelerate your learning journey.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Course Information</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Ask about specific courses, topics, or learning paths to find what suits you best.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Lightbulb className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Concept Explanations</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Get clear explanations for complex topics from your course materials.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Zap className="h-5 w-5 text-blue-600 mr-2" />
                  <h3 className="font-medium">Learning Recommendations</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Receive personalized suggestions for resources and next steps in your learning journey.
                </p>
              </div>
            </div>
            
            <AIChatAssistant />
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default AIAssistant;
