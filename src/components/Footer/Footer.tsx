import React, { CSSProperties } from 'react';
import Link from 'next/link';
import {
  FaDiscord,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaTelegram,
} from "react-icons/fa6";
import logo from '../../../public/images/logo.png';
import Image from 'next/image';

interface FooterProps {
  style?: CSSProperties;
}

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
  
const Footer: React.FC<FooterProps> = ({ style }) => {
  return (
    <footer className="bg-gradient-to-b from-[#061213] to-black text-white py-16" style={style}>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-6">About Us</h3>
            <p className="text-gray-400">
              Trading University provides expert-led education to help you master the financial markets and build consistent trading success.
            </p>
            <div className="flex mt-6 space-x-4">
              <Link href="https://discord.gg/tradinguniversity" passHref>
                <span className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  <FaDiscord size={24} />
                </span>
              </Link>
              <Link href="https://www.youtube.com/tradinguniversity" passHref>
                <span className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  <FaYoutube size={24} />
                </span>
              </Link>
              <Link href="https://x.com/tradinguniversity" passHref>
                <span className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  <FaXTwitter size={24} />
                </span>
              </Link>
              <Link href="https://www.instagram.com/tradinguniversity" passHref>
                <span className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  <FaInstagram size={24} />
                </span>
              </Link>
              <Link href="https://t.me/tradinguniversity" passHref>
                <span className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  <FaTelegram size={24} />
                </span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/success-stories" className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  Success Stories
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-[#F7CF2D] transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Join Our Community</h3>
            <p className="text-gray-400 mb-6">
              Get trading tips and market updates delivered straight to your inbox.
            </p>
            <Link href="/register" className="bg-[#F7CF2D] hover:bg-[#e6c029] text-black px-6 py-3 rounded-lg inline-block transition-colors font-semibold">
              Join Trading University
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Trading University. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;