import { useState, useEffect } from 'react';

// Direct video URLs for quick access
export const videoMap: Record<number, string> = {
  1: "https://player.vimeo.com/video/1049228759?h=c837653e33",
  2: "https://player.vimeo.com/video/1049420658?h=b976a2c1a0",
  3: "https://player.vimeo.com/video/1049422137?h=1a82bb8e5d",
  4: "https://player.vimeo.com/video/1049425449?h=ced0db690d",
  5: "https://player.vimeo.com/video/1049430208?h=f84978cf84",
  6: "https://player.vimeo.com/video/1050534522?h=7b4a3293cb",
  7: "https://player.vimeo.com/video/1050539920?h=a5d4efab0e",
  8: "https://player.vimeo.com/video/1050673812?h=86771e40bb",
  9: "https://player.vimeo.com/video/1050680144?h=a4d30cb92c",
  10: "https://player.vimeo.com/video/1050681821?h=c02afb5287",
  11: "https://player.vimeo.com/video/1050686017?h=6d96e223d2",
  12: "https://player.vimeo.com/video/1050693214?h=4f8f525142",
  13: "https://player.vimeo.com/video/1050695189?h=b86614c24f",
  14: "https://player.vimeo.com/video/1050698497?h=3a77a56ea9",
  15: "https://player.vimeo.com/video/1050699005?h=d804a0ee54",
  16: "https://player.vimeo.com/video/1050698136?h=f51d4b3cd0",
  17: "https://player.vimeo.com/video/1066197190?h=e76d47b4eb"
};

// Map lesson IDs to different video IDs
export const lessonVideoMap: Record<number, number> = {
  // Module 1
  100: 1,
  101: 2,
  102: 3,
  103: 4,
  104: 5,
  // Module 2
  200: 6,
  201: 7,
  202: 8,
  203: 9,
  204: 10,
  // Module 3
  300: 11,
  301: 12, 
  302: 13,
  303: 14,
  304: 15,
  // Module 4
  400: 16,
  401: 17,
  402: 1,
  403: 2,
  404: 3,
  // Module 5
  500: 4,
  501: 5,
  502: 6,
  503: 7,
  504: 8,
  // Module 6
  600: 9,
  601: 10,
  602: 11,
  603: 12,
  604: 13,
  // Module 7
  700: 14,
  701: 15,
  702: 16,
  703: 17,
  704: 1,
  // Module 8
  800: 2,
  801: 3,
  802: 4,
  803: 5,
  804: 6,
  // Module 9
  900: 7,
  901: 8,
  902: 9,
  903: 10,
  904: 11,
  // Module 10
  1000: 12,
  1001: 13,
  1002: 14,
  1003: 15,
  1004: 16
};

interface VideoProps {
  videoId: number;
  autoplay?: boolean;
}

const VideoPlayer = ({ videoId, autoplay = false }: VideoProps): JSX.Element => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadVideo = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Get token from localStorage to check authentication
        const token = localStorage.getItem('token');
        
        if (!token) {
          throw new Error('Authentication required');
        }
        
        // Get the video URL from the map or use a default
        const baseUrl = videoMap[videoId] || videoMap[1];
        
        if (!baseUrl) {
          throw new Error('Video not found');
        }
        
        // Add autoplay parameter if needed
        const finalUrl = `${baseUrl}${autoplay ? '&autoplay=1' : ''}`;
        setVideoUrl(finalUrl);
      } catch (err) {
        console.error('Error loading video:', err);
        setError(err instanceof Error ? err.message : 'Error loading video');
      } finally {
        setIsLoading(false);
      }
    };

    loadVideo();
  }, [videoId, autoplay]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-[#061213] border border-[#1A1D24]/30">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#CB9006]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[480px] bg-[#061213] border border-[#1A1D24]/30 p-4 rounded">
        <div className="text-center">
          <p className="font-bold mb-2 text-red-400">Error</p>
          <p className="text-gray-300 mb-4">{error === 'Authentication required' ? 'Video not found or not available' : error}</p>
          {error === 'Authentication required' && (
            <button 
              onClick={() => window.location.href = '/login'}
              className="mt-4 px-4 py-2 bg-[#CB9006] text-white rounded hover:bg-[#B07D05] transition-colors"
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
      <div className="flex items-center justify-center h-[480px] bg-[#061213] border border-[#1A1D24]/30">
        <p className="text-gray-400">Video not available</p>
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
      title={`Video ${videoId}`}
      style={{ pointerEvents: 'auto' }}
      onContextMenu={(e) => e.preventDefault()} // Prevent right-click
      onError={() => setError('Video failed to load')}
    ></iframe>
  );
};

// Export functions for different use cases
export const getIntroVideo = (id: number, autoplay?: boolean): JSX.Element => {
  return <VideoPlayer videoId={id} autoplay={!!autoplay} />;
};

export const getLessonVideo = (lessonId: number, autoplay?: boolean): JSX.Element => {
  // Get the correct video ID from our mapping or calculate one
  let videoId;
  
  // If we have a direct mapping for this lesson ID, use it
  if (lessonVideoMap[lessonId]) {
    videoId = lessonVideoMap[lessonId];
  } else {
    // Otherwise calculate based on module and lesson number
    const videosCount = Object.keys(videoMap).length;
    videoId = ((lessonId % videosCount) || videosCount);
  }
  
  return <VideoPlayer videoId={videoId} autoplay={!!autoplay} />;
};
