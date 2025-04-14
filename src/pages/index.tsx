import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const [count, setCount] = useState(113000);
  
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
      <section className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold text-center mb-6"
          >
            <span className="block">TRADING IS A</span>
            <span className="text-5xl md:text-7xl text-blue-400 block mt-2">SKILL</span>
          </motion.h1>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl text-center max-w-3xl mb-10"
          >
            We will teach you how to master it
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center mb-10"
          >
            <Link href="/courses">
              <span className="bg-blue-500 text-white font-bold text-xl md:text-2xl py-4 px-10 rounded-md hover:bg-blue-600 transition-colors">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
            <p className="mt-4 text-gray-300">Join {count.toLocaleString()}+ like-minded traders</p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">A MASSIVE UPGRADE</h2>
          
          <p className="text-xl md:text-2xl text-center max-w-4xl mx-auto mb-12">
            The traditional trading education system is designed to make you lose money.
          </p>
          
          <div className="max-w-5xl mx-auto mb-16">
            <p className="text-lg md:text-xl text-center">
              Imagine getting access to multi-millionaire traders who will give you a 
              <span className="font-bold"> step-by-step path to reach your financial goals </span>
              as fast as possible…
            </p>
            <p className="text-xl md:text-2xl font-bold text-center mt-8">
              That's exactly what you'll find inside TRADING UNIVERSITY.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">EXPERT TRADING EDUCATION</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>World-class market analysis training</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Scale from $0 to $10k/month trading</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Master risk management strategies</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">PRIVATE TRADER NETWORK</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Share wins with traders who understand</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Network with like-minded people</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Connect with {count.toLocaleString()}+ traders</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">ACCESS TO PRO TRADERS</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Learn from profitable professional traders</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Get mentored every step of your journey</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>1-on-1 advice from market experts</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses">
              <span className="bg-blue-500 text-white font-bold text-xl py-4 px-10 rounded-md hover:bg-blue-600 transition-colors">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* What You'll Learn Section */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">WHAT YOU'LL LEARN</h2>
          
          <p className="text-xl md:text-2xl text-center max-w-4xl mx-auto mb-12">
            When a new trading opportunity emerges in the market,
            <br />
            <span className="font-bold">TRADING UNIVERSITY</span> will be the first place to teach you
            <span className="font-bold"> how to take advantage of it.</span>
          </p>
          
          <p className="text-lg text-center max-w-4xl mx-auto mb-16">
            Our students receive the latest market analysis and opportunities at the start of every trading day.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">TECHNICAL ANALYSIS</h3>
              <p className="mb-4">Master chart patterns and technical indicators to identify high-probability trading setups in any market condition.</p>
              <Link href="/courses/technical-analysis">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">FOREX TRADING</h3>
              <p className="mb-4">Trade the world's largest financial market with confidence. Learn strategies for day trading, swing trading, and position trading.</p>
              <Link href="/courses/forex-trading">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">STOCK MARKET</h3>
              <p className="mb-4">Multiply your capital through the stock market. We'll train you to use technical and fundamental analysis to find high-potential opportunities.</p>
              <Link href="/courses/stock-market">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">CRYPTO TRADING</h3>
              <p className="mb-4">Take advantage of the volatile crypto markets and master the art of trading digital assets from short-term to long-term strategies.</p>
              <Link href="/courses/crypto-trading">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">RISK MANAGEMENT</h3>
              <p className="mb-4">Learn the most crucial aspect of trading success. Master position sizing, stop-loss placement, and capital preservation techniques.</p>
              <Link href="/courses/risk-management">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4">TRADING PSYCHOLOGY</h3>
              <p className="mb-4">Develop the mindset of successful traders. Overcome fear, greed, and emotional trading to execute your strategy with discipline.</p>
              <Link href="/courses/trading-psychology">
                <span className="text-blue-500 font-bold">Learn More →</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Student Success Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">OUR STUDENTS ARE WINNING</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="text-xl font-bold">Alex, 27</h3>
                  <p className="text-green-600 font-bold">New revenue: $5k+/month</p>
                </div>
              </div>
              <p>
                "After 6 months of following the Forex Trading system at Trading University, I'm consistently making $5,000+ per month while still working my day job. The risk management module alone was worth the entire cost of the program."
              </p>
            </div>
            
            <div className="bg-gray-50 p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h3 className="text-xl font-bold">Sarah, 34</h3>
                  <p className="text-green-600 font-bold">New revenue: $12k+/month</p>
                </div>
              </div>
              <p>
                "I was skeptical at first, but the crypto trading strategies at Trading University changed my life. I've replaced my corporate income and now trade full-time from anywhere in the world. The community support is incredible."
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses">
              <span className="bg-blue-500 text-white font-bold text-xl py-4 px-10 rounded-md hover:bg-blue-600 transition-colors">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">THE CHOICE IS YOURS</h2>
          
          <div className="max-w-md mx-auto bg-white text-gray-900 rounded-lg overflow-hidden shadow-xl">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">TAKE ACTION</h3>
                <div className="text-right">
                  <span className="line-through text-gray-500">$147</span>
                  <div className="text-3xl font-bold text-blue-600">$49.99</div>
                  <span className="text-sm text-gray-500">per month</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Step-by-step trading tutorials</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>6 wealth-building trading methods</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access to professional traders</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Trading community chat groups</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>No experience necessary</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Custom trading application</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Cancel anytime, risk-free</span>
                </li>
              </ul>
              
              <Link href="/courses">
                <span className="block w-full bg-blue-500 text-white text-center font-bold text-xl py-4 rounded-md hover:bg-blue-600 transition-colors">
                  JOIN TRADING UNIVERSITY
                </span>
              </Link>
              
              <p className="text-center text-sm mt-4 text-gray-500">Lock-in your price before it increases. Act fast.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">FREQUENTLY ASKED QUESTIONS</h2>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How quickly will I see results?</h3>
              <p>Results depend on your dedication, starting capital, and how well you implement our strategies. Some students see results in their first week, while others may take a few months to become consistently profitable. We provide all the tools, strategies, and support you need to succeed.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Do I need trading experience?</h3>
              <p>No experience is necessary. Our courses start from the absolute basics and progress to advanced concepts. We've designed our curriculum to transform complete beginners into skilled traders. If you already have experience, you'll still find valuable advanced strategies to improve your trading.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">How much money do I need to start trading?</h3>
              <p>While you can start with as little as $100, we recommend beginning with at least $500-$1000 for forex and crypto trading, and $2000-$5000 for stocks. However, we teach proper risk management regardless of your account size, and you can practice with a demo account until you're confident.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Can I trade part-time?</h3>
              <p>Absolutely! Many of our students trade part-time while working full-time jobs. We teach strategies for various time frames, including swing trading approaches that require just 30 minutes of analysis per day.</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/courses">
              <span className="bg-blue-500 text-white font-bold text-xl py-4 px-10 rounded-md hover:bg-blue-600 transition-colors">
                JOIN TRADING UNIVERSITY
              </span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
