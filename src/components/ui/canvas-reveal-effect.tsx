"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    setIsMounted(true);
    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className={cn("h-full relative bg-[#061213] w-full", containerClassName)}>
      {isMounted ? (
        <DynamicCanvasContent
          animationSpeed={animationSpeed}
          opacities={opacities}
          colors={colors}
          dotSize={dotSize}
        />
      ) : (
        <LoadingPlaceholder />
      )}
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-[#061213] to-[84%]" />
      )}
    </div>
  );
}; 