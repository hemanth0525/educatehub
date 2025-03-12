import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, PlayCircle, Lock, X } from 'lucide-react';

interface Lesson {
    title: string;
    duration?: string;
    preview?: boolean;
    videoType?: string;
    videoUrl?: string;
}

interface CourseContentAccordionProps {
    lessons: Lesson[];
}

const CourseContentAccordion: React.FC<CourseContentAccordionProps> = ({ lessons }) => {
    const [expandedSection, setExpandedSection] = useState<number | null>(0);
    const [videoModalOpen, setVideoModalOpen] = useState(false);
    const [currentVideo, setCurrentVideo] = useState<string | null>(null);

    // Function to extract YouTube video ID from URL
    const getYoutubeVideoId = (url: string): string | null => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Close modal when pressing ESC key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setVideoModalOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const toggleSection = (index: number) => {
        setExpandedSection(expandedSection === index ? null : index);
    };

    const openVideoModal = (lesson: Lesson) => {
        if (lesson.videoType === 'youtube' && lesson.videoUrl) {
            const videoId = getYoutubeVideoId(lesson.videoUrl);
            if (videoId) {
                setCurrentVideo(videoId);
                setVideoModalOpen(true);
            }
        } else {
            // Handle non-YouTube videos
            // For now, just show an alert
            alert('This video is not available for preview.');
        }
    };

    return (
        <>
            <div className="border rounded-lg divide-y">
                {lessons.map((lesson, index) => (
                    <div key={index} className="bg-white">
                        <button
                            onClick={() => toggleSection(index)}
                            className="flex items-center justify-between w-full p-4 text-left hover:bg-gray-50"
                        >
                            <div className="flex items-center">
                                {expandedSection === index ? (
                                    <ChevronUp size={18} className="text-gray-400 mr-2" />
                                ) : (
                                    <ChevronDown size={18} className="text-gray-400 mr-2" />
                                )}
                                <span className="text-sm font-medium">
                                    {index + 1}. {lesson.title || 'Untitled Lesson'}
                                </span>
                            </div>
                            <div className="flex items-center">
                                {lesson.preview ? (
                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded mr-2">
                                        Preview
                                    </span>
                                ) : (
                                    <Lock size={14} className="text-gray-400 mr-2" />
                                )}
                                {lesson.duration && (
                                    <span className="text-xs text-gray-500">{lesson.duration}</span>
                                )}
                            </div>
                        </button>

                        {expandedSection === index && (
                            <div className="p-4 pt-0 pl-10 bg-gray-50">
                                <div
                                    className="flex items-center text-sm p-2 rounded hover:bg-gray-100 cursor-pointer"
                                    onClick={() => openVideoModal(lesson)}
                                >
                                    <PlayCircle size={16} className="text-blue-500 mr-2" />
                                    <span>
                                        {lesson.videoType === 'youtube'
                                            ? 'Play Video'
                                            : 'Watch Video'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Video Modal */}
            {videoModalOpen && currentVideo && (
                <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
                    <div className="relative w-full max-w-4xl bg-white rounded-lg">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 z-10 p-1 bg-white rounded-full"
                            onClick={() => setVideoModalOpen(false)}
                        >
                            <X size={24} />
                        </button>
                        <div className="relative pt-[56.25%]">
                            <iframe
                                className="absolute top-0 left-0 w-full h-full rounded-t-lg"
                                src={`https://www.youtube.com/embed/${currentVideo}?autoplay=1`}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-4">
                            <h3 className="font-medium">
                                {lessons.find(l => l.videoUrl && l.videoUrl.includes(currentVideo))?.title || 'Video Lesson'}
                            </h3>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CourseContentAccordion;
