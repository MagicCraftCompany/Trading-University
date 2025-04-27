import { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

type Message = {
  id: string;
  content: string;
  createdAt: string;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

type UserInfo = {
  id: string;
};

// Create a single socket instance for the whole app
let socketInstance: Socket | null = null;

export const useSocket = (chatId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 10;
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine the user from session or localStorage
  useEffect(() => {
    // Try NextAuth session first
    if (session?.user?.id) {
      setUserInfo({ id: session.user.id });
      return;
    }
    
    // Try localStorage as fallback
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const user = JSON.parse(storedUser);
          if (user && user.id) {
            setUserInfo({ id: user.id });
          }
        }
      } catch (e) {
        console.error('Error reading user from localStorage:', e);
      }
    }
  }, [session]);
  
  // Function to fetch initial messages
  const fetchMessages = useCallback(async () => {
    if (!chatId || !userInfo?.id) return;
    
    try {
      setLoading(true);
      
      // Include JWT token if present
      const headers: HeadersInit = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/chat/global`, { headers });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else if (response.status === 401) {
        console.log('Authentication required for chat');
        setMessages([]);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [chatId, userInfo]);
  
  // Heartbeat function to keep connection alive
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    // Send a heartbeat every 25 seconds to keep the connection alive
    heartbeatIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('heartbeat', { userId: userInfo?.id });
      }
    }, 25000);
  }, [userInfo]);
  
  // Stop heartbeat
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);
  
  // Initialize socket connection
  useEffect(() => {
    // Don't establish a connection if user isn't logged in
    if (!userInfo?.id || !chatId) return;
    
    // Create socket connection with better production support
    const initializeSocket = () => {
      // If we already have a socket, clean it up first
      if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.close();
        socketInstance = null;
      }
      
      const socketUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                        (typeof window !== 'undefined' ? window.location.origin : '');
      
      console.log('Initializing new socket at:', socketUrl);
      
      // Clean URL by removing trailing slash if present
      const cleanUrl = socketUrl.endsWith('/') ? socketUrl.slice(0, -1) : socketUrl;
      
      socketInstance = io(cleanUrl, {
        path: '/api/socket/io',
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 15,
        reconnectionDelay: 2000,
        reconnectionDelayMax: 10000,
        timeout: 20000,
        autoConnect: true
      });
      
      socketRef.current = socketInstance;
    };
    
    // Initialize socket if not already connected
    initializeSocket();
    
    if (!socketRef.current) {
      console.error('Failed to initialize socket');
      return;
    }
    
    // Socket event handlers
    const onConnect = () => {
      console.log('Socket connected with ID:', socketRef.current?.id);
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      
      // Join the global chat room
      socketRef.current?.emit('join-global-chat', userInfo.id);
      
      // Start heartbeat to keep connection alive
      startHeartbeat();
    };
    
    const onDisconnect = (reason: string) => {
      console.log('Socket disconnected. Reason:', reason);
      setIsConnected(false);
      stopHeartbeat();
      
      // Force reconnect after a brief delay
      setTimeout(() => {
        if (socketRef.current && !socketRef.current.connected) {
          console.log('Forcing reconnection...');
          socketRef.current.connect();
        }
      }, 3000);
    };
    
    const onConnectError = (err: Error) => {
      console.error('Socket connection error:', err.message);
      setIsConnected(false);
      
      if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
        console.error('Max reconnection attempts reached, reinitializing connection');
        reconnectAttemptsRef.current = 0;
        
        // Reinitialize socket after a delay to avoid rapid reconnection loops
        setTimeout(() => {
          initializeSocket();
        }, 5000);
      } else {
        reconnectAttemptsRef.current++;
      }
    };
    
    const onNewMessage = (newMessage: Message) => {
      console.log('Received new message:', newMessage.content.substring(0, 20));
      setMessages((prev) => {
        // Check if message already exists to prevent duplicates
        if (prev.some(msg => msg.id === newMessage.id)) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };
    
    // Register event handlers
    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);
    socketRef.current.on('connect_error', onConnectError);
    socketRef.current.on('new-message', onNewMessage);
    socketRef.current.on('error', (error: any) => {
      console.error('Socket error:', error);
    });
    
    // Check if already connected
    if (socketRef.current.connected) {
      console.log('Socket already connected with ID:', socketRef.current.id);
      setIsConnected(true);
      socketRef.current.emit('join-global-chat', userInfo.id);
      startHeartbeat();
    }
    
    // Connect if not already connected
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
    
    // Cleanup on unmount
    return () => {
      // Stop heartbeat
      stopHeartbeat();
      
      // Remove event listeners but don't close the socket
      if (socketRef.current) {
        console.log('Removing socket event listeners');
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.off('connect_error', onConnectError);
        socketRef.current.off('new-message', onNewMessage);
        socketRef.current.off('error');
      }
    };
  }, [userInfo, chatId, startHeartbeat, stopHeartbeat]);
  
  // Ensure heartbeat is cleaned up properly
  useEffect(() => {
    return () => {
      stopHeartbeat();
      socketRef.current = null;
    };
  }, [stopHeartbeat]);
  
  // Fetch initial messages
  useEffect(() => {
    if (chatId && userInfo?.id) {
      fetchMessages();
    } else {
      // If not authenticated, set loading to false
      setLoading(false);
    }
  }, [chatId, fetchMessages, userInfo]);
  
  // Send message function
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !chatId || !userInfo?.id) return;
    
    // Only send if socket is connected
    if (!socketRef.current.connected) {
      console.warn('Cannot send message, socket not connected');
      return false;
    }
    
    socketRef.current.emit('send-message', {
      content,
      senderId: userInfo.id,
      chatId,
    });
    
    return true;
  }, [chatId, userInfo]);
  
  return {
    isConnected,
    messages,
    loading,
    sendMessage,
    refetch: fetchMessages,
    isAuthenticated: !!userInfo?.id
  };
}; 