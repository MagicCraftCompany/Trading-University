import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { FiSend, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { BiMessageDetail } from 'react-icons/bi';
import { RiCloseLine } from 'react-icons/ri';
import { useRouter } from 'next/router';

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

type CustomUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

interface GlobalChatProps {
  onToggle?: (isOpen: boolean) => void;
}

const GlobalChat: React.FC<GlobalChatProps> = ({ onToggle }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chatId, setChatId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingMessages, setPendingMessages] = useState<{id: string, content: string}[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const { messages, loading, sendMessage, isConnected } = useSocket(chatId || undefined);
  const [isMobile, setIsMobile] = useState(true);
  
  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  // Check for authentication from both NextAuth and localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Try to get user from NextAuth session
      if (session?.user?.id) {
        setCurrentUser({
          id: session.user.id,
          name: session.user.name || 'User',
          email: session.user.email,
          image: session.user.image
        });
        return;
      }
      
      // Fallback to localStorage token (your custom auth)
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (storedUser && token) {
          const user = JSON.parse(storedUser);
          if (user.id) {
            const userName = user.name || (user.email ? user.email.split('@')[0] : 'User');
            setCurrentUser({
              id: user.id,
              name: userName,
              email: user.email || null,
              image: user.image || null
            });
          }
        }
      } catch (error) {
        console.error('Error reading user from localStorage:', error);
      }
    }
  }, [session]);
  
  // Fetch chat ID on mount
  useEffect(() => {
    const fetchChatId = async () => {
      try {
        // Include token from localStorage for custom auth
        const token = localStorage.getItem('token');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch('/api/chat/global', { headers });
        if (response.ok) {
          const data = await response.json();
          setChatId(data.chatId);
        }
      } catch (error) {
        console.error('Error fetching chat ID:', error);
      }
    };
    
    if (currentUser?.id) {
      fetchChatId();
    }
  }, [currentUser]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, pendingMessages]);
  
  // Focus the input when chat opens and maintain focus
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  // Clear error message after 5 seconds
  useEffect(() => {
    if (sendError) {
      const timer = setTimeout(() => {
        setSendError(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [sendError]);
  
  // Retry sending pending messages when connection is restored
  useEffect(() => {
    const retryPendingMessages = async () => {
      if (isConnected && pendingMessages.length > 0 && !isSending) {
        // Create a copy of pending messages and clear the original
        const messagesToSend = [...pendingMessages];
        setPendingMessages([]);
        
        // Try to send each message
        for (const msg of messagesToSend) {
          try {
            setIsSending(true);
            const success = sendMessage(msg.content);
            if (!success) {
              // If sending fails, re-add to pending
              setPendingMessages(prev => [...prev, msg]);
            }
            await new Promise(resolve => setTimeout(resolve, 200)); // Small delay between sends
          } catch (error) {
            console.error('Error retrying message:', error);
          } finally {
            setIsSending(false);
          }
        }
      }
    };
    
    if (isConnected) {
      retryPendingMessages();
    }
  }, [isConnected, pendingMessages, sendMessage, isSending]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatId || !currentUser || isSending) return;
    
    setIsSending(true);
    setSendError(null);
    
    try {
      const messageText = inputMessage.trim();
      setInputMessage('');
      
      // Generate a temporary ID for the pending message
      const tempId = `temp-${Date.now()}`;
      
      if (!isConnected) {
        // Add to pending messages if disconnected
        setPendingMessages(prev => [...prev, { id: tempId, content: messageText }]);
        setIsSending(false);
        
        // Refocus the input after sending
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return;
      }
      
      const success = sendMessage(messageText);
      
      if (!success) {
        // If sending fails, add to pending messages
        setPendingMessages(prev => [...prev, { id: tempId, content: messageText }]);
      }
      
      // Simulate a short delay for UX
      setTimeout(() => {
        setIsSending(false);
        // Refocus the input after sending
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    } catch (error) {
      console.error('Error sending message:', error);
      setSendError('Failed to send message. Please try again.');
      setIsSending(false);
      
      // Refocus the input after error
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If the enter key is pressed and the input is not empty, send the message
    if (e.key === 'Enter' && inputMessage.trim() && !isSending) {
      e.preventDefault();
      handleSendMessage(e as unknown as React.FormEvent);
    }
  };
  
  const toggleChat = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    
    // Notify parent component of chat state change
    if (onToggle) {
      onToggle(newIsOpen);
    }
    
    // Focus the input when opening chat
    if (newIsOpen && inputRef.current) {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 300);
    }
  };
  
  const handleLogin = () => {
    router.push('/login');
  };
  
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Determine if user is authenticated
  const isAuthenticated = !!currentUser?.id;

  // Connection status indicator
  const connectionStatus = () => {
    return (
      <div 
        className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} 
        title={isConnected ? 'Connected' : 'Disconnected'}
      />
    );
  };

  // Calculate total message count including pending messages
  const totalMessageCount = messages.length + pendingMessages.length;
  
  // Chat content component (reused in both mobile and desktop)
  const ChatContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-[#F7CF2D] text-black px-5 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold text-lg">Community Chat</h3>
          {connectionStatus()}
        </div>
        <button 
          onClick={toggleChat}
          className="text-black hover:text-gray-700 transition-colors"
          aria-label="Close chat"
        >
          {isMobile ? <RiCloseLine size={24} /> : <FiChevronRight size={24} />}
        </button>
      </div>
      
      {/* Messages or Login Prompt */}
      <div className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-[#F7CF2D]/30 scrollbar-track-[#15292a] bg-[#0a1213]">
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-gray-300 text-center mb-6 text-lg">You need to be logged in to use the chat</span>
            <button 
              onClick={handleLogin}
              className="bg-[#F7CF2D] hover:bg-[#e6c029] text-black px-8 py-3 rounded-lg transition-all duration-300 font-semibold"
            >
              Log In
            </button>
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#F7CF2D]/20 mb-4"></div>
              <span className="text-gray-400">Loading messages...</span>
            </div>
          </div>
        ) : totalMessageCount === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-[#0d1e1f] rounded-xl">
              <span className="text-gray-300 block mb-2 text-lg">No messages yet.</span>
              <span className="text-[#F7CF2D]">Be the first to start the conversation!</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {/* Regular messages */}
            {messages.map((msg: Message) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender.id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] rounded-2xl px-4 py-3 shadow-md
                    ${msg.sender.id === currentUser?.id 
                      ? 'bg-[#F7CF2D] text-black rounded-br-none' 
                      : 'bg-[#15292a] text-gray-200 rounded-bl-none'}
                  `}
                >
                  {msg.sender.id !== currentUser?.id && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#F7CF2D]/40 shadow-sm">
                        {msg.sender.image ? (
                          <img src={msg.sender.image} alt={msg.sender.name || 'User'} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#F7CF2D] text-black text-sm font-bold">
                            {msg.sender.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-[#F7CF2D]">
                        {msg.sender.name || 'Anonymous'}
                      </span>
                    </div>
                  )}
                  <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                  <div className={`text-xs mt-1 text-right ${msg.sender.id === currentUser?.id ? 'text-[#0a1617]' : 'text-gray-400'}`}>
                    {formatTime(msg.createdAt)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Pending messages */}
            {pendingMessages.map((msg) => (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl px-4 py-3 shadow-md bg-[#F7CF2D]/60 text-black rounded-br-none">
                  <p className="text-sm break-words leading-relaxed">{msg.content}</p>
                  <div className="text-xs mt-1 text-right text-[#0a1617]/70 flex items-center justify-end space-x-1">
                    <span>Sending</span>
                    <div className="w-3 h-3 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Display error message if any */}
            {sendError && (
              <div className="bg-red-900/30 text-red-400 p-3 rounded-lg text-center text-sm">
                {sendError}
              </div>
            )}
            
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} className="h-1" />
          </div>
        )}
      </div>
      
      {/* Message Input */}
      {isAuthenticated && (
        <div className="border-t-2 border-[#15292a] bg-[#061213]">
          {!isConnected && (
            <div className="bg-red-900/30 py-1 px-3 text-xs text-red-400 text-center">
              Connection lost. Messages will be sent when reconnected.
            </div>
          )}
          
          <form onSubmit={handleSendMessage} className="p-4">
            <div className="flex items-center relative">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isConnected ? "Type a message..." : "Type a message (will send when reconnected)..."}
                disabled={isSending}
                autoComplete="off"
                autoFocus={isOpen}
                className="w-full px-4 py-3 bg-[#0a1213] text-white border-2 border-[#15292a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7CF2D] focus:border-transparent transition-all pr-14 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isSending}
                className="absolute right-0 top-0 h-full px-4 bg-[#F7CF2D] hover:bg-[#e6c029] text-black rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
              >
                {isSending ? (
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <FiSend size={20} />
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
  
  // Mobile view
  if (isMobile) {
    return (
      <div className="fixed bottom-6 right-6 z-50 font-sans">
        {/* Chat Button - Only shown when chat is closed */}
        {!isOpen && (
          <button
            onClick={toggleChat}
            className="bg-[#F7CF2D] hover:bg-[#e6c029] text-black rounded-full w-14 h-14 shadow-xl flex items-center justify-center transition-all duration-300 border-2 border-[#15292a]"
            aria-label="Open chat"
          >
            <BiMessageDetail size={28} />
          </button>
        )}
        
        {/* Chat Window */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[500px] bg-[#061213] rounded-xl shadow-2xl overflow-hidden flex flex-col border-2 border-[#F7CF2D]">
            <ChatContent />
          </div>
        )}
      </div>
    );
  }
  
  // Desktop view (Discord-like sidebar that covers full height)
  return (
    <div className="fixed top-0 right-0 bottom-0 z-50 font-sans pointer-events-none">
      {/* Chat toggle button for collapsed state */}
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="fixed top-1/2 -translate-y-1/2 right-0 bg-gradient-to-r from-[#F7CF2D] to-[#e6c029] border-l border-y border-[#061213] text-black flex items-center justify-center transition-all duration-300 hover:brightness-110 rounded-l-md z-50 pointer-events-auto shadow-md"
          aria-label="Open community chat"
        >
          <div className="py-3 px-2 flex items-center">
            <div className="relative mr-1">
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              <BiMessageDetail size={18} />
            </div>
            <span className="transform -rotate-90 origin-center text-[10px] font-semibold tracking-wider text-[#061213] ml-1 whitespace-nowrap">CHAT</span>
          </div>
        </button>
      ) : null}
      
      {/* Chat Panel - Full height */}
      <div
        className={`fixed top-0 right-0 bottom-0 bg-[#061213] border-l-2 border-[#F7CF2D] shadow-xl transition-all duration-300 ease-in-out pointer-events-auto ${
          isOpen ? 'w-[350px] opacity-100' : 'w-0 opacity-0 pointer-events-none'
        }`}
      >
        {isOpen && <ChatContent />}
      </div>
    </div>
  );
};

export default GlobalChat; 