import React, { FunctionComponent } from "react";
import Link from "next/link";
import {
  FaDiscord,
  FaYoutube,
  FaXTwitter,
  FaInstagram,
  FaPatreon,
  FaTelegram,
} from "react-icons/fa6";
import { MdOutlineAlternateEmail } from "react-icons/md";

export const socialLinks = [
  {
    icon: FaDiscord,
    link: "https://bit.ly/JamesCryptoGuruDiscord",
  },
  {
    icon: FaYoutube,
    link: "https://www.youtube.com/c/JamesCryptoGuru",
  },
  {
    icon: FaXTwitter,
    link: "https://twitter.com/jamyies",
  },
  {
    icon: FaInstagram,
    link: "https://instagram.com/jamescryptoguru?utm_medium=copy_link",
  },
  {
    icon: FaPatreon,
    link: "https://www.patreon.com/James_Crypto_Guru",
  },
  {
    icon: MdOutlineAlternateEmail,
    link: "mailto:contact@jamescryptoguru.com",
  },
  {
    icon: FaTelegram,
    link: "https://t.me/Jamescryptogurualerts",
  },
];
  
const Footer: FunctionComponent = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo and Social Links */}
          <div className="space-y-6">
          
            <p className="text-lg max-w-xs">
              Activate your Millionaire Mindset with Expert Guidance
            </p>
            <div className="flex space-x-4 text-white">
              {socialLinks.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.link}
                  className="text-gray-400 hover:text-white transition-colors text-xl"
                >
                  {<item.icon />}
                </Link>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Community</h4>
            <div className="space-y-2">
              <Link href="/courses" className="block text-gray-300 hover:text-white">
                Courses
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-orange-400">Platform</h4>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-300 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white">
                Terms and Conditions
              </Link>
              <Link href="#" className="block text-gray-300 hover:text-white">
                Tutor Help Centre
              </Link>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400">
          <p>JamesCryptoGuru All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;