"use client";

import { CardSpotlight } from "@/components/ui/card-spotlight";
import Link from "next/link";

export default function CardSpotlightDemo() {
  return (
    <CardSpotlight className="w-full mx-auto">
      <div className="flex justify-between items-center mb-6 relative z-20">
        <h3 className="text-2xl font-bold text-white">TAKE ACTION</h3>
        <div className="text-right">
          <span className="line-through text-gray-400">$147</span>
          <div className="text-3xl font-bold text-[#CB9006]">$49.99</div>
          <span className="text-sm text-gray-400">per month</span>
        </div>
      </div>

      <div className="space-y-4 mb-8 relative z-20">
        <Feature title="Step-by-step trading tutorials" />
        <Feature title="6 wealth-building trading methods" />
        <Feature title="Access to professional traders" />
        <Feature title="Trading community chat groups" />
        <Feature title="No experience necessary" />
        <Feature title="Custom trading application" />
        <Feature title="Cancel anytime, risk-free" />
      </div>

      <div className="relative z-20">
        <Link href="/custom-checkout">
          <span className="block w-full bg-[#CB9006] text-white text-center font-bold text-xl py-4 rounded-lg hover:bg-[#B07D05] transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-[#CB9006]/20">
            JOIN TRADING UNIVERSITY
          </span>
        </Link>
        
        <p className="text-center text-sm mt-4 text-gray-400">
          Lock-in your price before it increases. Act fast.
        </p>
      </div>
    </CardSpotlight>
  );
}

const Feature = ({ title }: { title: string }) => {
  return (
    <div className="flex items-start">
      <svg className="h-6 w-6 text-[#CB9006] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-white">{title}</span>
    </div>
  );
}; 