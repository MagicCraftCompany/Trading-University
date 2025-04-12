import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { BsCart, BsChevronDown } from 'react-icons/bs';
import ThemeToggle from '../ThemeToggle'; 
import { getCookie } from '@/utils/cookies';
import Notifications from './Notifications';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Check if current page is checkout
  const isCheckoutPage = router.pathname === '/custom-checkout';

  // Handle authentication changes
  useEffect(() => {
    const checkAuth = () => {
      // Only check on explicit auth changes, not on initial load
      const token = localStorage.getItem('token') || getCookie('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
          
          // Check if user has an active subscription
          setIsSubscribed(userData.subscription?.status === 'ACTIVE');
        } catch (e) {
          console.error('Error parsing user data', e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
        setIsSubscribed(false);
      }
    };

    // Don't check initially, only on explicit auth changes
    // Removed: checkAuth();

    // Add listener for auth changes
    window.addEventListener('authChange', checkAuth);
    
    // Check auth when component mounts
    checkAuth();
    
    // Clean up
    return () => {
      window.removeEventListener('authChange', checkAuth);
    };
  }, []);

  // Load cart and wishlist counts
  useEffect(() => {
    if (isAuthenticated) {
      // Get cart count - this could be from localStorage, context, or an API call
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartCount(cartItems.length);
      
      // Get wishlist count
      const wishlistItems = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistCount(wishlistItems.length);
    }
  }, [isAuthenticated]);

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Clear token and user data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Update auth state
    setIsAuthenticated(false);
    setUser(null);
    
    // Close menus
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
    
    // Notify components about authentication change
    window.dispatchEvent(new Event('authChange'));
    
    // Redirect to home
    router.push('/');
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  return (
    <header className={`w-full fixed top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white dark:bg-gray-900 shadow-md' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        {/* <Link href="/" className="flex items-center">
          <div className="relative h-10 w-40">
            <Image
              src="/logo.png"
              alt="Trading University"
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link> */}

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className={`text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${router.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
            Home
          </Link>
          {/* <Link href="/courses" className={`text-base font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${router.pathname === '/courses' || router.pathname.startsWith('/courses/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
            Courses
          </Link> */}
        </nav>

        {/* Right Section - Auth, Cart, Theme Toggle */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <ThemeToggle />

     
         

          {/* Notifications Component */}
          {/* {isAuthenticated && <Notifications />} */}

          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaUser className="text-blue-600 dark:text-blue-400" />
                  )}
                </div>
                <span className="hidden md:block font-medium">Hello, {user?.name?.split(' ')[0] || 'User'}</span>
                <BsChevronDown size={12} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                 
                 
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400">
                Sign In
              </Link>
              {!isCheckoutPage && !isSubscribed && (
                <Link href="/custom-checkout" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors">
                  Enroll
                </Link>
              )}
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="px-4 py-5 space-y-4">
            <Link href="/" className={`block py-2 text-base font-medium ${router.pathname === '/' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
              Home
            </Link>
            <Link href="/courses" className={`block py-2 text-base font-medium ${router.pathname === '/courses' || router.pathname.startsWith('/courses/') ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'}`}>
              Courses
            </Link>
            
            {!isAuthenticated && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link href="/login" className="block py-2 text-base font-medium text-gray-700 dark:text-gray-200">
                  Sign In
                </Link>
                {!isCheckoutPage && !isSubscribed && (
                  <Link href="/custom-checkout" className="block py-2 mt-2 w-full text-center bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md transition-colors">
                    Enroll
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
