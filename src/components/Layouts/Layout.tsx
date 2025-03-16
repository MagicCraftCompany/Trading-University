import React, { FunctionComponent, ReactNode } from "react";
import Header from "../Header/Header";
import Info from "../Info/Info";
import Footer from "../Footer/Footer";
import { LayoutStyles } from "@/styles/LayoutStyles/Layout";
import { useAppSelector } from "@/redux/hook";
import { RootState } from "@/redux/store";
import { Payment } from "@/components/Payments/Payments";

export interface ILayout {
  children: ReactNode;
}

const Layout: FunctionComponent<ILayout> = ({ children }) => {
    const { isNavOpen, showPaymentModal } = useAppSelector((state:RootState) => state.data);
  return (
    <LayoutStyles $isNavOpen={isNavOpen}>
      <Header />
      {/* <Info /> */}
      <main>
        {children}    
      </main>
      <Footer />
      {showPaymentModal && <Payment isFreeTrial={false} />}
    </LayoutStyles>
  );
};

export default Layout;
