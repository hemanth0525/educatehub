
interface TranscriptLine {
  time: string;
  text: string;
}

export function parseYouTubeTranscript(rawTranscript: string): TranscriptLine[] {
  const lines = rawTranscript.split('\n').filter(line => line.trim() !== '');
  const transcript: TranscriptLine[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip lines that are comments or headers
    if (line.startsWith('#')) continue;
    
    // Parse timestamp and text
    const timestampMatch = line.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})\s(.+)$/);
    if (timestampMatch) {
      transcript.push({
        time: timestampMatch[1],
        text: timestampMatch[2]
      });
    }
  }
  
  return transcript;
}

// Format seconds to HH:MM:SS
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
