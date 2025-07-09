/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import { Download, Unlock } from "lucide-react";
import Wrapper from "@/components/global/wrapper";
import { useState } from "react";
import InfoForm from "./info-form";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TechSpecsProps {
  device: any;
}

export default function TechSpecsSection({ device }: TechSpecsProps) {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const sectionName = "Technical Specifications";

  // Function to handle successful form submission
  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  return (
    <section id="techSpecs" className="py-16 border-t scroll-mt-40">
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
            Industry-leading specifications designed for enterprise
            performance and reliability.
          </p>
        </div>

        {/* Content section - blurred with lock overlay */}
        <div className="relative min-h-[300px]">
          {/* Apply blur effect that is more prominent */}
          <div 
            className={`relative transition-opacity duration-300 ${
              formSubmitted 
                ? "opacity-100" 
                : "opacity-0 hidden" // Hide completely until form submitted
            }`}
          >
            <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-1/3 font-bold text-gray-900 py-4">
                      Specification
                    </TableHead>
                    <TableHead className="font-bold text-gray-900 py-4">
                      Value
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(device.techSpecs).map(
                    ([key, value], index) => (
                      <motion.tr
                        key={index}
                        className={
                          index % 2 === 0 ? "bg-white" : "bg-blue-50/30"
                        }
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.5 }}
                      >
                        <TableCell className="font-medium border-t border-gray-100 py-4">
                          {key}
                        </TableCell>
                        <TableCell className="border-t border-gray-100 py-4">
                          {String(value)}
                        </TableCell>
                      </motion.tr>
                    )
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-8 bg-blue-50 rounded-xl p-6 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <Download className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  Need more details?
                </h4>
                <p className="text-sm text-gray-600">
                  Download our comprehensive technical specifications
                  document.
                </p>
              </div>
              <motion.button
                className="whitespace-nowrap px-4 py-2 bg-white text-blue-600 border border-blue-200 rounded-lg shadow-sm hover:shadow-md transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Download PDF
              </motion.button>
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
                  Your request has been submitted successfully. We&rsquo;ll get back to you shortly with the information you requested.
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