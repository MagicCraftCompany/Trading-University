import { Server as ServerIO } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Set CORS headers for preflight requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Check if socket and server exist and if io is not already initialized
  if (res.socket && 'server' in res.socket && !(res.socket.server as any).io) {
    const httpServer: NetServer = (res.socket.server as any);
    const io = new ServerIO(httpServer, {
      path: '/socket.io/',
      // Use polling transport first, then try WebSocket
      transports: ['polling', 'websocket'],
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        credentials: false
      },
      connectTimeout: 45000,
      // For Vercel serverless functions, set up appropriate timeouts
      pingTimeout: 60000,
      pingInterval: 25000,
      cookie: false
    });
    
    // Add your socket event handlers here
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);
      
      socket.on('join', (userData) => {
        console.log('User joined:', userData);
        socket.broadcast.emit('user-joined', userData);
        
        // Send previous messages to the new user
        // This would typically come from a database
        // For now, we'll just emit an empty array
        socket.emit('previous-messages', []);
      });

      socket.on('message', (messageData) => {
        console.log('Received message:', messageData);
        const formattedMessage = {
          id: Date.now().toString(),
          content: messageData.text,
          user: {
            name: messageData.userName || 'Anonymous',
            email: messageData.userEmail || 'user@example.com',
            image: messageData.userImage || 'https://ui-avatars.com/api/?name=User',
          },
          createdAt: new Date().toISOString(),
        };
        
        // Broadcast the message to all connected clients
        io.emit('message', formattedMessage);
      });

      socket.on('disconnect', () => {
        console.log('Socket disconnected:', socket.id);
      });
    });

    // Attach IO instance to the server object
    (res.socket.server as any).io = io;
  }
  
  // Handle the request appropriately based on method
  if (req.method === 'POST') {
    // Handle POST requests (used in long-polling)
    res.status(200).json({ success: true });
  } else if (req.method === 'GET') {
    // Handle GET requests
    if (res.socket && 'server' in res.socket && (res.socket.server as any).io) {
      // Socket.IO is already initialized
      res.end();
    } else {
      // Socket.IO isn't initialized or there's an issue
      res.status(200).end();
    }
  } else {
    // Method not allowed
    res.status(405).end();
  }
};

export default ioHandler; 