"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Award, Linkedin, CheckCircle, X, Users } from "lucide-react";
import Container from "../../../components/global/container";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  expertise: string[];
  background: string;
  achievements: string[];
}

export default function TeamPage() {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const teamMembers: TeamMember[] = [
    {
      name: "Chandra Shekhar Misra",
      role: "CEO and Founder",
      image: "/images/team/csm.png",
      linkedin: "https://www.linkedin.com/in/chandra-shekhar-misra-46949645/",
      background: "Technology Innovation Strategist",
      expertise: ["Strategic Leadership", "Product Vision", "Digital Transformation"],
      achievements: [
        "Pioneered multiple tech innovation initiatives",
        "Recognized for strategic business growth",
        "Leading expert in technology entrepreneurship"
      ]
    },
    {
      name: "Jose Kurian",
      role: "Co-Founder and Vice President Alliances",
      image: "/images/team/jk.png",
      linkedin: "https://www.linkedin.com/in/jose-kurian-93b8051/",
      background: "Digital Transformation Expert",
      expertise: ["Business Strategy", "Operational Excellence", "Innovation Management"],
      achievements: [
        "Drove significant digital transformation projects",
        "Award-winning business strategist",
        "Expert in scaling technology enterprises"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />
      
      {/* Hero Section with Enhanced Design */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_70%)] bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_70%)]"></div>
        
        <Container className="relative z-10 px-4 sm:px-6 py-12 lg:py-16">
          <div className="text-center max-w-4xl mx-auto">
            
            {/* Premium Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 backdrop-blur-sm rounded-full border border-blue-400/20 mb-6"
            >
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-blue-300 font-semibold text-sm tracking-wider uppercase">Leadership Team</span>
            </motion.div>
            
            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
            >
              Meet the Minds Behind <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400">
                Terafence Innovation
              </span>
            </motion.h1>
            
            {/* Description */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-slate-300 leading-relaxed"
            >
              Visionary leaders driving innovation, strategic growth, and transformative cybersecurity solutions across global enterprise landscapes.
            </motion.p>
          </div>
        </Container>
      </div>

      {/* Team Members Section - Compact Layout */}
      <div className="relative bg-slate-900 py-8 lg:py-12">
        <Container className="px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            
            {/* Team Grid - Horizontal Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div 
                  key={member.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedMember(member)}
                >
                  <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-6 hover:border-blue-400/50 hover:bg-slate-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/10 h-full">
                    
                    <div className="flex flex-col items-center text-center space-y-4 h-full">
                      
                      {/* Image Section */}
                      <div className="relative flex-shrink-0">
                        <div className="w-48 h-48 relative">
                          <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl"></div>
                          <div className="absolute inset-2 bg-slate-600 rounded-lg overflow-hidden">
                            <Image
                              src={member.image}
                              alt={member.name}
                              fill
                              sizes="192px"
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>
                        
                        {/* LinkedIn Badge */}
                        {member.linkedin && (
                          <a 
                            href={member.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="absolute -bottom-2 -right-2 p-3 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg border-2 border-slate-800 transition-all duration-300 hover:scale-110"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="w-5 h-5 text-white" />
                          </a>
                        )}
                      </div>
                      
                      {/* Content Section */}
                      <div className="flex-1 flex flex-col justify-center space-y-4">
                        
                        {/* Name & Role */}
                        <div>
                          <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">
                            {member.name}
                          </h2>
                          <p className="text-lg text-blue-400 font-semibold mb-3">
                            {member.role}
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed">
                            {member.background}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* Refined Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
            onClick={() => setSelectedMember(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-slate-800 rounded-3xl max-w-5xl w-full mx-auto shadow-2xl border border-slate-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Header */}
              <div className="relative bg-gradient-to-r from-slate-800 to-slate-700 px-8 py-6 border-b border-slate-600">
                <button 
                  onClick={() => setSelectedMember(null)} 
                  className="absolute top-6 right-6 p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-blue-400 font-semibold text-sm uppercase tracking-wider">Executive Profile</span>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* Image & LinkedIn */}
                  <div className="space-y-6">
                    <div className="w-full max-w-sm mx-auto relative">
                      <div className="aspect-square relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl overflow-hidden">
                        <Image
                          src={selectedMember.image}
                          alt={selectedMember.name}
                          fill
                          className="object-cover object-top"
                        />
                      </div>
                    </div>
                    
                    {selectedMember.linkedin && (
                      <a 
                        href={selectedMember.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 shadow-lg"
                      >
                        <Linkedin className="w-5 h-5" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="space-y-8">
                    
                    {/* Header */}
                    <div>
                      <h2 className="text-3xl lg:text-4xl font-bold text-white mb-3">
                        {selectedMember.name}
                      </h2>
                      <p className="text-xl text-blue-400 font-semibold mb-4">
                        {selectedMember.role}
                      </p>
                      <p className="text-lg text-slate-300 leading-relaxed">
                        {selectedMember.background}
                      </p>
                    </div>
                    
                    {/* Expertise */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-blue-500" />
                        Core Expertise
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {selectedMember.expertise.map((skill) => (
                          <span 
                            key={skill} 
                            className="px-4 py-2 bg-blue-600/20 text-blue-300 font-medium rounded-lg border border-blue-400/30"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Achievements */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Key Achievements
                      </h3>
                      <div className="space-y-3">
                        {selectedMember.achievements.map((achievement, idx) => (
                          <div 
                            key={idx} 
                            className="flex items-start gap-3 p-4 bg-slate-700/50 rounded-xl border border-slate-600/50"
                          >
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-300 leading-relaxed">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <Footer />
    </div>
  );
}