import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { queryGemini } from '@/lib/gemini-service';

interface CourseAIAssistantProps {
    courseId: string;
    systemPrompt?: string;
}

const CourseAIAssistant: React.FC<CourseAIAssistantProps> = ({ courseId, systemPrompt = '' }) => {
    const [question, setQuestion] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!question.trim()) return;

        const userQuestion = question;
        setQuestion('');
        setChatHistory([...chatHistory, { role: 'user', content: userQuestion }]);
        setLoading(true);

        try {
            // Query Gemini with the user's question and the course transcript
            const response = await queryGemini(userQuestion, systemPrompt);

            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: response
            }]);
        } catch (error) {
            console.error('AI Assistant error:', error);
            setChatHistory(prev => [...prev, {
                role: 'assistant',
                content: "Sorry, I couldn't process your question. Please try again later."
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-xl p-4">
            <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {chatHistory.length === 0 ? (
                    <div className="text-center p-4">
                        <p className="text-gray-500">Ask a question about this course material</p>
                    </div>
                ) : (
                    chatHistory.map((message, index) => (
                        <div
                            key={index}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`rounded-lg px-4 py-2 max-w-[80%] ${message.role === 'user'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-800'
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))
                )}

                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 text-gray-800 rounded-lg px-4 py-2">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                    placeholder="Ask about specific topics in the course..."
                    disabled={loading}
                />
                <Button type="submit" size="sm" disabled={loading}>
                    <Send size={16} />
                </Button>
            </form>
        </div>
    );
};

export default CourseAIAssistant;
