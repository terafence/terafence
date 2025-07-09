'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-md border border-gray-200">
      <button
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-medium font-heading text-gray-900 flex items-center">
          {title}
        </h3>
        <div className="h-8 w-8 rounded-full bg-white shadow-sm flex items-center justify-center text-primary border border-gray-200">
          {isOpen ? (
            <IconChevronUp className="h-5 w-5" />
          ) : (
            <IconChevronDown className="h-5 w-5" />
          )}
        </div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden bg-white"
          >
            <div className="p-5 border-t border-gray-200">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}