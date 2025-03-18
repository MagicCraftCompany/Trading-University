import { HeaderStyle } from "@/styles/HeaderStyles/Header";
import { MobileNavStyles } from "@/styles/HeaderStyles/MobileNav";

import Link from "next/link";
import { Logo, Menu } from "../Icons/Icons";
import Search from "./Search";
import React, { FunctionComponent, useEffect, useState, useRef } from "react";
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
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    // Close user menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    setShowUserMenu(false);
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

  // Function to get user's initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(name => name[0]).join('').toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || '?';
  };

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
          <div className="relative" ref={userMenuRef}>
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
            >
              <div className="w-8 h-8 rounded-full bg-[#e39c44] flex items-center justify-center text-white font-medium">
                {getUserInitials()}
              </div>
              <span className="text-gray-700 font-medium max-w-[120px] truncate">
                {user?.name || user?.email}
              </span>
              <svg className={`w-4 h-4 text-gray-500 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
               
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
                Login
              </button>
            </Link>
            <button
              onClick={handleSubscribe}
              className="bg-[#e39c44] text-white px-6 py-2 rounded-md hover:bg-[#d38933] transition-colors font-semibold"
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
              <div className="user-profile border-t border-gray-200 mt-4 pt-4">
                <div className="flex items-center gap-3 px-4 py-2">
                  <div className="w-10 h-10 rounded-full bg-[#e39c44] flex items-center justify-center text-white font-medium">
                    {getUserInitials()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{user?.name || user?.email}</p>
                    {user?.name && <p className="text-xs text-gray-500">{user.email}</p>}
                  </div>
                </div>
                <div className="mt-2 border-t border-gray-200">
                  <Link href="/profile">
                    <span className="block px-4 py-2 hover:bg-gray-100">Profile Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
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
