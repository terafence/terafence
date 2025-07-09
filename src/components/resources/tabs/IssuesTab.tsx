/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertCircle, Plus, X, MoreHorizontal, ChevronDown, Clock,
  User, Search,
  Trash2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { User as UserType } from "@/hooks/useAuth";

interface IssuesTabProps {
  resourcePath: string;
  user: UserType;
}

interface Issue {
  id: number;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "critical";
  createdBy: {
    name: string;
    email: string;
  };
  assignedTo?: {
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

const availableUsers = [
  { name: "Yash Sejwal", email: "yash@terafence.in" },
  { name: "Jose Yohannan Kurian", email: "jose@terafence.in" },
  { name: "Chandra Shekhar Misra", email: "chandra@terafence.in" },
  { name: "Dinesh Rohilla", email: "dinesh@terafence.in" },
  { name: "Akshat Mangla", email: "akshat@terafence.in" },
  { name: "Samarjit Biswas", email: "samarjit@terafence.in" },
  { name: "Amandeep Arora | Amandeep Chugh | Amandeep", email: "amandeep@terafence.in" },
];

export default function IssuesTab({ resourcePath, user }: IssuesTabProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
  const [newIssue, setNewIssue] = useState<Partial<Issue>>({
    title: "",
    description: "",
    priority: "medium",
    status: "open",
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showIssueDetailDialog, setShowIssueDetailDialog] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const { toast } = useToast();

  // Load issues from localStorage
  useEffect(() => {
    try {
      const storedIssues = localStorage.getItem(`issues_${resourcePath}`);
      if (storedIssues) {
        setIssues(JSON.parse(storedIssues));
      } else {
        localStorage.setItem(`issues_${resourcePath}`, JSON.stringify([]));
        setIssues([]);
      }
    } catch (error) {
      console.error("Error loading issues:", error);
      setIssues([]);
    }
  }, [resourcePath]);

  // Apply filters and search
  useEffect(() => {
    let result = [...issues];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (issue) =>
          issue.title.toLowerCase().includes(query) ||
          issue.description.toLowerCase().includes(query) ||
          issue.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply status filter
    if (statusFilter.length > 0) {
      result = result.filter((issue) => statusFilter.includes(issue.status));
    }
    
    // Apply priority filter
    if (priorityFilter.length > 0) {
      result = result.filter((issue) => priorityFilter.includes(issue.priority));
    }
    
    setFilteredIssues(result);
  }, [issues, searchQuery, statusFilter, priorityFilter]);

  // Save issues to localStorage
  const saveIssues = (updatedIssues: Issue[]) => {
    localStorage.setItem(`issues_${resourcePath}`, JSON.stringify(updatedIssues));
    setIssues(updatedIssues);
  };

  // Create a new issue
  const handleCreateIssue = () => {
    if (!newIssue.title || !newIssue.description) {
      toast({
        title: "Error",
        description: "Title and description are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const issue: Issue = {
        id: Date.now(),
        title: newIssue.title,
        description: newIssue.description,
        status: newIssue.status as "open",
        priority: newIssue.priority as "medium",
        createdBy: {
          name: user.name,
          email: user.email,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: newIssue.tags || [],
      };

      const updatedIssues = [...issues, issue];
      saveIssues(updatedIssues);
      
      // Reset form
      setNewIssue({
        title: "",
        description: "",
        priority: "medium",
        status: "open",
        tags: [],
      });
      
      setShowNewIssueDialog(false);
      
      toast({
        title: "Issue created",
        description: "Your issue has been reported successfully",
      });
    } catch (error) {
      console.error("Error creating issue:", error);
      toast({
        title: "Error",
        description: "Failed to create issue",
        variant: "destructive",
      });
    }
  };

  // Update issue status
  const handleUpdateStatus = (issueId: number, newStatus: Issue["status"]) => {
    try {
      const updatedIssues = issues.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
      
      saveIssues(updatedIssues);
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({
          ...selectedIssue,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        });
      }
      
      toast({
        title: "Status updated",
        description: `Issue status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error("Error updating issue status:", error);
      toast({
        title: "Error",
        description: "Failed to update issue status",
        variant: "destructive",
      });
    }
  };

  // Assign issue to user
  const handleAssignIssue = (issueId: number, assignee: { name: string; email: string }) => {
    try {
      const updatedIssues = issues.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            assignedTo: assignee,
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
      
      saveIssues(updatedIssues);
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({
          ...selectedIssue,
          assignedTo: assignee,
          updatedAt: new Date().toISOString(),
        });
      }
      
      toast({
        title: "Issue assigned",
        description: `Issue assigned to ${assignee.name}`,
      });
    } catch (error) {
      console.error("Error assigning issue:", error);
      toast({
        title: "Error",
        description: "Failed to assign issue",
        variant: "destructive",
      });
    }
  };

  // Add tag to issue
  const handleAddTag = (issueId: number) => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      const tag = newTagName.trim();
      
      const updatedIssues = issues.map((issue) => {
        if (issue.id === issueId) {
          // Check if tag already exists
          if (issue.tags.includes(tag)) {
            throw new Error("Tag already exists");
          }
          
          return {
            ...issue,
            tags: [...issue.tags, tag],
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
      
      saveIssues(updatedIssues);
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({
          ...selectedIssue,
          tags: [...selectedIssue.tags, tag],
          updatedAt: new Date().toISOString(),
        });
      }
      
      setNewTagName("");
      
      toast({
        title: "Tag added",
        description: `Tag "${tag}" added to issue`,
      });
    } catch (error) {
      console.error("Error adding tag:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add tag",
        variant: "destructive",
      });
    }
  };

  // Remove tag from issue
  const handleRemoveTag = (issueId: number, tag: string) => {
    try {
      const updatedIssues = issues.map((issue) => {
        if (issue.id === issueId) {
          return {
            ...issue,
            tags: issue.tags.filter((t) => t !== tag),
            updatedAt: new Date().toISOString(),
          };
        }
        return issue;
      });
      
      saveIssues(updatedIssues);
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setSelectedIssue({
          ...selectedIssue,
          tags: selectedIssue.tags.filter((t) => t !== tag),
          updatedAt: new Date().toISOString(),
        });
      }
      
      toast({
        title: "Tag removed",
        description: `Tag "${tag}" removed from issue`,
      });
    } catch (error) {
      console.error("Error removing tag:", error);
      toast({
        title: "Error",
        description: "Failed to remove tag",
        variant: "destructive",
      });
    }
  };

  // Delete issue
  const handleDeleteIssue = (issueId: number) => {
    try {
      const updatedIssues = issues.filter((issue) => issue.id !== issueId);
      saveIssues(updatedIssues);
      
      if (selectedIssue && selectedIssue.id === issueId) {
        setShowIssueDetailDialog(false);
        setSelectedIssue(null);
      }
      
      toast({
        title: "Issue deleted",
        description: "Issue has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting issue:", error);
      toast({
        title: "Error",
        description: "Failed to delete issue",
        variant: "destructive",
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) => 
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Toggle priority filter
  const togglePriorityFilter = (priority: string) => {
    setPriorityFilter((prev) => 
      prev.includes(priority)
        ? prev.filter((p) => p !== priority)
        : [...prev, priority]
    );
  };

  // Status badge color
  const getStatusColor = (status: Issue["status"]) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Priority badge color
  const getPriorityColor = (priority: Issue["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-gray-100 text-gray-800";
      case "medium":
        return "bg-blue-100 text-blue-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "critical":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <AlertCircle className="mr-2 inline-block h-5 w-5" />
          Issues ({issues.length})
        </h3>
        <Button onClick={() => setShowNewIssueDialog(true)}>
          <Plus className="mr-1 h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Filters */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Status filters */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Status</h4>
            <div className="flex flex-wrap gap-2">
              {["open", "in-progress", "resolved", "closed"].map((status) => (
                <div key={status} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status}`}
                    checked={statusFilter.includes(status)}
                    onCheckedChange={() => toggleStatusFilter(status)}
                  />
                  <label
                    htmlFor={`status-${status}`}
                    className="cursor-pointer text-sm font-medium capitalize"
                  >
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Priority filters */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">Priority</h4>
            <div className="flex flex-wrap gap-2">
              {["low", "medium", "high", "critical"].map((priority) => (
                <div key={priority} className="flex items-center space-x-2">
                  <Checkbox
                    id={`priority-${priority}`}
                    checked={priorityFilter.includes(priority)}
                    onCheckedChange={() => togglePriorityFilter(priority)}
                  />
                  <label
                    htmlFor={`priority-${priority}`}
                    className="cursor-pointer text-sm font-medium capitalize"
                  >
                    {priority}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Issues list */}
      <AnimatePresence>
        {filteredIssues.length > 0 ? (
          <div className="space-y-4">
            {filteredIssues.map((issue) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:shadow-md"
                onClick={() => {
                  setSelectedIssue(issue);
                  setShowIssueDetailDialog(true);
                }}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-base font-medium text-gray-900">{issue.title}</h4>
                  <div className="flex items-center space-x-2">
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(issue.status)}`}>
                      {issue.status}
                    </span>
                    <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getPriorityColor(issue.priority)}`}>
                      {issue.priority}
                    </span>
                  </div>
                </div>
                
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">
                  {issue.description}
                </p>
                
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>Opened on {formatDate(issue.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">By:</span>
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">
                        {issue.createdBy.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">{issue.createdBy.name}</span>
                  </div>
                </div>
                
                {issue.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {issue.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <AlertCircle className="mb-2 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No Issues Found</h3>
            <p className="text-sm text-gray-500">
              {issues.length > 0
                ? "No issues match your current filters."
                : "There are no issues reported for this resource yet."}
            </p>
            {issues.length === 0 && (
              <Button
                className="mt-4"
                onClick={() => setShowNewIssueDialog(true)}
              >
                <Plus className="mr-1 h-4 w-4" />
                Report First Issue
              </Button>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* New issue dialog */}
      <Dialog open={showNewIssueDialog} onOpenChange={setShowNewIssueDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label
                htmlFor="issue-title"
                className="text-sm font-medium text-gray-700"
              >
                Title
              </label>
              <Input
                id="issue-title"
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                placeholder="Brief summary of the issue"
              />
            </div>
            
            <div className="space-y-2">
              <label
                htmlFor="issue-description"
                className="text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Textarea
                id="issue-description"
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                placeholder="Detailed description of the issue"
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="issue-priority"
                  className="text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <select
                  id="issue-priority"
                  value={newIssue.priority}
                  onChange={(e) => setNewIssue({ ...newIssue, priority: e.target.value as any })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label
                  htmlFor="issue-tags"
                  className="text-sm font-medium text-gray-700"
                >
                  Tags (comma separated)
                </label>
                <Input
                  id="issue-tags"
                  placeholder="e.g., bug, ui, feature"
                  onChange={(e) => {
                    const tagsArray = e.target.value
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean);
                    setNewIssue({ ...newIssue, tags: tagsArray });
                  }}
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewIssueDialog(false);
                  setNewIssue({
                    title: "",
                    description: "",
                    priority: "medium",
                    status: "open",
                    tags: [],
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateIssue}>Submit Issue</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Issue detail dialog */}
      {selectedIssue && (
        <Dialog open={showIssueDetailDialog} onOpenChange={setShowIssueDetailDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Issue Details</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-semibold">{selectedIssue.title}</h2>
                
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        Status: <span className="ml-1 capitalize">{selectedIssue.status}</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedIssue.id, "open")}>
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedIssue.id, "in-progress")}>
                        In Progress
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedIssue.id, "resolved")}>
                        Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(selectedIssue.id, "closed")}>
                        Closed
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(user.email === selectedIssue.createdBy.email || user.isAdmin) && (
                        <>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteIssue(selectedIssue.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Issue
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => {
                        // In a real app, this would export to PDF or similar
                        toast({
                          title: "Feature not implemented",
                          description: "Export functionality would be implemented in a production version",
                        });
                      }}>
                        Export Issue
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Description</h3>
                    <p className="whitespace-pre-wrap text-sm text-gray-600">
                      {selectedIssue.description}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Details</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs text-gray-500">Priority:</span>
                        <span className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getPriorityColor(selectedIssue.priority)}`}>
                          {selectedIssue.priority}
                        </span>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">Created by:</span>
                        <div className="mt-1 flex items-center space-x-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {selectedIssue.createdBy.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-medium">{selectedIssue.createdBy.name}</span>
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">Created on:</span>
                        <div className="mt-1 text-xs">
                          {formatDate(selectedIssue.createdAt)}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-xs text-gray-500">Last updated:</span>
                        <div className="mt-1 text-xs">
                          {formatDate(selectedIssue.updatedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <h3 className="mb-2 text-sm font-medium text-gray-700">Assigned To</h3>
                    
                    {selectedIssue.assignedTo ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback>
                              {selectedIssue.assignedTo.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{selectedIssue.assignedTo.name}</span>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleAssignIssue(selectedIssue.id, {
                                name: "",
                                email: "",
                              })}
                            >
                              Unassign
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    ) : (
                      <div>
                        <span className="text-sm text-gray-500">Not assigned</span>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="mt-2 w-full">
                              <User className="mr-2 h-4 w-4" />
                              Assign Issue
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {availableUsers.map((assignee) => (
                              <DropdownMenuItem
                                key={assignee.email}
                                onClick={() => handleAssignIssue(selectedIssue.id, assignee)}
                              >
                                {assignee.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    )}
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">Tags</h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {selectedIssue.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                        >
                          {tag}
                          <button
                            className="ml-1 rounded-full p-0.5 hover:bg-gray-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTag(selectedIssue.id, tag);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      
                      {selectedIssue.tags.length === 0 && (
                        <span className="text-xs text-gray-500">No tags</span>
                      )}
                    </div>
                    
                    <div className="mt-3 flex">
                      <Input
                        value={newTagName}
                        onChange={(e) => setNewTagName(e.target.value)}
                        placeholder="Add a tag"
                        className="text-xs"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-2"
                        onClick={() => handleAddTag(selectedIssue.id)}
                        disabled={!newTagName.trim()}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}