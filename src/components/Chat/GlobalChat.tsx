import React, { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/hooks/useSocket';
import { FiSend } from 'react-icons/fi';
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

const GlobalChat = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [chatId, setChatId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentUser, setCurrentUser] = useState<CustomUser | null>(null);
  const { messages, loading, sendMessage } = useSocket(chatId || undefined);
  
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
  }, [messages, isOpen]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !chatId || !currentUser) return;
    
    sendMessage(inputMessage.trim());
    setInputMessage('');
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
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
        <div className="absolute bottom-16 right-0 w-[350px] sm:w-[400px] h-[550px] bg-[#061213] rounded-xl shadow-2xl overflow-hidden flex flex-col border-2 border-[#F7CF2D]">
          {/* Header */}
          <div className="bg-[#F7CF2D] text-black px-5 py-4 flex justify-between items-center">
            <h3 className="font-bold text-lg">Community Chat</h3>
            <button 
              onClick={toggleChat}
              className="text-black hover:text-gray-700 transition-colors"
              aria-label="Close chat"
            >
              <RiCloseLine size={24} />
            </button>
          </div>
          
          {/* Messages or Login Prompt */}
          <div className="flex-1 p-4 overflow-y-auto bg-[#0a1617] scrollbar-thin scrollbar-thumb-[#15292a] scrollbar-track-[#061213]">
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
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-6 bg-[#0d1e1f] rounded-xl">
                  <span className="text-gray-300 block mb-2 text-lg">No messages yet.</span>
                  <span className="text-[#F7CF2D]">Be the first to start the conversation!</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-1">
                {messages.map((msg: Message) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`
                        max-w-[85%] rounded-2xl px-4 py-3 shadow-md
                        ${msg.sender.id === currentUser.id 
                          ? 'bg-[#F7CF2D] text-black rounded-br-none' 
                          : 'bg-[#15292a] text-gray-200 rounded-bl-none'}
                      `}
                    >
                      {msg.sender.id !== currentUser.id && (
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
                      <div className={`text-xs mt-1 text-right ${msg.sender.id === currentUser.id ? 'text-[#0a1617]' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} className="h-4" />
              </div>
            )}
          </div>
          
          {/* Enhanced Input Area */}
          {isAuthenticated && (
            <form onSubmit={handleSendMessage} className="p-4 border-t-2 border-[#15292a] bg-[#0d1e1f]">
              <div className="flex items-center relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="w-full px-4 py-3 bg-[#061213] text-white border-2 border-[#15292a] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F7CF2D] focus:border-transparent transition-all pr-14"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="absolute right-0 top-0 h-full px-4 bg-[#F7CF2D] hover:bg-[#e6c029] text-black rounded-r-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  <FiSend size={20} />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalChat; 