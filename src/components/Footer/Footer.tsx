import React from "react";
import Link from "next/link";
import {
  FaDiscord,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTelegram,
} from "react-icons/fa6";
import logo from '../../../public/images/logo.png';
import Image from 'next/image';

const socialLinks = [
  {
    icon: FaDiscord,
    link: "https://bit.ly/JamesCryptoGuruDiscord",
    label: "Discord"
  },
  {
    icon: FaYoutube,
    link: "https://www.youtube.com/c/JamesCryptoGuru",
    label: "YouTube"
  },
  {
    icon: FaXTwitter,
    link: "https://twitter.com/jamyies",
    label: "Twitter"
  },
  {
    icon: FaInstagram,
    link: "https://instagram.com/jamescryptoguru",
    label: "Instagram"
  },
  {
    icon: FaTelegram,
    link: "https://t.me/Jamescryptogurualerts",
    label: "Telegram"
  },
];

// Function to scroll to section
const scrollToSection = (id: string) => {
  // Check if we're on the homepage
  if (window.location.pathname !== '/') {
    window.location.href = `/#${id}`;
    return;
  }
  
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
  
const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-b from-[#061213] to-black">
      {/* Gold accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
      
      {/* Main footer content */}
      <div className="container mx-auto px-4 py-4">
        {/* Top section - Swapped position of logo and social links */}
        <div className="flex flex-col md:flex-row justify-between items-center ">
          {/* Social Links - Now on the left */}
          <div className="flex space-x-6 mb-6 md:mb-0 order-2 md:order-1">
            {socialLinks.map((item, i) => (
              <Link 
                key={i} 
                href={item.link}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#0A1114] hover:bg-[#CB9006] text-gray-400 hover:text-white transition-all duration-300"
                aria-label={item.label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="text-lg">{<item.icon />}</span>
              </Link>
            ))}
          </div>
          
          {/* Logo - Now on the right */}
          <div className="mb-6 md:mb-0 order-1 md:order-2">
            <Image src={logo} alt="Trading University Logo" width={100} height={100} />
          </div>
        </div>
        
        {/* Middle section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-6 border-t border-[#1A1D24]/30 border-b">
          {/* About */}
          <div>
            <h3 className="text-[#CB9006] font-semibold mb-4 text-lg">About Us</h3>
            <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
              Trading University provides expert-led education to help you master the financial markets and build consistent trading success.
            </p>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="text-[#CB9006] font-semibold mb-4 text-lg">Quick Links</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-400 hover:text-white transition-all"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('success')}
                className="text-left text-gray-400 hover:text-white transition-all"
              >
                Success Stories
              </button>
              <button 
                onClick={() => scrollToSection('pricing')}
                className="text-left text-gray-400 hover:text-white transition-all"
              >
                Pricing
              </button>
              <button 
                onClick={() => scrollToSection('faq')}
                className="text-left text-gray-400 hover:text-white transition-all"
              >
                FAQ
              </button>
            </div>
          </div>
          
          {/* Join Community */}
          <div>
            <h3 className="text-[#CB9006] font-semibold mb-4 text-lg">Join Our Community</h3>
            <p className="text-gray-400 text-sm mb-4">Get trading tips and market updates</p>
            <Link 
              href="/custom-checkout"
              className="inline-block bg-[#CB9006] hover:bg-[#B07D05] text-white font-medium py-2 px-6 rounded transition-all duration-300"
            >
              Join Trading University
            </Link>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="bg-black/40 py-4">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs mb-4 md:mb-0">
            © {new Date().getFullYear()} Trading University. All Rights Reserved.
          </p>
          
          <div className="flex space-x-6 text-xs">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-[#CB9006]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-[#CB9006]">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;