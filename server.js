const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');
const { PrismaClient } = require('@prisma/client');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const prisma = new PrismaClient();

// Debug logging for Prisma queries
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: ["*"],
      credentials: true
    },
    path: "/socket.io/",
    addTrailingSlash: false,
    transports: ['websocket', 'polling']
  });

  io.on('connection', (socket) => {
    console.log('Client connected, socket ID:', socket.id);

    socket.on('join', async (userData) => {
      console.log('User joined:', JSON.stringify(userData, null, 2));
      
      // Store user data in socket for later use
      socket.userData = userData;
      
      // Join the chatroom
      socket.join('chatroom');
      
      try {
        // Create or update user in database
        const user = await prisma.user.upsert({
          where: { id: userData.id },
          update: {
            name: userData.fullName,
            email: userData.email,
            image: userData.imageUrl,
            lastLoginAt: new Date()
          },
          create: {
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            image: userData.imageUrl,
            password: '', // Required field in schema
            authProvider: 'GOOGLE', // Using GOOGLE as default for socket users
            lastLoginAt: new Date()
          }
        });
        console.log('User upserted:', JSON.stringify(user, null, 2));

        // Fetch last 50 messages
        const messages = await prisma.chatMessage.findMany({
          take: 50,
          orderBy: {
            createdAt: 'asc' // Changed to ascending order to show oldest first
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
        
        console.log('Sending previous messages:', JSON.stringify(messages, null, 2));
        socket.emit('previous-messages', messages);
        
        // Broadcast to others that a new user has joined
        socket.to('chatroom').emit('user-joined', {
          id: userData.id,
          name: userData.fullName,
          email: userData.email,
          image: userData.imageUrl
        });
      } catch (error) {
        console.error('Error in join handler:', error);
        socket.emit('error', { message: 'Failed to join chat' });
      }
    });

    socket.on('message', async (data) => {
      console.log('Received message data:', JSON.stringify(data, null, 2));
      try {
        // Validate the message data
        if (!data.text || !data.userId) {
          socket.emit('error', { message: 'Invalid message data' });
          return;
        }
        
        const savedMessage = await prisma.chatMessage.create({
          data: {
            content: data.text,
            userId: data.userId,
          },
          include: {
            user: {
              select: {
                name: true,
                email: true,
                image: true
              }
            }
          }
        });
        
        console.log('Saved and broadcasting message:', JSON.stringify(savedMessage, null, 2));
        // Broadcast to all clients including sender
        io.to('chatroom').emit('message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
        socket.emit('error', { message: 'Failed to save message' });
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected, socket ID:', socket.id);
      
      // If we have user data, notify others that user has left
      if (socket.userData) {
        socket.to('chatroom').emit('user-left', {
          id: socket.userData.id,
          name: socket.userData.fullName
        });
      }
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
