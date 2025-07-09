import React from "react";
import { motion } from "framer-motion";
import DiodeAnimation from "./DiodeAnimation";
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface HowItWorksSectionProps {
  title: string;
  description: string;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ 
  title, 
  description 
}) => {
  return (
    <section id="how-it-works" className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="text-center"
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerChildren}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            {description}
          </motion.p>
          
          <DiodeAnimation />
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;