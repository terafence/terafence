import React from "react";
import { motion } from "framer-motion";
import { IconArrowRight } from '@tabler/icons-react';
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface UseCasesSectionProps {
  title: string;
  cases: string[];
}

const UseCasesSection: React.FC<UseCasesSectionProps> = ({ title, cases }) => {
  return (
    <section className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerChildren}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-12 text-center"
          >
            {title}
          </motion.h2>
          
          <motion.div 
            variants={fadeInUp}
            className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 p-10"
          >
            <ul className="space-y-6">
              {cases.map((useCase, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
                      <IconArrowRight size={16} className="text-blue-600" />
                    </div>
                  </div>
                  <p className="ml-5 text-gray-700 text-lg leading-relaxed">{useCase}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;