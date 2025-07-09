/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Check, ArrowRight } from "lucide-react";
import Wrapper from "@/components/global/wrapper";

interface FeaturesProps {
  device: any;
}

export default function FeaturesSection({ device }: FeaturesProps) {
  return (
    <section id="keyFeatures" className="py-16 scroll-mt-40">
      <Wrapper>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="space-y-8">
            <div className="inline-block">
              <h2 className="text-3xl font-bold text-gray-900">
                {device.name} Features
              </h2>
              <div className="h-1 w-20 bg-blue-600 mt-2 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {device.keyFeatures.map((feature: string, index: number) => (
                <motion.div
                  key={index}
                  className="flex items-start p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div
            className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Image
              src={`/images/gen2.svg?height=400&width=600`}
              alt={`${device.name} features`}
              fill
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        {/* Dark Contrast Section */}
        <motion.div
          className="mt-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="relative aspect-square md:aspect-auto md:h-full">
              <Image
                src={`/images/gen1.svg?height=400&width=400`}
                alt={`${device.name} security`}
                fill
                className="object-cover h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/40 to-transparent mix-blend-multiply" />
              {/* Decorative security badge overlay */}
              <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md p-3 rounded-lg">
                <div className="text-sm font-semibold text-white">
                  Security Certified
                </div>
                <div className="text-xs text-blue-200">
                  SSE | 7 Layers | Horizon
                </div>
              </div>
            </div>
            <div className="p-10 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-6">
                Advanced Security Features
              </h2>
              <p className="mb-8 text-blue-100 text-lg leading-relaxed">
                {device.name} provides industry-leading security features to
                protect your most sensitive data and communications.
              </p>
              <ul className="space-y-5">
                {device.keyFeatures.slice(0, 3).map((feature: string, index: number) => (
                  <motion.li
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0 mr-4">
                      <Check className="h-4 w-4 text-blue-300" />
                    </div>
                    <span className="text-blue-50">{feature}</span>
                  </motion.li>
                ))}
              </ul>
              <motion.button
                className="mt-10 self-start inline-flex items-center justify-center gap-2 bg-white text-blue-900 font-medium px-6 py-3 rounded-full shadow-lg hover:shadow-white/20 transition-all duration-300"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  (window.location.href = "mailto:info@terafence.in")
                }
              >
                Learn More
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </Wrapper>
    </section>
  );
}