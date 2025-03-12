import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with your API key
// In Vite, environment variables must be prefixed with VITE_
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Check if the API key is available
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
    genAI = new GoogleGenerativeAI(API_KEY);
}

// Function to generate a simple mock response based on content
function generateMockResponse(question: string, systemPrompt: string): string {
    // Convert to lowercase for easier matching
    const q = question.toLowerCase();

    // Look for sentences in the content that might contain keywords from the question
    const sentences = systemPrompt.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const relevantSentences = sentences.filter(sentence => {
        const lower = sentence.toLowerCase();
        // Check if any words from question are in this sentence
        return q.split(' ')
            .filter(word => word.length > 3) // Only check significant words
            .some(word => lower.includes(word));
    });

    if (relevantSentences.length > 0) {
        return `Based on the course materials, I found this information that might help: "${relevantSentences.join('. ')}"

Note: This is demo mode. The AI assistant is using a simple keyword matching system instead of the full Gemini model.`;
    }

    // Default response if no relevant content found
    return `I don't have enough information in the course materials to answer that question specifically.

Note: This is demo mode.`;
}

export async function queryGemini(question: string, systemPrompt: string): Promise<string> {
    try {
        // Check if API is initialized
        if (!genAI || !API_KEY) {
            console.warn('Gemini API key not configured, using mock response');
            // Return a mock response
            return generateMockResponse(question, systemPrompt);
        }

        // Get the generative model - use "gemini-pro" which is widely available
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Format system prompt to instruct Gemini to only use provided content
        const formattedSystemPrompt = `
      You are an educational AI assistant dedicated to helping students with course content.
      ONLY answer based on the following course material. If you don't know the answer based on this content, say so.
      Do not make up information that isn't present in the provided materials.
      
      COURSE MATERIAL:
      ${systemPrompt}
    `;

        // Send a direct message instead of a chat for more reliability
        const result = await model.generateContent([
            formattedSystemPrompt,
            `Question: ${question}\nAnswer (based only on the provided course material):`
        ]);

        const response = result.response.text();
        return response;
    } catch (error: any) {
        // Log detailed error information
        console.error('Error querying Gemini:', error);
        console.error('Error details:', error?.message || 'Unknown error');

        // Provide a more informative error message
        if (error?.message?.includes('API key')) {
            return "The Gemini AI assistant couldn't authenticate. There may be an issue with the API key configuration.";
        }

        if (error?.message?.includes('rate limit')) {
            return "The AI service is currently experiencing high demand. Please try your question again in a few minutes.";
        }

        // Fall back to the mock response as a last resort
        try {
            return generateMockResponse(question, systemPrompt) +
                "\n\n(Note: Using fallback mode due to an error connecting to the AI service)";
        } catch (fallbackError) {
            return "I'm unable to answer your question at the moment. Please try again later.";
        }
    }
}
