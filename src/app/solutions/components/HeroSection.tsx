import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from '@tabler/icons-react';
import { fadeInUp, staggerChildren } from "./AnimationUtils";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  ctaText: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ 
  title, 
  subtitle, 
  description, 
  ctaText 
}) => {
  return (
    <section className="relative pt-32 pb-24 px-6 md:pt-40 md:pb-32 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-900 to-gray-800 mb-6 tracking-tight leading-none"
          >
            {title}
          </motion.h1>
          
          <motion.h2 
            variants={fadeInUp}
            className="text-xl md:text-2xl lg:text-3xl font-light text-gray-700 mb-8 max-w-4xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-gray-600 max-w-2xl mx-auto mb-12 text-lg md:text-xl leading-relaxed"
          >
            {description}
          </motion.p>
          
          <motion.div variants={fadeInUp}>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 rounded-xl text-lg font-medium shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:translate-y-[-5px]"
              onClick={() => {
                document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {ctaText} <IconArrowRight className="ml-2" size={20} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;