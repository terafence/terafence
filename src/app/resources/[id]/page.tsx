/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Download, Star, 
  Loader2, 
  FileText, AlertCircle, 
  BarChart2, Settings, 
  Layers
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import ResourcesSidebar from "@/components/resources/ResourcesSidebar";
import CommentsSection from "@/components/resources/CommentsSection";
import DocumentView from "@/components/resources/DocumentView";
import IssuesTab from "@/components/resources/tabs/IssuesTab";
import DownloadRequestsTab from "@/components/resources/tabs/DownloadRequestsTab";
import ActionsTab from "@/components/resources/tabs/ActionsTab";
import ProjectsTab from "@/components/resources/tabs/ProjectsTab";
import InsightsTab from "@/components/resources/tabs/InsightsTab";
import MetadataPanel from "@/components/resources/MetadataPanel";
import LiveTracker from "@/components/resources/LiveTracker";


interface FileDetails {
  name: string;
  type: string;
  path: string;
  size?: number;
  lastModified?: string;
  extension?: string;
  content?: string;
  starred?: boolean;
}

export default function FileDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("files");
  const [isStarred, setIsStarred] = useState(false);

  // Fetch file details
  useEffect(() => {
    const fetchFileDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const decodedPath = decodeURIComponent(id as string);
        const response = await fetch(`/api/resources/file?path=${encodeURIComponent(decodedPath)}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch file details");
        }
        
        const data = await response.json();
        setFileDetails(data);
        
        // Check if file is starred
        const starredItems = JSON.parse(localStorage.getItem("starredItems") || "[]");
        setIsStarred(starredItems.some((item: any) => item.path === decodedPath));
        
        // Add to recently viewed
        if (user) {
          const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
          
          const newView = {
            path: `/resources/${encodeURIComponent(decodedPath)}`,
            name: data.name,
            type: data.type,
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
      } catch (error) {
        console.error("Error fetching file details:", error);
        toast({
          title: "Error",
          description: "Failed to load file details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchFileDetails();
    }
  }, [id, user, toast]);

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Handle starring/unstarring a file
  const handleToggleStar = () => {
    if (!fileDetails) return;
    
    const starredItems = JSON.parse(localStorage.getItem("starredItems") || "[]");
    
    if (isStarred) {
      // Remove from starred
      const updatedStarred = starredItems.filter(
        (item: any) => item.path !== fileDetails.path
      );
      localStorage.setItem("starredItems", JSON.stringify(updatedStarred));
      setIsStarred(false);
    } else {
      // Add to starred
      const newStarredItem = {
        path: fileDetails.path,
        name: fileDetails.name,
        type: fileDetails.type,
        starredAt: new Date().toISOString(),
      };
      localStorage.setItem(
        "starredItems",
        JSON.stringify([...starredItems, newStarredItem])
      );
      setIsStarred(true);
    }
    
    toast({
      title: isStarred ? "Removed from starred" : "Added to starred",
      description: isStarred 
        ? `"${fileDetails.name}" has been removed from your starred items`
        : `"${fileDetails.name}" has been added to your starred items`,
    });
  };

  // Handle download
  const handleDownload = async () => {
    if (!fileDetails) return;
    
    try {
      window.open(
        `/api/resources/download?path=${encodeURIComponent(fileDetails.path)}`,
        "_blank"
      );
      
      toast({
        title: "Success",
        description: `Downloading "${fileDetails.name}"`,
      });
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }

  if (isLoading || !fileDetails) {
    return (
      <div className="flex h-screen bg-white">
        <ResourcesSidebar user={user} />
        <div className="flex-1 overflow-auto p-8">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 animate-pulse rounded-lg bg-gray-200"></div>
            <div className="space-y-2">
              <div className="h-6 w-64 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-40 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>
          <div className="mt-8 h-96 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white">
      <ResourcesSidebar user={user} />
      
      <div className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="container mx-auto px-4 py-6"
        >
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => router.back()}
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back
              </Button>
              
              <h1 className="text-2xl font-bold text-gray-900">
                {fileDetails.name}
              </h1>
            </div>
            
            <div className="flex space-x-2">
              <LiveTracker resourcePath={fileDetails.path} />
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStar}
              >
                <Star 
                  className={`mr-1 h-4 w-4 ${isStarred ? "fill-yellow-400 text-yellow-400" : ""}`} 
                />
                {isStarred ? "Starred" : "Star"}
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
              >
                <Download className="mr-1 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Document preview */}
              <div className="mb-6 overflow-hidden rounded-xl border shadow-sm">
                <DocumentView fileDetails={fileDetails} />
              </div>
              
              {/* Tabs */}
              <Tabs 
                defaultValue="files" 
                value={activeTab}
                onValueChange={setActiveTab}
                className="mt-6"
              >
                <TabsList className="mb-4 grid w-full grid-cols-3 lg:grid-cols-6">
                  <TabsTrigger value="files">
                    <FileText className="mr-1 h-4 w-4" />
                    Files
                  </TabsTrigger>
                  <TabsTrigger value="issues">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="downloads">
                    <Download className="mr-1 h-4 w-4" />
                    Download Requests
                  </TabsTrigger>
                  <TabsTrigger value="actions">
                    <Settings className="mr-1 h-4 w-4" />
                    Actions
                  </TabsTrigger>
                  <TabsTrigger value="projects">
                    <Layers className="mr-1 h-4 w-4" />
                    Projects
                  </TabsTrigger>
                  <TabsTrigger value="insights">
                    <BarChart2 className="mr-1 h-4 w-4" />
                    Insights
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="files">
                  <CommentsSection resourcePath={fileDetails.path} user={user} />
                </TabsContent>
                
                <TabsContent value="issues">
                  <IssuesTab resourcePath={fileDetails.path} user={user} />
                </TabsContent>
                
                <TabsContent value="downloads">
                  <DownloadRequestsTab resourcePath={fileDetails.path} user={user} />
                </TabsContent>
                
                <TabsContent value="actions">
                  <ActionsTab resourcePath={fileDetails.path} user={user} />
                </TabsContent>
                
                <TabsContent value="projects">
                  <ProjectsTab resourcePath={fileDetails.path} user={user} />
                </TabsContent>
                
                <TabsContent value="insights">
                  <InsightsTab resourcePath={fileDetails.path} user={user} />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Sidebar */}
            <div>
              <MetadataPanel fileDetails={fileDetails} />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}