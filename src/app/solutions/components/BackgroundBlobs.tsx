import React from "react";
import { motion } from "framer-motion";

// Enhanced premium background effects
const BackgroundEffects: React.FC = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    {/* Main gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50/30 opacity-80" />
    
    {/* Large primary blob - subtle blue */}
    <div className="absolute top-0 left-1/4 w-[1200px] h-[1200px] bg-blue-100/20 rounded-full mix-blend-multiply blur-[120px] animate-blob-slow" />
    
    {/* Medium accent blob - indigo tone */}
    <div className="absolute top-1/3 right-1/4 w-[900px] h-[900px] bg-indigo-100/20 rounded-full mix-blend-multiply blur-[100px] animate-blob-slow animation-delay-2000" />
    
    {/* Smaller vibrant blob - purple accent */}
    <div className="absolute -bottom-32 left-1/3 w-[800px] h-[800px] bg-violet-100/20 rounded-full mix-blend-multiply blur-[90px] animate-blob-slow animation-delay-4000" />
    
    {/* Subtle highlight blob */}
    <div className="absolute bottom-20 right-1/3 w-[600px] h-[600px] bg-sky-100/20 rounded-full mix-blend-multiply blur-[80px] animate-blob-slow animation-delay-6000" />
    
    {/* Additional ambient lighting effects */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1500px] h-[1500px] bg-gradient-radial from-blue-50/10 to-transparent rounded-full opacity-70" />
    
    {/* Grain texture overlay for premium feel */}
    <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-soft-light pointer-events-none"></div>

    {/* Subtle grid pattern */}
    <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] mix-blend-soft-light pointer-events-none"></div>
    
    {/* Animated floating particles for premium dynamism */}
    <div className="particles-container absolute inset-0 overflow-hidden">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-blue-200/30"
          animate={{
            x: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            y: [
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`,
              `${Math.random() * 100}%`
            ],
            scale: [0.8, 1.2, 1, 0.9, 0.8],
            opacity: [0.4, 0.7, 0.4, 0.6, 0.4]
          }}
          transition={{
            duration: 25 + i * 2,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  </div>
);

export default BackgroundEffects;