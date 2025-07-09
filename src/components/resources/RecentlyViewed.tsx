// src/components/resources/RecentlyViewed.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, File, Folder, ExternalLink } from "lucide-react";

interface RecentlyViewedProps {
  onNavigate: (path: string) => void;
}

interface ViewedItem {
  path: string;
  name: string;
  type: string;
  viewedAt: string;
}

export default function RecentlyViewed({ onNavigate }: RecentlyViewedProps) {
  const [recentItems, setRecentItems] = useState<ViewedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get recently viewed items from localStorage
    const storedItems = localStorage.getItem("recentlyViewed");
    
    if (storedItems) {
      try {
        const parsedItems = JSON.parse(storedItems);
        setRecentItems(parsedItems);
      } catch (error) {
        console.error("Error parsing recently viewed items:", error);
        setRecentItems([]);
      }
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex h-20 items-center justify-center">
        <Clock className="mr-2 h-5 w-5 animate-pulse text-gray-400" />
        <span className="text-gray-500">Loading recent items...</span>
      </div>
    );
  }

  if (recentItems.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed">
        <Clock className="mb-2 h-8 w-8 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900">No recent items</h3>
        <p className="text-sm text-gray-500">
          Items you view will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Recently Viewed</h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recentItems.map((item, index) => (
          <motion.div
            key={`${item.path}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.05 }}
            className="cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            onClick={() => onNavigate(item.path)}
          >
            <div className="flex items-center">
              {item.type === "folder" ? (
                <Folder className="mr-3 h-8 w-8 text-blue-500" />
              ) : (
                <File className="mr-3 h-8 w-8 text-gray-500" />
              )}
              <div className="flex-1 overflow-hidden">
                <h4 className="truncate font-medium text-gray-900">
                  {item.name}
                </h4>
                <p className="text-sm text-gray-500">
                  {new Date(item.viewedAt).toLocaleDateString()} at{" "}
                  {new Date(item.viewedAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <ExternalLink className="ml-2 h-4 w-4 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}