
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from '@/components/ui/separator';

interface TranscriptLine {
  time: string;
  text: string;
}

interface TranscriptViewerProps {
  transcript: TranscriptLine[];
}

const TranscriptViewer: React.FC<TranscriptViewerProps> = ({ transcript }) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Video Transcript</CardTitle>
      </CardHeader>
      <CardContent className="max-h-[500px] overflow-y-auto">
        {transcript.map((line, index) => (
          <div key={index} className="mb-3">
            <div className="flex">
              <span className="text-xs text-muted-foreground font-mono w-24">{line.time}</span>
              <p className="text-sm">{line.text}</p>
            </div>
            {index < transcript.length - 1 && <Separator className="mt-2" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default TranscriptViewer;
