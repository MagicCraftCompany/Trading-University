'use client'

import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import { Send, Users, Smile } from 'lucide-react'
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
const EmojiPickerDynamic = dynamic(() => Promise.resolve({ default: ({ onEmojiClick }: any) => <div>Emoji Picker</div> }), {
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

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('user');
    
    if (!token) {
      router.push('/login');
      return;
    }
    
    if (userInfo) {
      try {
        const userData = JSON.parse(userInfo);
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          image: userData.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || userData.email)}`
        });
      } catch (e) {
        console.error('Error parsing user data:', e);
        router.push('/login');
        return;
      }
    }
    
    setIsLoaded(true);
  }, [router]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
      return
    }

    // Initialize socket only if user is present
    if (user) {
      try {
        // Use existing socket or create a new one
        if (!socket) {
          socket = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
            path: '/socket.io/',
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
          });
        }
        
        socketRef.current = socket;

        // Only set up listeners if they haven't been set up
        if (!socket._listeners) {
          socket._listeners = true;

          socket.on('connect', () => {
            console.log('Connected to Socket.IO server')
            setIsConnected(true)
            setError(null)
            
            // Join the chat with user data
            socket.emit('join', {
              id: user.id,
              fullName: user.name,
              email: user.email,
              imageUrl: user.image
            })
          })

          socket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error)
            setIsConnected(false)
            setError('Connection error. Please try again.')
          })

          socket.on('disconnect', () => {
            console.log('Disconnected from Socket.IO server')
            setIsConnected(false)
            setError('Disconnected from chat. Attempting to reconnect...')
          })
          
          socket.on('previous-messages', (previousMessages: Message[]) => {
            console.log('Received previous messages:', previousMessages)
            if (Array.isArray(previousMessages)) {
              setMessages(previousMessages)
            }
          })

          socket.on('message', (message: Message) => {
            console.log('Received new message:', message)
            setMessages((prevMessages) => [...prevMessages, message])
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
    }

    // Cleanup function - don't disconnect on component unmount
    return () => {
      // Only remove component-specific listeners
      if (socketRef.current) {
        // We don't disconnect the socket when navigating away
        socketRef.current = null
      }
    }
  }, [user, isLoaded, router])

  const sendMessage = () => {
    if (input.trim() && user && isConnected && socket) {
      try {
        const messageData = {
          text: input.trim(),
          userId: user.id,
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

  const handleEmojiSelect = (emojiObject: any) => {
    setInput((prev) => prev + emojiObject.emoji)
    setShowEmojiPicker(false)
  }

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const Sidebar = () => (
    <div className="p-4 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4">Community Chat</h2>
      <div className="flex items-center space-x-2 mb-4">
        <Avatar>
          <AvatarImage src={user?.image} alt={user?.name || ''} />
          <AvatarFallback>{user?.name?.[0]?.toUpperCase() || user?.email[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user?.name || user?.email}</p>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Online' : 'Connecting...'}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <div className="mb-2">
          <h3 className="font-medium text-sm text-gray-500 mb-2">ONLINE USERS ({onlineUsers.length + 1})</h3>
          <div className="space-y-2">
            {/* Current user */}
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <p className="text-sm">{user?.name || user?.email} (You)</p>
            </div>
            
            {/* Other online users */}
            {onlineUsers.map(onlineUser => (
              <div key={onlineUser.id} className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="text-sm">{onlineUser.name || onlineUser.email}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex flex-col h-[90vh] bg-gray-100">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <div className="hidden md:block w-1/4 bg-white border-r border-gray-200">
          <Sidebar />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-4">
                No messages yet. Start the conversation!
              </div>
            ) : (
              groupMessagesByDate(messages).map(({ date, messages }) => (
                <div key={date.toISOString()} className="space-y-4">
                  <div className="flex justify-center">
                    <div className="bg-gray-200 text-gray-600 text-xs px-4 py-1 rounded-full">
                      {formatMessageDate(date)}
                    </div>
                  </div>
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.user.email === user.email ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] px-3 py-2 rounded-lg ${
                          msg.user.email === user.email
                            ? 'bg-[#D4A64E] text-black'
                            : 'bg-white text-black'
                        }`}
                      >
                        {msg.user.email !== user.email && (
                          <div className="flex items-center space-x-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={msg.user.image} alt={msg.user.name || ''} />
                              <AvatarFallback>{msg.user.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <p className="text-xs font-semibold">{msg.user.name}</p>
                          </div>
                        )}
                        <p className="mb-1 break-words">{msg.content}</p>
                        <p className="text-xs text-gray-500 text-right">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="bg-gray-100 p-4">
            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isConnected ? "Type a message" : "Connecting..."}
                  className="pr-10"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={!isConnected}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Button 
                onClick={sendMessage} 
                size="icon" 
                className="rounded-full bg-primary text-primary-foreground"
                disabled={!isConnected || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-16 right-4 z-50 bg-white rounded-lg shadow-lg">
                <EmojiPickerDynamic onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom

