import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

interface VimeoVideoData {
  id: string;
  hash: string;
}

// Map of video IDs to their Vimeo data
const videoMap: Record<number, VimeoVideoData> = {
  1: { id: "1049228759", hash: "c837653e33" },
  2: { id: "1049420658", hash: "b976a2c1a0" },
  3: { id: "1049422137", hash: "1a82bb8e5d" },
  4: { id: "1049425449", hash: "ced0db690d" },
  5: { id: "1049430208", hash: "f84978cf84" },
  6: { id: "1050534522", hash: "7b4a3293cb" },
  7: { id: "1050539920", hash: "a5d4efab0e" },
  8: { id: "1050673812", hash: "86771e40bb" },
  9: { id: "1050680144", hash: "a4d30cb92c" },
  10: { id: "1050681821", hash: "c02afb5287" },
  11: { id: "1050686017", hash: "6d96e223d2" },
  12: { id: "1050693214", hash: "4f8f525142" },
  13: { id: "1050695189", hash: "b86614c24f" },
  14: { id: "1050698497", hash: "3a77a56ea9" },
  15: { id: "1050699005", hash: "d804a0ee54" },
  16: { id: "1050698136", hash: "f51d4b3cd0" },
  17: { id: "1066197190", hash: "e76d47b4eb" }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the auth session
    const { userId } = getAuth(req);
    
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get the video ID from query params
    const { videoId } = req.query;
    
    if (!videoId || typeof videoId !== 'string') {
      return res.status(400).json({ error: 'Invalid video ID' });
    }

    const numericVideoId = parseInt(videoId);
    const videoData = videoMap[numericVideoId];

    if (!videoData) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Construct the video URL with Vimeo's hash
    const videoUrl = `https://player.vimeo.com/video/${videoData.id}?h=${videoData.hash}`;

    return res.status(200).json({ 
      url: videoUrl,
      expires: Date.now() + (3600 * 1000) // Still include expiry for client-side handling
    });

  } catch (error) {
    console.error('Error fetching video URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 