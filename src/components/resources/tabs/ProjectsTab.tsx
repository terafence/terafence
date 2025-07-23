/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Layers, Plus, Calendar, Users, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ProjectsTabProps {
  resourcePath: string;
  user: User;
}

interface Project {
  id: number;
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  status: "planning" | "active" | "completed" | "on-hold";
  members: { name: string; email: string }[];
  tags: string[];
}

export default function ProjectsTab({ user }: ProjectsTabProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showAddProjectDialog, setShowAddProjectDialog] = useState(false);
  const [newProject, setNewProject] = useState<Partial<Project>>({
    name: "",
    description: "",
    startDate: new Date().toISOString().split("T")[0],
    status: "planning",
    members: [{ name: user.name, email: user.email }],
    tags: [],
  });
  const { toast } = useToast();

  const handleAddProject = () => {
    if (!newProject.name || !newProject.description) {
      toast({
        title: "Error",
        description: "Project name and description are required",
        variant: "destructive",
      });
      return;
    }

    const project: Project = {
      id: Date.now(),
      name: newProject.name,
      description: newProject.description,
      startDate: newProject.startDate || new Date().toISOString().split("T")[0],
      status: newProject.status as "planning",
      members: newProject.members || [{ name: user.name, email: user.email }],
      tags: newProject.tags || [],
    };

    setProjects([...projects, project]);
    setShowAddProjectDialog(false);
    setNewProject({
      name: "",
      description: "",
      startDate: new Date().toISOString().split("T")[0],
      status: "planning",
      members: [{ name: user.name, email: user.email }],
      tags: [],
    });

    toast({
      title: "Project added",
      description: "The project has been added successfully",
    });
  };

  const getStatusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "on-hold":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <Layers className="mr-2 inline-block h-5 w-5" />
          Associated Projects
        </h3>
        <Button onClick={() => setShowAddProjectDialog(true)}>
          <Plus className="mr-1 h-4 w-4" />
          New Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {projects.map(project => (
            <div key={project.id} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h4 className="text-xl font-medium">{project.name}</h4>
                <span className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
              </div>
              
              <p className="mb-4 text-sm text-gray-600">{project.description}</p>
              
              <div className="mb-4 space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span>Started: {new Date(project.startDate).toLocaleDateString()}</span>
                </div>
                
                {project.endDate && (
                  <div className="flex items-center text-sm">
                    <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                    <span>Due: {new Date(project.endDate).toLocaleDateString()}</span>
                  </div>
                )}
                
                <div className="flex items-center text-sm">
                  <Users className="mr-2 h-4 w-4 text-gray-500" />
                  <span>{project.members.length} team members</span>
                </div>
              </div>
              
              {project.tags.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <Button variant="outline" className="w-full" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                View Project Details
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12">
          <Layers className="mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-1 text-lg font-medium text-gray-900">No Projects Yet</h3>
          <p className="text-sm text-gray-500">
            This resource is not associated with any projects.
          </p>
          <Button
            className="mt-4"
            onClick={() => setShowAddProjectDialog(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Create New Project
          </Button>
        </div>
      )}

      {/* Add Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Project Name
              </label>
              <Input
                value={newProject.name || ""}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Description
              </label>
              <Textarea
                value={newProject.description || ""}
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                placeholder="Describe the project purpose and goals"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <Input
                  type="date"
                  value={newProject.startDate || ""}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={newProject.status || "planning"}
                  onChange={(e) => setNewProject({ ...newProject, status: e.target.value as any })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tags (comma separated)
              </label>
              <Input
                placeholder="e.g., security, compliance, development"
                onChange={(e) => {
                  const tagsArray = e.target.value
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean);
                  setNewProject({ ...newProject, tags: tagsArray });
                }}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddProjectDialog(false);
                  setNewProject({
                    name: "",
                    description: "",
                    startDate: new Date().toISOString().split("T")[0],
                    status: "planning",
                    members: [{ name: user.name, email: user.email }],
                    tags: [],
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleAddProject}>Create Project</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}