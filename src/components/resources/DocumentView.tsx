// src/components/resources/DocumentView.tsx
"use client";

import { useState, useEffect } from "react";
import { FileText, Image, Download, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import NextImage from "next/image";
import { JSX } from "react/jsx-runtime";

interface FileDetails {
  name: string;
  type: string;
  path: string;
  size?: number;
  lastModified?: string;
  extension?: string;
  content?: string;
}

interface DocumentViewProps {
  fileDetails: FileDetails;
}

// Helper function to format bytes to human-readable size
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
};

export default function DocumentView({ fileDetails }: DocumentViewProps): JSX.Element {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  // Generate preview URL for files that can be displayed in browser
  useEffect(() => {
    if (!fileDetails) return;
    
    // For files that can be displayed in browser, generate a preview URL
    const viewableExtensions = ["pdf", "jpg", "jpeg", "png", "gif", "svg"];
    const extension = fileDetails.extension?.toLowerCase() || "";
    
    if (viewableExtensions.includes(extension)) {
      // Since we're using the public folder, we can directly reference the file
      const filePath = `/resources${fileDetails.path}`;
      setPreviewUrl(filePath);
    } else {
      setPreviewUrl(null);
    }
  }, [fileDetails]);

  if (!fileDetails) {
    return (
      <div className="flex h-64 items-center justify-center bg-gray-50 p-8">
        <AlertCircle className="mr-2 h-6 w-6 text-gray-400" />
        <span className="text-gray-500">No file details available</span>
      </div>
    );
  }

  const extension = fileDetails.extension?.toLowerCase() || "";

  // Render different previews based on file type
  const renderPreview = () => {
    // For text-based files with content
    if (fileDetails.content) {
      return (
        <div className="max-h-[600px] overflow-auto bg-gray-50 p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm">
            {fileDetails.content}
          </pre>
        </div>
      );
    }

    // For image files
    if (["jpg", "jpeg", "png", "gif", "svg"].includes(extension) && previewUrl) {
      return (
        <div className="flex items-center justify-center bg-gray-50 p-4">
          <div className="relative h-[600px] max-w-full">
            <NextImage
              src={previewUrl}
              alt={`Preview of ${fileDetails.name}`}
              fill
              style={{ objectFit: "contain" }}
              className="max-h-[600px]"
            />
          </div>
        </div>
      );
    }

    // For PDF files
    if (extension === "pdf" && previewUrl) {
      return (
        <div className="h-[600px] w-full bg-gray-50">
          <iframe
            src={previewUrl}
            title={fileDetails.name}
            className="h-full w-full"
          />
        </div>
      );
    }

    // For documents that can't be previewed
    return (
      <div className="flex h-64 flex-col items-center justify-center bg-gray-50 p-8">
        {getFileIcon(extension)}
        <h3 className="mt-4 text-lg font-medium">{fileDetails.name}</h3>
        {fileDetails.size && (
          <p className="mt-1 text-sm text-gray-500">
            {formatBytes(fileDetails.size)}
          </p>
        )}
        <p className="mt-4 text-sm text-gray-500">
          This file type cannot be previewed directly in the browser.
        </p>
        <Button
          className="mt-4"
          onClick={() => window.open(`/api/resources/download?path=${encodeURIComponent(fileDetails.path)}`, "_blank")}
        >
          <Download className="mr-2 h-4 w-4" />
          Download to View
        </Button>
      </div>
    );
  };

  // Get appropriate icon based on file extension
  const getFileIcon = (extension: string) => {
    switch (extension) {
      case "pdf":
        return <FileText className="h-16 w-16 text-red-500" />;
      case "doc":
      case "docx":
        return <FileText className="h-16 w-16 text-blue-500" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-16 w-16 text-green-500" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-16 w-16 text-orange-500" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        // eslint-disable-next-line jsx-a11y/alt-text
        return <Image className="h-16 w-16 text-purple-500" />;
      default:
        return <FileText className="h-16 w-16 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="border-b bg-white p-4">
        <div className="flex items-center">
          {getFileIcon(extension)}
          <div className="ml-4">
            <h2 className="text-xl font-medium">{fileDetails.name}</h2>
            <div className="mt-1 flex text-sm text-gray-500">
              {fileDetails.size && (
                <span className="mr-4">{formatBytes(fileDetails.size)}</span>
              )}
              {fileDetails.lastModified && (
                <span>
                  Last modified:{" "}
                  {new Date(fileDetails.lastModified).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {renderPreview()}
    </div>
  );
}