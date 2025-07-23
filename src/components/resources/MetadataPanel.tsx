"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Info, Users, Link as LinkIcon, Edit,
  Plus, X, Check, Tag, 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface FileDetails {
  name: string;
  type: string;
  path: string;
  size?: number;
  lastModified?: string;
  extension?: string;
}

interface MetadataPanelProps {
  fileDetails: FileDetails;
}

// Sample contributors for demo (in a real app, these would come from an API)
const initialContributors = [
  { name: "Yash", email: "yash@terafence.in", role: "Owner" },
  { name: "Jose", email: "jose@terafence.in", role: "Editor" },
];

// Sample tags for the document (in a real app, these would come from an API)
const initialTags = [
  { id: 1, name: "Security" },
  { id: 2, name: "Protocols" },
  { id: 3, name: "Compliance" },
];

// Sample related links (in a real app, these would come from an API)
const initialRelatedLinks = [
  { id: 1, title: "Security Guidelines", url: "/resources/security-guidelines.pdf" },
  { id: 2, title: "Implementation Guide", url: "/resources/implementation-guide.docx" },
];

export default function MetadataPanel({ }: MetadataPanelProps) {
  const [aboutDocument, setAboutDocument] = useState<string>(
    "This document provides information related to the project."
  );
  const [editingAbout, setEditingAbout] = useState(false);
  const [newAboutText, setNewAboutText] = useState(aboutDocument);
  
  const [contributors, setContributors] = useState(initialContributors);
  const [showAddContributor, setShowAddContributor] = useState(false);
  const [newContributor, setNewContributor] = useState({ name: "", email: "", role: "Viewer" });
  
  const [tags, setTags] = useState(initialTags);
  const [newTagName, setNewTagName] = useState("");
  const [showAddTag, setShowAddTag] = useState(false);
  
  const [relatedLinks, setRelatedLinks] = useState(initialRelatedLinks);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  
  const { toast } = useToast();

  // Save about section
  const handleSaveAbout = () => {
    setAboutDocument(newAboutText);
    setEditingAbout(false);
    
    toast({
      title: "Changes saved",
      description: "Document information has been updated",
    });
  };

  // Add a new contributor
  const handleAddContributor = () => {
    if (!newContributor.name || !newContributor.email) {
      toast({
        title: "Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }
    
    // Validate email format
    if (!newContributor.email.endsWith("@terafence.in")) {
      toast({
        title: "Error",
        description: "Only @terafence.in email addresses are allowed",
        variant: "destructive",
      });
      return;
    }
    
    setContributors([...contributors, newContributor]);
    setNewContributor({ name: "", email: "", role: "Viewer" });
    setShowAddContributor(false);
    
    toast({
      title: "Contributor added",
      description: `${newContributor.name} has been added as a contributor`,
    });
  };

  // Remove a contributor
  const handleRemoveContributor = (email: string) => {
    setContributors(contributors.filter(c => c.email !== email));
    
    toast({
      title: "Contributor removed",
      description: "The contributor has been removed",
    });
  };

  // Add a new tag
  const handleAddTag = () => {
    if (!newTagName.trim()) {
      toast({
        title: "Error",
        description: "Tag name is required",
        variant: "destructive",
      });
      return;
    }
    
    // Check if tag already exists
    if (tags.some(tag => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      toast({
        title: "Error",
        description: "This tag already exists",
        variant: "destructive",
      });
      return;
    }
    
    const newTag = {
      id: Date.now(),
      name: newTagName.trim(),
    };
    
    setTags([...tags, newTag]);
    setNewTagName("");
    setShowAddTag(false);
    
    toast({
      title: "Tag added",
      description: `"${newTagName}" has been added as a tag`,
    });
  };

  // Remove a tag
  const handleRemoveTag = (id: number) => {
    setTags(tags.filter(tag => tag.id !== id));
    
    toast({
      title: "Tag removed",
      description: "The tag has been removed",
    });
  };

  // Add a related link
  const handleAddRelatedLink = () => {
    if (!newLink.title.trim() || !newLink.url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }
    
    const newRelatedLink = {
      id: Date.now(),
      title: newLink.title.trim(),
      url: newLink.url.trim(),
    };
    
    setRelatedLinks([...relatedLinks, newRelatedLink]);
    setNewLink({ title: "", url: "" });
    setShowAddLink(false);
    
    toast({
      title: "Link added",
      description: `"${newLink.title}" has been added as a related link`,
    });
  };

  // Remove a related link
  const handleRemoveRelatedLink = (id: number) => {
    setRelatedLinks(relatedLinks.filter(link => link.id !== id));
    
    toast({
      title: "Link removed",
      description: "The related link has been removed",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border bg-white shadow-sm"
    >
      <Accordion type="multiple" defaultValue={["about", "contributors", "related", "tags"]}>
        {/* About This Document */}
        <AccordionItem value="about">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center">
              <Info className="mr-2 h-4 w-4 text-gray-500" />
              <span>About this document</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            {editingAbout ? (
              <div className="space-y-2">
                <textarea
                  value={newAboutText}
                  onChange={(e) => setNewAboutText(e.target.value)}
                  className="h-24 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  placeholder="Enter document description..."
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingAbout(false);
                      setNewAboutText(aboutDocument);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSaveAbout}
                  >
                    Save
                  </Button>
                </div>
              </div>
            ) : (
              <div className="group relative">
                <p className="text-sm text-gray-600">{aboutDocument}</p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    setEditingAbout(true);
                    setNewAboutText(aboutDocument);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Contributors */}
        <AccordionItem value="contributors">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-gray-500" />
              <span>Contributors</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {contributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <div>
                    <p className="text-sm font-medium">{contributor.name}</p>
                    <p className="text-xs text-gray-500">{contributor.email} • {contributor.role}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveContributor(contributor.email)}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              ))}
              
              {showAddContributor ? (
                <div className="space-y-2 rounded-md border p-3">
                  <Input
                    placeholder="Name"
                    value={newContributor.name}
                    onChange={(e) => setNewContributor({ ...newContributor, name: e.target.value })}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Email (@terafence.in)"
                    value={newContributor.email}
                    onChange={(e) => setNewContributor({ ...newContributor, email: e.target.value })}
                    className="text-sm"
                  />
                  <select
                    value={newContributor.role}
                    onChange={(e) => setNewContributor({ ...newContributor, role: e.target.value })}
                    className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm"
                  >
                    <option value="Owner">Owner</option>
                    <option value="Editor">Editor</option>
                    <option value="Viewer">Viewer</option>
                  </select>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddContributor(false);
                        setNewContributor({ name: "", email: "", role: "Viewer" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddContributor}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAddContributor(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Contributor
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Related Links */}
        <AccordionItem value="related">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center">
              <LinkIcon className="mr-2 h-4 w-4 text-gray-500" />
              <span>Related links</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              {relatedLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between rounded-md bg-gray-50 p-2">
                  <a
                    href={link.url}
                    className="text-sm text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </a>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveRelatedLink(link.id)}
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-red-500" />
                  </Button>
                </div>
              ))}
              
              {showAddLink ? (
                <div className="space-y-2 rounded-md border p-3">
                  <Input
                    placeholder="Link Title"
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    className="text-sm"
                  />
                  <Input
                    placeholder="URL"
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    className="text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddLink(false);
                        setNewLink({ title: "", url: "" });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddRelatedLink}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowAddLink(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Link
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
        
        {/* Tags */}
        <AccordionItem value="tags">
          <AccordionTrigger className="px-4 py-3">
            <div className="flex items-center">
              <Tag className="mr-2 h-4 w-4 text-gray-500" />
              <span>Tags</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <div 
                    key={tag.id} 
                    className="flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700"
                  >
                    {tag.name}
                    <button 
                      onClick={() => handleRemoveTag(tag.id)}
                      className="ml-1 rounded-full p-1 hover:bg-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              
              {showAddTag ? (
                <div className="mt-2 space-y-2">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="text-sm"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowAddTag(false);
                        setNewTagName("");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleAddTag}
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full"
                  onClick={() => setShowAddTag(true)}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Tag
                </Button>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}