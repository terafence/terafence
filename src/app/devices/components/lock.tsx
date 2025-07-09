"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import InfoForm from "./info-form";
import Image from "next/image";

interface LockProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export default function LockComponent({ title, description, children }: LockProps) {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to handle successful form submission
  const handleFormSuccess = () => {
    setFormSubmitted(true);
  };

  // Extract the header section from children
  // We'll assume the first child element contains the header
  
  return (
    <div className="relative w-full">
      {/* Keep the wrapper div intact */}
      <div className="w-full">
        {/* The children will be rendered here, but each section within will be locked separately */}
        {children}
      </div>

      {/* Overlay that locks the content but not the header */}
      <div className="absolute inset-0 top-28 flex items-center justify-center z-20">
        {/* Semi-transparent blur layer */}
        <div className="absolute inset-0 backdrop-blur-xl bg-white/50 pointer-events-none select-none" />
        
        {/* Lock dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-blue-100 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          {description && (
            <p className="text-gray-600 mb-6">{description}</p>
          )}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-blue-200 transition-all duration-300 hover:bg-blue-700"
            onClick={() => setShowForm(true)}
          >
            <Unlock className="h-4 w-4" />
            Unlock Content
          </motion.button>
        </motion.div>
      </div>

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
              title={title}
            />
          </motion.div>
        </div>
      )}

      {/* Success Message Modal - Shown after form submission */}
      {formSubmitted && (
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
              Your request has been submitted successfully. Our team will get back to you shortly with the information you requested.
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
  );
}