import React, { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";


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
      
 
    </div>
  );
};

export default Layout;
