const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

// Create the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create the HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Create Socket.IO server
  const io = new Server(server, {
    path: '/api/socket/io',
    addTrailingSlash: false,
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
        const existingMember = await prisma.chatMember.findFirst({
          where: {
            userId: userId,
            chatId: globalChat.id
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

  // Make the socket available to Next.js API routes
  server.io = io;

  // Start the server
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}); 