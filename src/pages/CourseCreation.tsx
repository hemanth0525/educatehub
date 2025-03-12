import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { BookOpen, Plus, Minus, Upload, ArrowLeft, FileText, Check } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { uploadCourseMaterial } from '@/lib/storage-service';
import { storeCourse } from '@/lib/course-service';

type LessonForm = {
  title: string;
  duration: string;
  preview: boolean;
  videoType: 'upload' | 'youtube';
  videoUrl?: string;
  videoFile?: File;
  transcriptFile?: File;
};

type MaterialForm = {
  title: string;
  type: 'transcript' | 'notes' | 'pdf';
  file: File | null;
};

const CourseCreation: React.FC = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();

  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseCategory, setCourseCategory] = useState('');
  const [courseLevel, setCourseLevel] = useState('Beginner');
  const [coursePrice, setCoursePrice] = useState('');
  const [lessons, setLessons] = useState<LessonForm[]>([{
    title: '',
    duration: '',
    preview: false,
    videoType: 'upload'
  }]);
  const [materials, setMaterials] = useState<MaterialForm[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const addLesson = () => {
    const newLesson: LessonForm = { title: '', duration: '', preview: false, videoType: 'upload' };
    setLessons([...lessons, newLesson]);
  };

  const removeLesson = (index: number) => {
    const updatedLessons = [...lessons];
    updatedLessons.splice(index, 1);
    setLessons(updatedLessons);
  };

  const updateLesson = (index: number, field: keyof LessonForm, value: string | boolean | File) => {
    const updatedLessons = [...lessons];
    updatedLessons[index] = { ...updatedLessons[index], [field]: value };
    setLessons(updatedLessons);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'transcript' | 'notes' | 'pdf') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Add material to the list
    setMaterials([...materials, {
      title: file.name,
      type,
      file
    }]);

    toast({
      title: "File Added",
      description: `${file.name} has been added to course materials.`,
    });

    // Reset the input
    event.target.value = '';
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required materials
      if (materials.length === 0) {
        toast({
          title: "Missing Materials",
          description: "Please upload at least one course material for AI training.",
          variant: "destructive",
        });
        setIsSubmitting(false); // Reset before early return
        return;
      }

      // Generate a unique course ID
      const courseId = `course_${Date.now()}`;

      // Upload materials and get their URLs
      const materialUploads = await Promise.all(
        materials.map(async (material) => {
          if (!material.file) return null;
          const result = await uploadCourseMaterial(courseId, material.file, material.type);
          return {
            ...material,
            url: result.url,
            id: result.id
          };
        })
      );

      // Filter out any failed uploads
      const uploadedMaterials = materialUploads.filter(Boolean);

      // Extract text content from transcripts for AI training
      // We need to read the actual content from the files
      const transcriptContents: string[] = [];

      // Process uploaded materials to extract content
      for (const material of uploadedMaterials) {
        if (material?.type === 'transcript' && material.file) {
          try {
            const fileContent = await material.file.text();
            transcriptContents.push(fileContent);
          } catch (error) {
            console.error('Error reading file content:', error);
            transcriptContents.push(material.title);
          }
        }
      }

      // For now, just send the transcriptions as system prompt
      let aiSystemPrompt = null;
      if (transcriptContents.length > 0) {
        aiSystemPrompt = transcriptContents.join("\n\n");
      }

      // Create course data object with AI system prompt info
      const courseData = {
        id: courseId,
        title: courseTitle,
        description: courseDescription,
        category: courseCategory,
        level: courseLevel,
        price: parseFloat(coursePrice),
        lessons: lessons.map(lesson => ({
          title: lesson.title,
          duration: lesson.duration,
          preview: lesson.preview,
          videoType: lesson.videoType,
          videoUrl: lesson.videoType === 'youtube' ? lesson.videoUrl : null,
          transcriptFile: lesson.transcriptFile ? (lesson.transcriptFile as File).name : null  // <-- store file name instead of the File object
        })),
        materials: materials.map(material => ({
          title: material.title,
          type: material.type,
          url: material.file ? material.file.name : null
        })),
        aiSystemPrompt, // <-- system prompt with transcriptions
        createdAt: new Date()
      };

      // Store the course in Firebase
      await storeCourse(courseData);

      toast({
        title: "Course Created Successfully!",
        description: "Your course has been created, stored in Firebase, and the AI assistant has been trained on your materials.",
      });

      // Reset form
      setCourseTitle('');
      setCourseDescription('');
      setCourseCategory('');
      setCourseLevel('Beginner');
      setCoursePrice('');
      setLessons([{ title: '', duration: '', preview: false, videoType: 'upload' }]);
      setMaterials([]);
      setActiveStep(1);

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Validate course details
      if (!courseTitle.trim()) {
        toast({
          title: "Missing Title",
          description: "Please provide a title for your course",
          variant: "destructive",
        });
        return false;
      }
      if (!courseDescription.trim()) {
        toast({
          title: "Missing Description",
          description: "Please provide a description for your course",
          variant: "destructive",
        });
        return false;
      }
      if (!courseCategory) {
        toast({
          title: "Missing Category",
          description: "Please select a category for your course",
          variant: "destructive",
        });
        return false;
      }
      if (!courseLevel) {
        toast({
          title: "Missing Level",
          description: "Please select a difficulty level for your course",
          variant: "destructive",
        });
        return false;
      }
      if (!coursePrice) {
        toast({
          title: "Missing Price",
          description: "Please provide a price for your course",
          variant: "destructive",
        });
        return false;
      }
      return true;
    } else if (step === 2) {
      // Validate course content/lessons
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i];
        if (!lesson.title.trim()) {
          toast({
            title: "Missing Lesson Title",
            description: `Please provide a title for lesson ${i + 1}`,
            variant: "destructive",
          });
          return false;
        }
        if (!lesson.duration.trim()) {
          toast({
            title: "Missing Lesson Duration",
            description: `Please provide a duration for lesson ${i + 1}`,
            variant: "destructive",
          });
          return false;
        }
        if (lesson.videoType === 'youtube' && (!lesson.videoUrl || !lesson.videoUrl.trim())) {
          toast({
            title: "Missing YouTube URL",
            description: `Please provide a YouTube URL for lesson ${i + 1}`,
            variant: "destructive",
          });
          return false;
        }
        if (lesson.videoType === 'upload' && !lesson.videoFile) {
          toast({
            title: "Missing Video File",
            description: `Please upload a video file for lesson ${i + 1}`,
            variant: "destructive",
          });
          return false;
        }
        if (!lesson.transcriptFile) {
          toast({
            title: "Missing Transcript",
            description: `Please upload a transcript file for lesson ${i + 1}`,
            variant: "destructive",
          });
          return false;
        }
      }
      return true;
    } else if (step === 3) {
      // Validate AI training materials
      if (materials.length === 0) {
        toast({
          title: "Missing Materials",
          description: "Please upload at least one course material for AI training",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(activeStep)) {
      setActiveStep(activeStep + 1);
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16">
        <Container>
          <Link to="/tutor-dashboard" className="inline-flex items-center text-gray-600 hover:text-blue-600 mb-6">
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
            <p className="text-gray-600">
              Fill in the details below to create your course and upload materials for the AI assistant
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mr-2`}>1</div>
              <div className={`flex-grow h-1 ${activeStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'} mx-2`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} mx-2`}>2</div>
              <div className={`flex-grow h-1 ${activeStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'} mx-2`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${activeStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'} ml-2`}>3</div>
            </div>
            <div className="flex justify-between mt-2 text-sm">
              <span className={activeStep >= 1 ? 'text-blue-600' : 'text-gray-500'}>Course Details</span>
              <span className={activeStep >= 2 ? 'text-blue-600' : 'text-gray-500'}>Course Content</span>
              <span className={activeStep >= 3 ? 'text-blue-600' : 'text-gray-500'}>AI Training Materials</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Course Details */}
            {activeStep === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Course Details</h2>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="course-title" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Title*
                    </label>
                    <input
                      id="course-title"
                      type="text"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Introduction to Machine Learning"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-1">
                      Course Description*
                    </label>
                    <textarea
                      id="course-description"
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Provide a detailed description of your course..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="course-category" className="block text-sm font-medium text-gray-700 mb-1">
                        Category*
                      </label>
                      <select
                        id="course-category"
                        value={courseCategory}
                        onChange={(e) => setCourseCategory(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="" disabled>Select a category</option>
                        <option value="Programming">Programming</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="course-level" className="block text-sm font-medium text-gray-700 mb-1">
                        Level*
                      </label>
                      <select
                        id="course-level"
                        value={courseLevel}
                        onChange={(e) => setCourseLevel(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="course-price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price (USD)*
                    </label>
                    <input
                      id="course-price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={coursePrice}
                      onChange={(e) => setCoursePrice(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., 49.99"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Course Content */}
            {activeStep === 2 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-6">Course Content</h2>

                <div className="space-y-6">
                  {lessons.map((lesson, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Lesson {index + 1}</h3>
                        {lessons.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeLesson(index)}
                            className="text-red-600 border-red-200 hover:bg-red-50"
                          >
                            <Minus size={16} className="mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label htmlFor={`lesson-title-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                            Lesson Title*
                          </label>
                          <input
                            id={`lesson-title-${index}`}
                            type="text"
                            value={lesson.title}
                            onChange={(e) => updateLesson(index, 'title', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                            placeholder="e.g., Introduction to the Course"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={`lesson-duration-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Duration*
                            </label>
                            <input
                              id={`lesson-duration-${index}`}
                              type="text"
                              value={lesson.duration}
                              onChange={(e) => updateLesson(index, 'duration', e.target.value)}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                              placeholder="e.g., 45 min"
                              required
                            />
                          </div>

                          <div className="flex items-center">
                            <input
                              id={`lesson-preview-${index}`}
                              type="checkbox"
                              checked={lesson.preview}
                              onChange={(e) => updateLesson(index, 'preview', e.target.checked)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor={`lesson-preview-${index}`} className="ml-2 block text-sm text-gray-700">
                              Free Preview
                            </label>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Video Source*
                            </label>
                            <div className="flex gap-4">
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`video-type-${index}`}
                                  value="upload"
                                  checked={lesson.videoType === 'upload'}
                                  onChange={(e) => updateLesson(index, 'videoType', e.target.value)}
                                  className="mr-2"
                                />
                                Upload Video
                              </label>
                              <label className="flex items-center">
                                <input
                                  type="radio"
                                  name={`video-type-${index}`}
                                  value="youtube"
                                  checked={lesson.videoType === 'youtube'}
                                  onChange={(e) => updateLesson(index, 'videoType', e.target.value)}
                                  className="mr-2"
                                />
                                YouTube Link
                              </label>
                            </div>
                          </div>

                          {lesson.videoType === 'upload' ? (
                            <div>
                              <label htmlFor={`video-file-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                Upload Video File*
                              </label>
                              <input
                                id={`video-file-${index}`}
                                type="file"
                                accept="video/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    updateLesson(index, 'videoFile', file as any);
                                  }
                                }}
                                className="w-full"
                                required
                              />
                            </div>
                          ) : (
                            <div>
                              <label htmlFor={`video-url-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                                YouTube Video URL*
                              </label>
                              <input
                                id={`video-url-${index}`}
                                type="url"
                                value={lesson.videoUrl || ''}
                                onChange={(e) => updateLesson(index, 'videoUrl', e.target.value)}
                                placeholder="e.g., https://youtube.com/watch?v=..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                required
                              />
                            </div>
                          )}

                          <div>
                            <label htmlFor={`transcript-file-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                              Upload Transcript*
                            </label>
                            <input
                              id={`transcript-file-${index}`}
                              type="file"
                              accept=".txt,.srt,.vtt"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  updateLesson(index, 'transcriptFile', file as any);
                                }
                              }}
                              className="w-full"
                              required
                            />
                            <p className="mt-1 text-xs text-gray-500">
                              Upload transcript file in .txt, .srt, or .vtt format
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={addLesson}
                    className="w-full"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Another Lesson
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: AI Training Materials */}
            {activeStep === 3 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold mb-2">AI Training Materials</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Upload materials to train the course-specific AI assistant. The more materials you provide, the better the AI will be at answering student questions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {/* Modified Video Transcripts Tile */}
                  <div>
                    <label
                      htmlFor="transcript-upload"
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3 transition-colors group-hover:text-blue-500" />
                      <h3 className="text-sm font-medium mb-1">Video Transcripts</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload transcripts of your video lectures (.txt, .docx, .pdf)
                      </p>
                      <span className="inline-block text-blue-600 font-semibold">Click to Upload</span>
                      <input
                        id="transcript-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'transcript')}
                        accept=".txt,.docx,.pdf"
                      />
                    </label>
                  </div>
                  {/* ...existing Course Notes and Reference Materials tiles... */}
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors group">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                      <h3 className="text-sm font-medium mb-1">Course Notes</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload supplementary notes and handouts (.txt, .docx, .pdf)
                      </p>
                      <label className="inline-block w-full">
                        <span className="sr-only">Upload notes</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'notes')}
                          accept=".txt,.docx,.pdf"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          className="flex items-center mx-auto hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        >
                          <Upload size={14} className="mr-1" />
                          Upload Files
                        </Button>
                      </label>
                    </div>
                  </div>
                  <div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 cursor-pointer transition-colors group">
                      <FileText className="mx-auto h-10 w-10 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                      <h3 className="text-sm font-medium mb-1">Reference Materials</h3>
                      <p className="text-xs text-gray-500 mb-3">
                        Upload additional reference PDFs and resources (.pdf)
                      </p>
                      <label className="inline-block w-full">
                        <span className="sr-only">Upload reference materials</span>
                        <input
                          type="file"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, 'pdf')}
                          accept=".pdf"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          type="button"
                          className="flex items-center mx-auto hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors"
                        >
                          <Upload size={14} className="mr-1" />
                          Upload Files
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {materials.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-3">Uploaded Materials</h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      {materials.map((material, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 last:border-b-0">
                          <div className="flex items-center">
                            {material.type === 'transcript' && (
                              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                <FileText size={16} />
                              </div>
                            )}
                            {material.type === 'notes' && (
                              <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                                <FileText size={16} />
                              </div>
                            )}
                            {material.type === 'pdf' && (
                              <div className="bg-red-100 text-red-600 p-2 rounded-lg mr-3">
                                <FileText size={16} />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium">{material.title}</div>
                              <div className="text-xs text-gray-500">
                                {material.type === 'transcript' ? 'Video Transcript' :
                                  material.type === 'notes' ? 'Course Notes' : 'Reference PDF'}
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeMaterial(index)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <span className="sr-only">Remove</span>
                            <Minus size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-between">
              {activeStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                >
                  Previous Step
                </Button>
              ) : (
                <div></div>
              )}

              {activeStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Course...
                    </>
                  ) : (
                    <>
                      <Check size={16} className="mr-1" />
                      Create Course
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default CourseCreation;
