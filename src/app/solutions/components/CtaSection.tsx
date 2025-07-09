import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { IconArrowRight } from '@tabler/icons-react';
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface CtaSectionProps {
  title: string;
  buttonText: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({ title, buttonText }) => {
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-90" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/30 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-100/30 rounded-full blur-2xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-purple-100/30 rounded-full blur-2xl" />
      </div>
      
      <div className="max-w-5xl mx-auto">
        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerChildren}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-12 leading-tight"
          >
            {title}
          </motion.h2>
          
          <motion.div variants={fadeInUp}>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-7 rounded-xl text-xl font-medium shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:translate-y-[-5px]"
            >
              {buttonText} <IconArrowRight className="ml-2" size={22} />
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CtaSection;