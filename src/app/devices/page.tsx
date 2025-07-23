"use client";

import { useState, useEffect, SetStateAction } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Download,
  ExternalLink,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";
import Wrapper from "@/components/global/wrapper";

// Import section components
import FeaturesSection from "./components/features";
import ProtocolsSection from "./components/protocols";
import TechSpecsSection from "./components/tech-specs";
import ResourcesSection from "./components/resources";

import { devices } from "@/app/devices/specs";

export default function ProductPage() {
  const [selectedDevice, setSelectedDevice] = useState("121");
  const [activeSection, setActiveSection] = useState("keyFeatures");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const device = devices[selectedDevice];

  const handleDeviceChange = (deviceId: SetStateAction<string>) => {
    setSelectedDevice(deviceId);
    setCurrentImageIndex(0); // Reset image index when device changes
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "keyFeatures",
        "protocols",
        "techSpecs",
        "resources",
        "support",
      ];

      for (const section of sections) {
        const element = document.getElementById(section);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= 160 && rect.bottom >= 160) {
          setActiveSection(section);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Datasheet download mapping
  const datasheetLinks: { [key: string]: string } = {
    "121": "/download",
    "1-URP": "/download",
    "BSG": "/download",
  };

  // Transition variants for animations
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1] as const,
      }, 
    },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* Device Selection Navigation (Sticky) */}
      <div className="sticky top-16 z-40 w-full border-b bg-white/95 backdrop-blur-md shadow-sm">
        <Wrapper>
          <div className="flex h-16 items-center">
            <nav className="flex items-center gap-6 text-sm font-medium overflow-x-auto hide-scrollbar py-2 w-full">
              {Object.keys(devices).map((deviceId) => (
                <motion.button
                  key={deviceId}
                  onClick={() => handleDeviceChange(deviceId)}
                  className={`transition-all relative py-2 px-3 rounded-full ${
                    selectedDevice === deviceId
                      ? "text-blue-600 font-semibold bg-blue-50"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50/50"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {deviceId}
                  {selectedDevice === deviceId && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full mx-3"
                      layoutId="deviceIndicator"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>
        </Wrapper>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedDevice}
          variants={pageTransition}
          initial="initial"
          animate="animate"
          exit="exit"
          className="flex-1"
        >
          {/* Breadcrumb */}
          <Wrapper>
            <div className="pt-8">
              <div className="text-sm text-gray-500 flex items-center">
                <Link href="/" className="hover:text-blue-600 transition-colors">
                  Home
                </Link>
                <ChevronRight className="inline h-4 w-4 mx-1" />
                <span>Products</span>
              </div>
            </div>
          </Wrapper>

          {/* Product Header Section */}
          <Wrapper>
            <motion.section
              className="py-8 md:py-12"
              variants={staggerContainer}
              initial="initial"
              animate="animate"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Product Image Gallery */}
                <motion.div variants={fadeInUp} className="flex gap-4">
                  <div className="flex flex-col gap-4">
                    {device.images.map((image, index) => (
                      <motion.div
                        key={index}
                        className={`relative w-16 h-16 rounded-md overflow-hidden cursor-pointer ${
                          currentImageIndex === index
                            ? "ring-2 ring-blue-500"
                            : ""
                        }`}
                        whileHover={{
                          scale: 1.05,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleThumbnailClick(index)}
                      >
                        <div
                          className={`absolute inset-0 border-2 ${
                            currentImageIndex === index
                              ? "border-blue-500"
                              : "border-transparent hover:border-blue-500"
                          } transition-colors rounded-md z-10`}
                        />
                        <Image
                          src={image}
                          alt={`${device.name} thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    className="relative flex-1 aspect-square rounded-xl overflow-hidden shadow-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`${selectedDevice}-${currentImageIndex}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full h-full"
                      >
                        <Image
                          src={device.images[currentImageIndex]}
                          alt={`${device.name} - ${currentImageIndex + 1}`}
                          fill
                          className="object-contain"
                          priority
                        />
                      </motion.div>
                    </AnimatePresence>
                    {/* Overlay gradient for product image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-rose/20 to-transparent opacity-50" />
                  </motion.div>
                </motion.div>

                {/* Product Info */}
                <motion.div variants={fadeInUp} className="space-y-8">
                  <div>
                    <Badge className="mb-3 text-xs px-3 py-1 font-medium bg-blue-100 text-blue-800 border-none">
                      {device.uspBadge}
                    </Badge>
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                      {device.name}
                    </h1>
                    <p className="text-xl text-gray-500 mt-3 leading-relaxed">
                      {device.tagline}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                    <h3 className="text-lg font-semibold mb-4 text-gray-900">
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {device.keyFeatures.slice(0, 4).map((feature, index) => (
                        <motion.li
                          key={index}
                          className="flex items-start"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-3 mt-0.5">
                            <Check className="h-3.5 w-3.5 text-blue-600" />
                          </div>
                          <span className="text-gray-700">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:bg-blue-700"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        (window.location.href = "mailto:info@terafence.in")
                      }
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </motion.button>

                    <motion.button
                      className="inline-flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-200 font-medium px-6 py-3 rounded-full shadow-sm hover:shadow-md transition-all duration-300 hover:bg-gray-50"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        const datasheetLink =
                          datasheetLinks[selectedDevice] ||
                          "/downloads/datasheet/121.pdf";
                        window.open(datasheetLink, "_blank");
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download Datasheet
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.section>
          </Wrapper>

          {/* Sub-Navigation for Sections */}
          <div className="sticky top-32 z-40 w-full border-b bg-white/90 backdrop-blur-md">
            <Wrapper>
              <div className="flex h-16 items-center justify-between">
                <nav className="flex items-center overflow-x-auto hide-scrollbar py-2 gap-8 text-sm font-medium">
                  {[
                    { id: "keyFeatures", label: "Key Features" },
                    { id: "protocols", label: "Protocols" },
                    { id: "techSpecs", label: "Tech Specs" },
                    { id: "resources", label: "Resources" },
                    { id: "support", label: "Support" },
                  ].map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className={`relative transition-colors whitespace-nowrap py-2 ${
                        activeSection === section.id
                          ? "text-blue-600 font-semibold"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {section.label}
                      {activeSection === section.id && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                          layoutId="sectionIndicator"
                        />
                      )}
                    </a>
                  ))}
                </nav>
                <motion.button
                  className="hidden md:flex items-center justify-center whitespace-nowrap bg-blue-600 text-white px-5 py-2 rounded-full shadow-md hover:shadow-lg transition-all hover:bg-blue-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() =>
                    (window.location.href = "mailto:info@terafence.in")
                  }
                >
                  Get a Quote
                </motion.button>
              </div>
            </Wrapper>
          </div>

          {/* Features Section */}
          <FeaturesSection device={device} />

          {/* Protocols Section */}
          <ProtocolsSection device={device} />

          {/* Tech Specs Section */}
          <TechSpecsSection device={device} />

          {/* Resources Section */}
          <ResourcesSection device={device} />

          {/* Support Section */}
          <section
            id="support"
            className="py-20 border-t scroll-mt-40"
          >
            <Wrapper>
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl overflow-hidden shadow-xl relative"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600"></div>
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-blue-200 opacity-30 blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-200 opacity-30 blur-3xl"></div>

                <div className="text-center max-w-3xl mx-auto p-12">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7 }}
                    viewport={{ once: true }}
                  >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                      Smooth Sailing Guaranteed
                    </h2>
                    <p className="text-lg text-gray-700 mb-10 leading-relaxed">
                      Our dedicated support team is available to help you
                      with any questions or issues you may have. We&apos;re
                      committed to your success.
                    </p>
                    <motion.button
                      className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-8 py-4 rounded-full shadow-lg hover:shadow-blue-300/50 transition-all duration-300 hover:bg-blue-700 text-lg"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
                      }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() =>
                        (window.location.href = "mailto:support@terafence.in")
                      }
                    >
                      GET SUPPORT
                      <ExternalLink className="h-5 w-5 ml-1" />
                    </motion.button>

                    <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        24/7 Support
                      </span>
                      <span className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        99.9% Uptime
                      </span>
                      <span className="flex items-center">
                        <Check className="h-4 w-4 text-green-500 mr-1" />
                        Enterprise SLA
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </Wrapper>
          </section>

          {/* Final CTA Section */}
          <section className="bg-gradient-to-b from-gray-200 to-blue-300 py-20">
            <Wrapper>
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">
                  Go beyond basic security
                </h2>
                <p className="text-xl mb-8">
                  Absolute Security. Absolute Control.
                </p>
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-lime-700 px-10 py-4 h-auto text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  onClick={() =>
                    (window.location.href = "mailto:info@terafence.in")
                  }
                >
                  Request a PoC
                </Button>
              </div>
            </Wrapper>
          </section>
        </motion.div>
      </AnimatePresence>
      <Footer />
    </div>
  );
}