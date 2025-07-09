/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

import Breadcrumb from "@/components/resources/Breadcrumb";
import UploadForm from "@/components/resources/UploadForm";
import FileExplorer from "@/components/resources/FileExplorer";
import SearchBar from "@/components/resources/SearchBar";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentlyViewed from "@/components/resources/RecentlyViewed";

export default function ResourcesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentPath, setCurrentPath] = useState("/");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("files");
  
  // Get the path from URL query params if available
  useEffect(() => {
    const pathParam = searchParams.get("path") || "/";
    setCurrentPath(pathParam);
  }, [searchParams]);

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Track this page view in localStorage
  useEffect(() => {
    if (user) {
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      
      // Add the current view to recently viewed
      const newView = {
        path: "/resources",
        name: "Resources Home",
        type: "folder",
        viewedAt: new Date().toISOString(),
      };
      
      // Remove duplicates and add new view at the beginning
      const filteredViews = recentlyViewed.filter(
        (view: any) => view.path !== newView.path
      );
      
      localStorage.setItem(
        "recentlyViewed",
        JSON.stringify([newView, ...filteredViews].slice(0, 10))
      );
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handlePathChange = (newPath: string) => {
    setCurrentPath(newPath);
    router.push(`/resources?path=${encodeURIComponent(newPath)}`);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <ResourcesSidebar user={user} />

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-6"
        >
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
            {user.isAdmin && (
              <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800">
                Admin
              </span>
            )}
          </div>

          <div className="mb-6">
            <SearchBar onSearch={handleSearch} />
          </div>

          <Breadcrumb 
            path={currentPath} 
            onNavigate={handlePathChange} 
          />

          <Tabs 
            defaultValue="files" 
            value={activeTab}
            onValueChange={setActiveTab} 
            className="mt-6"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="recent">Recently Viewed</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              {user.isAdmin && <TabsTrigger value="admin">Admin View</TabsTrigger>}
            </TabsList>

            <TabsContent value="files" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-[1fr_300px]">
                <div>
                  <UploadForm currentPath={currentPath} user={user} />
                  <FileExplorer 
                    currentPath={currentPath} 
                    onPathChange={handlePathChange}
                    searchQuery={searchQuery}
                    user={user}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="recent">
              <RecentlyViewed onNavigate={(path: string) => router.push(path)} />
            </TabsContent>

            <TabsContent value="starred">
              <div className="rounded-lg border p-4">
                <h3 className="mb-4 text-lg font-medium">Your Starred Resources</h3>
                {/* Starred resources component */}
              </div>
            </TabsContent>

            {user.isAdmin && (
              <TabsContent value="admin">
                <div className="rounded-lg border p-4">
                  <h3 className="mb-4 text-lg font-medium">Admin Dashboard</h3>
                  {/* Admin components */}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}