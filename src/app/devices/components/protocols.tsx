/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Wrapper from "@/components/global/wrapper";
import { useState } from "react";
import { Unlock } from "lucide-react";
import InfoForm from "./info-form";
import Image from "next/image";

interface ProtocolsProps {
  device: any;
}

export default function ProtocolsSection({ device }: ProtocolsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const sectionName = "Supported Protocols";

  // Function to handle successful form submission
  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  return (
    <section id="protocols" className="py-16 border-t scroll-mt-40">
      <Wrapper>
        {/* Header section - always visible */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {sectionName}
            </h2>
            <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
          </div>
          <p className="text-gray-500 md:max-w-md mt-4 md:mt-0">
            Our device supports all industry-standard protocols to ensure
            seamless integration with your existing infrastructure.
          </p>
        </div>

        {/* Content section - blurred with lock overlay */}
        <div className="relative min-h-[200px]">
          {/* Apply blur effect that is more prominent */}
          <div 
            className={`relative transition-opacity duration-300 ${
              formSubmitted 
                ? "opacity-100" 
                : "opacity-0 hidden" // Hide completely until form submitted
            }`}
          >
            <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-100">
              <div className="flex flex-wrap gap-3">
                {device.supportedProtocols.map((protocol: string, index: number) => (
                  <motion.div
                    key={index}
                    className="px-5 py-3 bg-white text-gray-700 rounded-full shadow-sm border border-gray-100 text-sm font-medium hover:shadow-md transition-all cursor-default"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03, duration: 0.4 }}
                    whileHover={{ y: -3, scale: 1.05 }}
                  >
                    {protocol}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Lock overlay - only shown if form not submitted */}
          {!formSubmitted && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-md rounded-2xl border border-gray-100">
              <div className="text-center">
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:bg-blue-700"
                >
                  <Unlock className="h-5 w-5" />
                  Unlock {sectionName}
                </button>
              </div>
            </div>
          )}

          {/* Info Form Modal */}
          {showForm && !formSubmitted && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl w-full max-w-2xl m-4 max-h-[90vh] overflow-y-auto"
              >
                <InfoForm 
                  onClose={() => setShowForm(false)} 
                  onSuccess={handleFormSuccess}
                  title={sectionName}
                />
              </motion.div>
            </div>
          )}

          {/* Success Message Modal - Shown after form submission */}
          {formSubmitted && showForm && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-8 shadow-2xl max-w-lg w-full m-4 text-center"
              >
                <div className="flex justify-center mb-6">
                 <Image
                                     src={`/images/terafence.png`} 
                                     alt={`Terafence Logo` }
                                     className={`h-12 object-contain`}
                                   />
                </div>
                
                <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Thank You!</h3>
                <p className="text-lg text-gray-700 mb-6">
                  Your request has been submitted successfully. We&#39;ll get back to you shortly with the information you requested.
                </p>
                
                <div className="py-4 px-6 bg-gray-50 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">For immediate assistance, please contact us at:</p>
                  <a href="mailto:info@terafence.in" className="text-blue-600 font-medium hover:underline">info@terafence.in</a>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-8 inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:bg-blue-700"
                  onClick={() => setShowForm(false)}
                >
                  Close
                </motion.button>
              </motion.div>
            </div>
          )}
        </div>
      </Wrapper>
    </section>
  );
}