import { HeaderStyle } from "@/styles/HeaderStyles/Header";
import { MobileNavStyles } from "@/styles/HeaderStyles/MobileNav";

import Link from "next/link";
import { Logo, Menu } from "../Icons/Icons";
import Search from "./Search";
import React, { FunctionComponent, useEffect, useState } from "react";
import { PageLinkStyle } from "@/styles/LinkStyles/Link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { closeNav, toggleNav } from "@/redux/dataSlice";
import { useRouter } from "next/router";
import { RootState } from "@/redux/store";

// What is left to do here is
// 1. Complete the hover/clicked states of the wishlist and notifications
const Header: FunctionComponent = () => {
  const dispatch = useAppDispatch();
  const { isNavOpen } = useAppSelector((state: RootState) => state.data);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

  useEffect(() => {
    // Check for JWT token in localStorage
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Get user info from localStorage if available
      const userInfo = localStorage.getItem('user');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      }
    }
  }, []);

  const toggleMenu = () => {
    dispatch(toggleNav());
  };

  const handleSubscribe = async () => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Failed to create checkout session:", error);
    }
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
    
    setIsAuthenticated(false);
    setUser(null);
    router.push('/login');
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
   
          <Link href={"/chatroom"}>
            <PageLinkStyle
              color="var(--grey-500, #525252)"
              $ispageactive={router.pathname === "/chatroom"}
            >
              Chat
            </PageLinkStyle>
          </Link>
     
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
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800"
            >
              Logout
            </button>
            <span className="text-gray-700 font-medium">
              {user?.name || user?.email}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-gray-600 hover:text-gray-800 px-4 py-2">
                Login
              </button>
            </Link>
            <button
              onClick={handleSubscribe}
              className="bg-[#e39c44] text-white px-6 py-3 rounded-md hover:bg-[#d38933] transition-colors font-semibold"
            >
              Subscribe Now
            </button>
          </div>
        )}
      </div>

      <div className="mobile mobile-nav-links">
        {!isAuthenticated && (
          <button
            onClick={handleSubscribe}
            className="bg-[#e39c44] text-white px-4 py-2 rounded-md hover:bg-[#d38933] transition-colors font-semibold w-full mt-1"
          >
            Subscribe Now
          </button>
        )}
        <Menu toggleMenu={toggleMenu} isNavOpen={isNavOpen} />
      </div>

      {isNavOpen && (
        <MobileNavStyles>
          <div className="overlay" onClick={() => dispatch(closeNav())}></div>
          <div className="sidemenu">
            <div className="sidemenu-links">
              <Link href={"/courses"}>Courses</Link>
              {isAuthenticated && <Link href={"/chatroom"}>Chat</Link>}
              <Link href={"/about"}>About Us</Link>
              <Link href={"/contact"}>Contact Us</Link>
              {!isAuthenticated && <Link href={"/login"}>Login</Link>}
            </div>
            {isAuthenticated && (
              <div className="user-profile">
                <div className="flex items-center gap-3 justify-between w-full px-4">
                  <span className="text-gray-700 font-medium">
                    {user?.name || user?.email}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </MobileNavStyles>
      )}
    </HeaderStyle>
  );
};

export default Header;
