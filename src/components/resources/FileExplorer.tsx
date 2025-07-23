/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/resources/FileExplorer.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  File, Folder, Star, MoreHorizontal, FileText, 
  Download, Trash2, Edit} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/useAuth";

interface FileExplorerProps {
  currentPath: string;
  onPathChange: (path: string) => void;
  searchQuery: string;
  user: User;
}

interface FileItem {
  name: string;
  type: 'file' | 'folder';
  path: string;
  size?: number;
  lastModified?: string;
  extension?: string;
  starred?: boolean;
}

// Helper function to format bytes to human-readable size
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

export default function FileExplorer({ 
  currentPath, 
  onPathChange, 
  searchQuery}: FileExplorerProps) {
  const [items, setItems] = useState<FileItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FileItem | null>(null);
  const [showNewFolderDialog, setShowNewFolderDialog] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [newName, setNewName] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  // Fetch files and folders for current path
  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        // Make API call to fetch real files and folders
        const response = await fetch(`/api/resources?path=${encodeURIComponent(currentPath)}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.statusText}`);
        }
        
        const data = await response.json();
        setItems(data.items);
      } catch (error) {
        console.error("Error fetching files:", error);
        toast({
          title: "Error",
          description: "Failed to load files and folders",
          variant: "destructive",
        });
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [currentPath, toast]);

  // Filter items based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredItems(items);
      return;
    }

    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    setFilteredItems(filtered);
  }, [items, searchQuery]);

  // Handle item click
  const handleItemClick = (item: FileItem) => {
    if (item.type === "folder") {
      onPathChange(`${item.path}/`);
    } else {
      // Navigate to the file detail page
      const fileId = encodeURIComponent(item.path);
      router.push(`/resources/${fileId}`);
      
      // Add to recently viewed in localStorage
      const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed") || "[]");
      
      const newView = {
        path: `/resources/${fileId}`,
        name: item.name,
        type: item.type,
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
  };

  // Create new folder
  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      toast({
        title: "Error",
        description: "Folder name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/resources/folder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: currentPath,
          name: newFolderName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create folder");
      }

      toast({
        title: "Success",
        description: `Folder "${newFolderName}" created successfully`,
      });

      // Refresh the file list
      const updatedResponse = await fetch(`/api/resources?path=${encodeURIComponent(currentPath)}`);
      const data = await updatedResponse.json();
      setItems(data.items);
      
      // Close dialog and reset form
      setShowNewFolderDialog(false);
      setNewFolderName("");
    } catch (error) {
      console.error("Error creating folder:", error);
      toast({
        title: "Error",
        description: "Failed to create folder",
        variant: "destructive",
      });
    }
  };

  // Rename file/folder
  const handleRename = async () => {
    if (!selectedItem) return;
    
    if (!newName.trim()) {
      toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/resources/rename", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: selectedItem.path,
          newName: newName,
          type: selectedItem.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to rename item");
      }

      toast({
        title: "Success",
        description: `"${selectedItem.name}" renamed to "${newName}"`,
      });

      // Refresh the file list
      const updatedResponse = await fetch(`/api/resources?path=${encodeURIComponent(currentPath)}`);
      const data = await updatedResponse.json();
      setItems(data.items);
      
      // Close dialog and reset form
      setShowRenameDialog(false);
      setNewName("");
      setSelectedItem(null);
    } catch (error) {
      console.error("Error renaming item:", error);
      toast({
        title: "Error",
        description: "Failed to rename item",
        variant: "destructive",
      });
    }
  };

  // Delete file/folder
  const handleDelete = async (item: FileItem) => {
    try {
      const response = await fetch("/api/resources", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: item.path,
          type: item.type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete item");
      }

      toast({
        title: "Success",
        description: `"${item.name}" deleted successfully`,
      });

      // Refresh the file list
      const updatedResponse = await fetch(`/api/resources?path=${encodeURIComponent(currentPath)}`);
      const data = await updatedResponse.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  // Get icon for file based on extension
  const getFileIcon = (extension?: string) => {
    switch (extension?.toLowerCase()) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'docx':
      case 'doc':
        return <FileText className="text-blue-500" />;
      case 'xlsx':
      case 'xls':
        return <FileText className="text-green-500" />;
      case 'pptx':
      case 'ppt':
        return <FileText className="text-orange-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return <FileText className="text-purple-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  // Download file
  const handleDownload = async (item: FileItem) => {
    if (item.type !== 'file') return;
    
    try {
      window.open(`/api/resources/download?path=${encodeURIComponent(item.path)}`, '_blank');
      
      toast({
        title: "Success",
        description: `Downloading "${item.name}"`,
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

  return (
    <div className="mt-6">
      <div className="mb-4 flex justify-between">
        <h3 className="text-lg font-medium">Files & Folders</h3>
        <Button
          size="sm"
          onClick={() => setShowNewFolderDialog(true)}
        >
          New Folder
        </Button>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-xl border p-4">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredItems.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="group cursor-pointer rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md"
                onClick={() => handleItemClick(item)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {item.type === "folder" ? (
                      <Folder className="h-10 w-10 text-blue-500" />
                    ) : (
                      getFileIcon(item.extension)
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {item.type === "file" && item.size
                          ? formatBytes(item.size)
                          : item.type === "folder"
                          ? "Folder"
                          : "File"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 transition-opacity group-hover:opacity-100">
                    {item.starred && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {item.type === "file" && (
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(item);
                          }}>
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          setSelectedItem(item);
                          setNewName(item.name);
                          setShowRenameDialog(true);
                        }}>
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item);
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                
                {item.lastModified && (
                  <p className="mt-2 text-xs text-gray-500">
                    Last modified: {new Date(item.lastModified).toLocaleDateString()}
                  </p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Folder className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-1 text-lg font-medium text-gray-900">No items found</h3>
          <p className="text-sm text-gray-500">
            {searchQuery
              ? "No matching files or folders for your search query."
              : "This folder is empty."}
          </p>
        </div>
      )}
      
      {/* New Folder Dialog */}
      <Dialog open={showNewFolderDialog} onOpenChange={setShowNewFolderDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="folderName"
                className="text-sm font-medium text-gray-700"
              >
                Folder Name
              </label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewFolderDialog(false);
                  setNewFolderName("");
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateFolder}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Rename Dialog */}
      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename {selectedItem?.type === "folder" ? "Folder" : "File"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="newName"
                className="text-sm font-medium text-gray-700"
              >
                New Name
              </label>
              <Input
                id="newName"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRenameDialog(false);
                  setNewName("");
                  setSelectedItem(null);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleRename}>Rename</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}