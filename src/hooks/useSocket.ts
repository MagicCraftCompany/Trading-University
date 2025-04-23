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

export const useSocket = (chatId?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);
  const { data: session, status } = useSession();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  
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
  
  // Initialize socket connection
  useEffect(() => {
    // Don't establish a connection if user isn't logged in
    if (!userInfo?.id || !chatId) return;
    
    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_SITE_URL || '', {
      path: '/api/socket/io',
      addTrailingSlash: false,
      auth: {
        token: localStorage.getItem('token') || ''
      }
    });
    
    socketRef.current = socket;
    
    // Socket event handlers
    socket.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      
      socket.emit('join-global-chat', userInfo.id);
    });
    
    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    socket.on('new-message', (newMessage: Message) => {
      setMessages((prev) => [...prev, newMessage]);
    });
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [userInfo, chatId]);
  
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
    
    socketRef.current.emit('send-message', {
      content,
      senderId: userInfo.id,
      chatId,
    });
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