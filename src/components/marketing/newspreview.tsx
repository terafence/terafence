"use client";

import { useState } from "react";
import Image from "next/image";

interface UseCase {
  id: number;
  name: string;
  title: string;
  description: string;
  image: string;
  features: string[];
}

const useCases: UseCase[] = [
  {
    id: 1,
    name: "Water Plant",
    title: "Water Treatment Facility Protection",
    description: "Secure water treatment and distribution systems with advanced threat protection against cyberattacks targeting critical water infrastructure. Our data diode solutions ensure complete isolation of operational technology networks while maintaining seamless monitoring and control capabilities for safe water delivery.",
    image: "/images/usecases/hero/1.png",
    features: ["SCADA System Protection", "Water Quality Monitoring", "Treatment Process Security", "Distribution Network Safety"]
  },
  {
    id: 2,
    name: "Oil & Gas",
    title: "Oil & Gas Infrastructure Security",
    description: "Protect upstream, midstream, and downstream oil and gas operations from sophisticated cyber threats. Our hardware-enforced security solutions safeguard drilling platforms, refineries, and pipeline networks while ensuring compliance with industry regulations and maintaining operational continuity.",
    image: "/images/usecases/hero/2.png",
    features: ["Pipeline Monitoring", "Refinery Protection", "Drilling Platform Security", "Storage Facility Safety"]
  },
  {
    id: 3,
    name: "Pharmaceutical",
    title: "Pharmaceutical Manufacturing Security",
    description: "Ensure the integrity and security of pharmaceutical manufacturing processes with comprehensive cybersecurity solutions. Protect sensitive research data, manufacturing equipment, and quality control systems from cyber threats while maintaining regulatory compliance and product safety standards.",
    image: "/images/usecases/hero/3.png",
    features: ["Manufacturing Process Protection", "Research Data Security", "Quality Control Systems", "Regulatory Compliance"]
  },
  {
    id: 4,
    name: "Power Plant",
    title: "Power Generation Facility Protection",
    description: "Safeguard nuclear, thermal, and renewable power generation facilities with military-grade cybersecurity solutions. Our data diode technology provides unbreachable protection for control systems, grid connections, and safety systems while ensuring reliable power generation and distribution.",
    image: "/images/usecases/hero/4.png",
    features: ["Grid Connection Security", "Control System Protection", "Safety System Isolation", "Generation Monitoring"]
  },
  {
    id: 5,
    name: "Space Station",
    title: "Space Operations Security",
    description: "Protect mission-critical space operations, satellite communications, and ground control systems with advanced cybersecurity solutions. Our technology ensures secure data transmission between space assets and ground stations while maintaining operational integrity for space missions.",
    image: "/images/usecases/hero/5.png",
    features: ["Satellite Communication Security", "Ground Control Protection", "Mission Data Integrity", "Space Asset Monitoring"]
  },
  {
    id: 6,
    name: "Research Labs",
    title: "Research Laboratory Security",
    description: "Secure sensitive research environments, intellectual property, and experimental data with comprehensive cybersecurity measures. Protect high-value research assets, laboratory equipment, and confidential data from cyber espionage and unauthorized access attempts.",
    image: "/images/usecases/hero/6.png",
    features: ["IP Protection", "Lab Equipment Security", "Data Confidentiality", "Research Integrity"]
  },
  {
    id: 7,
    name: "Ports",
    title: "Maritime Port Security",
    description: "Enhance the cybersecurity posture of maritime ports, shipping terminals, and cargo handling systems. Our solutions protect port operations, vessel traffic management, and logistics systems from cyber threats while ensuring smooth maritime commerce and trade operations.",
    image: "/images/usecases/hero/7.png",
    features: ["Port Operations Security", "Vessel Traffic Management", "Cargo System Protection", "Maritime Safety"]
  },
  {
    id: 8,
    name: "Defense Facilities",
    title: "Defense Infrastructure Protection",
    description: "Provide military-grade cybersecurity for defense installations, command centers, and sensitive military operations. Our solutions ensure complete network isolation and protection against advanced persistent threats while maintaining operational readiness and national security.",
    image: "/images/usecases/hero/8.png",
    features: ["Command Center Security", "Military Network Protection", "Intelligence System Safety", "Defense Communication"]
  }
];

const CybersecurityUseCases = () => {
  const [activeTab, setActiveTab] = useState(0);
  const currentUseCase = useCases[activeTab];

  return (
    <div 
      className="relative w-full py-12 sm:py-16 bg-gray-900"
      style={{
        backgroundImage: "url('/images/bg/uc.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/80"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header Section */}
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            Cybersecurity for <span className="text-blue-400">Mission-Critical Infrastructure</span>
          </h2>
          <p className="text-base sm:text-lg text-gray-300 max-w-3xl mx-auto">
            End-to-end protection for critical infrastructure across all environments
          </p>
        </div>

        {/* Compact Tabs Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-1.5 border border-gray-700/50">
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              {useCases.map((useCase, index) => (
                <button
                  key={useCase.id}
                  onClick={() => setActiveTab(index)}
                  className={`relative px-2 py-2.5 sm:px-3 sm:py-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
                    activeTab === index
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-700/50"
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold leading-tight">{useCase.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Compact Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          
          {/* Left Side - Compact Image */}
          <div className="order-2 lg:order-1">
            <div className="relative h-[300px] sm:h-[350px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <div className="absolute inset-0">
                <Image
                  src={currentUseCase.image}
                  alt={`${currentUseCase.title} visualization`}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-all duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"></div>
              </div>
              
              {/* Compact Floating Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-black/40 backdrop-blur-sm rounded-lg px-3 py-1.5 border border-white/20">
                  <span className="text-white font-semibold text-sm">{currentUseCase.name}</span>
                </div>
              </div>
              
              {/* Compact Security Indicator */}
              <div className="absolute top-4 right-4">
                <div className="bg-green-600/80 backdrop-blur-sm rounded-full p-2 border border-green-400/30">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Compact Content */}
          <div className="order-1 lg:order-2 space-y-4 sm:space-y-5">
            
            {/* Compact Header */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 rounded-full border border-blue-500/30">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-semibold text-blue-300">CRITICAL INFRASTRUCTURE</span>
              </div>
              
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-tight">
                {currentUseCase.title}
              </h3>
            </div>

            {/* Compact Description */}
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed line-clamp-4">
              {currentUseCase.description}
            </p>

            {/* Compact Features */}
            <div className="space-y-3">
              <h4 className="text-base font-semibold text-white flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Key Protection Areas
              </h4>
              
              <div className="grid grid-cols-2 gap-2">
                {currentUseCase.features.slice(0, 4).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span className="text-xs text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compact CTA */}
            <div className="pt-3">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 hover:scale-105">
                <span>Learn More</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CybersecurityUseCases;