import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Build YouTube auth URL with the required scopes
  const scope = encodeURIComponent('https://www.googleapis.com/auth/youtube.channel-memberships.creator');
  
  // Create a state parameter to maintain context
  const state = encodeURIComponent(JSON.stringify({
    session_id: req.query.session_id || '',
    redirect_after: req.query.redirect_after || '/login',
  }));

  // Construct the auth URL
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${
    process.env.YOUTUBE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
  }&redirect_uri=${
    encodeURIComponent(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/youtube-callback`)
  }&response_type=code&scope=${scope}&access_type=offline&state=${state}`;

  // Redirect to YouTube/Google auth page
  res.redirect(authUrl);
} 