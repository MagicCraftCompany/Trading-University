import React, { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";

export interface ILayout {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
  const { isNavOpen, showPaymentModal } = useAppSelector((state: RootState) => state.data);
  
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow pt-20">
        {children}    
      </main>
      
 
    </div>
  );
};

export default Layout;
