
import React, { createContext, useContext, useState } from 'react';
import { getCourseMaterials, getCourseTranscripts, logChatInteraction } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

type AIContextType = {
  loadCourseAI: (courseId: string, courseTitle: string) => Promise<boolean>;
  isCourseAILoaded: boolean;
  isLoadingAI: boolean;
  courseAIData: {
    courseId: string;
    courseTitle: string;
    embeddings?: Array<{
      content: string;
      vector: number[];
      type: 'transcript' | 'material';
    }>;
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  } | null;
  generateAIResponse: (question: string) => Promise<string>;
};

const AIContext = createContext<AIContextType | undefined>(undefined);

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error("useAI must be used within an AIProvider");
  }
  return context;
};

export const AIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCourseAILoaded, setIsCourseAILoaded] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [courseAIData, setCourseAIData] = useState<{
    courseId: string;
    courseTitle: string;
    conversationHistory?: Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
  } | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  // Function to load course AI data
  const loadCourseAI = async (courseId: string, courseTitle: string) => {
    setIsLoadingAI(true);
    setCourseAIData({ courseId, courseTitle, conversationHistory: [] });

    try {
      // Fetch course materials and transcripts from Supabase
      const materials = await getCourseMaterials(courseId);
      const transcripts = await getCourseTranscripts(courseId);

      // Check for existing embeddings
      let embeddings: Array<{ content: string; vector: number[]; type: 'transcript' | 'material' }> = [];

      // If no embeddings exist, generate and store them
      if (embeddings.length === 0) {
        // Generate embeddings for materials
        const newEmbeddings: Array<{ content: string; vector: number[]; type: 'transcript' | 'material' }> = [];

        // Generate embeddings for materials
        for (const material of materials) {
          // In a real implementation, this would use an embedding service (e.g., OpenAI)
          // For now, we'll simulate embedding generation
          const mockVector = Array.from({ length: 1536 }, () => Math.random());
          newEmbeddings.push({
            content: material || '', // Using text property as content is not available
            vector: mockVector,
            type: 'material'
          });
        }

        // Generate embeddings for transcripts
        for (const transcript of transcripts) {
          const mockVector = Array.from({ length: 1536 }, () => Math.random());
          newEmbeddings.push({
            content: transcript.content,
            vector: mockVector,
            type: 'transcript'
          });
        }

        // Store the new embeddings
        await storeCourseEmbeddings(courseId, newEmbeddings);
        embeddings = await getStoredEmbeddings(courseId);
      }

      if (embeddings.length > 0) {
        // Store embeddings in courseAIData
        setCourseAIData(prev => ({
          ...prev!,
          embeddings
        }));

        setIsCourseAILoaded(true);
        toast({
          title: "AI Assistant Ready",
          description: `The AI for ${courseTitle} has been trained on ${embeddings.length} course materials.`,
        });
        return true;
      } else {
        toast({
          title: "Limited AI Assistant",
          description: "No training materials found. Please upload course materials to enable AI assistance.",
          variant: "destructive",
        });
        setIsCourseAILoaded(false);
        return false;
      }
    } catch (error) {
      console.error('Error loading course AI:', error);
      toast({
        title: "Error",
        description: "Failed to load AI assistant. Please try again later.",
        variant: "destructive",
      });
      setIsCourseAILoaded(false);
      return false;
    } finally {
      setIsLoadingAI(false);
    }
  };

  // Function to generate AI response based on course data
  const generateAIResponse = async (question: string): Promise<string> => {
    if (!courseAIData || !isCourseAILoaded) {
      return "Please ensure the course is loaded and AI assistant is trained with materials.";
    }

    try {
      const { courseId, courseTitle, conversationHistory = [] } = courseAIData;

      // Add user's question to conversation history
      conversationHistory.push({ role: 'user', content: question });

      // Fetch relevant course materials for context
      const materials = await getCourseMaterials(courseId);
      const transcripts = await getCourseTranscripts(courseId);

      // Process the question with context from embeddings and conversation history
      const context = {
        embeddings: courseAIData.embeddings || [],
        recentMessages: conversationHistory.slice(-5) // Consider last 5 messages for context
      };

      // In a real implementation, we would:
      // 1. Generate embedding for the question
      // 2. Perform similarity search against stored embeddings
      // 3. Use the most relevant content for context

      // Use the AI service to generate response
      let response = await generateAIResponse(question, context);

      // Add AI's response to conversation history
      conversationHistory.push({ role: 'assistant', content: response });

      // Update courseAIData with new conversation history
      setCourseAIData({ ...courseAIData, conversationHistory });

      // Log interaction for analytics
      await logChatInteraction(courseId, user?.id || null, question, response);

      return response;
    } catch (error) {
      console.error('Error generating AI response:', error);
      return "I'm sorry, I encountered an error while processing your question. Please try again later.";
    }
  };

  // Helper function to generate context-aware responses
  const generateContextAwareResponse = async (
    question: string,
    context: {
      materials: string[];
      transcripts: string[];
      recentMessages: Array<{ role: string; content: string }>;
    },
    courseTitle: string
  ): Promise<string> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    const isFollowUpQuestion = context.recentMessages.length > 1;
    const previousMessages = context.recentMessages.slice(-2);

    // Search for relevant content in materials and transcripts
    const relevantMaterials = context.materials.filter(material =>
      material.toLowerCase().includes(question.toLowerCase())
    );

    const relevantTranscripts = context.transcripts.filter(transcript =>
      transcript.toLowerCase().includes(question.toLowerCase())
    );

    if (relevantMaterials.length > 0 || relevantTranscripts.length > 0) {
      return `Based on the course materials for ${courseTitle}, I can provide a detailed answer: ${relevantMaterials[0] || relevantTranscripts[0]}`;
    }

    if (isFollowUpQuestion) {
      const previousQuestion = previousMessages[0].content;
      if (question.toLowerCase().includes("more") || question.toLowerCase().includes("elaborate")) {
        return `Let me provide more details from ${courseTitle}'s materials. The course covers this topic extensively with practical examples and exercises.`;
      }
    }

    return `According to ${courseTitle}'s materials, this topic is covered in the course content. Would you like me to focus on any specific aspect?`;
  };

  return (
    <AIContext.Provider
      value={{
        loadCourseAI,
        isCourseAILoaded,
        isLoadingAI,
        courseAIData,
        generateAIResponse,
      }}
    >
      {children}
    </AIContext.Provider>
  );
};
