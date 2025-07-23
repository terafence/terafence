// src/components/resources/Breadcrumb.tsx
"use client";

import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";

interface BreadcrumbProps {
  path: string;
  onNavigate: (path: string) => void;
}

export default function Breadcrumb({ path, onNavigate }: BreadcrumbProps) {
  // Parse the path into segments
  const segments = path
    .split("/")
    .filter(Boolean)
    .map((segment, index, array) => {
      // Calculate the path up to this segment
      const pathToSegment = "/" + array.slice(0, index + 1).join("/") + "/";
      
      return {
        name: segment,
        path: pathToSegment,
      };
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6 flex flex-wrap items-center text-sm"
    >
      <button
        onClick={() => onNavigate("/")}
        className="flex items-center rounded-lg px-2 py-1 text-gray-600 hover:bg-gray-100"
      >
        <Home className="mr-1 h-4 w-4" />
        Home
      </button>

      {segments.map((segment, index) => (
        <div key={segment.path} className="flex items-center">
          <ChevronRight className="mx-1 h-4 w-4 text-gray-400" />
          <button
            onClick={() => onNavigate(segment.path)}
            className={`rounded-lg px-2 py-1 ${
              index === segments.length - 1
                ? "font-medium text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {segment.name}
          </button>
        </div>
      ))}
    </motion.div>
  );
}