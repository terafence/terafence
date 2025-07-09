// src/components/resources/UploadForm.tsx
"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FilePlus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { User } from "@/hooks/useAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface UploadFormProps {
  currentPath: string;
  user: User;
}

export default function UploadForm({ currentPath }: UploadFormProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileContent, setNewFileContent] = useState("");
  const [fileType, setFileType] = useState("txt");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Handle drag events
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // Handle file drop
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const { files } = e.dataTransfer;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  // Handle file selection from dialog
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length > 0) {
      await uploadFiles(files);
    }
  };

  // Upload files to server
  const uploadFiles = async (files: FileList) => {
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append("path", currentPath);
      
      // Add all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }

      // Create XMLHttpRequest to track progress
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      // Create a promise to handle the upload
      const uploadPromise = new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };
        xhr.onerror = () => reject(new Error("Network error occurred"));
      });

      xhr.open("POST", "/api/resources/upload", true);
      xhr.send(formData);

      await uploadPromise;

      toast({
        title: "Upload successful",
        description: `${files.length} file${files.length > 1 ? "s" : ""} uploaded successfully`,
      });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Refresh the file list (handle through parent component)
      window.location.reload();
    } catch (error) {
      console.error("Error uploading files:", error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Error uploading files",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  // Handle creating a new text file
  const handleCreateFile = async () => {
    if (!newFileName.trim()) {
      toast({
        title: "Error",
        description: "File name is required",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert the content to a Blob
      const blob = new Blob([newFileContent], { type: "text/plain" });
      
      // Create a file object with proper extension
      const extension = fileType || "txt";
      const fileName = newFileName.endsWith(`.${extension}`) 
        ? newFileName 
        : `${newFileName}.${extension}`;
      
      const file = new File([blob], fileName, { type: "text/plain" });
      
      const formData = new FormData();
      formData.append("path", currentPath);
      formData.append("files", file);

      const response = await fetch("/api/resources/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create file");
      }

      toast({
        title: "Success",
        description: `File "${fileName}" created successfully`,
      });

      // Close dialog and reset form
      setShowCreateFileDialog(false);
      setNewFileName("");
      setNewFileContent("");
      setFileType("txt");

      // Refresh the file list
      window.location.reload();
    } catch (error) {
      console.error("Error creating file:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create file",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Upload Files</h2>
        
        <div className="flex gap-2">
          <Dialog open={showCreateFileDialog} onOpenChange={setShowCreateFileDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <FilePlus className="mr-2 h-4 w-4" />
                Create New File
              </Button>
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Text File</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-3">
                    <label htmlFor="fileName" className="text-sm font-medium text-gray-700">
                      File Name
                    </label>
                    <Input
                      id="fileName"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder="Enter file name"
                    />
                  </div>
                  <div>
                    <label htmlFor="fileType" className="text-sm font-medium text-gray-700">
                      Type
                    </label>
                    <Select value={fileType} onValueChange={setFileType}>
                      <SelectTrigger id="fileType">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="txt">TXT</SelectItem>
                        <SelectItem value="md">MD</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="html">HTML</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="fileContent" className="text-sm font-medium text-gray-700">
                    Content
                  </label>
                  <Textarea
                    id="fileContent"
                    rows={10}
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    placeholder="Enter file content"
                    className="resize-none"
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCreateFileDialog(false);
                      setNewFileName("");
                      setNewFileContent("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFile} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create File"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          <Button size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        multiple
        className="hidden"
      />

      {/* Drag and drop area */}
      <motion.div
        className={`mt-4 cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        animate={{ backgroundColor: dragging ? "#EFF6FF" : "#FFFFFF" }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center">
          <Upload className="mb-2 h-10 w-10 text-gray-400" />
          
          {uploading ? (
            <div className="text-center">
              <div className="mb-2 text-sm font-medium text-gray-700">
                Uploading... {progress}%
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-1 text-lg font-medium text-gray-700">
                Drop files here or click to browse
              </p>
              <p className="text-sm text-gray-500">
                Support for documents, images, and other files
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}