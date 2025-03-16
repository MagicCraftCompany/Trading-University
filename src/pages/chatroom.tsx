'use client'

import React, { useState, useEffect, useRef, lazy, Suspense } from 'react'
import io from 'socket.io-client'
import { Send, Users, Smile } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import EmojiPicker from 'emoji-picker-react'

// Dynamically import EmojiPicker with no SSR
const EmojiPickerDynamic = dynamic(() => import('emoji-picker-react'), {
  ssr: false,
  loading: () => null
})

let socket: any;

interface Message {
  id: string
  content: string
  user: {
    name: string
    email: string
    image: string
  }
  createdAt: string
}

const initSocket = () => {
  const socketInstance = io(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000', {
    path: '/socket.io/',
    addTrailingSlash: false,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socketInstance.on('connect_error', (error: Error) => {
    console.error('Socket connection error:', error);
  });

  return socketInstance;
};

const ChatRoom: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
      return
    }

    if (!socket && user) {
      try {
        socket = initSocket()
        
        socket.on('connect', () => {
          console.log('Connected to Socket.IO server')
          setIsConnected(true)
          setError(null)
          
          // Join the chat with user data
          socket.emit('join', {
            id: user.id,
            fullName: user.fullName,
            email: user.emailAddresses[0].emailAddress,
            imageUrl: user.imageUrl
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
      } catch (error) {
        console.error('Error initializing socket:', error)
        setError('Failed to connect to chat. Please refresh the page.')
      }
    }

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }
  }, [user, isLoaded])

  const sendMessage = () => {
    if (input.trim() && user && isConnected) {
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
          <AvatarImage src={user.imageUrl} alt={user.fullName || ''} />
          <AvatarFallback>{user.fullName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{user.fullName}</p>
          <p className="text-sm text-gray-500">
            {isConnected ? 'Online' : 'Connecting...'}
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Button variant="outline" className="justify-start">
          <Users className="mr-2 h-4 w-4" />
          Online Users
        </Button>
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
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.user.email === user.emailAddresses[0].emailAddress ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg ${
                      msg.user.email === user.emailAddresses[0].emailAddress
                        ? 'bg-[#D4A64E] text-black'
                        : 'bg-white text-black'
                    }`}
                  >
                    {msg.user.email !== user.emailAddresses[0].emailAddress && (
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
                <EmojiPicker onEmojiClick={handleEmojiSelect} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatRoom

