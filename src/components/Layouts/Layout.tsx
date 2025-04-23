import React, { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import dynamic from 'next/dynamic';

// Dynamically import the chat component to avoid SSR issues with socket.io
const GlobalChat = dynamic(() => import('../Chat/GlobalChat'), { ssr: false });

export interface ILayout {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
  // const { isNavOpen, showPaymentModal } = useAppSelector((state: RootState) => state.data);
  
  return (
    <div className="flex flex-col min-h-screen bg-[#061213]">
      <Header />
      
      <main className="flex-grow pt-20">
        {children}    
      </main>
      
      <Footer />
      
      {/* Global Chat Component */}
      <GlobalChat />
    </div>
  );
};

export default Layout;
