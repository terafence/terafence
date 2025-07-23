/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/resources/LiveTracker.tsx
"use client";

import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LiveTrackerProps {
  resourcePath: string;
}

export default function LiveTracker({ resourcePath }: LiveTrackerProps) {
  const [viewerCount, setViewerCount] = useState(1);
  const [hasNewViewer, setHasNewViewer] = useState(false);

  // In a real implementation, this would use WebSockets
  // For demo purposes, we'll use polling and simulate random viewers
  useEffect(() => {
    // Add this viewer to the count
    const updateViewers = async () => {
      try {
        // In a real implementation, this would be a WebSocket or API call
        // For demo, we'll just increment a counter in localStorage
        const resourceViewers = JSON.parse(localStorage.getItem(`resource_viewers_${resourcePath}`) || "{}");
        
        // Generate a unique ID for this viewer
        const viewerId = `viewer_${Math.random().toString(36).substring(2, 9)}`;
        
        // Add this viewer
        resourceViewers[viewerId] = {
          joinedAt: new Date().toISOString(),
          lastSeen: new Date().toISOString()
        };
        
        // Save back to localStorage
        localStorage.setItem(`resource_viewers_${resourcePath}`, JSON.stringify(resourceViewers));
        
        // Count active viewers (those who were active in the last 5 minutes)
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
        const activeViewers = Object.values(resourceViewers).filter(
          (viewer: any) => viewer.lastSeen > fiveMinutesAgo
        );
        
        setViewerCount(activeViewers.length);
      } catch (error) {
        console.error("Error updating viewer count:", error);
      }
    };

    // Initial update
    updateViewers();

    // Set up polling
    const interval = setInterval(() => {
      // Simulate random new viewers occasionally
      if (Math.random() < 0.3) {  // 30% chance of new viewer
        const newCount = viewerCount + 1;
        setViewerCount(newCount);
        setHasNewViewer(true);
        
        // Reset animation after 2 seconds
        setTimeout(() => {
          setHasNewViewer(false);
        }, 2000);
      }
      
      // Simulate random viewers leaving occasionally
      if (viewerCount > 1 && Math.random() < 0.2) {  // 20% chance of viewer leaving
        setViewerCount(viewerCount - 1);
      }
      
      // In a real implementation, this would call updateViewers() to get real data
    }, 10000);  // Poll every 10 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
    };
  }, [resourcePath, viewerCount]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className={`flex items-center rounded-full ${
              hasNewViewer ? "bg-green-100" : "bg-gray-100"
            } px-3 py-1 transition-colors`}
            animate={{ scale: hasNewViewer ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.5 }}
          >
            <Eye
              className={`mr-1 h-4 w-4 ${
                hasNewViewer ? "text-green-500" : "text-gray-500"
              }`}
            />
            <span
              className={`text-xs font-medium ${
                hasNewViewer ? "text-green-700" : "text-gray-700"
              }`}
            >
              {viewerCount}
            </span>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {viewerCount} {viewerCount === 1 ? "person" : "people"} viewing this document
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}