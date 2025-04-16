import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { BsChevronDown } from 'react-icons/bs';
import { getCookie } from '@/utils/cookies';
import logo from '../../../public/images/logo.png';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle authentication changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token') || getCookie('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (e) {
          console.error('Error parsing user data', e);
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    };

    // Check initially
    checkAuth();

    // Add listener for auth changes
    window.addEventListener('authChange', checkAuth);
    
    // Clean up
    return () => {
      window.removeEventListener('authChange', checkAuth);
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

  // Scroll to section function
  const scrollToSection = (id: string) => {
    setIsMenuOpen(false);
    if (router.pathname !== '/') {
      router.push(`/#${id}`);
      return;
    }
    
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.pathname]);

  return (
    <header className="w-full fixed top-0 z-50 transition-all duration-300 bg-[#061213] shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="transition-colors">
          <Image src={logo} alt="Trading University" width={60} height={60} />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-5">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-white hover:text-[#CB9006] transition-colors font-medium"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection('success')} 
            className="text-white hover:text-[#CB9006] transition-colors font-medium"
          >
            Success Stories
          </button>
          <button 
            onClick={() => scrollToSection('pricing')} 
            className="text-white hover:text-[#CB9006] transition-colors font-medium"
          >
            Pricing
          </button>
          <button 
            onClick={() => scrollToSection('faq')} 
            className="text-white hover:text-[#CB9006] transition-colors font-medium"
          >
            FAQ
          </button>
          {isAuthenticated && (
            <Link 
              href="/courses" 
              className="text-white hover:text-[#CB9006] transition-colors font-medium"
            >
              Courses
            </Link>
          )}
        </nav>

        {/* Right Section - Auth */}
        <div className="flex items-center space-x-4">
          {/* Authentication Section */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 text-white"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt={user.name || 'User'} 
                      width={32} 
                      height={32} 
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <FaUser className="text-[#CB9006]" />
                  )}
                </div>
                <span className="hidden md:block font-medium">Hello, {user?.name?.split(' ')[0] || 'User'}</span>
                <BsChevronDown size={12} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0A1114] rounded-md shadow-lg py-1 z-10 border border-[#1A1D24]/30">
                  <div className="px-4 py-2 border-b border-[#1A1D24]/30">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-[#CB9006] hover:bg-[#0F1A1B]"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/login" className="text-white hover:text-[#CB9006]">
                Sign In
              </Link>
              <Link href="/custom-checkout" className="bg-[#CB9006] hover:bg-[#B07D05] text-white px-4 py-2 rounded-md transition-colors">
                Enroll
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-[#CB9006]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0A1114] shadow-lg">
          <div className="px-4 py-3 space-y-3">
            <button 
              onClick={() => scrollToSection('features')}
              className="block w-full text-left py-2 text-base font-medium text-white hover:text-[#CB9006]"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('success')}
              className="block w-full text-left py-2 text-base font-medium text-white hover:text-[#CB9006]"
            >
              Success Stories
            </button>
            <button 
              onClick={() => scrollToSection('pricing')}
              className="block w-full text-left py-2 text-base font-medium text-white hover:text-[#CB9006]"
            >
              Pricing
            </button>
            <button 
              onClick={() => scrollToSection('faq')}
              className="block w-full text-left py-2 text-base font-medium text-white hover:text-[#CB9006]"
            >
              FAQ
            </button>
            {isAuthenticated && (
              <Link 
                href="/courses" 
                className="block py-2 text-base font-medium text-white hover:text-[#CB9006]"
              >
                Courses
              </Link>
            )}
            
            {!isAuthenticated && (
              <div className="pt-3 border-t border-[#1A1D24]/30">
                <Link href="/login" className="block py-2 text-base font-medium text-white">
                  Sign In
                </Link>
                <Link href="/custom-checkout" className="block py-2 mt-2 w-full text-center bg-[#CB9006] hover:bg-[#B07D05] text-white px-4 rounded-md transition-colors">
                  Enroll
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
