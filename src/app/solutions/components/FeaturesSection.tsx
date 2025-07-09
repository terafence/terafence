import React from "react";
import { motion } from "framer-motion";
import { getIconByName } from "./IconUtils";
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => {
  const Icon = getIconByName(icon);
  
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl p-8 lg:p-10 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-100 group"
    >
      <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center mb-8 group-hover:bg-gradient-to-br group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
        <Icon size={32} className="text-blue-600" />
      </div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const FeaturesSection: React.FC<FeaturesSectionProps> = ({ title, features }) => {
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
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-16 text-center"
          >
            {title}
          </motion.h2>
          
          <motion.div 
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
          >
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;