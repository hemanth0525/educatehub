
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Copy, FileText, Video, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAI } from '@/context/AIContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type CourseResource = {
  id: string;
  type: 'transcript' | 'notes' | 'pdf';
  title: string;
  description: string;
  url?: string;
};

interface CourseChatAssistantProps {
  courseId: string;
  courseTitle: string;
}

const CourseChatAssistant: React.FC<CourseChatAssistantProps> = ({ courseId, courseTitle }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resources, setResources] = useState<CourseResource[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { loadCourseAI, isLoadingAI, isCourseAILoaded, generateAIResponse } = useAI();

  // Load AI and course resources when component mounts
  useEffect(() => {
    const initializeAI = async () => {
      // Load course AI data
      await loadCourseAI(courseId, courseTitle);
      
      // Fetch course resources
      fetchCourseResources();
      
      // Set initial welcome message
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm your AI assistant for the "${courseTitle}" course. I'm trained on course materials provided by your instructor. How can I help you understand the course content?`,
          timestamp: new Date(),
        }
      ]);
    };
    
    initializeAI();
  }, [courseId, courseTitle]);

  // Mock function to fetch course resources
  const fetchCourseResources = async () => {
    // In a real implementation, this would fetch from Supabase
    // For now, using mock data
    const mockResources: CourseResource[] = [
      {
        id: '1',
        type: 'transcript',
        title: 'Lesson 1 Transcript',
        description: 'Full transcript of the introduction lesson'
      },
      {
        id: '2',
        type: 'notes',
        title: 'Course Notes',
        description: 'Supplementary notes provided by the instructor'
      },
      {
        id: '3',
        type: 'pdf',
        title: 'Reference Guide',
        description: 'Detailed reference materials'
      }
    ];
    
    setResources(mockResources);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Generate response using our AI context
      const response = await generateAIResponse(input);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      console.error('Error getting AI response:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col h-[500px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-blue-600 text-white p-3">
        <h2 className="text-lg font-semibold flex items-center">
          <Bot className="mr-2" size={18} />
          Course Assistant - {courseTitle}
        </h2>
        <p className="text-xs text-blue-100">Trained on course-specific materials</p>
      </div>
      
      {/* AI Training Status */}
      {isLoadingAI && (
        <div className="p-4 bg-blue-50 border-b">
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm font-medium">Training AI on course materials...</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            This may take a moment as the assistant analyzes course transcripts and materials.
          </p>
        </div>
      )}
      
      {/* Course Resources */}
      {isCourseAILoaded && resources.length > 0 && (
        <div className="p-3 bg-gray-50 border-b">
          <h3 className="text-sm font-medium mb-2">Training materials:</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {resources.map(resource => (
              <div key={resource.id} className="flex items-center text-xs text-gray-600 bg-white p-2 rounded border">
                {resource.type === 'transcript' && <Video size={14} className="mr-1 text-blue-500" />}
                {resource.type === 'notes' && <FileText size={14} className="mr-1 text-green-500" />}
                {resource.type === 'pdf' && <Book size={14} className="mr-1 text-red-500" />}
                {resource.title}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={cn(
              "flex w-full max-w-[80%] mb-4",
              message.role === 'user' ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "rounded-lg p-3 group relative",
                message.role === 'user' 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              <div className="flex items-center mb-1">
                {message.role === 'assistant' ? (
                  <Bot size={14} className="mr-1" />
                ) : (
                  <User size={14} className="mr-1" />
                )}
                <span className="text-xs opacity-70">
                  {message.role === 'assistant' ? 'Course Assistant' : 'You'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {message.role === 'assistant' && (
                  <div className="ml-auto hidden group-hover:flex items-center">
                    <button 
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      <Copy size={12} />
                    </button>
                  </div>
                )}
              </div>
              <div className="whitespace-pre-line text-sm">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full max-w-[80%] mr-auto">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3">
              <div className="flex items-center">
                <Bot size={14} className="mr-1" />
                <span className="text-xs opacity-70">Course Assistant</span>
              </div>
              <div className="flex items-center mt-2">
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
                <span className="text-xs">Processing course materials...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about course content..."
          className="flex-grow px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={isLoading || isLoadingAI || !isCourseAILoaded}
        />
        <Button 
          type="submit" 
          size="sm"
          disabled={isLoading || isLoadingAI || !isCourseAILoaded || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={16} />}
        </Button>
      </form>
    </div>
  );
};

export default CourseChatAssistant;
