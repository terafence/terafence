"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Mail, 
  Linkedin, 
  Shield,
  Lock,
  Server,
  ChevronRight,
  ArrowUpRight,
  Youtube
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const FadeInContainer = ({ children, delay = 0, className = "" }: ContainerProps) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Set a small initial delay for server-side rendering to client hydration
    const initialTimer = setTimeout(() => {
      // Detect if the element is in viewport using Intersection Observer
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setIsVisible(true);
            }, delay * 100); // Reduced delay for a snappier feel
            observer.unobserve(entry.target);
          }
        },
        { 
          threshold: 0.1,
          // Add rootMargin to trigger animations slightly before elements come into view
          rootMargin: '0px 0px 50px 0px'
        }
      );
      
      const currentElement = document.getElementById(`fade-container-${delay}`);
      if (currentElement) {
        observer.observe(currentElement);
      }
      
      return () => {
        if (currentElement) {
          observer.unobserve(currentElement);
        }
      };
    }, 10);
    
    return () => clearTimeout(initialTimer);
  }, [delay]);
  
  return (
    <div
      id={`fade-container-${delay}`}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, href: "https://www.linkedin.com/company/terafence-private-limited/", label: "LinkedIn", color: "hover:bg-blue-600" },
    { icon: <Youtube className="h-5 w-5" />, href: "https://www.youtube.com/@terafenceprivatelimited9541", label: "YouTube", color: "hover:bg-red-600" },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-br from-slate-950 to-slate-900 text-slate-100 overflow-hidden">
      {/* Abstract shapes for modern look */}
      <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-72 h-72 rounded-full bg-cyan-500 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-80 h-80 rounded-full bg-indigo-500 blur-3xl" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="py-12 lg:py-14">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-10 gap-x-6">
            <FadeInContainer className="lg:col-span-4 flex flex-col space-y-6">
              <Link href="/" className="flex items-center mb-4 group">
                <div className="relative overflow-hidden rounded-xl bg-white p-3 transition-all duration-300 group-hover:bg-white/90 shadow-lg">
                  <Image 
                    src="/images/terafence.png" 
                    alt="Terafence Logo" 
                    width={220} 
                    height={58} 
                    priority
                    className="h-12 w-auto z-10 relative"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-cyan-100 opacity-50 group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              </Link>
              
              <p className="text-slate-300 text-sm leading-relaxed">
                Terafence delivers cutting-edge cybersecurity solutions that protect critical infrastructure and sensitive data across industries. Our award-winning technology creates impenetrable barriers against modern digital threats.
              </p>
              
              <div className="flex flex-wrap items-center gap-3 mt-6">
                {socialLinks.map((link, index) => (
                  <TooltipProvider key={index} delayDuration={200}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`bg-slate-800/80 ${link.color} p-3 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 inline-flex items-center justify-center`}
                          aria-label={link.label}
                        >
                          {link.icon}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 border-slate-700 text-white">
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </FadeInContainer>
            
            <FadeInContainer delay={1} className="lg:col-span-2 space-y-5">
              <h3 className="text-base font-semibold text-white tracking-wide group flex items-center">
                <span className="relative inline-block pb-1">
                  Products
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform origin-left transition-transform duration-300 group-hover:scale-110"></span>
                </span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "TFG 121", href: "/devices", icon: <Shield className="h-4 w-4" /> },
                  { name: "TFG 1U-RP", href: "/devices", icon: <Lock className="h-4 w-4" /> },
                  { name: "TFG BSG", href: "/devices", icon: <Server className="h-4 w-4" /> },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center py-1 px-2 -mx-2 rounded-md hover:bg-slate-800/70 transition-all duration-200"
                    >
                      <span className="mr-2.5 text-cyan-400 group-hover:text-cyan-300 transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 text-slate-400 transition-all duration-200 transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeInContainer>

            {/* <FadeInContainer delay={2} className="lg:col-span-2 space-y-5">
              <h3 className="text-base font-semibold text-white tracking-wide group flex items-center">
                <span className="relative inline-block pb-1">
                  Solutions
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform origin-left transition-transform duration-300 group-hover:scale-110"></span>
                </span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Securing the IT", href: "/solutions" },
                  { name: "Securing the OT", href: "/solutions" },
                  { name: "Securing the CAM", href: "/solutions" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href} 
                      className="group flex items-center py-1 px-2 -mx-2 rounded-md hover:bg-slate-800/70 transition-all duration-200"
                    >
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 text-slate-400 transition-all duration-200 transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeInContainer> */}

            <FadeInContainer delay={3} className="lg:col-span-2 space-y-5">
              <h3 className="text-base font-semibold text-white tracking-wide group flex items-center">
                <span className="relative inline-block pb-1">
                  Company
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform origin-left transition-transform duration-300 group-hover:scale-110"></span>
                </span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Our Story", href: "/about" },
                  { name: "Downloads", href: "/download" },
                  { name: "Use Cases", href: "/usecases" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href}
                      className="group flex items-center py-1 px-2 -mx-2 rounded-md hover:bg-slate-800/70 transition-all duration-200"
                    >
                      <span className="text-slate-300 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                      <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-0 group-hover:opacity-100 text-slate-400 transition-all duration-200 transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </FadeInContainer>

            <FadeInContainer delay={4} className="lg:col-span-4 space-y-5">
              <h3 className="text-base font-semibold text-white tracking-wide group flex items-center">
                <span className="relative inline-block pb-1">
                  Contact
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transform origin-left transition-transform duration-300 group-hover:scale-110"></span>
                </span>
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start group">
                  <div className="p-2 mr-3 rounded-md bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors duration-300 mt-1">
                    <MapPin className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <span className="text-slate-300 group-hover:text-white transition-colors duration-300 leading-relaxed">
                      209, Suncity Success Tower,<br/> Sector-65, Gurgaon,<br/> Haryana-122005, India
                    </span>
                  </div>
                </li>
                <li className="flex items-center group">
                  <div className="p-2 mr-3 rounded-md bg-slate-800/80 text-cyan-400 group-hover:bg-cyan-500/20 transition-colors duration-300">
                    <Mail className="h-5 w-5 flex-shrink-0" />
                  </div>
                  <a 
                    href="mailto:info@terafence.in" 
                    className="relative text-slate-300 hover:text-cyan-300 transition-colors duration-300 group-hover:text-white text-base"
                  >
                    info@terafence.in
                    <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                  </a>
                </li>
              </ul>
            </FadeInContainer>
          </div>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700 to-transparent opacity-50"></div>
        
        <div className="py-6">
          <FadeInContainer delay={5} className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-400 order-2 sm:order-1 text-center sm:text-left">
              &copy; {currentYear} Terafence Private Limited. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-end gap-4 text-sm text-slate-400 order-1 sm:order-2">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Use", href: "/terms" },
                { name: "Cookie Policy", href: "/cookie" },
              ].map((item, idx) => (
                <Link 
                  key={idx}
                  href={item.href} 
                  className="group relative hover:text-cyan-300 transition-colors duration-300"
                >
                  <span className="inline-flex items-center">
                    {item.name}
                    <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </span>
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>
          </FadeInContainer>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />
    </footer>
  );
};

export default Footer;