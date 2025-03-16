import { useState, useEffect } from 'react';

interface VideoResponse {
  url: string;
  expires: number;
}

interface VideoProps {
  videoId: number;
}

const VideoPlayer = ({ videoId }: VideoProps): JSX.Element => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(`/api/videos?videoId=${videoId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video URL');
        }
        const data: VideoResponse = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        setError('Error loading video');
        console.error('Error fetching video URL:', err);
      }
    };

    fetchVideoUrl();
  }, [videoId]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!videoUrl) {
    return <div className="loading">Loading video...</div>;
  }

  return (
    <iframe
      src={videoUrl}
      width="100%"
      height="480"
      frameBorder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title={`Lesson ${videoId}`}
      style={{ pointerEvents: 'auto' }}
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click
    ></iframe>
  );
};

export const getIntroVideo = (id: number): JSX.Element => {
  return <VideoPlayer videoId={id} />;
};
