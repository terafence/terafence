'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TOCItem } from '../types';
import { IconList } from '@tabler/icons-react';

interface TOCSectionProps {
  tocItems: TOCItem[];
}

export default function TOCSection({ tocItems }: TOCSectionProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-10% 0% -80% 0%', threshold: 0.1 }
    );
    
    // Observe all section headings
    tocItems.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });
    
    return () => {
      tocItems.forEach((item) => {
        const element = document.getElementById(item.id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [tocItems]);
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Save to localStorage for reading progress
      localStorage.setItem(`readingProgress-${window.location.pathname}`, id);
      
      // Smooth scroll to the element
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth',
      });
      
      setIsMobileMenuOpen(false);
    }
  };
  
  if (tocItems.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* Mobile TOC Toggle */}
      <div className="lg:hidden fixed bottom-20 right-4 z-40">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white shadow-lg"
          aria-label="Table of Contents"
        >
          <IconList className="h-5 w-5" />
        </button>
      </div>
      
      {/* Mobile TOC Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm flex items-end">
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            className="bg-white rounded-t-2xl w-full p-6 max-h-[70vh] overflow-y-auto shadow-xl"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold font-heading">Table of Contents</h3>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-3">
              {tocItems.map((item) => (
                <li
                  key={item.id}
                  className={`${item.level === 'h3' ? 'pl-4' : 'pl-0'}`}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left w-full py-2 px-3 rounded-lg transition-colors ${
                      activeId === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${item.level === 'h3' ? 'text-sm' : 'text-base'}`}
                  >
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
      
      {/* Desktop TOC */}
      <div className="hidden lg:block sticky top-24">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h3 className="text-base font-semibold font-heading flex items-center gap-2 mb-4 text-gray-900">
            <IconList className="h-4 w-4 text-primary" />
            <span>Table of Contents</span>
          </h3>
          <nav>
            <ul className="space-y-2">
              {tocItems.map((item) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`${item.level === 'h3' ? 'pl-2' : 'pl-0'}`}
                >
                  <button
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left w-full py-1.5 px-3 rounded-lg text-sm transition-colors ${
                      activeId === item.id
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${item.level === 'h3' ? 'pl-4 border-l-2 border-gray-200' : ''}`}
                  >
                    {item.text}
                  </button>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
