'use client'

import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Send, Smile } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'

// Create a singleton socket instance
let socket: any;

// Add Message interface definition
interface Message {
  id: string;
  content: string;
  user: {
    name: string;
    email: string;
    image: string;
  };
  createdAt: string;
}

// Add utility functions for date handling
const formatMessageDate = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
};

const groupMessagesByDate = (messages: Message[]) => {
  const groups: { [key: string]: Message[] } = {};
  
  messages.forEach(message => {
    const date = new Date(message.createdAt);
    const dateKey = date.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(message);
  });

  return Object.entries(groups).map(([date, messages]) => ({
    date: new Date(date),
    messages
  }));
};

// Dynamically import EmojiPicker with no SSR
const EmojiPickerDynamic = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => null
})

interface UserData {
  id: string;
  name?: string;
  email: string;
  image?: string;
}

const ChatRoom: React.FC = () => {
  const socketRef = useRef<any>(null);  // Keep this ref for component-specific reference
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [onlineUsers, setOnlineUsers] = useState<UserData[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Add a function to save messages to localStorage
  const saveMessagesToStorage = (messages: Message[]) => {
    try {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  };

  // Load messages from localStorage on initial render
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      }
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
    }
  }, []);

  // Load user data from localStorage
  useEffect(() => {
    const userInfo = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    console.log('User info from localStorage:', userInfo ? 'Found' : 'Not found');
    console.log('Token from localStorage:', token ? 'Found' : 'Not found');
    
    try {
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        console.log('Parsed user data:', userData);
        
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email)}`
        });
      } else {
        // Try to get user from token payload
        if (token) {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            console.log('Token payload:', payload);
            if (payload.userId && payload.email) {
              setUser({
                id: payload.userId,
                email: payload.email,
                image: `https://ui-avatars.com/api/?name=${encodeURIComponent(payload.email)}`
              });
            }
          } catch (e) {
            console.error('Error parsing token:', e);
          }
        }
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
      setError('Error loading user data');
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Initialize socket connection when user data is loaded
  useEffect(() => {
    if (!isLoaded || !user) return;

    console.log('Attempting socket connection with user:', user);
    
    try {
      // Use existing socket or create a new one
      if (!socket) {
        const socketUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        console.log('Connecting to socket server at:', socketUrl);
        
        socket = io(socketUrl, {
          path: '/socket.io/',
          // Match server configuration - use polling first, then try WebSocket
          transports: ['polling', 'websocket'],
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          timeout: 20000,
        });
      }
      
      socketRef.current = socket;

      // Only set up listeners if they haven't been set up
      if (!socket._listeners) {
        socket._listeners = true;

        socket.on('connect', () => {
          console.log('Connected to Socket.IO server, socket ID:', socket.id);
          setIsConnected(true);
          setError(null);
          
          // Join the chat with user data
          const joinData = {
            id: user.id,
            fullName: user.name,
            email: user.email,
            imageUrl: user.image,
            userName: user.name,
            userEmail: user.email,
            userImage: user.image
          };
          console.log('Emitting join event with data:', joinData);
          socket.emit('join', joinData);
        });

        socket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
          setIsConnected(false);
          setError('Connection error. Please try again.');
        });

        socket.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server')
          setIsConnected(false)
          setError('Disconnected from chat. Attempting to reconnect...')
        })
        
        socket.on('previous-messages', (previousMessages: Message[]) => {
          console.log('Received previous messages:', previousMessages)
          if (Array.isArray(previousMessages)) {
            setMessages(previousMessages)
            saveMessagesToStorage(previousMessages) // Save to localStorage
          }
        })

        socket.on('message', (message: Message) => {
          console.log('Received new message:', message)
          setMessages((prevMessages) => {
            const updatedMessages = [...prevMessages, message];
            saveMessagesToStorage(updatedMessages); // Save to localStorage
            return updatedMessages;
          })
        })
        
        socket.on('error', (errorData: { message: string }) => {
          console.error('Socket error:', errorData)
          setError(errorData.message || 'An error occurred')
        })
        
        socket.on('user-joined', (userData: UserData) => {
          console.log('User joined:', userData)
          setOnlineUsers(prev => {
            // Add user if not already in the list
            if (!prev.find(u => u.id === userData.id)) {
              return [...prev, userData]
            }
            return prev
          })
        })
        
        socket.on('user-left', (userData: { id: string, name?: string }) => {
          console.log('User left:', userData)
          setOnlineUsers(prev => prev.filter(u => u.id !== userData.id))
        })
      } else {
        // If socket exists and is connected, manually join the room
        if (socket.connected) {
          socket.emit('join', {
            id: user.id,
            fullName: user.name,
            email: user.email,
            imageUrl: user.image
          })
        }
      }

      // Update connection status based on current socket state
      setIsConnected(socket.connected)
    } catch (error) {
      console.error('Error initializing socket:', error)
      setError('Failed to connect to chat. Please refresh the page.')
    }

    // Cleanup function - don't disconnect on component unmount
    return () => {
      // Only remove component-specific listeners
      if (socketRef.current) {
        // We don't disconnect the socket when navigating away
        socketRef.current = null
      }
    }
  }, [user, isLoaded])

  const sendMessage = () => {
    if (input.trim() && user && isConnected && socket) {
      try {
        const messageData = {
          text: input.trim(),
          userId: user.id,
          userName: user.name,
          userEmail: user.email,
          userImage: user.image
        }
        console.log('Sending message:', messageData)
        socket.emit('message', messageData)
        setInput('')
      } catch (error) {
        console.error('Error sending message:', error)
        setError('Failed to send message. Please try again.')
      }
    }
  }

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const handleEmojiSelect = (emojiData: any) => {
    setInput((prev) => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  // Show loading state when waiting for user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Show error if no user data was loaded
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-4">
          <h2 className="text-xl font-bold mb-2">Unable to load user data</h2>
          <p>Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Community Chat</h1>
          <div className="flex items-center mt-4 mb-2">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.image} alt={user?.name || ''} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <div className="font-semibold">{user?.name || user?.email}</div>
              <div className="text-sm text-gray-500">Online</div>
            </div>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">ONLINE USERS ({onlineUsers.length + 1})</h2>
          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm">{user?.name || user?.email} (You)</span>
            </div>
            {onlineUsers.map(onlineUser => (
              <div key={onlineUser.id} className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm">{onlineUser.name || onlineUser.email}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            groupMessagesByDate(messages).map(({ date, messages }) => (
              <div key={date.toISOString()} className="mb-6">
                <div className="flex justify-center mb-4">
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {formatMessageDate(date)}
                  </div>
                </div>
                
                {messages.map((msg) => {
                  const isCurrentUser = msg.user.email === user.email;
                  return (
                    <div 
                      key={msg.id} 
                      className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="mr-2 flex-shrink-0">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={msg.user.image} />
                            <AvatarFallback>{msg.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      
                      <div 
                        className={`max-w-md px-4 py-2 rounded-lg ${
                          isCurrentUser 
                            ? 'bg-[#D4A64E] text-black' 
                            : 'bg-white border border-gray-200 text-gray-900'
                        }`}
                      >
                        {!isCurrentUser && (
                          <div className="font-medium text-xs mb-1">{msg.user.name}</div>
                        )}
                        <div>{msg.content}</div>
                        <div className="text-xs mt-1 text-right text-gray-500">
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input 
                placeholder={isConnected ? "Type a message" : "Connecting..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!isConnected}
                className="pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!isConnected}
              >
                <Smile className="h-5 w-5 text-gray-500" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-12 right-0 z-10">
                  <EmojiPickerDynamic onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
            <Button
              className="ml-2 bg-[#D4A64E] hover:bg-[#c99a47] text-white rounded-full"
              size="icon"
              onClick={sendMessage}
              disabled={!isConnected || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom

