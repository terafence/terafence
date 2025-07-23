/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, useScroll } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowRight,
  Shield,
  Zap,
  Lock,
  CheckCircle,
  Cpu,
  Network,
  ShieldCheck,
  Gauge,
  FileCheck,
  Layers,
  CircuitBoard,
  Grid,
  Play,
  Star
} from "lucide-react"
import { content } from "./content"
import Wrapper from "@/components/global/wrapper";
import Navbar from "@/components/marketing/navbar";
import Footer from "@/components/marketing/footer";

export default function Home() {
  const [, setActiveSection] = useState("hero")
  const heroRef = useRef<HTMLDivElement>(null)
  const techRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useScroll()

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { threshold: 0.5 },
    )

    const sections = [
      { ref: heroRef, id: "hero" },
      { ref: techRef, id: "tech" },
      { ref: featuresRef, id: "features" },
      { ref: comparisonRef, id: "comparison" },
      { ref: ctaRef, id: "cta" },
    ]

    sections.forEach(({ ref }) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      sections.forEach(({ ref }) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [])

  return (
    <div className="min-h-screen bg-black">
      <Navbar/>
      
      {/* Premium Hero Section */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-black">
        
        {/* Sophisticated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/50 via-black to-gray-900/50"></div>
          <div className="absolute top-20 right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl"></div>
        </div>

        <Wrapper className="relative z-10 py-32">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="space-y-8"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="inline-block"
              >
                <div className="px-4 py-2 bg-gray-800/50 backdrop-blur-xl rounded-full border border-gray-700/50">
                  <span className="text-gray-300 text-sm font-medium">FPGA-Based Data Diode</span>
                </div>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.3 }}
                className="text-5xl lg:text-7xl font-bold leading-tight"
              >
                <span className="text-white">{content.hero.headline.split(' ').slice(0, 1).join(' ')}</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  {content.hero.headline.split(' ').slice(1).join(' ')}
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-xl text-gray-400 leading-relaxed max-w-lg"
              >
                {content.hero.subheading}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="flex gap-4"
              >
                <Button
                  size="lg"
                  onClick={() => scrollToSection(techRef)}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => scrollToSection(ctaRef)}
                  className="px-8 py-4 border border-gray-700 text-blue-800 hover:bg-gray-800 rounded-lg font-medium transition-all duration-300"
                >
                  Contact Us
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800"
              >
                <div>
                  <div className="text-2xl font-bold text-white">100%</div>
                  <div className="text-sm text-gray-500">Secure</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">24/7</div>
                  <div className="text-sm text-gray-500">Support</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">~99.9%</div>
                  <div className="text-sm text-gray-500">Uptime</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-800">
                  <Image
                    src="/images/fpga.svg"
                    alt="FPGA Technology"
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Hardware-Enforced Security</h3>
                  <p className="text-gray-400 text-sm">
                    Physically impossible reverse data flow with FPGA technology.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </Wrapper>
      </section>

      {/* Technology Section */}
      <section id="tech" ref={techRef} className="py-24 bg-gray-950">
        <Wrapper>
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              {content.technology.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              {content.technology.description}
            </motion.p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h3 className="text-3xl font-bold text-white">{content.technology.subtitle}</h3>
              <p className="text-lg text-gray-400 leading-relaxed">{content.technology.content}</p>

              <div className="space-y-6">
                {content.technology.points.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                      {index === 0 && <Shield className="h-6 w-6 text-blue-400" />}
                      {index === 1 && <Lock className="h-6 w-6 text-blue-400" />}
                      {index === 2 && <Zap className="h-6 w-6 text-blue-400" />}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-white mb-2">{point.title}</h4>
                      <p className="text-gray-400">{point.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800">
                <h3 className="text-2xl font-bold text-white mb-8">Core Component of the Data Diode</h3>
                
                <div className="aspect-[4/3] bg-gray-800 rounded-xl mb-8 overflow-hidden">
                  <Image
                    src="/images/fpga.svg"
                    alt="Data Flow Architecture"
                    width={600}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </Wrapper>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 bg-black">
        <Wrapper>
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              {content.features.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              {content.features.description}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {content.features.items.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 transition-all duration-300 h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-6">
                      {index === 0 && <Network className="h-6 w-6 text-blue-400" />}
                      {index === 1 && <ShieldCheck className="h-6 w-6 text-blue-400" />}
                      {index === 2 && <Gauge className="h-6 w-6 text-blue-400" />}
                      {index === 3 && <Cpu className="h-6 w-6 text-blue-400" />}
                      {index === 4 && <FileCheck className="h-6 w-6 text-blue-400" />}
                      {index === 5 && <Layers className="h-6 w-6 text-blue-400" />}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* Comparison Section */}
      <section id="comparison" ref={comparisonRef} className="py-24 bg-gray-950">
        <Wrapper>
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              {content.comparison.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 max-w-3xl mx-auto"
            >
              {content.comparison.description}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {content.comparison.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur-xl rounded-2xl p-8 border border-gray-800"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-300">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </Wrapper>
      </section>

      {/* CTA Section */}
      <section id="cta" ref={ctaRef} className="py-24 bg-black">
        <Wrapper>
          <div className="text-center max-w-4xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold text-white mb-6"
            >
              {content.cta.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-12"
            >
              {content.cta.description}
            </motion.p>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {content.cta.cards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Card className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 hover:border-gray-700 transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 bg-gray-800 rounded-xl flex items-center justify-center mx-auto mb-6">
                        {index === 0 ? (
                          <Play className="h-8 w-8 text-blue-400" />
                        ) : (
                          <Shield className="h-8 w-8 text-blue-400" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4">{card.title}</h3>
                      <p className="text-gray-400 mb-8">{card.description}</p>
                      <Button
                        onClick={() => window.location.href = card.link}
                        className={index === 0 
                          ? "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-300"
                          : "w-full py-3 border border-gray-700 text-gray-300 hover:bg-gray-800 rounded-lg font-medium transition-all duration-300"
                        }
                      >
                        {card.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Wrapper>
      </section>

      <Footer/>
    </div>
  )
}