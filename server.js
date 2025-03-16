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
      socket.join('chatroom');
      
      try {
        // Create or update user in database
        const user = await prisma.user.upsert({
          where: { id: userData.id },
          update: {
            name: userData.fullName,
            email: userData.email,
            image: userData.imageUrl
          },
          create: {
            id: userData.id,
            name: userData.fullName,
            email: userData.email,
            image: userData.imageUrl,
            plan: 'free' // Set default plan
          }
        });
        console.log('User upserted:', JSON.stringify(user, null, 2));

        // Fetch last 50 messages
        const messages = await prisma.chatMessage.findMany({
          take: 50,
          orderBy: {
            createdAt: 'desc'
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
        
        const reversedMessages = messages.reverse();
        console.log('Sending previous messages:', JSON.stringify(reversedMessages, null, 2));
        socket.emit('previous-messages', reversedMessages);
      } catch (error) {
        console.error('Error in join handler:', error);
      }
    });

    socket.on('message', async (data) => {
      console.log('Received message data:', JSON.stringify(data, null, 2));
      try {
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
        io.to('chatroom').emit('message', savedMessage);
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected, socket ID:', socket.id);
    });
  });

  const PORT = process.env.PORT || 3000;
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
