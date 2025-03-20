import { useState, useEffect } from 'react';
import io from 'socket.io-client';

export default function SocketTest() {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionDetails, setConnectionDetails] = useState('');
  const [lastMessage, setLastMessage] = useState('');
  const [error, setError] = useState('');
  const [transport, setTransport] = useState('');

  useEffect(() => {
    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    console.log('Connecting to socket server at:', socketUrl);
    
    // Disable auto-connect so we can set up event handlers first
    const socket = io(socketUrl, {
      path: '/socket.io/',
      transports: ['polling', 'websocket'],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      forceNew: true
    });

    // Set up all event handlers before connecting
    socket.on('connect', () => {
      setIsConnected(true);
      // @ts-ignore - Socket.io typings issue
      const transportName = socket.io?.engine?.transport?.name || 'unknown';
      setTransport(transportName);
      setConnectionDetails(`Connected with ID: ${socket.id}, Transport: ${transportName}`);
      console.log('Socket connected!', socket);
    });

    socket.on('connect_error', (err: Error) => {
      console.error('Connection error:', err);
      setError(`Connect error: ${err.message}`);
    });

    // @ts-ignore - Socket.io typings issue
    socket.io?.on('error', (err: Error) => {
      console.error('IO error:', err);
      setError(`IO error: ${err.message}`);
    });

    // @ts-ignore - Socket.io typings issue
    socket.io?.on('reconnect_attempt', (attempt: number) => {
      console.log(`Reconnection attempt ${attempt}`);
      setConnectionDetails(prev => `${prev}\nReconnection attempt ${attempt}`);
    });

    socket.on('message', (msg: any) => {
      setLastMessage(JSON.stringify(msg));
    });

    socket.on('disconnect', (reason: string) => {
      setIsConnected(false);
      setConnectionDetails(`Disconnected: ${reason}`);
      console.log(`Disconnected: ${reason}`);
    });

    // Once all handlers are set up, connect
    socket.connect();

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Function to simulate sending a test message
  const sendTestMessage = () => {
    const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    fetch(`${socketUrl}/api/socket/io`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        method: 'POST',
        url: `/socket.io/?EIO=4&transport=${transport || 'polling'}`
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Test request successful:', data);
      setConnectionDetails(prev => `${prev}\nTest request successful`);
    })
    .catch(err => {
      console.error('Test request failed:', err);
      setError(`Test request failed: ${err.message}`);
    });
  };

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
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">{connectionDetails}</pre>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded">
          <h2 className="font-semibold text-red-700">Error:</h2>
          <pre className="mt-2 text-red-600 overflow-x-auto whitespace-pre-wrap">{error}</pre>
        </div>
      )}
      
      {lastMessage && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="font-semibold">Last Message:</h2>
          <pre className="mt-2 bg-gray-100 p-2 rounded overflow-x-auto whitespace-pre-wrap">{lastMessage}</pre>
        </div>
      )}

      <div className="mt-6">
        <button 
          onClick={sendTestMessage}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Send Test Request
        </button>
      </div>
    </div>
  );
} 