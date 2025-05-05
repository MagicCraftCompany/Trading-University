import type { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { code, state } = req.query;
  
  // Parse state parameters
  let stateParams: any = {};
  try {
    stateParams = JSON.parse(decodeURIComponent(state as string));
  } catch (error) {
    console.error('Error parsing state:', error);
  }
  
  const redirectAfter = stateParams.redirect_after || '/login';

  // Ensure we have a code from YouTube
  if (!code) {
    return res.redirect(`${redirectAfter}?error=NoCodeProvided`);
  }

  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code: code as string,
        client_id: process.env.YOUTUBE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
        client_secret: process.env.YOUTUBE_CLIENT_SECRET || process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/auth/youtube-callback`,
        grant_type: 'authorization_code',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Error exchanging code for tokens:', tokenData);
      return res.redirect(`${redirectAfter}?error=YouTubeAuthFailed`);
    }

    // Use the access token to get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    const googleUserInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok) {
      console.error('Error getting user info from Google:', googleUserInfo);
      return res.redirect(`${redirectAfter}?error=YouTubeAuthFailed`);
    }

    // Verify YouTube channel membership
    const isMember = await verifyYouTubeMembership(tokenData.access_token);
    
    if (!isMember) {
      console.log('User is not a YouTube member:', googleUserInfo.email);
      return res.redirect(`${redirectAfter}?error=NotYouTubeMember`);
    }

    // Find or create user in database
    let user = await prisma.user.findUnique({
      where: {
        email: googleUserInfo.email,
      },
      include: {
        subscription: true
      }
    });

    if (!user) {
      // Create new user with YouTube membership
      user = await prisma.user.create({
        data: {
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          image: googleUserInfo.picture,
          googleId: googleUserInfo.id,
          authProvider: 'GOOGLE',
          youTubeMembershipVerified: true,
          youTubeMembershipVerifiedAt: new Date(),
          youtubeAccessToken: tokenData.access_token,
          youtubeRefreshToken: tokenData.refresh_token,
          youtubeTokenExpiry: tokenData.expires_in 
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : undefined,
          lastLoginAt: new Date(),
        },
        include: {
          subscription: true
        }
      });
    } else {
      // Update existing user with YouTube membership info
      user = await prisma.user.update({
        where: {
          email: googleUserInfo.email,
        },
        data: {
          name: googleUserInfo.name || user.name,
          image: googleUserInfo.picture || user.image,
          googleId: googleUserInfo.id,
          youTubeMembershipVerified: true,
          youTubeMembershipVerifiedAt: new Date(),
          youtubeAccessToken: tokenData.access_token,
          youtubeRefreshToken: tokenData.refresh_token,
          youtubeTokenExpiry: tokenData.expires_in 
            ? new Date(Date.now() + tokenData.expires_in * 1000)
            : undefined,
          lastLoginAt: new Date(),
        },
        include: {
          subscription: true
        }
      });
    }

    // Create JWT token with user information including YouTube membership
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        provider: 'GOOGLE',
        youTubeMember: true,
        subscriptionStatus: user.subscription?.status || 'FREE'
      },
      process.env.JWT_SECRET || 'fallback-secret-key-for-development-only',
      { expiresIn: '7d' }
    );

    // Redirect to login page with success parameters
    return res.redirect(
      `/login?success=true&token=${token}&email=${encodeURIComponent(user.email)}&name=${encodeURIComponent(user.name || 'User')}`
    );
  } catch (error) {
    console.error('Error in YouTube callback:', error);
    return res.redirect(`${redirectAfter}?error=AuthenticationFailed`);
  }
}

// Function to verify YouTube membership
async function verifyYouTubeMembership(accessToken: string): Promise<boolean> {
  try {
    // Get YouTube channel ID from environment variables
    const channelId = process.env.YOUTUBE_CHANNEL_ID || 'UC9RRYB9wpfAKPy95OSUdzDw';
    
    // Make a request to YouTube API to check membership
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/members?part=snippet&maxResults=1&mine=true`, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      console.error('YouTube membership verification error:', await response.text());
      return false;
    }
    
    const data = await response.json();
    
    // Check if user is a member of the channel
    // This is a simplified approach - in production you would need to check
    // if the user is specifically a member of your channel
    return data && data.items && data.items.length > 0;
  } catch (error) {
    console.error('Error verifying YouTube membership:', error);
    return false;
  }
} 