import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as ServerIO } from 'socket.io';
import { NextApiResponseServerIO } from '@/types/socket';
import prisma from '@/db/prisma';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
      // Support authenticated connections with token
      connectionStateRecovery: {
        maxDisconnectionDuration: 2 * 60 * 1000, // 2 min
      },
      // Allow credentials
      cors: {
        origin: process.env.NEXT_PUBLIC_SITE_URL || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      }
    });

    // Socket.IO server
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      // Join public chat
      socket.on('join-global-chat', async (userId) => {
        try {
          if (!userId) {
            console.log('No user ID provided to join chat');
            return;
          }

          // Get or create the global chat
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

          // Add user to chat if not already a member
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

          socket.join(globalChat.id);
          console.log(`User ${userId} joined global chat ${globalChat.id}`);
        } catch (error) {
          console.error('Error joining global chat:', error);
        }
      });

      // Handle new messages
      socket.on('send-message', async (message) => {
        try {
          const { content, senderId, chatId } = message;
          
          if (!content || !senderId || !chatId) {
            console.log('Invalid message data:', message);
            return;
          }
          
          const newMessage = await prisma.message.create({
            data: {
              content,
              senderId,
              chatId,
            },
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
          
          // Broadcast the message to all clients in the chat room
          io.to(chatId).emit('new-message', newMessage);
        } catch (error) {
          console.error('Error sending message:', error);
        }
      });

      // Handle disconnect
      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    // Make the socket available to all API routes
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHandler;