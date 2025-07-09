import React from "react";
import { motion } from "framer-motion";
import { getIconByName } from "./IconUtils";
import { fadeInUp, staggerChildren, standardViewport } from "./AnimationUtils";

interface Application {
  icon: string;
  title: string;
  description: string;
}

interface ApplicationsSectionProps {
  title: string;
  applications: Application[];
}

const ApplicationCard: React.FC<Application> = ({ icon, title, description }) => {
  const Icon = getIconByName(icon);
  
  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-500 hover:translate-y-[-8px] border border-gray-100 group"
    >
      <div className="w-16 h-16 bg-gradient-to-tr from-purple-50 to-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-gradient-to-tr group-hover:from-purple-100 group-hover:to-blue-100 transition-all duration-300">
        <Icon size={30} className="text-purple-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
};

const ApplicationsSection: React.FC<ApplicationsSectionProps> = ({ title, applications }) => {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-white to-gray-50">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {applications.map((app, index) => (
              <ApplicationCard 
                key={index}
                icon={app.icon}
                title={app.title}
                description={app.description}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ApplicationsSection;