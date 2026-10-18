"use client";

import { useState } from "react";
import Container from "../global/container";
import Image from "next/image";
import { Shield, Check, Award, Lock } from "lucide-react";

interface Certification {
  id: string;
  image: string;
  title: string;
  description: string;
  features?: string[];
  category: string;
}

const SecurityCertifications = () => {
  const certifications: Certification[] = [
    {
      id: "sse",
      image: "/images/sse.png",
      title: "SSE",
      category: "IEC62443-4-2",
      description: "SSE certification ensures our that the device not exposed information outside reducing the possibility of an attack",
      features: ["No Information Exposure", "Zero Trust Architecture for Isolated Networks", "Enhanced Data Protection with Hardware Enforced Security"],
    },
    {
      id: "emi-emc",
      image: "/images/emi-emc.png",
      title: "EMI / EMC",
      category: "Electromagnetic Compatibility",
      description: "Electromagnetic Interference (EMI) and Electromagnetic Compatibility (EMC) certification ensures our hardware systems operate securely without external interference.",
      features: ["No external interference", "Electromagnetic Shielding for Unidirectional Data Transfer", "Hardware-Based Isolation for Enhanced Security"],
    },
    {
      id: "7layers",
      image: "/images/layers.png",
      title: "7 Layers",
      category: "Penetration Testing",
      description: "7 Layers is a veteran-owned and operated business specializing in penetration testing, adversary emulation, and security awareness.",
      features: ["Data Diode Penetration Testing", "Air-Gapped Architecture Assessment", "Compliance with One-Way Data Flow Standards"],
    },
    {
      id: "horizon",
      image: "/images/horizon.png",
      title: "Horizon Security",
      category: "Infrastructure Security",
      description: "Horizon Security has validated our security infrastructure through rigorous testing protocols. Their certification demonstrates our dedication to maintaining a secure environment.",
      features: ["Maintains Physical-level Isolation ", "Secure and Safe Device Working", "Critical System Isolation"],
    },
  ];

  const [activeTab, setActiveTab] = useState("sse");
  const activeCertification = certifications.find(cert => cert.id === activeTab) || certifications[0];

  return (
    <div 
      className="relative w-full py-8 sm:py-12 bg-gray-900"
      style={{
        backgroundImage: "url('/images/bg/security.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/70"></div>
      <Container>
        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Enhanced Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/15 rounded-full border border-blue-500/30 mb-4 backdrop-blur-sm">
              <Award className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">Enterprise Security Standards</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-3 leading-tight">
              Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Certifications</span>
            </h2>
          </div>

          {/* Enhanced Tabs */}
          <div className="mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700/40 shadow-xl">
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveTab(cert.id)}
                    className={`flex-1 min-w-0 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                      activeTab === cert.id
                        ? "bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-lg transform scale-105"
                        : "text-gray-300 hover:text-white hover:bg-gray-700/40"
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-bold text-base sm:text-lg">{cert.title}</div>
                      <div className="text-xs sm:text-sm opacity-80 hidden sm:block truncate">{cert.category}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Content */}
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-3xl border border-gray-700/40 overflow-hidden shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Left - Enhanced Image */}
              <div className="relative bg-gray-800/40 flex items-center justify-center p-6 sm:p-8 lg:p-10">
                <div className="relative w-full max-w-sm">
                  <div className="relative bg-white/8 backdrop-blur-sm rounded-3xl p-6 border border-gray-600/30">
                    <div className="relative w-full h-36 sm:h-44 lg:h-52">
                      <Image
                        src={activeCertification.image}
                        alt={`${activeCertification.title} certification`}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-contain filter drop-shadow-2xl transform hover:scale-105 transition-transform duration-500"
                        priority
                      />
                    </div>
                  </div>
                  
                  {/* Enhanced glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/15 to-green-500/15 rounded-3xl blur-2xl -z-10"></div>
                </div>
              </div>

              {/* Right - Enhanced Content */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="space-y-4">
                  
                  {/* Enhanced Header */}
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/15 rounded-lg border border-green-500/30 mb-3 backdrop-blur-sm">
                      <Shield className="w-4 h-4 text-green-400" />
                      <span className="text-sm font-semibold text-green-300">Security Certified</span>
                    </div>
                    
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 leading-tight">
                      {activeCertification.title}
                    </h3>
                    
                    <p className="text-lg sm:text-xl text-blue-300 font-semibold">
                      {activeCertification.category}
                    </p>
                  </div>

                  {/* Enhanced Description */}
                  <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                    {activeCertification.description}
                  </p>

                  {/* Enhanced Features */}
                  {activeCertification.features && (
                    <div className="space-y-3">
                      <h4 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                        <Lock className="w-5 h-5 text-blue-400" />
                        Key Protection Features
                      </h4>
                      
                      <div className="space-y-2">
                        {activeCertification.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-start gap-3 group">
                            <div className="flex-shrink-0 w-5 h-5 bg-green-500/15 rounded-full flex items-center justify-center mt-1 group-hover:bg-green-500/25 transition-colors">
                              <Check className="w-3.5 h-3.5 text-green-400" />
                            </div>
                            <span className="text-sm sm:text-base text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default SecurityCertifications;