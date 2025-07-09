// components/solutions/DiodeAnimation.tsx
import React from "react";
import { motion } from "framer-motion";
import { IconArrowNarrowRight, IconShield, IconServer } from '@tabler/icons-react';
import { fadeInUp, staggerSlow } from "./AnimationUtils";

// Premium DiodeAnimation component with advanced effects
const DiodeAnimation: React.FC = () => (
  <div className="relative w-full max-w-5xl mx-auto my-24 h-64 md:h-80">
    {/* 3D perspective container */}
    <div className="relative perspective-[1200px] w-full h-full">
      <motion.div 
        className="relative flex items-center justify-center w-full h-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerSlow}
      >
        {/* Reflective surface/platform effect */}
        <div className="absolute bottom-0 w-full h-2/3 bg-gradient-to-t from-blue-50/30 to-transparent rounded-full blur-md transform scale-y-[0.2] scale-x-[0.9] opacity-70"></div>
        
        {/* Source Node */}
        <motion.div 
          variants={fadeInUp}
          className="absolute left-0 flex flex-col items-center z-20"
          whileHover={{ y: -8, transition: { duration: 0.4 } }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl transform scale-110"></div>
            
            {/* Main container with glass effect */}
            <div className="relative w-28 h-28 backdrop-blur-sm bg-gradient-to-br from-white/80 to-blue-50/80 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(31,38,135,0.15)] border border-white/40">
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl opacity-80"></div>
              
              {/* Inner content */}
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-inner">
                <IconServer size={40} className="text-white drop-shadow-md" />
              </div>
            </div>
            
            {/* Bottom reflection */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-blue-400/20 rounded-full blur-md"></div>
          </div>
          
          {/* Label with subtle animation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-5"
          >
            <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500 tracking-wide">SOURCE</p>
          </motion.div>
        </motion.div>
        
        {/* Flow animation with particles */}
        <div className="relative w-full max-w-xl h-6 mx-8 z-10">
          {/* Base flow path */}
          <motion.div 
            className="absolute inset-0 h-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-violet-500 rounded-full"
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ delay: 0.6, duration: 1.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          
          {/* Glow effect */}
          <motion.div 
            className="absolute inset-0 h-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-400 to-violet-500 rounded-full blur-md"
            initial={{ scaleX: 0, originX: 0, opacity: 0.7 }}
            whileInView={{ scaleX: 1, opacity: 0.7 }}
            transition={{ delay: 0.6, duration: 1.8, ease: "easeOut" }}
            viewport={{ once: true }}
          />
          
          {/* Animated data particles */}
          <div className="absolute inset-0 h-6 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                initial={{ x: -10, opacity: 0 }}
                animate={{ 
                  x: ["0%", "100%"],
                  opacity: [0, 1, 1, 0]
                }}
                transition={{
                  duration: 2.5,
                  times: [0, 0.1, 0.9, 1],
                  delay: 1 + i * 0.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: i * 0.5
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Diode Node */}
        <motion.div 
          variants={fadeInUp}
          className="absolute flex flex-col items-center z-30"
          whileHover={{ 
            scale: 1.05, 
            rotate: 5, 
            transition: { duration: 0.4 } 
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl transform scale-110"></div>
            
            {/* Main container */}
            <div className="relative w-36 h-36 backdrop-blur-sm bg-gradient-to-br from-white/80 to-purple-50/80 rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(91,33,182,0.2)] border border-white/40">
              <motion.div 
                className="w-28 h-28 bg-gradient-to-br from-purple-400 to-violet-600 rounded-full flex items-center justify-center shadow-[inset_0_4px_15px_rgba(0,0,0,0.15)]"
                whileHover={{ 
                  boxShadow: "inset 0 4px 25px rgba(0,0,0,0.25)",
                  transition: { duration: 0.3 }
                }}
              >
                <div className="w-20 h-20 backdrop-blur-sm bg-white/90 rounded-full flex items-center justify-center shadow-inner border border-white/80">
                  <IconArrowNarrowRight size={36} className="text-violet-600 drop-shadow-sm" />
                </div>
              </motion.div>
            </div>
            
            {/* Animated pulse rings */}
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-purple-400/30"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Bottom reflection */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-2/3 h-4 bg-purple-400/30 rounded-full blur-md"></div>
          </div>
          
          {/* Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-5"
          >
            <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-violet-500 tracking-wide">DATA DIODE</p>
          </motion.div>
        </motion.div>
        
        {/* Destination Node */}
        <motion.div 
          variants={fadeInUp}
          className="absolute right-0 flex flex-col items-center z-20"
          whileHover={{ y: -8, transition: { duration: 0.4 } }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-violet-400/20 rounded-2xl blur-xl transform scale-110"></div>
            
            {/* Main container with glass effect */}
            <div className="relative w-28 h-28 backdrop-blur-sm bg-gradient-to-br from-white/80 to-violet-50/80 rounded-2xl flex items-center justify-center shadow-[0_8px_32px_rgba(91,33,182,0.15)] border border-white/40">
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent rounded-2xl opacity-80"></div>
              
              {/* Inner content */}
              <div className="w-20 h-20 bg-gradient-to-br from-violet-400 to-violet-600 rounded-xl flex items-center justify-center shadow-inner">
                <IconShield size={40} className="text-white drop-shadow-md" />
              </div>
            </div>
            
            {/* Bottom reflection */}
            <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-violet-400/20 rounded-full blur-md"></div>
          </div>
          
          {/* Label with subtle animation */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-5"
          >
            <p className="text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-violet-700 to-violet-500 tracking-wide">DESTINATION</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

export default DiodeAnimation;