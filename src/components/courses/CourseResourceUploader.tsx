
import { uploadCourseMaterial } from '@/lib/storage-service';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, Video, Bot, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ResourceType = 'transcript' | 'notes' | 'pdf';

interface CourseResourceUploaderProps {
  courseId: string;
}

const CourseResourceUploader: React.FC<CourseResourceUploaderProps> = ({ courseId }) => {
  const [resources, setResources] = useState<{
    id: string;
    type: ResourceType;
    title: string;
    description: string;
    file?: File;
  }[]>([]);
  const [resourceType, setResourceType] = useState<ResourceType>('transcript');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddResource = () => {
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your resource",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Missing file",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    const newResource = {
      id: Date.now().toString(),
      type: resourceType,
      title: title.trim(),
      description: description.trim(),
      file: selectedFile,
    };

    setResources([...resources, newResource]);
    setTitle('');
    setDescription('');
    setSelectedFile(null);

    toast({
      title: "Resource added",
      description: "The resource has been added to the list",
    });
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(resource => resource.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (resources.length === 0) {
      toast({
        title: "No resources",
        description: "Please add at least one resource before training the AI",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Upload each resource using the storage service
      const uploadPromises = resources.map(async (resource) => {
        if (!resource.file) return null;
        const result = await uploadCourseMaterial(courseId, resource.file, resource.type);
        return {
          ...resource,
          url: result.url,
          id: result.id
        };
      });

      const uploadedResources = await Promise.all(uploadPromises);
      
      toast({
        title: "Upload Complete",
        description: "All resources have been uploaded successfully.",
      });
      
      // Clear the form
      setResources([]);
      setTitle('');
      setDescription('');
      setSelectedFile(null);
    } catch (error: Error | unknown) {
      console.error('Error uploading resources:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload resources. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Bot className="mr-2" size={20} />
          Train Course AI Assistant
        </h2>
        <p className="text-sm text-blue-100">Upload course materials to enhance the AI assistant</p>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Resource Type</label>
              <Select
                value={resourceType}
                onValueChange={(value) => setResourceType(value as ResourceType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resource type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transcript">Video Transcript</SelectItem>
                  <SelectItem value="notes">Course Notes</SelectItem>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Module 1 Video Transcript"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the content"
                rows={2}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Upload File</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <Input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  accept=".txt,.pdf,.docx,.doc"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Click to upload file</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {resourceType === 'transcript' ? 'TXT, DOCX' : 
                       resourceType === 'notes' ? 'TXT, DOCX, PDF' : 'PDF'}
                    </span>
                  </div>
                </label>
                {selectedFile && (
                  <div className="mt-2 text-sm text-gray-600">
                    Selected: {selectedFile.name}
                  </div>
                )}
              </div>
            </div>
            
            <Button 
              type="button"
              onClick={handleAddResource}
              variant="outline"
              className="flex items-center"
            >
              <FileText className="mr-2 h-4 w-4" />
              Add to Resources List
            </Button>
          </div>
          
          {resources.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Resources to be processed:</h3>
              <div className="space-y-2">
                {resources.map(resource => (
                  <div 
                    key={resource.id} 
                    className="flex items-center justify-between bg-gray-50 p-2 rounded border"
                  >
                    <div className="flex items-center">
                      {resource.type === 'transcript' && <Video size={16} className="mr-2 text-blue-500" />}
                      {resource.type === 'notes' && <FileText size={16} className="mr-2 text-green-500" />}
                      {resource.type === 'pdf' && <FileText size={16} className="mr-2 text-red-500" />}
                      <div>
                        <p className="text-sm font-medium">{resource.title}</p>
                        <p className="text-xs text-gray-500">{resource.file?.name}</p>
                      </div>
                    </div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveResource(resource.id)}
                      className="h-7 w-7 p-0"
                    >
                      <X size={14} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Bot className="mr-2" size={16} />
                Train AI Assistant
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CourseResourceUploader;
