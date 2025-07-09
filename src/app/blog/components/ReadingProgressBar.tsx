'use client';

import { useEffect } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

export default function ReadingProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  // Save reading progress to localStorage
  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((latest) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          `scrollProgress-${window.location.pathname}`,
          latest.toString()
        );
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [scrollYProgress]);
  
  // Restore reading progress if available
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedProgress = localStorage.getItem(
        `scrollProgress-${window.location.pathname}`
      );
      
      if (savedProgress) {
        const targetScroll = 
          parseFloat(savedProgress) * document.documentElement.scrollHeight;
        window.scrollTo({ top: targetScroll });
      }
    }
  }, []);
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
      style={{ scaleX }}
    />
  );
}