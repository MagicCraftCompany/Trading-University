import React, { FunctionComponent, ReactNode, useState, useEffect } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import dynamic from 'next/dynamic';

// Dynamically import the chat component to avoid SSR issues with socket.io
const GlobalChat = dynamic(() => import('../Chat/GlobalChat'), { ssr: false });

export interface ILayout {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
  // Track chat open state and device type
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  
  // Check if we're on mobile
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
  
  // Listen for custom events from GlobalChat component
  useEffect(() => {
    const handleChatToggle = (e: CustomEvent) => {
      setIsChatOpen(e.detail.isOpen);
    };
    
    // Add event listener for custom chat toggle event
    window.addEventListener('chatToggle' as any, handleChatToggle as EventListener);
    
    return () => {
      window.removeEventListener('chatToggle' as any, handleChatToggle as EventListener);
    };
  }, []);
  
  // Calculate right padding for content when chat is open on desktop
  const contentStyle = (!isMobile && isChatOpen) 
    ? { paddingRight: '350px', transition: 'all 0.3s ease-in-out' } 
    : { paddingRight: '0', transition: 'all 0.3s ease-in-out' };
  
  return (
    <div className={`flex flex-col min-h-screen bg-[#061213] transition-all duration-300 ease-in-out ${!isMobile && isChatOpen ? 'chat-open' : ''}`}>
      <Header style={contentStyle} />
      
      <main className="flex-grow pt-20" style={contentStyle}>
        {children}    
      </main>
      
      <Footer style={contentStyle} />
      
      {/* Global Chat Component */}
      <GlobalChat onToggle={(isOpen) => {
        // Dispatch custom event for the Layout to detect
        const event = new CustomEvent('chatToggle', { detail: { isOpen } });
        window.dispatchEvent(event);
      }} />
    </div>
  );
};

export default Layout;
