import React from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface ComparisonItem {
  category: string;
  firewall: string;
  diode: string;
}

interface ComparisonSectionProps {
  title: string;
  description: string;
  comparison: ComparisonItem[];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ 
  title, 
  description, 
  comparison 
}) => {
  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={standardViewport}
          variants={staggerChildren}
        >
          <motion.h2 
            variants={fadeInUp}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-8 text-center"
          >
            {title}
          </motion.h2>
          
          <motion.p 
            variants={fadeInUp}
            className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-16 text-center leading-relaxed"
          >
            {description}
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-100"
          >
            <div className="grid grid-cols-3 text-center font-medium text-lg border-b border-gray-100 bg-gray-50">
              <div className="py-5 px-6 text-gray-800 font-semibold">Category</div>
              <div className="py-5 px-6 text-gray-600 font-semibold">Firewall</div>
              <div className="py-5 px-6 text-blue-600 font-semibold">Data Diode</div>
            </div>
            
            {comparison.map((row, index) => (
              <div 
                key={index} 
                className={`grid grid-cols-3 text-center ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <div className="py-6 px-6 font-medium text-gray-800">{row.category}</div>
                <div className="py-6 px-6 text-gray-600">{row.firewall}</div>
                <div className="py-6 px-6 font-medium text-blue-600">{row.diode}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonSection;