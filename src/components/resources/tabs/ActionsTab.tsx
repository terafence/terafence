"use client";

import { useState } from "react";
import { Settings, Clock, FileText, Download, Upload, Trash2, Link, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/useAuth";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ActionsTabProps {
  resourcePath: string;
  user: User;
}

export default function ActionsTab({ resourcePath, user }: ActionsTabProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGeneratingShareLink, setIsGeneratingShareLink] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const { toast } = useToast();

  const handleDelete = () => {
    // In a real app, this would call an API to delete the resource
    toast({
      title: "Resource deleted",
      description: "The resource has been deleted successfully",
    });
    setIsDeleteDialogOpen(false);
    // Would redirect back to the resources page in a real app
  };

  const handleGenerateShareLink = () => {
    setIsGeneratingShareLink(true);
    
    // Simulate API call
    setTimeout(() => {
      const generatedLink = `https://terafence.in/shared/resources/${btoa(resourcePath)}`;
      setShareLink(generatedLink);
      setIsGeneratingShareLink(false);
    }, 1500);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Link copied",
      description: "Share link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <Settings className="mr-2 inline-block h-5 w-5" />
          Actions & Operations
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Download className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Download</h3>
          <p className="mb-4 text-sm text-gray-500">
            Download the current version of this resource to your device.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              window.open(`/api/resources/download?path=${encodeURIComponent(resourcePath)}`, "_blank");
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Download File
          </Button>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Upload className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Upload New Version</h3>
          <p className="mb-4 text-sm text-gray-500">
            Upload a new version of this file while preserving history.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Feature in development",
                description: "Version control will be available in a future update",
              });
            }}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload New Version
          </Button>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Version History</h3>
          <p className="mb-4 text-sm text-gray-500">
            View and restore previous versions of this resource.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Feature in development",
                description: "Version history will be available in a future update",
              });
            }}
          >
            <Clock className="mr-2 h-4 w-4" />
            View History
          </Button>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
            <Share2 className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Share</h3>
          <p className="mb-4 text-sm text-gray-500">
            Generate a shareable link for this resource.
          </p>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Generate Share Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Resource</DialogTitle>
                <DialogDescription>
                  Generate a shareable link for this resource.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                {shareLink ? (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Shareable Link</label>
                    <div className="flex">
                      <Input value={shareLink} readOnly className="flex-1" />
                      <Button className="ml-2" onClick={handleCopyLink}>
                        Copy
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      This link will grant view-only access to the resource.
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="mb-4 text-sm text-gray-500">
                      Generate a unique shareable link that will allow others to access this resource.
                    </p>
                    <Button 
                      onClick={handleGenerateShareLink}
                      disabled={isGeneratingShareLink}
                    >
                      {isGeneratingShareLink ? (
                        <>Generating...</>
                      ) : (
                        <>
                          <Link className="mr-2 h-4 w-4" />
                          Generate Link
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <FileText className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="mb-2 text-lg font-medium">Properties</h3>
          <p className="mb-4 text-sm text-gray-500">
            View and edit resource properties and metadata.
          </p>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              toast({
                title: "Feature in development",
                description: "Properties editor will be available in a future update",
              });
            }}
          >
            <FileText className="mr-2 h-4 w-4" />
            Edit Properties
          </Button>
        </div>

        {user.isAdmin && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Delete</h3>
            <p className="mb-4 text-sm text-gray-500">
              Permanently delete this resource (admin only).
            </p>
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="destructive"
                  className="w-full"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Resource
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Resource</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this resource? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    Delete Permanently
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}