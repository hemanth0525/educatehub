import { pipeline, env } from '@xenova/transformers';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

// Set environment configurations
env.allowLocalModels = false;
env.useBrowserCache = true;

// Initialize the BERT model for question answering
let questionAnsweringModel: any = null;

// Function to store model in Firebase
async function storeModelInFirebase(courseId: string, modelData: any) {
  try {
    const modelsRef = collection(db, 'course_models');
    await addDoc(modelsRef, {
      course_id: courseId,
      model_data: modelData,
      created_at: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error storing model in Firebase:', error);
    return false;
  }
}

// Function to load model from Firebase
async function loadModelFromFirebase(courseId: string) {
  try {
    const modelsRef = collection(db, 'course_models');
    const q = query(modelsRef, where('course_id', '==', courseId));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const modelDoc = querySnapshot.docs[0];
      return modelDoc.data().model_data;
    }
    return null;
  } catch (error) {
    console.error('Error loading model from Firebase:', error);
    return null;
  }
}

// Function to initialize and train the model
export async function initializeModel(courseId?: string, materials?: string[]) {
  if (!questionAnsweringModel) {
    // Try to load existing model from Firebase if courseId is provided
    if (courseId) {
      const savedModel = await loadModelFromFirebase(courseId);
      if (savedModel) {
        questionAnsweringModel = savedModel;
        return questionAnsweringModel;
      }
    }

    // If no saved model found, initialize new model
    questionAnsweringModel = await pipeline('question-answering', 'Xenova/bert-base-cased-squad2');

    // Train model on course materials if provided
    if (courseId && materials && materials.length > 0) {
      // Fine-tune the model on course materials
      for (const material of materials) {
        await questionAnsweringModel.train({
          context: material,
          questions: generateTrainingQuestions(material)
        });
      }

      // Store trained model in Firebase
      await storeModelInFirebase(courseId, questionAnsweringModel);
    }
  }
  return questionAnsweringModel;
}

// Helper function to generate training questions from material
function generateTrainingQuestions(material: string): Array<{ question: string; answer: string }> {
  // Extract key sentences and generate question-answer pairs
  const sentences = material.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const questions = sentences.map(sentence => {
    const words = sentence.trim().split(' ');
    if (words.length > 5) {
      const answer = sentence.trim();
      const question = `What is described by: ${words.slice(0, 5).join(' ')}...?`;
      return { question, answer };
    }
    return null;
  }).filter(qa => qa !== null);

  return questions as Array<{ question: string; answer: string }>;
}

// Function to generate AI response using BERT model
export async function generateAIResponse(
  question: string,
  context: {
    materials: string[];
    transcripts: string[];
    recentMessages: Array<{ role: string; content: string }>;
  }
): Promise<string> {
  try {
    // Initialize model if not already initialized
    const model = await initializeModel();

    // Analyze conversation context
    const { isFollowUp, previousContext } = analyzeConversationContext(question, context.recentMessages);

    // Prepare context by combining materials and transcripts
    let contextMaterials = [...context.materials, ...context.transcripts];

    // If it's a follow-up question, prioritize previous context
    if (isFollowUp && previousContext) {
      contextMaterials = [previousContext, ...contextMaterials];
    }

    // Find most relevant context using keyword matching
    const relevantContext = contextMaterials
      .filter(text => text.toLowerCase().includes(question.toLowerCase()))
      .slice(0, 3)
      .join(' ');

    // If no relevant context found, use the first few materials as context
    const contextText = relevantContext || contextMaterials.slice(0, 2).join(' ');

    // Generate response using the BERT model with chunked context
    const maxContextLength = 5000; // BERT typically has a token limit
    const truncatedContext = contextText.slice(0, maxContextLength);

    const result = await model({
      question: question,
      context: truncatedContext
    });

    if (result && result.answer) {
      return result.answer;
    }

    return isFollowUp
      ? 'I understand this is a follow-up question. Could you provide more specific details about what you\'d like to know?'
      : 'I apologize, but I couldn\'t find a specific answer to your question in the course materials. Could you please rephrase your question or ask about a different topic?';

  } catch (error) {
    console.error('Error generating AI response:', error);
    return 'I apologize, but I encountered an error while processing your question. Please try again later.';
  }
}

// Function to analyze conversation context
export function analyzeConversationContext(
  question: string,
  recentMessages: Array<{ role: string; content: string }>
): {
  isFollowUp: boolean;
  previousContext?: string;
} {
  if (recentMessages.length < 2) {
    return { isFollowUp: false };
  }

  const previousMessages = recentMessages.slice(-2);
  const isFollowUp = question.toLowerCase().includes('more') ||
    question.toLowerCase().includes('elaborate') ||
    question.toLowerCase().includes('what about');

  return {
    isFollowUp,
    previousContext: isFollowUp ? previousMessages[0].content : undefined
  };
}