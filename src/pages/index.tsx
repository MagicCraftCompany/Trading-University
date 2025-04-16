import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import bgimage from '../../public/images/bgimage.png';
import { Vortex } from '@/components/ui/vortex';
import CardSpotlightDemo from '@/components/ui/card-spotlight-demo';
import image1 from '../../public/Testimonials/IMG-20201201-WA0033.webp';
import image2 from '../../public/Testimonials/Necole .webp';
import image3 from '../../public/Testimonials/Copy of 126616155_3534718319954950_2947393296962467673_n.webp';
import image4 from '../../public/Testimonials/Ferrari .webp';
import image5 from '../../public/Testimonials/IMG-20201201-WA0035.webp';
import image6 from '../../public/Testimonials/IMG-20201201-WA0036.webp';
import image7 from '../../public/Testimonials/IMG-20201201-WA0037.webp';

import image9 from '../../public/Testimonials/IMG-20201201-WA0039.webp';




export default function Home() {
  const [count, setCount] = useState(113000);
  const videoContainerRef = useRef(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(prev => prev + Math.floor(Math.random() * 5));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Head>
        <title>Trading University | Master the Markets</title>
        <meta name="description" content="Learn to master the financial markets with Trading University. Expert-led courses that turn beginners into profitable traders." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/assets/favicon.ico" />
      </Head>
     
      {/* Hero Section */}
      <section className="w-full text-white relative bg-[#061213]" id="hero">
      
        <div className="container mx-auto px-4 h-screen flex flex-col items-center justify-center relative z-10">
              <div className='flex flex-row text-4xl mt-10'>
              <span className="block mb-4 text-gray-200 font-extrabold tracking-tight">TRADING IS A</span>
              <span className="block ml-2 bg-gradient-to-r from-[#CB9006] to-[#FFCB6B] text-transparent bg-clip-text font-black tracking-wider">
                SKILL
              </span>
              </div>
              <p className="text-xl md:text-3xl mb-12 text-gray-300">We will teach you how to master it</p>
         
          {/* Video Section - Now in the hero */}
          <div 
            className="video-wrapper relative max-w-4xl w-full mx-auto mb-12"
            ref={videoContainerRef}
          >
            {/* Glowing borders */}
            <div 
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CB9006] to-transparent z-10"
              style={{
                boxShadow: '0 0 20px rgba(203, 144, 6, 0.5)'
              }}
            />
            <div 
              className="absolute top-0 right-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#CB9006] to-transparent z-10"
              style={{
                boxShadow: '0 0 20px rgba(203, 144, 6, 0.5)'
              }}
            />
            <div 
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#CB9006] to-transparent z-10"
              style={{
                boxShadow: '0 0 20px rgba(203, 144, 6, 0.5)'
              }}
            />
            <div 
              className="absolute top-0 left-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-[#CB9006] to-transparent z-10"
              style={{
                boxShadow: '0 0 20px rgba(203, 144, 6, 0.5)'
              }}
            />
            
            {/* Video container */}
            <div className="video-container aspect-video rounded-md overflow-hidden">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/XpZmZnNAafI?autoplay=0&rel=0&showinfo=0&modestbranding=1"
                title="Trading University Introduction"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          <div className="text-center mt-2">
            <Link href="/custom-checkout">
              <span className="inline-block bg-[#CB9006] text-white font-bold text-xl md:text-2xl py-4 px-12 rounded-lg hover:bg-[#B07D05] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#CB9006]/20">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
            <p className="text-gray-400 text-lg md:text-xl mt-6">
              Join <span className="text-[#CB9006] font-semibold">{count.toLocaleString()}+</span> like-minded traders
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#061213]" id="features">
        <div className="w-full h-full">
          <Vortex
            backgroundColor="transparent"
            baseHue={38}
            className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
          >
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">A MASSIVE UPGRADE</h2>
              
              <p className="text-xl md:text-2xl text-center max-w-4xl mx-auto mb-12 text-white">
                The traditional trading education system is designed to make you lose money.
              </p>
              
              <div className="max-w-5xl mx-auto mb-16">
                <p className="text-lg md:text-xl text-center text-white">
                  Imagine getting access to multi-millionaire traders who will give you a 
                  <span className="font-bold"> step-by-step path to reach your financial goals </span>
                  as fast as possible…
                </p>
                <p className="text-xl md:text-2xl font-bold text-center mt-8 text-white">
                  That&apos;s exactly what you&apos;ll find inside TRADING UNIVERSITY.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-[#0A0D14] p-8 rounded-lg shadow-lg border border-[#CB9006]/20 hover:border-[#CB9006]/40 transition-all duration-300 hover:shadow-[#CB9006]/10">
                  <h3 className="text-xl font-bold mb-4 text-[#CB9006]">EXPERT TRADING EDUCATION</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">World-class market analysis training</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Scale from $0 to $10k/month trading</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Master risk management strategies</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#0A0D14] p-8 rounded-lg shadow-lg border border-[#CB9006]/20 hover:border-[#CB9006]/40 transition-all duration-300 hover:shadow-[#CB9006]/10">
                  <h3 className="text-xl font-bold mb-4 text-[#CB9006]">PRIVATE TRADER NETWORK</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Share wins with traders who understand</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Network with like-minded people</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Connect with {count.toLocaleString()}+ traders</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-[#0A0D14] p-8 rounded-lg shadow-lg border border-[#CB9006]/20 hover:border-[#CB9006]/40 transition-all duration-300 hover:shadow-[#CB9006]/10">
                  <h3 className="text-xl font-bold mb-4 text-[#CB9006]">ACCESS TO PRO TRADERS</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Learn from profitable professional traders</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">Get mentored every step of your journey</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-6 w-6 text-[#CB9006] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-300">1-on-1 advice from market experts</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="text-center mt-12">
                <Link href="/custom-checkout">
                  <span className="inline-block bg-[#CB9006] text-white font-bold text-xl md:text-2xl py-4 px-12 rounded-lg hover:bg-[#B07D05] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#CB9006]/20">
                    JOIN TRADING UNIVERSITY
                  </span>
                </Link>
              </div>
            </div>
          </Vortex>
        </div>
      </section>

     
      {/* Student Success Section */}
      <section className="py-20 bg-[#061213]" id="success">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16 text-white">OUR STUDENTS ARE WINNING</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">FOREX</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image1}
                    alt="Forex Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">CRYPTO</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image2}
                    alt="Crypto Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">STOCKS</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image3}
                    alt="Stocks Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 4 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">FUTURES</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image4}
                    alt="Futures Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 5 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">DAY TRADING</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image5}
                    alt="Day Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 6 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">OPTIONS</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image6}
                    alt="Options Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* More Testimonials Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto mt-8">
            {/* Testimonial Card 7 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">CRYPTO</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image7}
                    alt="Crypto Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
            
            {/* Testimonial Card 8 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#0A1114] to-[#141B20] rounded-xl shadow-xl border border-[#1A1D24]/30 hover:border-[#CB9006]/30 transition-all duration-300 overflow-hidden"
            >
              {/* Gold accent line */}
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-[#CB9006] to-transparent"></div>
              
              {/* Category Tag */}
              <div className="absolute top-4 right-4 z-10">
                <span className="px-2 py-1 bg-[#0A1114]/80 text-xs uppercase tracking-wider text-[#CB9006] rounded-full border border-[#CB9006]/30">TRADING</span>
              </div>
              
              {/* Testimonial Image */}
              <div className="p-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden">
                  <Image
                    src={image9}
                    alt="Trading Testimonial"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </motion.div>
          </div>
          
          <div className="text-center mt-16">
            <Link href="/custom-checkout">
              <span className="inline-block bg-[#CB9006] text-white font-bold text-xl md:text-2xl py-4 px-12 rounded-lg hover:bg-[#B07D05] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#CB9006]/20">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="text-white py-20 relative overflow-hidden" id="pricing">
        {/* Background Image for Pricing Section */}
        <div className="absolute inset-0 w-full h-full z-0">
          <Image
            src={bgimage}
            alt="Trading Background"
            fill
            priority
            className="object-cover opacity-70"
            quality={100}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#061213]/40 to-[#061213]/60" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Card Positioning Container */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left column for heading and empty space to show bear imagery */}
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl md:text-5xl font-bold text-left mb-6 md:mb-4">THE CHOICE IS YOURS</h2>
              
              <div className="mb-6 md:mb-10 max-w-xl">
                <p className="text-xl md:text-2xl text-[#CB9006] font-semibold italic mb-2">
                  &quot;The market doesn&apos;t care if you win or lose.&quot;
                </p>
                <p className="text-lg md:text-xl text-gray-300">
                  While others are <span className="text-red-500">losing money</span> in unpredictable markets, our students are discovering how to <span className="text-green-500 font-medium">consistently profit</span> regardless of market conditions.
                </p>
              </div>
              
              <div className="hidden md:block h-full min-h-[200px]">
                {/* Intentionally left empty to show background imagery */}
              </div>
            </div>
            
            {/* Card Container */}
            <div className="md:max-w-md mx-auto w-full">
              <CardSpotlightDemo />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#061213] text-white" id="faq">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">FREQUENTLY ASKED QUESTIONS</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-[#0d1f21] border border-[#1e2e30] p-6 rounded-lg shadow-xl hover:shadow-[#1a2c2e]/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">How quickly will I see results?</h3>
              <p className="text-gray-300">Results depend on your dedication, starting capital, and how well you implement our strategies. Some students see results in their first week, while others may take a few months to become consistently profitable. We provide all the tools, strategies, and support you need to succeed.</p>
            </div>
            
            <div className="bg-[#0d1f21] border border-[#1e2e30] p-6 rounded-lg shadow-xl hover:shadow-[#1a2c2e]/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">Do I need trading experience?</h3>
              <p className="text-gray-300">No experience is necessary. Our courses start from the absolute basics and progress to advanced concepts. We&apos;ve designed our curriculum to transform complete beginners into skilled traders. If you already have experience, you&apos;ll still find valuable advanced strategies to improve your trading.</p>
            </div>
            
            <div className="bg-[#0d1f21] border border-[#1e2e30] p-6 rounded-lg shadow-xl hover:shadow-[#1a2c2e]/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">How much money do I need to start trading?</h3>
              <p className="text-gray-300">While you can start with as little as $100, we recommend beginning with at least $500-$1000 for forex and crypto trading, and $2000-$5000 for stocks. However, we teach proper risk management regardless of your account size, and you can practice with a demo account until you&apos;re confident.</p>
            </div>
            
            <div className="bg-[#0d1f21] border border-[#1e2e30] p-6 rounded-lg shadow-xl hover:shadow-[#1a2c2e]/50 transition-all duration-300">
              <h3 className="text-xl font-bold text-white mb-3">Can I trade part-time?</h3>
              <p className="text-gray-300">Absolutely! Many of our students trade part-time while working full-time jobs. We teach strategies for various time frames, including swing trading approaches that require just 30 minutes of analysis per day.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/custom-checkout">
              <span className="inline-block bg-[#CB9006] text-white font-bold text-xl md:text-2xl py-4 px-12 rounded-lg hover:bg-[#B07D05] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#CB9006]/20">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
