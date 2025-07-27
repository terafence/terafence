"use client"

import React from "react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Shield, Zap, Database, Server, Cloud, Globe } from "lucide-react"
import Image from "next/image"
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import Wrapper from "@/components/global/wrapper";
import Link from "next/link"

const useCases = [
  {
    id: "overview",
    title: "Security Overview",
    shortTitle: "Overview",
    subtitle: "Comprehensive Cybersecurity Solutions",
    description:
      "Our enterprise-grade cybersecurity solutions provide end-to-end protection for critical infrastructure and sensitive data. Advanced threat detection, real-time monitoring, and rapid incident response safeguard your organization against evolving cyber threats.",
    icon: Shield,
    imagePath: "/images/usecases/overview.svg",
  },
  {
    id: "energy-management",
    title: "Energy Infrastructure Security",
    shortTitle: "Energy",
    subtitle: "Power Grid & Infrastructure Protection",
    description:
      "Protect electrical grid infrastructure with specialized security solutions for the energy sector. Our technology secures SCADA systems, industrial control networks, and critical power management infrastructure against targeted attacks.",
    icon: Zap,
    imagePath: "/images/usecases/energy.svg",
  },
  {
    id: "petroleum-industry",
    title: "Petroleum & Gas Security",
    shortTitle: "Petroleum",
    subtitle: "Oil & Gas Infrastructure Protection",
    description:
      "Secure oil and gas operations with tailored cybersecurity solutions that protect refineries, pipelines, and distribution networks. Our specialized approach addresses the unique challenges of petroleum industry infrastructure.",
    icon: Database,
    imagePath: "/images/usecases/petroleum.svg",
  },
  {
    id: "mission-critical-systems",
    title: "Mission Critical Systems",
    shortTitle: "Critical",
    subtitle: "High Availability Security Solutions",
    description:
      "Ensure continuous operation of mission-critical systems with high-availability security solutions. Robust protection that maintains system integrity while ensuring maximum uptime for your most important IT and OT infrastructure.",
    icon: Server,
    imagePath: "/images/usecases/critical.svg",
  },
  {
    id: "ot-data-transfer",
    title: "OT Data Transfer to SIEM",
    shortTitle: "OT Data",
    subtitle: "Secure Operational Data Transfer",
    description:
      "Securely transfer operational technology data to Security Information and Event Management (SIEM) systems with specialized data transfer solutions. Maintain visibility across your entire infrastructure while keeping critical systems isolated.",
    icon: Database,
    imagePath: "/images/usecases/otdata.svg",
  },
  {
    id: "cloud-security",
    title: "Cloud Security Solutions",
    shortTitle: "Cloud",
    subtitle: "Secure Cloud Connectivity",
    description:
      "Enable secure cloud adoption with comprehensive cloud security solutions. Secure connectivity, access controls, and continuous monitoring to protect your cloud infrastructure and ensure safe migration to cloud environments.",
    icon: Cloud,
    imagePath: "/images/usecases/cloud.svg",
  },
  {
    id: "defense-export",
    title: "Defense Export Programs",
    shortTitle: "Defense",
    subtitle: "Foreign Military Sales Solutions",
    description:
      "Support international defense programs with specialized cybersecurity solutions for foreign military sales. Compliant, robust security measures that meet the stringent requirements of defense export programs.",
    icon: Globe,
    imagePath: "/images/usecases/defense.svg",
  },
]

const certifications = [
  "IEC 62443-4-2, SL-2",
  "TASL",
  "SSE",
  "7 Layers",
  "Horizon Security"
]

export default function UseCases() {
  const [activeTab, setActiveTab] = useState("overview")
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const tabsRef = useRef(null)
  const containerRef = useRef(null)

  const handleTabClick = (id: string) => {
    setActiveTab(id)
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start", 
      inline: "nearest",
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 150

      for (const id of Object.keys(sectionRefs.current)) {
        const section = sectionRefs.current[id]
        if (!section) continue

        const sectionTop = section.offsetTop
        const sectionBottom = sectionTop + section.offsetHeight

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setActiveTab(id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar/>
      <div ref={containerRef} className="relative overflow-hidden w-full">
        {/* Enhanced Hero Section with Video Background */}
        <div className="relative h-screen flex items-center justify-center overflow-hidden">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/images/hero/usecases.mp4" type="video/mp4" />
            </video>
            {/* Video Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-800/85"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <Wrapper>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="space-y-8"
              >
                
                {/* Main Title */}
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight">
                    Use Cases
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-slate-200 max-w-4xl mx-auto leading-relaxed">
                    Comprehensive cybersecurity solutions designed for critical infrastructure protection and enterprise security requirements
                  </p>
                </div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
                >
                  <Link href="/technology">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-medium shadow-lg transition-all duration-300">
                      Explore Solutions
                    </Button>
                  </Link>
                  <Link href="/contact/contact">
                    <Button variant="subtle" className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-xl text-lg font-medium transition-all duration-300">
                      Contact Expert
                    </Button>
                  </Link>
                </motion.div>

                {/* Certifications */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-wrap justify-center gap-3 mt-16"
                >
                  {certifications.map((cert) => (
                    <div
                      key={cert}
                      className="px-4 py-2 bg-blue/10 backdrop-blur-md rounded-lg border border-white/20 text-white text-sm font-medium"
                    >
                      {cert}
                    </div>
                  ))}
                </motion.div>
              </motion.div>
            </Wrapper>
          </div>
        </div>

        {/* Sticky Navigation - Positioned below main navbar */}
        <div ref={tabsRef} className="sticky top-[64px] bg-slate-900/95 backdrop-blur-2xl z-40 border-b border-slate-800/20 shadow-xl">
          <Wrapper>
            <div className="flex overflow-x-auto scrollbar-hide py-6 gap-3 justify-center">
              {useCases.map((useCase) => (
                <motion.button
                  key={useCase.id}
                  onClick={() => handleTabClick(useCase.id)}
                  className={`px-6 py-4 rounded-xl whitespace-nowrap text-sm font-semibold transition-all duration-300 ${
                    activeTab === useCase.id
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-3">
                    {React.createElement(useCase.icon, { 
                      size: 18, 
                      className: activeTab === useCase.id ? "text-white" : "text-blue-400" 
                    })}
                    <span>{useCase.shortTitle}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </Wrapper>
        </div>

        {/* Use Cases Content with Full Width/Height Images */}
        <div className="relative">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              ref={(el) => {
                sectionRefs.current[useCase.id] = el;
              }}
              id={useCase.id}
              className={`py-32 relative overflow-hidden ${
                index % 2 === 0 
                  ? 'bg-white' 
                  : 'bg-slate-900'
              }`}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="container mx-auto px-4 relative z-10">
                <Wrapper>
                  <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`flex flex-col ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    } items-stretch gap-0`}
                  >
                    {/* Content Half */}
                    <div className="w-full lg:w-1/2 flex items-center">
                      <div className="w-full space-y-10 p-8 lg:p-16">
                        <div>
                          <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            viewport={{ once: true }}
                          >
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
                              index % 2 === 0 
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-blue-500/20 text-blue-300'
                            }`}>
                              {React.createElement(useCase.icon, { size: 20 })}
                              <span className="text-sm font-semibold">{useCase.shortTitle} Solution</span>
                            </div>
                            <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${
                              index % 2 === 0 
                                ? 'text-slate-900'
                                : 'text-white'
                            }`}>
                              {useCase.title}
                            </h2>
                            <p className={`text-xl font-medium ${
                              index % 2 === 0 
                                ? 'text-blue-600'
                                : 'text-blue-400'
                            }`}>
                              {useCase.subtitle}
                            </p>
                          </motion.div>
                        </div>

                        <motion.p
                          className={`text-lg leading-relaxed ${
                            index % 2 === 0 
                              ? 'text-slate-700'
                              : 'text-slate-300'
                          }`}
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 0.8, delay: 0.4 }}
                          viewport={{ once: true }}
                        >
                          {useCase.description}
                        </motion.p>

        

                        <motion.div
                          className="flex flex-wrap gap-6 pt-8"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8, delay: 0.7 }}
                          viewport={{ once: true }}
                        >
                          <a href="mailto:info@terafence.in">
                            <Button
                              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                              size="lg"
                            >
                              Talk To An Expert
                            </Button>
                          </a>
                          <a href="mailto:info@terafence.in">
                            <Button
                              variant="outline"
                              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                                index % 2 === 0 
                                  ? 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
                                  : 'border-2 border-blue-400 text-blue-400 hover:bg-blue-500/10'
                              }`}
                              size="lg"
                            >
                              Learn More
                            </Button>
                          </a>
                        </motion.div>
                      </div>
                    </div>

                    {/* Image Half - Professional Size */}
                    <motion.div
                      className="w-full lg:w-1/2 h-[400px] lg:h-[500px]"
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-xl">
                        <Image
                          src={useCase.imagePath}
                          alt={useCase.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        
                        {/* Overlay Elements */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                        
                        <motion.div 
                          className="absolute top-4 right-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          {React.createElement(useCase.icon, { size: 24, className: "text-blue-600" })}
                        </motion.div>

                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 font-medium text-blue-600">
                          {useCase.shortTitle}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                </Wrapper>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  )
}