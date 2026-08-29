"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  Globe,
  Server,
  Shield,
  Cloud,
  FileDigit,
  Box,
  AlertTriangle,
  FileJson,
  Flag,
  ChevronRight,
  ArrowRight,
  Lightbulb,
  Monitor,
  Network,
  Link2,
} from "lucide-react";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import Link from "next/link";

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <Navbar />
      <main className="flex flex-col min-h-screen bg-slate-50 overflow-hidden">
        <SolutionsHero />
        <ServicesOverview />
        <CybersecurityPhilosophy />
        <GlobalPresence />
        <TerafencePlatform />
      </main>
      <Footer />
    </div>
  );
}

function SolutionsHero() {
  return (
    <section className="w-full bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 py-12 sm:py-16 md:py-24 relative overflow-hidden">
      <div className="absolute right-0 top-0 h-40 w-40 sm:h-64 sm:w-64 bg-yellow-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute left-0 bottom-0 h-40 w-40 sm:h-64 sm:w-64 bg-blue-400 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="space-y-4 sm:space-y-6"
          >
            <div className="inline-flex items-center px-3 py-1 bg-blue-800/30 backdrop-blur-sm rounded-full border border-blue-400/20 text-blue-200 text-xs sm:text-sm">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Unidirectional Security Gateway
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Protecting India&apos;s <br />
              <span className="text-yellow-300">Critical Infrastructure</span>
            </h1>
            <p className="text-base sm:text-lg text-blue-100 max-w-lg">
              Cutting-edge cybersecurity solutions designed for mission-critical
              environments in the modern threat landscape.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
              <Link href="/services/cybersecurity" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-yellow-400/30 transition duration-300 flex items-center justify-center"
                >
                  Explore Solutions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </motion.button>
              </Link>
              <Link href="/services/advisory" passHref>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-blue-700/30 text-white border border-blue-400/30 backdrop-blur-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base hover:bg-blue-600/40 transition duration-300"
                >
                  Advisory & Consulting
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="relative h-[250px] sm:h-[320px] md:h-[400px] w-full"
          >
            <div className="absolute inset-0 bg-blue-600/20 backdrop-blur-md rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 to-indigo-900/80 backdrop-blur-md rounded-2xl"></div>
            <div className="h-full w-full relative flex items-center justify-center">
              <Image
                src="/images/about/info.svg"
                alt="Cybersecurity Infographic"
                fill
                className="object-contain p-4 sm:p-6"
                priority
              />
              <div className="absolute top-4 right-4 p-2 bg-blue-500/30 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 p-1 bg-yellow-500/30 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CybersecurityPhilosophy() {
  return (
    <section className="w-full py-14 sm:py-18 md:py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/dot-pattern.svg')] opacity-5"></div>
      <div className="container mx-auto px-4 md:px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4 sm:space-y-6"
        >
          <div className="inline-flex items-center px-3 py-1 bg-blue-50 rounded-full text-blue-600 font-medium text-xs sm:text-sm">
            OUR CYBERSECURITY PHILOSOPHY
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Ensure data flows only one way. <br className="hidden sm:block" /> Protect every device.
          </h2>

          <div className="max-w-3xl mx-auto">
            <p className="text-base sm:text-lg text-gray-600">
              Terafence&apos;s solutions ensure security and our technology
              protects critical infrastructure by securing data transfer and
              device access at all levels.
            </p>
          </div>

          <div className="pt-4 sm:pt-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block"
            >
              <Link href="/usecases" passHref>
                <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 flex items-center">
                  Learn More
                  <ChevronRight className="ml-2 h-4 w-4" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Services Overview Section ─── */
function ServicesOverview() {
  const services = [
    {
      icon: <Lightbulb className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Advisory & Consulting",
      description:
        "Strategic IT advisory covering data migration, workplace experience consulting, technology transformation, and cost optimization — aligned to your mission-critical goals.",
      href: "/services/advisory",
      color: "from-emerald-500 to-teal-500",
      bgLight: "bg-emerald-50",
      textColor: "text-emerald-600",
      stats: "200+ enterprises advised",
    },
    {
      icon: <Cloud className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Cloud Services",
      description:
        "Multi-cloud migration, infrastructure management, and FinOps optimization across AWS, Azure, and GCP — with security built into every layer.",
      href: "/services/cloud",
      color: "from-blue-500 to-cyan-500",
      bgLight: "bg-blue-50",
      textColor: "text-blue-600",
      stats: "99.99% uptime SLA",
    },
    {
      icon: <Monitor className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Workplace Services",
      description:
        "Digital workspace transformation — endpoint management, unified communications, AI-powered service desk, and zero-trust endpoint security.",
      href: "/services/workplace",
      color: "from-violet-500 to-purple-500",
      bgLight: "bg-violet-50",
      textColor: "text-violet-600",
      stats: "40% productivity increase",
    },
    {
      icon: <Network className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Network Services",
      description:
        "Enterprise and tactical network design — campus LAN, SD-WAN, data center fabrics, and military-grade encrypted communications for field operations.",
      href: "/services/network",
      color: "from-amber-500 to-orange-500",
      bgLight: "bg-amber-50",
      textColor: "text-amber-600",
      stats: "500+ sites deployed",
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Cybersecurity",
      description:
        "24/7 SOC operations, hardware data diode solutions, OT/ICS security, penetration testing, and threat intelligence — protecting what matters most.",
      href: "/services/cybersecurity",
      color: "from-red-500 to-rose-500",
      bgLight: "bg-red-50",
      textColor: "text-red-600",
      stats: "24/7 SOC operations",
    },
    {
      icon: <Link2 className="h-6 w-6 sm:h-7 sm:w-7" />,
      title: "Service Integration",
      description:
        "SIAM framework implementation, multi-vendor orchestration, unified ITSM, and automation-first service delivery across all IT towers.",
      href: "/services/integration",
      color: "from-teal-500 to-emerald-500",
      bgLight: "bg-teal-50",
      textColor: "text-teal-600",
      stats: "50+ vendors integrated",
    },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="w-full py-14 sm:py-18 md:py-24 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-16"
        >
          <div className="inline-flex items-center px-3 py-1 bg-indigo-50 rounded-full text-indigo-600 font-medium text-xs sm:text-sm mb-3">
            OUR SERVICES
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            End-to-End IT & Security Services
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Beyond our core data diode technology, Terafence delivers a
            comprehensive suite of IT services — from strategic advisory and
            cloud transformation to 24/7 cybersecurity operations.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={item}>
              <Link href={service.href} className="block h-full">
                <motion.div
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.1)",
                  }}
                  className="bg-white rounded-xl p-5 sm:p-6 border border-gray-100 transition-all hover:border-gray-200 group shadow-sm h-full flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div
                      className={`${service.bgLight} p-2.5 sm:p-3 rounded-xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <div className={service.textColor}>{service.icon}</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2 group-hover:text-blue-700 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                    <span
                      className={`text-xs font-semibold ${service.textColor} uppercase tracking-wider`}
                    >
                      {service.stats}
                    </span>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function GlobalPresence() {
  return (
    <section className="w-full py-14 sm:py-18 md:py-24 bg-gradient-to-b from-slate-50 to-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/topo.svg')] opacity-5" />

      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="h-px w-4 sm:w-6 bg-amber-500/60" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-600">
              Global Footprint
            </span>
            <span className="h-px w-4 sm:w-6 bg-amber-500/60" />
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 tracking-tight">
            Our Global Presence
          </h2>

          <p className="text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Terafence secures critical infrastructure across continents — active across
            multiple strategic locations worldwide.
          </p>
        </motion.div>

        {/* Map — static image with all locations pre-rendered */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-[1200px] mx-auto"
        >
          <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1]">
            <Image
              src="/images/about/map.svg"
              alt="Terafence Global Presence — Dallas, New Jersey, United Kingdom, Italy, Dubai, India, Singapore, Thailand, Indonesia, Japan"
              fill
              className="object-contain"
              priority
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function TerafencePlatform() {
  const techStack = [
    { icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Data Diode" },
    { icon: <FileDigit className="h-4 w-4 sm:h-5 sm:w-5" />, name: "TFG-BSG" },
    { icon: <Box className="h-4 w-4 sm:h-5 sm:w-5" />, name: "TFG-1URP" },
    { icon: <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />, name: "TFG-121" },
    { icon: <Search className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Syslog Transfer" },
    { icon: <Globe className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Threat Prevention" },
    { icon: <FileJson className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Cybersecurity" },
    { icon: <Flag className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Origin Security" },
  ];

  const deploymentOptions = [
    { icon: <Shield className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Air-Gapped" },
    { icon: <Server className="h-4 w-4 sm:h-5 sm:w-5" />, name: "On-Premise" },
    { icon: <Cloud className="h-4 w-4 sm:h-5 sm:w-5" />, name: "Data Diode" },
  ];

  const serviceHighlights = [
    {
      label: "Advisory & Cloud",
      desc: "Strategy, migration & FinOps",
      href: "/services/advisory",
    },
    {
      label: "Network & Security",
      desc: "SD-WAN, SOC & data diodes",
      href: "/services/network",
    },
    {
      label: "Service Integration",
      desc: "SIAM & multi-vendor mgmt",
      href: "/services/integration",
    },
  ];

  return (
    <section className="w-full py-14 sm:py-18 md:py-24 bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/wave-pattern.svg')] opacity-10"></div>
      <div className="absolute top-0 right-0 w-40 h-40 sm:w-64 sm:h-64 bg-blue-400 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-40 h-40 sm:w-64 sm:h-64 bg-violet-400 rounded-full blur-3xl opacity-20"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 sm:space-y-8"
          >
            <div>
              <div className="inline-flex items-center px-3 py-1 bg-blue-800/40 backdrop-blur-sm rounded-full border border-blue-400/20 text-blue-200 mb-3 text-xs sm:text-sm">
                <span className="w-2 h-2 bg-blue-300 rounded-full mr-2 animate-pulse"></span>
                COMPREHENSIVE PROTECTION
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Terafence</h2>
              <p className="text-base sm:text-lg text-blue-100">
                Our product combines the unidirectional gateway security to
                provide comprehensive protection against threats, even in the
                most sensitive environments.
              </p>
            </div>

            <div className="bg-blue-800/20 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-blue-700/40">
              <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <div className="w-1 h-5 sm:h-6 bg-yellow-400 rounded-full mr-3"></div>
                Technology Overview
              </h4>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center space-x-2 sm:space-x-3 group"
                  >
                    <div className="bg-blue-600/50 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      {tech.icon}
                    </div>
                    <span className="text-sm sm:text-base group-hover:text-blue-200 transition-colors truncate">
                      {tech.name}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <div className="w-1 h-5 sm:h-6 bg-yellow-400 rounded-full mr-3"></div>
                Deployment Options
              </h4>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {deploymentOptions.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.03 }}
                    className="bg-blue-800/50 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg flex items-center space-x-2 sm:space-x-3 border border-blue-600/40"
                  >
                    <div className="bg-blue-600/50 p-1.5 sm:p-2 rounded-lg">
                      {option.icon}
                    </div>
                    <span className="text-sm sm:text-base font-medium">{option.name}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Services quick-links */}
            <div>
              <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 flex items-center">
                <div className="w-1 h-5 sm:h-6 bg-yellow-400 rounded-full mr-3"></div>
                Our Services
              </h4>
              <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                {serviceHighlights.map((svc, index) => (
                  <Link key={index} href={svc.href}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="bg-yellow-400/10 px-4 py-3 mb-1 sm:mb-5 rounded-lg border border-yellow-400/20 hover:border-yellow-400/40 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-yellow-300">
                        {svc.label}
                      </span>
                      <p className="text-xs text-blue-200 mt-0.5">{svc.desc}</p>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </div>

            <Link href="/contact/contact">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-amber-500 text-blue-900 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-bold text-sm sm:text-base shadow-lg hover:shadow-yellow-400/30 transition duration-300 flex items-center justify-center sm:inline-flex"
              >
                Request a Demo
                <ChevronRight className="ml-2 h-4 w-4" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full mt-4 lg:mt-0"
          >
            <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md rounded-xl border border-blue-500/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/about/info1.svg"
                alt="terafence-india"
                fill
                className="object-contain p-6 sm:p-8"
              />
              <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-300"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
