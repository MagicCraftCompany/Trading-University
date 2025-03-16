import { NextApiRequest, NextApiResponse } from 'next';
import { getAuth } from '@clerk/nextjs/server';

// Map of video IDs to their Vimeo IDs - moved from frontend
const videoMap: Record<number, string> = {
  1: "1049228759",
  2: "1049420658",
  3: "1049422137",
  4: "1049425449",
  5: "1049430208",
  6: "1050534522",
  7: "1050539920",
  8: "1050673812",
  9: "1050680144",
  10: "1050681821",
  11: "1050686017",
  12: "1050693214",
  13: "1050695189",
  14: "1050698497",
  15: "1050699005",
  16: "1050698136",
  17: "1066197190"
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
    const vimeoId = videoMap[numericVideoId];

    if (!vimeoId) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Generate a temporary token or signature if needed
    const timestamp = Date.now();
    const expiresIn = 3600; // URL expires in 1 hour

    // Construct the secure video URL with expiration
    const secureUrl = `https://player.vimeo.com/video/${vimeoId}?h=${generateSecureHash(vimeoId, timestamp, expiresIn)}`;

    return res.status(200).json({ 
      url: secureUrl,
      expires: timestamp + (expiresIn * 1000)
    });

  } catch (error) {
    console.error('Error fetching video URL:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Helper function to generate a secure hash (implement based on your security requirements)
function generateSecureHash(videoId: string, timestamp: number, expiresIn: number): string {
  // Implement your secure hash generation logic here
  // This should use environment variables and proper cryptographic methods
  return 'secure_hash_here';
} 