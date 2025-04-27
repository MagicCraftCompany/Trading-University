const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const hostname = dev ? 'localhost' : '0.0.0.0';
const port = process.env.PORT || 3000;
const prisma = new PrismaClient();

console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL || 'not set');

// Create the Next.js app
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create the HTTP server
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Create Socket.IO server with better production configuration
  const io = new Server(server, {
    path: '/api/socket/io',
    cors: {
      origin: process.env.NEXT_PUBLIC_SITE_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 30000,
    maxHttpBufferSize: 1e6,
    allowUpgrades: true
  });

  // Track active sockets per user
  const userSockets = new Map();
  const activeUsers = new Map();

  // Periodic cleanup of inactive connections
  setInterval(() => {
    const now = Date.now();
    
    // Clean up inactive users (those inactive for more than 15 minutes)
    activeUsers.forEach((lastActive, userId) => {
      if (now - lastActive > 15 * 60 * 1000) {
        console.log(`Cleaning up inactive user: ${userId}`);
        activeUsers.delete(userId);
      }
    });
    
    // Log active connections
    console.log(`Active connections: ${io.engine.clientsCount}`);
    console.log(`Active users: ${activeUsers.size}`);
  }, 5 * 60 * 1000); // Run every 5 minutes

  // Socket.IO server
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id} (total: ${io.engine.clientsCount})`);

    // Handle heartbeat to keep connection alive
    socket.on('heartbeat', ({ userId }) => {
      if (userId) {
        activeUsers.set(userId, Date.now());
      }
    });

    // Handle authentication
    socket.on('join-global-chat', async (userId) => {
      try {
        if (!userId) {
          console.log('No user ID provided to join chat');
          socket.emit('error', { message: 'User ID required' });
          return;
        }

        // Mark user as active
        activeUsers.set(userId, Date.now());

        // Store socket reference for this user
        if (!userSockets.has(userId)) {
          userSockets.set(userId, new Set());
        }
        userSockets.get(userId).add(socket.id);

        // Get or create the global chat
        let globalChat = await prisma.chat.findFirst({
          where: {
            type: 'GROUP',
            name: 'Global Chat'
          }
        });
        
        if (!globalChat) {
          globalChat = await prisma.chat.create({
            data: {
              type: 'GROUP',
              name: 'Global Chat'
            }
          });
          console.log('Created new Global Chat:', globalChat.id);
        }

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
        console.log(`User ${userId} joined global chat ${globalChat.id} (Socket: ${socket.id})`);
        
        // Acknowledge the join with chat data
        socket.emit('joined-chat', { 
          chatId: globalChat.id,
          success: true
        });
      } catch (error) {
        console.error('Error joining global chat:', error);
        socket.emit('error', { message: 'Error joining chat' });
      }
    });

    // Handle new messages with debouncing to prevent flooding
    let lastMessageTime = 0;
    const MESSAGE_RATE_LIMIT = 500; // ms between messages
    
    socket.on('send-message', async (message) => {
      try {
        const now = Date.now();
        if (now - lastMessageTime < MESSAGE_RATE_LIMIT) {
          socket.emit('error', { message: 'Please wait before sending another message' });
          return;
        }
        lastMessageTime = now;
        
        const { content, senderId, chatId } = message;
        
        if (!content || !senderId || !chatId) {
          console.log('Invalid message data:', message);
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }
        
        // Update active status for user
        activeUsers.set(senderId, now);
        
        // Prevent extremely long messages
        const truncatedContent = content.substring(0, 1000);
        
        // Check if the chat exists
        const chat = await prisma.chat.findUnique({
          where: { id: chatId }
        });
        
        if (!chat) {
          socket.emit('error', { message: 'Chat not found' });
          return;
        }
        
        const newMessage = await prisma.message.create({
          data: {
            content: truncatedContent,
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
        
        console.log(`New message from ${senderId} in chat ${chatId}: ${truncatedContent.substring(0, 30)}${truncatedContent.length > 30 ? '...' : ''}`);
        
        // Broadcast the message to all clients in the chat room
        io.to(chatId).emit('new-message', newMessage);
        
        // Acknowledge successful message
        socket.emit('message-sent', { 
          messageId: newMessage.id,
          success: true
        });
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle error
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });

    // Handle disconnect
    socket.on('disconnect', (reason) => {
      console.log(`Socket disconnected: ${socket.id}, reason: ${reason} (remaining: ${io.engine.clientsCount})`);
      
      // Clean up user socket mapping
      for (const [userId, sockets] of userSockets.entries()) {
        if (sockets.has(socket.id)) {
          sockets.delete(socket.id);
          console.log(`Removed socket ${socket.id} for user ${userId} (${sockets.size} sockets remaining)`);
          
          if (sockets.size === 0) {
            userSockets.delete(userId);
            console.log(`User ${userId} has no more active sockets`);
          }
          break;
        }
      }
    });
  });

  // Handle server shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    io.close(() => {
      console.log('Socket.IO server closed');
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    });
  });

  // Error handling for the HTTP server
  server.on('error', (err) => {
    console.error('Server error:', err);
  });

  // Make the socket available to Next.js API routes
  server.io = io;

  // Start the server
  server.listen(port, hostname, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> Environment: ${process.env.NODE_ENV}`);
    console.log(`> NEXT_PUBLIC_SITE_URL: ${process.env.NEXT_PUBLIC_SITE_URL || 'not set'}`);
  });
}); 