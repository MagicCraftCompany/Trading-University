'use client'

import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Send, Smile, Menu, X, ChevronDown, Users, MessageSquare } from 'lucide-react'
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
  const [showSidebar, setShowSidebar] = useState(false)
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
          autoConnect: false,
          reconnection: true,
          reconnectionAttempts: 10,
          reconnectionDelay: 1000,
          timeout: 20000,
          forceNew: true
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

        // Connect the socket after all event handlers are set up
        socket.connect();
      } else {
        // If socket exists and is connected, manually join the room
        if (socket.connected) {
          socket.emit('join', {
            id: user.id,
            fullName: user.name,
            email: user.email,
            imageUrl: user.image,
            userName: user.name,
            userEmail: user.email,
            userImage: user.image
          });
        } else {
          // Try to connect if not connected
          socket.connect();
        }
      }

      // Update connection status based on current socket state
      setIsConnected(socket.connected);
      
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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  // Show loading state when waiting for user data
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4A64E]"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading chat...</p>
        </div>
      </div>
    )
  }

  // Show error if no user data was loaded
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-3 text-gray-800">Unable to load user data</h2>
          <p className="text-gray-600 mb-6">Please try refreshing the page or log in again.</p>
          <Button 
            onClick={() => router.push('/login')} 
            className="bg-[#D4A64E] hover:bg-[#c99a47] text-white font-medium"
          >
            Back to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-50">
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between bg-white p-3 border-b shadow-sm">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="text-gray-700"
        >
          {showSidebar ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
        <div className="flex items-center">
          <h1 className="text-lg font-bold text-gray-800">Trading University Chat</h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-[#D4A64E]">
              <AvatarImage src={user?.image} alt={user?.name || ''} />
              <AvatarFallback className="bg-[#D4A64E] text-white">
                {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
        </div>
      </div>
      
      {/* Sidebar - hidden on mobile unless toggled */}
      <div className={`${showSidebar ? 'fixed inset-0 z-20 bg-black bg-opacity-50' : 'hidden'} md:bg-transparent md:static md:block md:z-auto`}>
        <div className={`
          w-[280px] md:w-[320px] h-full bg-white border-r border-gray-200 flex flex-col
          ${showSidebar ? 'block' : 'hidden'} md:block
          transition-all duration-300 ease-in-out
          md:static fixed inset-y-0 left-0 z-30
        `}>
          {/* Sidebar header */}
          <div className="p-5 border-b border-gray-200 bg-gradient-to-r from-[#D4A64E]/10 to-white">
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2 text-[#D4A64E]" />
              Community Chat
            </h1>
            <div className="flex items-center mt-4 mb-2">
              <Avatar className="h-12 w-12 border-2 border-[#D4A64E]">
                <AvatarImage src={user?.image} alt={user?.name || ''} />
                <AvatarFallback className="bg-[#D4A64E] text-white">
                  {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <div className="font-semibold text-gray-800">{user?.name || user?.email}</div>
                <div className="text-sm text-[#D4A64E] flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></div>
                  Online
                </div>
              </div>
            </div>
          </div>
          
          {/* Online users section */}
          <div className="p-5 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-500 uppercase flex items-center">
                <Users className="h-4 w-4 mr-1.5" />
                Online Users
                <span className="ml-2 bg-[#D4A64E] text-white text-xs rounded-full px-2 py-0.5">
                  {onlineUsers.length + 1}
                </span>
              </h2>
            </div>
            
            <div className="space-y-2.5">
              <div className="flex items-center p-2.5 rounded-lg bg-[#D4A64E]/10 border border-[#D4A64E]/20">
                <Avatar className="h-8 w-8 border-2 border-white">
                  <AvatarImage src={user?.image} alt={user?.name || ''} />
                  <AvatarFallback className="bg-[#D4A64E] text-white">
                    {user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2.5 flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{user?.name || user?.email}</div>
                  <div className="text-xs text-gray-500">You</div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              
              {onlineUsers.map(onlineUser => (
                <div key={onlineUser.id} className="flex items-center p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={onlineUser.image} />
                    <AvatarFallback className="bg-gray-200 text-gray-600">
                      {onlineUser.name?.[0]?.toUpperCase() || onlineUser.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-2.5 flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{onlineUser.name || onlineUser.email}</div>
                    <div className="text-xs text-gray-500 truncate">{onlineUser.email}</div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile close button */}
          <div className="p-4 border-t border-gray-200 md:hidden">
            <Button 
              onClick={toggleSidebar} 
              variant="outline" 
              className="w-full justify-center"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop header */}
        <div className="hidden md:flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-gray-800">Trading University Community</h2>
            <div className="ml-3 px-2.5 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
              {onlineUsers.length + 1} online
            </div>
          </div>
          <div>
            {isConnected ? (
              <div className="text-sm text-green-600 flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                Connected
              </div>
            ) : (
              <div className="text-sm text-red-600 flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></div>
                Disconnected
              </div>
            )}
          </div>
        </div>
        
        {/* Error notification */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 m-4 rounded-md shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <X className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Messages */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto bg-[#f8f9fc] flex flex-col space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageSquare className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-600">No messages yet</p>
              <p className="text-sm text-gray-500 mt-1">Be the first to start the conversation!</p>
            </div>
          ) : (
            groupMessagesByDate(messages).map(({ date, messages }) => (
              <div key={date.toISOString()} className="space-y-4">
                <div className="flex justify-center my-6">
                  <div className="bg-white text-gray-600 text-xs px-3 py-1.5 rounded-full shadow-sm border border-gray-100 font-medium">
                    {formatMessageDate(date)}
                  </div>
                </div>
                
                {messages.map((msg) => {
                  const isCurrentUser = msg.user.email === user.email;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isCurrentUser && (
                        <div className="mr-2 flex-shrink-0 self-end mb-1">
                          <Avatar className="h-9 w-9 border border-gray-200">
                            <AvatarImage src={msg.user.image} />
                            <AvatarFallback className="bg-gray-200 text-gray-600">
                              {msg.user.name?.[0]?.toUpperCase() || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                      
                      <div className={`max-w-[75%] md:max-w-[60%] flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        {!isCurrentUser && (
                          <span className="text-xs text-gray-500 ml-1 mb-1">{msg.user.name || msg.user.email}</span>
                        )}
                        <div 
                          className={`px-4 py-2.5 rounded-2xl ${
                            isCurrentUser 
                              ? 'bg-[#D4A64E] text-white rounded-tr-none shadow-sm' 
                              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'
                          }`}
                        >
                          <div className="text-sm whitespace-pre-wrap break-words">{msg.content}</div>
                        </div>
                        <div className={`text-xs mt-1 text-gray-500 ${isCurrentUser ? 'mr-1' : 'ml-1'}`}>
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
        <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center">
            <div className="relative flex-1">
              <Input 
                placeholder={isConnected ? "Type a message..." : "Connecting..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                disabled={!isConnected}
                className="pr-10 py-6 px-4 rounded-full border-gray-200 focus:border-[#D4A64E] focus:ring focus:ring-[#D4A64E]/25 transition-all bg-gray-50 hover:bg-white"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-[#D4A64E] transition-colors"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                disabled={!isConnected}
              >
                <Smile className="h-5 w-5" />
              </Button>
              {showEmojiPicker && (
                <div className="absolute bottom-14 right-0 z-40 shadow-xl rounded-lg border border-gray-200">
                  <EmojiPickerDynamic onEmojiClick={handleEmojiSelect} />
                </div>
              )}
            </div>
            <Button
              className="ml-2 bg-[#D4A64E] hover:bg-[#c99a47] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md"
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

