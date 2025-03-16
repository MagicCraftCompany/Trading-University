import { HeaderStyle } from "@/styles/HeaderStyles/Header";
import { MobileNavStyles } from "@/styles/HeaderStyles/MobileNav";

import Link from "next/link";
import { Logo, Menu, } from "../Icons/Icons";
import Search from "./Search";
import React, { FunctionComponent, useEffect } from "react";
import { PageLinkStyle } from "@/styles/LinkStyles/Link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeNav, toggleNav } from "@/redux/dataSlice";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";
import { UserButton, useUser } from "@clerk/nextjs";

// What is left to do here is
// 1. Complete the hover/clicked states of the wishlist and notifications
const Header: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { isNavOpen } = useAppSelector((state: RootState) => state.data);
  const router = useRouter();
  const { isSignedIn, isLoaded } = useUser();

  const toggleMenu = () => {
    dispatch(toggleNav());
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      dispatch(closeNav());
    };
    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <HeaderStyle>
      <div className="logo">
        <Link href={"/"}>
        <Logo />
        </Link>
      </div>
      <div className="desktop desktop-nav-links">
        <Link href={"/courses"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={router.pathname === "/courses"}
          >
            Courses
          </PageLinkStyle>
        </Link>
        {isSignedIn && (
          <Link href={"/chatroom"}>
            <PageLinkStyle
              color="var(--grey-500, #525252)"
              $ispageactive={router.pathname === "/chatroom"}
            >
              Chat
            </PageLinkStyle>
          </Link>
        )}
        <Link href={"/about"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={router.pathname === "/about"}
          >
            About Us
          </PageLinkStyle>
        </Link>
        <Link href={"/contact"}>
          <PageLinkStyle
            color="var(--grey-500, #525252)"
            $ispageactive={router.pathname === "/contact"}
          >
            Contact Us
          </PageLinkStyle>
        </Link>
      </div>
      <div className="desktop">
        <Search />
      </div>
      <div className="desktop icons-group">
        {isLoaded && (
          isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <button 
              onClick={handleSubscribe} 
              className="bg-[#e39c44] text-white px-6 py-3 rounded-md hover:bg-[#d38933] transition-colors font-semibold"
            >
              Subscribe Now
            </button>
          )
        )}
      </div>

      <div className="mobile mobile-nav-links">
        <Search />
        <Menu toggleMenu={toggleMenu} isNavOpen={isNavOpen} />
      </div>

      {isNavOpen && (
        <MobileNavStyles>
          <div className="sidemenu">
            <div className="sidemenu-links">
              <Link href={"/courses"}>Courses</Link>
              {isSignedIn && <Link href={"/chatroom"}>Chat</Link>}
              <Link href={"/about"}>About Us</Link>
              <Link href={"/contact"}>Contact Us</Link>
              {isLoaded && !isSignedIn && (
                <button 
                  onClick={handleSubscribe}
                  className="bg-[#e39c44] text-white px-6 py-3 rounded-md hover:bg-[#d38933] transition-colors font-semibold w-full mt-4"
                >
                  Subscribe Now
                </button>
              )}
            </div>
          </div>
        </MobileNavStyles>
      )}
    </HeaderStyle>
  );
};

export default Header;
