import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function SocketTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('Connecting to socket server at:', socketUrl);
    
    const socket = io(socketUrl, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionDetails(`Connected with ID: ${socket.id}`);
      console.log('Socket connected!', socket);
    });

    socket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
      setError(`Connect error: ${err.message}`);
    });

    socket.on('message', (msg: any) => {
      setLastMessage(JSON.stringify(msg));
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      setConnectionDetails('Disconnected');
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Socket.IO Test</h1>
      
      <div className="mb-4 p-4 border rounded">
        <h2 className="font-semibold">Connection Status:</h2>
        <div className="flex items-center mt-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </div>
      
      {connectionDetails && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="font-semibold">Connection Details:</h2>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">{connectionDetails}</pre>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
          <h2 className="font-semibold text-red-700">Error:</h2>
          <pre className="mt-2 text-red-600 overflow-x-auto">{error}</pre>
        </div>
      )}
      
      {lastMessage && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="font-semibold">Last Message:</h2>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto">{lastMessage}</pre>
        </div>
      )}
    </div>
  );
} 