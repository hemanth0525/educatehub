
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, HelpCircle, Book, Info, ThumbsUp, ThumbsDown, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type SuggestionTopic = {
  title: string;
  icon: React.ReactNode;
  questions: string[];
};

const AIChatAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI learning assistant. How can I help you with your courses today?',
      timestamp: new Date(),
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      // In a real implementation, this would be an API call to an AI service
      // For demonstration, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Sample responses based on keywords in the user's message
      let response = '';
      const userInput = input.toLowerCase();
      
      if (userInput.includes('javascript') || userInput.includes('js')) {
        response = "JavaScript is a programming language that is one of the core technologies of the World Wide Web. It's an essential part of web development and is covered in our Web Development Fundamentals course. The key concepts include variables, functions, objects, and asynchronous programming. Would you like me to explain any specific JavaScript concept in more detail?";
      } else if (userInput.includes('python')) {
        response = "Python is a high-level, general-purpose programming language known for its readability. Our Python Programming Masterclass covers everything from basic syntax to advanced topics like machine learning. Python is particularly popular for data science, AI, web development with frameworks like Django and Flask, and automation. What specific aspect of Python would you like to learn more about?";
      } else if (userInput.includes('react')) {
        response = "React is a JavaScript library for building user interfaces. It's component-based and allows you to create reusable UI components. Check out our Advanced JavaScript and React course for in-depth learning. React uses a virtual DOM for improved performance and has a unidirectional data flow architecture. Would you like to know more about React hooks, components, or state management?";
      } else if (userInput.includes('html') || userInput.includes('css')) {
        response = "HTML and CSS are fundamental technologies for web development. HTML provides the structure of a webpage, while CSS styles it. Both are covered extensively in our Web Development Fundamentals course. HTML5 introduced semantic elements like <header>, <footer>, and <article>, while modern CSS includes flexbox, grid, and custom variables. Which aspect would you like to explore further?";
      } else if (userInput.includes('course') || userInput.includes('recommend')) {
        response = "Based on current industry trends, I'd recommend starting with our Web Development Fundamentals if you're new to programming, or Data Science Essentials if you're interested in analytics and machine learning. For someone looking to enhance their career prospects quickly, our Cloud Computing and DevOps course has excellent job placement rates. What are your specific learning goals or interests?";
      } else if (userInput.includes('career') || userInput.includes('job')) {
        response = "Technology careers are diverse and rewarding! Web developers are in high demand (average salary $75,000/year), as are data scientists ($95,000/year) and cloud engineers ($110,000/year). Our courses are designed with industry requirements in mind, and many include projects you can add to your portfolio. Would you like specific guidance on transitioning into tech or advancing your current tech career?";
      } else if (userInput.includes('difficulty') || userInput.includes('hard')) {
        response = "Learning programming or any technical skill is a journey that takes time and practice. Our courses are designed for different levels - beginners can start with Web Development Fundamentals or Python Basics, while those with some experience might prefer Advanced JavaScript or Database Management. Remember, everyone learns at their own pace, and our platform includes hands-on projects and community support to help you progress. What's your current skill level?";
      } else {
        response = "That's an interesting question! While I don't have specific information on that topic yet, I'd recommend checking our course catalog or reaching out to our instructors for more detailed guidance. Would you like me to help you navigate to a relevant course section or suggest learning resources on a related topic?";
      }
      
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

  const suggestionTopics: SuggestionTopic[] = [
    {
      title: "Course Help",
      icon: <Book className="h-4 w-4" />,
      questions: [
        "Which course should I take for web development?",
        "How do I get started with JavaScript?",
        "What prerequisites do I need for the Python course?"
      ]
    },
    {
      title: "Concepts",
      icon: <HelpCircle className="h-4 w-4" />,
      questions: [
        "Explain CSS flexbox to me",
        "What is object-oriented programming?",
        "How do React hooks work?"
      ]
    },
    {
      title: "General Info",
      icon: <Info className="h-4 w-4" />,
      questions: [
        "What career options exist in web development?",
        "How much time does it take to learn Python?",
        "Do you offer certificates for courses?"
      ]
    }
  ];

  const handleSuggestionClick = (question: string) => {
    setInput(question);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Response copied to clipboard",
    });
  };

  return (
    <div className="flex flex-col h-[600px] md:h-[700px] border rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Bot className="mr-2" size={20} />
          AI Learning Assistant
        </h2>
        <p className="text-sm text-blue-100">Ask any question about your courses or learning material</p>
      </div>
      
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
                "rounded-lg p-4 group relative",
                message.role === 'user' 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-gray-100 text-gray-800 rounded-bl-none"
              )}
            >
              <div className="flex items-center mb-1">
                {message.role === 'assistant' ? (
                  <Bot size={16} className="mr-1" />
                ) : (
                  <User size={16} className="mr-1" />
                )}
                <span className="text-xs opacity-70">
                  {message.role === 'assistant' ? 'AI Assistant' : 'You'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                
                {message.role === 'assistant' && (
                  <div className="ml-auto hidden group-hover:flex items-center space-x-1">
                    <button 
                      onClick={() => copyToClipboard(message.content)}
                      className="p-1 rounded-full hover:bg-gray-200 transition-colors"
                      aria-label="Copy to clipboard"
                    >
                      <Copy size={14} />
                    </button>
                    <div className="flex items-center space-x-1">
                      <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Helpful">
                        <ThumbsUp size={14} />
                      </button>
                      <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" aria-label="Not helpful">
                        <ThumbsDown size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="whitespace-pre-line">{message.content}</div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full max-w-[80%] mr-auto">
            <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-4">
              <div className="flex items-center">
                <Bot size={16} className="mr-1" />
                <span className="text-xs opacity-70">AI Assistant</span>
              </div>
              <div className="flex items-center mt-2">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {messages.length === 1 && (
        <div className="px-4 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Suggested questions:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {suggestionTopics.map((topic) => (
              <div key={topic.title} className="space-y-2">
                <div className="flex items-center text-sm font-medium text-gray-600">
                  {topic.icon}
                  <span className="ml-1">{topic.title}</span>
                </div>
                <ul className="space-y-1">
                  {topic.questions.map((question) => (
                    <li key={question}>
                      <button 
                        onClick={() => handleSuggestionClick(question)}
                        className="text-left text-sm text-blue-600 hover:text-blue-800 hover:underline w-full truncate"
                      >
                        {question}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about your courses..."
          className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
        </Button>
      </form>
    </div>
  );
};

export default AIChatAssistant;
