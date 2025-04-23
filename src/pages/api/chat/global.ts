import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import jwt from 'jsonwebtoken';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // First try to get NextAuth session
    const session = await getServerSession(req, res, authOptions);
    let userId: string | null = session?.user?.id || null;
    
    // If no NextAuth session, try to get JWT from Authorization header
    if (!userId) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        try {
          // Verify and decode the JWT token
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as jwt.JwtPayload;
          userId = decoded.userId || null;
        } catch (error) {
          console.error('Invalid token:', error);
        }
      }
    }
    
    // Return unauthorized if no valid session or token
    if (!userId) {
      return res.status(401).json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to access chat messages'
      });
    }

    // Only handle GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Find or create global chat
    const globalChat = await prisma.chat.findFirst({
      where: {
        type: 'GROUP',
        name: 'Global Chat'
      }
    }) || await prisma.chat.create({
      data: {
        type: 'GROUP',
        name: 'Global Chat'
      }
    });

    // Ensure user is a member of the chat
    const existingMember = await prisma.chatMember.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId: globalChat.id
        }
      }
    });

    if (!existingMember) {
      await prisma.chatMember.create({
        data: {
          userId,
          chatId: globalChat.id,
          role: 'MEMBER'
        }
      });
    }

    // Get messages with pagination
    const { page = '1', limit = '50' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const messages = await prisma.message.findMany({
      where: {
        chatId: globalChat.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limitNum,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        }
      }
    });

    return res.status(200).json({
      chatId: globalChat.id,
      messages: messages.reverse(),
    });
  } catch (error) {
    console.error('Error fetching global chat:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
} 