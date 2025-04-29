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

// Track if we're in the process of reconnecting to avoid multiple reconnection attempts
let isReconnecting = false;

// Cache the global chat ID to reduce database lookups
let cachedChatId: string | null = null;

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
  const lastFetchTimeRef = useRef<number>(0);
  const messageRequestPendingRef = useRef<boolean>(false);
  
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
  
  // Function to fetch initial messages with debouncing
  const fetchMessages = useCallback(async (force = false) => {
    if (!chatId || !userInfo?.id) return;
    
    // Debounce requests - don't fetch more than once every 10 seconds unless forced
    const now = Date.now();
    if (!force && now - lastFetchTimeRef.current < 10000) {
      return;
    }
    
    // Don't make overlapping requests
    if (messageRequestPendingRef.current) {
      return;
    }
    
    try {
      messageRequestPendingRef.current = true;
      setLoading(true);
      lastFetchTimeRef.current = now;
      
      // Use cached chat ID if available
      if (cachedChatId) {
        console.log('Using cached chat ID:', cachedChatId);
      }
      
      // Include JWT token if present
      const headers: HeadersInit = {};
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`/api/chat/global`, { 
        headers,
        // Add cache control to prevent excessive server requests
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000) // Timeout after 5 seconds
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.chatId) {
          cachedChatId = data.chatId; // Cache the chat ID for future use
        }
        setMessages(data.messages || []);
      } else if (response.status === 401) {
        console.log('Authentication required for chat');
        setMessages([]);
      } else {
        // Handle other error statuses
        console.error('Error fetching messages, status:', response.status);
      }
    } catch (error) {
      // Don't log aborted requests as errors
      if (error && typeof error === 'object' && 'name' in error && error.name !== 'AbortError') {
        console.error('Error fetching messages:', error);
      }
    } finally {
      setLoading(false);
      messageRequestPendingRef.current = false;
    }
  }, [chatId, userInfo]);
  
  // Heartbeat function to keep connection alive
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    
    // Send a heartbeat every 30 seconds to keep the connection alive
    // Increased from 25 to 30 seconds to reduce server load
    heartbeatIntervalRef.current = setInterval(() => {
      if (socketRef.current?.connected) {
        socketRef.current.emit('heartbeat', { userId: userInfo?.id });
      }
    }, 30000);
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
    if (!userInfo?.id) return;
    
    // Create socket connection with better production support
    const initializeSocket = () => {
      // Prevent multiple reconnection attempts
      if (isReconnecting) {
        return;
      }
      
      isReconnecting = true;
      
      // If we already have a socket, clean it up first
      if (socketInstance) {
        socketInstance.removeAllListeners();
        socketInstance.close();
        socketInstance = null;
      }
      
      const socketUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                        (typeof window !== 'undefined' ? window.location.origin : '');
      
      // Clean URL by removing trailing slash if present
      const cleanUrl = socketUrl.endsWith('/') ? socketUrl.slice(0, -1) : socketUrl;
      
      try {
        socketInstance = io(cleanUrl, {
          path: '/api/socket/io',
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: 8, // Reduced to minimize rapid reconnection attempts
          reconnectionDelay: 3000, // Increased to reduce server load
          reconnectionDelayMax: 15000,
          timeout: 30000,
          autoConnect: true
        });
        
        socketRef.current = socketInstance;
      } catch (err) {
        console.error('Error initializing socket:', err);
      } finally {
        isReconnecting = false;
      }
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
        if (socketRef.current && !socketRef.current.connected && !isReconnecting) {
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
          if (!isReconnecting) {
            initializeSocket();
          }
        }, 10000); // Increased delay to reduce server load
      } else {
        reconnectAttemptsRef.current++;
      }
    };
    
    const onNewMessage = (newMessage: Message) => {
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
    if (!socketRef.current.connected && !isReconnecting) {
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
  }, [userInfo, startHeartbeat, stopHeartbeat]);
  
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
      
      // Setup periodic refresh of messages
      const refreshInterval = setInterval(() => {
        fetchMessages();
      }, 30000); // Refresh messages every 30 seconds
      
      return () => clearInterval(refreshInterval);
    } else {
      // If not authenticated, set loading to false
      setLoading(false);
    }
  }, [chatId, fetchMessages, userInfo]);
  
  // Send message function with better error handling
  const sendMessage = useCallback((content: string) => {
    if (!socketRef.current || !userInfo?.id) return false;
    
    // Use cached chatId if available, otherwise fallback to the prop
    const targetChatId = cachedChatId || chatId;
    if (!targetChatId) return false;
    
    // Only send if socket is connected
    if (!socketRef.current.connected) {
      console.warn('Cannot send message, socket not connected');
      return false;
    }
    
    try {
      socketRef.current.emit('send-message', {
        content,
        senderId: userInfo.id,
        chatId: targetChatId,
      });
      
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      return false;
    }
  }, [chatId, userInfo]);
  
  return {
    isConnected,
    messages,
    loading,
    sendMessage,
    refetch: (force = true) => fetchMessages(force),
    isAuthenticated: !!userInfo?.id
  };
}; 