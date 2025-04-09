"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from 'react';
import { 
  MapPin, 
  Mail, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Instagram,
  Shield,
  Lock,
  Server,
  Database
} from "lucide-react";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

interface ContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

const Container = ({ children, delay = 0, className = "" }: ContainerProps) => {
  // Instead of using Framer Motion directly, we'll use a simple fade-in effect with React
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay * 1000);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return (
    <div
      className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  );
};

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { icon: <Linkedin className="h-5 w-5" />, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: <Twitter className="h-5 w-5" />, href: "https://twitter.com", label: "Twitter" },
    { icon: <Facebook className="h-5 w-5" />, href: "https://facebook.com", label: "Facebook" },
    { icon: <Instagram className="h-5 w-5" />, href: "https://instagram.com", label: "Instagram" },
  ];

  return (
    <footer className="relative w-full bg-gradient-to-r from-gray-600 to-gray-700 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            <Container className="lg:col-span-4 flex flex-col space-y-6">
              <Link href="/" className="flex items-center">
                <Image 
                  src="/images/terafence.png" 
                  alt="Terafence Logo" 
                  width={180} 
                  height={48} 
                  priority
                  className="h-12 w-auto"
                />
              </Link>
              
              <p className="text-neutral-100 text-sm leading-relaxed">
                Terafence delivers cutting-edge cybersecurity solutions that protect critical infrastructure and sensitive data across industries. Our award-winning technology creates impenetrable barriers against modern digital threats.
              </p>
              
              <div className="flex items-center space-x-4 mt-4">
                {socialLinks.map((link, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-zinc-800 hover:bg-primary/90 p-2.5 rounded-full transition-all duration-300 hover:-translate-y-1 inline-block"
                        >
                          {link.icon}
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{link.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </Container>
            
            <Container delay={0.1} className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-white tracking-wide">
                <span className="border-b-2 border-primary pb-1">Products</span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "121", href: "/devices", icon: <Shield className="h-4 w-4" /> },
                  { name: "1-URP", href: "/devices", icon: <Lock className="h-4 w-4" /> },
                  { name: "BSG", href: "/devices", icon: <Server className="h-4 w-4" /> },
                  { name: "MBSecure+", href: "/devices", icon: <Database className="h-4 w-4" /> },
                  { name: "VSecure", href: "/devices", icon: <Shield className="h-4 w-4" /> },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="group flex items-center">
                      <span className="mr-2 text-primary/80 group-hover:text-primary transition-colors">
                        {item.icon}
                      </span>
                      <span className="text-zinc-400 group-hover:text-white transition-colors">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>

            <Container delay={0.2} className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-white tracking-wide">
                <span className="border-b-2 border-primary pb-1">Solutions</span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Secure IT", href: "/solutions" },
                  { name: "Secure OT", href: "/solutions" },
                  { name: "Secure CAM", href: "/solutions" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href} 
                      className="text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>

            <Container delay={0.3} className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-white tracking-wide">
                <span className="border-b-2 border-primary pb-1">Company</span>
              </h3>
              <ul className="space-y-3 text-sm">
                {[
                  { name: "Our Story", href: "/about" },
                  { name: "Meet the Team", href: "/about/team" },
                  { name: "Join Us", href: "/careers" },
                  { name: "Downloads", href: "/download" },
                  { name: "Support", href: "/support" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link 
                      href={item.href} 
                      className="text-zinc-400 hover:text-white transition-all duration-300 hover:translate-x-1 inline-block"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>

            <Container delay={0.4} className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-semibold text-white tracking-wide">
                <span className="border-b-2 border-primary pb-1">Contact</span>
              </h3>
              <ul className="space-y-4 text-sm">
                <li className="flex items-start">
                  <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-neutral">Terafence Private Limited, 209, Suncity Success Tower, Sector-65, Gurgaon-122 018, Haryana, India</span>
                </li>
                <li className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                  <a href="mailto:info@terafence.in" className="text-neutral hover:text-blue-300 transition-colors">
                    info@terafence.in
                  </a>
                </li>
              </ul>
            </Container>
          </div>
        </div>
        
        <Separator className="bg-zinc-800" />
        
        <div className="py-8">
          <Container delay={0.5} className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral">
              &copy; {currentYear} Terafence Private Limited. All rights reserved.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-neutral-100">
              <Link href="/privacy-policy" className="hover:text-sky-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-sky-300 transition-colors">
                Terms of Use
              </Link>
              <Link href="/cookies" className="hover:text-sky-300 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </Container>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-primary" />
    </footer>
  );
};

export default Footer;