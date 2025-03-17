import { useState, useEffect } from 'react';

interface VideoResponse {
  url: string;
  expires: number;
}

interface VideoProps {
  videoId: number;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoId, autoplay = false }: VideoProps): JSX.Element => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        const response = await fetch(`/api/videos?videoId=${videoId}${autoplay ? '&autoplay=true' : ''}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch video URL');
        }
        
        const data: VideoResponse = await response.json();
        setVideoUrl(data.url);
      } catch (err) {
        console.error('Error fetching video URL:', err);
        setError(err instanceof Error ? err.message : 'Error loading video');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoUrl();
  }, [videoId, autoplay]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-100 text-red-500 p-4 rounded">
        <div className="text-center">
          <p className="font-bold mb-2">Error</p>
          <p>{error}</p>
          {error === 'Authentication required' && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-[#D4A64E] text-white rounded hover:bg-[#c99a47]"
            >
              Login to Watch
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-gray-100">
        <p>Loading video...</p>
      </div>
    );
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

export const getIntroVideo = (id: number, autoplay?: boolean): JSX.Element => {
  return <VideoPlayer videoId={id} autoplay={autoplay} />;
};
