"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";

// Define props interface
export interface CanvasRevealEffectProps {
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}

// Create a placeholder component
const LoadingPlaceholder = () => (
  <div className="h-full w-full bg-[#061213]" />
);

// Dynamically import the canvas component with no SSR
const DynamicCanvasContent = dynamic(
  () => import('./canvas-components').then(mod => mod.default),
  { 
    ssr: false, 
    loading: () => <LoadingPlaceholder />
  }
);

// Main component that doesn't use Three.js directly
export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize = 3,
  showGradient = true,
}: CanvasRevealEffectProps) => {
  // Use a client-side only flag to ensure we only render the canvas on the client
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  
  // Performance optimization - reduce dot size on mobile
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const optimizedDotSize = isMobile ? Math.max(dotSize - 1, 1) : dotSize;
  
  // IntersectionObserver to disable rendering when not in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: '100px', threshold: 0.1 }
    );
    
    const currentContainerRef = containerRef.current;
    
    if (currentContainerRef) {
      observer.observe(currentContainerRef);
    }
    
    return () => {
      if (currentContainerRef) {
        observer.unobserve(currentContainerRef);
      }
    };
  }, [isMounted]);
  
  // Scroll event handler to optimize rendering during scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeoutId);
      scrollTimeoutId = setTimeout(() => setIsScrolling(false), 150);
    };
    
    let scrollTimeoutId: NodeJS.Timeout;
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeoutId);
    };
  }, []);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup if needed
    };
  }, []);

  // Calculate maxFps based on device and scroll state
  const maxFps = isMobile ? (isScrolling ? 30 : 45) : (isScrolling ? 40 : 60);

  return (
    <div 
      ref={containerRef}
      className={cn("h-full relative bg-[#061213] w-full", containerClassName)}
    >
      {isMounted && isVisible ? (
        <DynamicCanvasContent
          animationSpeed={animationSpeed}
          opacities={opacities}
          colors={colors}
          dotSize={optimizedDotSize}
          maxFps={maxFps}
        />
      ) : (
        <LoadingPlaceholder />
      )}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#061213] to-[84%] pointer-events-none" />
      )}
    </div>
  );
}; 