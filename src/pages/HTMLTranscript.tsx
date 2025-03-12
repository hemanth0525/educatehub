
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Container from '@/components/ui/Container';
import TranscriptViewer from '@/components/transcript/TranscriptViewer';
import { Button } from '@/components/ui/button';
import { parseYouTubeTranscript } from '@/lib/transcript-parser';
import { Loader2 } from 'lucide-react';

const HTMLTranscript: React.FC = () => {
  const [transcript, setTranscript] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchTranscript = async () => {
      try {
        // Fetching transcript data from the data file
        const response = await fetch('/ts.txt');
        const data = await response.text();
        
        // Parse the transcript
        const parsedTranscript = parseYouTubeTranscript(data);
        setTranscript(parsedTranscript);
      } catch (error) {
        console.error('Error loading transcript:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTranscript();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <Container>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <h1 className="text-3xl font-bold">HTML Introduction - Transcript</h1>
              <p className="text-muted-foreground">
                This transcript is from W3Schools' YouTube tutorial "HTML - Introduction"
              </p>
              
              <div className="flex gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => window.open('https://www.youtube.com/watch/it1rTvBcfRg', '_blank')}
                >
                  Watch on YouTube
                </Button>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <TranscriptViewer transcript={transcript} />
            )}
          </div>
        </Container>
      </main>
      
      <Footer />
    </div>
  );
};

export default HTMLTranscript;
