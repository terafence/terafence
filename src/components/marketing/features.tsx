"use client";

import { useState } from "react";
import Container from "../global/container";
import Image from "next/image";

interface TrustCard {
  id: number;
  image: string;
  title: string;
  description: string;
}

const TrustedNetworks = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const trustCards: TrustCard[] = [
    {
      id: 1,
      image: "/images/application/1.png",
      title: "We do Reliable Innovations!",
      description: "Delivering trusted and forward-thinking cybersecurity solutions that evolve with your needs—built on a foundation of reliability and real-world impact."
    },
    {
      id: 2,
      image: "/images/application/2.png",
      title: "Secure File Transfer Solution",
      description: "Enforced via one-way data flow using hardware-based data diodes for absolute isolation."
    },
    {
      id: 3,
      image: "/images/application/3.png",
      title: "FPGA Technology",
      description: "FPGA-powered architecture enabling ultra-reliable, low-latency one-way data transfer with uncompromised hardware-level enforcement."
    },
    {
      id: 4,
      image: "/images/application/4.png",
      title: "OT Cybersecurity",
      description: "Purpose-built OT cybersecurity ensuring resilient protection for  ICS/SCADA networks against evolving threats and operational disruptions."
    },
    {
      id: 5,
      image: "/images/application/5.png",
      title: "Our Presence in India",
      description: "Nationwide presence delivering trusted cybersecurity and data diode solutions across diverse sectors and critical infrastructure in India."
    },
    {
      id: 6,
      image: "/images/application/6.png",
      title: "Many Satisfied Customers",
      description: "Trusted by a growing network of satisfied customers who rely on our secure, innovative solutions to protect their most critical operations."
    },
    {
      id: 7,
      image: "/images/application/7.png",
      title: "Water Plants Cybersecurity",
      description: "Cybersecurity for water plants that safeguards control systems, prevents unauthorized access, and ensures safe, continuous delivery of clean water."
    },
    {
      id: 8,
      image: "/images/application/8.png",
      title: "Nuclear Plants Cybersecurity",
      description: "Cybersecurity solutions for nuclear plants designed to protect critical control systems, prevent cyber sabotage, and ensure operational integrity and safety."
    },
    {
      id: 9,
      image: "/images/application/9.png",
      title: "Power Plants Cybersecurity",
      description: "Tailored cybersecurity for power plants to defend against grid-targeted attacks, secure generation assets, and maintain uninterrupted energy delivery."
    },
    {
      id: 10,
      image: "/images/application/10.png",
      title: "Oil & Gas Cybersecurity",
      description: "End-to-end cybersecurity for oil & gas operations, protecting pipelines, refineries, and control systems from cyber threats and operational disruption."
    },
    {
      id: 11,
      image: "/images/application/11.png",
      title: "Pharmaceutical Cybersecurity",
      description: "Cybersecurity solutions for the pharmaceutical sector ensuring protection of intellectual property, manufacturing integrity, and regulatory compliance."
    },
    {
      id: 12,
      image: "/images/application/12.png",
      title: "Secure Patch Distribution",
      description: "Secure and controlled patch & software distribution framework ensuring authenticated updates within critical networks without exposing systems to external threats."
    },
    {
      id: 13,
      image: "/images/application/13.png",
      title: "Integrated Transport Sector",
      description: "Comprehensive cybersecurity for integrated transport systems, protecting smart infrastructure, operational networks, and passenger data from evolving threats."
    },
    {
      id: 14,
      image: "/images/application/14.png",
      title: "Securing the CCTV",
      description: "End-to-end cybersecurity for CCTV systems, ensuring protection against unauthorized access, data breaches, and tampering of critical surveillance infrastructure."
    },
    {
      id: 15,
      image: "/images/application/15.png",
      title: "Future-ready Solutions",
      description: "Scalable, adaptive, and future-ready cybersecurity solutions built to evolve with emerging threats, technologies, and critical infrastructure demands."
    }
  ];

  const totalSlides = Math.ceil(trustCards.length / 5);
  

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  return (
    <div className="relative w-full py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
      <Container>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Trusted to Protect <span className="text-blue-600">Critical Networks</span>
            </h2>
            
            <p className="text-lg sm:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We understand the evolving threat landscape and have spent the thousands of hours innovating resources that solve some of the biggest challenges in critical infrastructure cybersecurity
            </p>
          </div>

          {/* Carousel Container */}
          <div className="relative overflow-hidden mb-12">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
                    {trustCards.slice(slideIndex * 5, slideIndex * 5 + 5).map((card) => (
                      <div
                        key={card.id}
                        className="relative group"
                        onMouseEnter={() => setHoveredCard(card.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                      >
                        <div className="relative h-72 sm:h-80 lg:h-96 rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200/50">
                          
                          {/* Background Image */}
                          <div className="absolute inset-0">
                            <Image
                              src={card.image}
                              alt={card.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                              className="object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                            
                            {/* Hover Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/60 to-blue-600/30 transition-opacity duration-500 ${
                              hoveredCard === card.id ? 'opacity-100' : 'opacity-0'
                            }`}></div>
                          </div>

                          {/* Content Container */}
                          <div className="absolute inset-0 flex flex-col justify-end p-6">
                            
                            {/* Title - Default State */}
                            <div className={`transform transition-all duration-500 ease-in-out ${
                              hoveredCard === card.id 
                                ? 'translate-y-0 opacity-0' 
                                : 'translate-y-0 opacity-100'
                            }`}>
                              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                                {card.title}
                              </h3>
                            </div>

                            {/* Description - Hover State */}
                            <div className={`absolute inset-x-6 bottom-6 transform transition-all duration-500 ease-in-out ${
                              hoveredCard === card.id 
                                ? 'translate-y-0 opacity-100' 
                                : 'translate-y-8 opacity-0'
                            }`}>
                              <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-3">
                                {card.title}
                              </h3>
                              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                                {card.description}
                              </p>
                            </div>
                          </div>

                          {/* Shine Effect */}
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center items-center space-x-3">
            {/* Left Arrow */}
            <button 
              onClick={() => goToSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              className={`p-2 rounded-full transition-all duration-300 ${
                currentSlide === 0 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-10 bg-blue-600' 
                    : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                }`}
              ></button>
            ))}

            {/* Right Arrow */}
            <button 
              onClick={() => goToSlide(Math.min(totalSlides - 1, currentSlide + 1))}
              disabled={currentSlide === totalSlides - 1}
              className={`p-2 rounded-full transition-all duration-300 ${
                currentSlide === totalSlides - 1 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TrustedNetworks;