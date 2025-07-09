/* eslint-disable @typescript-eslint/no-unused-vars */
// src/components/resources/CommentsSection.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, 
  Send, MoreHorizontal, Trash2, Reply, Flag,
  ThumbsUp, Edit 
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { User } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { JSX } from "react/jsx-runtime";


interface CommentsProps {
  resourcePath: string;
  user: User;
}

interface Comment {
  id: number;
  content: string;
  author: {
    name: string;
    email: string;
    isAdmin: boolean;
  };
  createdAt: string;
  upvotes: number;
  upvotedBy: string[];
  replies: Comment[];
}

export default function CommentsSection({ resourcePath, user }: CommentsProps): JSX.Element {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch comments for this resource
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // In a real implementation, this would be an API call
        // For demo purposes, we'll simulate it with localStorage
        const storedComments = localStorage.getItem(`comments_${resourcePath}`);
        
        if (storedComments) {
          setComments(JSON.parse(storedComments));
        } else {
          // Initialize with empty array
          localStorage.setItem(`comments_${resourcePath}`, JSON.stringify([]));
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
      }
    };

    fetchComments();
  }, [resourcePath, toast]);

  // Save comments to localStorage
  const saveComments = (updatedComments: Comment[]) => {
    localStorage.setItem(`comments_${resourcePath}`, JSON.stringify(updatedComments));
    setComments(updatedComments);
  };

  // Add a new comment
  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const comment: Comment = {
        id: Date.now(),
        content: newComment.trim(),
        author: {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        upvotedBy: [],
        replies: [],
      };

      const updatedComments = [...comments, comment];
      saveComments(updatedComments);
      setNewComment("");
      
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add a reply to a comment
  const handleAddReply = (commentId: number) => {
    if (!replyContent.trim()) {
      toast({
        title: "Error",
        description: "Reply cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const reply: Comment = {
        id: Date.now(),
        content: replyContent.trim(),
        author: {
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        },
        createdAt: new Date().toISOString(),
        upvotes: 0,
        upvotedBy: [],
        replies: [],
      };

      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply],
          };
        }
        return comment;
      });

      saveComments(updatedComments);
      setReplyingTo(null);
      setReplyContent("");
      
      toast({
        title: "Reply added",
        description: "Your reply has been added successfully",
      });
    } catch (error) {
      console.error("Error adding reply:", error);
      toast({
        title: "Error",
        description: "Failed to add reply",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit a comment
  const handleEditComment = (commentId: number, isReply = false, parentId?: number) => {
    if (!editContent.trim()) {
      toast({
        title: "Error",
        description: "Comment cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let updatedComments;
      
      if (isReply && parentId) {
        // Edit a reply
        updatedComments = comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  return {
                    ...reply,
                    content: editContent.trim(),
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        });
      } else {
        // Edit a top-level comment
        updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              content: editContent.trim(),
            };
          }
          return comment;
        });
      }

      saveComments(updatedComments);
      setEditingComment(null);
      setEditContent("");
      
      toast({
        title: "Comment updated",
        description: "Your comment has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toast({
        title: "Error",
        description: "Failed to update comment",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete a comment
  const handleDeleteComment = (commentId: number, isReply = false, parentId?: number) => {
    try {
      let updatedComments;
      
      if (isReply && parentId) {
        // Delete a reply
        updatedComments = comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.filter(reply => reply.id !== commentId),
            };
          }
          return comment;
        });
      } else {
        // Delete a top-level comment
        updatedComments = comments.filter(comment => comment.id !== commentId);
      }

      saveComments(updatedComments);
      
      toast({
        title: "Comment deleted",
        description: "The comment has been deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
    }
  };

  // Upvote a comment
  const handleUpvote = (commentId: number, isReply = false, parentId?: number) => {
    try {
      let updatedComments;
      
      if (isReply && parentId) {
        // Upvote a reply
        updatedComments = comments.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: comment.replies.map(reply => {
                if (reply.id === commentId) {
                  const alreadyUpvoted = reply.upvotedBy.includes(user.email);
                  
                  return {
                    ...reply,
                    upvotes: alreadyUpvoted ? reply.upvotes - 1 : reply.upvotes + 1,
                    upvotedBy: alreadyUpvoted 
                      ? reply.upvotedBy.filter(email => email !== user.email)
                      : [...reply.upvotedBy, user.email],
                  };
                }
                return reply;
              }),
            };
          }
          return comment;
        });
      } else {
        // Upvote a top-level comment
        updatedComments = comments.map(comment => {
          if (comment.id === commentId) {
            const alreadyUpvoted = comment.upvotedBy.includes(user.email);
            
            return {
              ...comment,
              upvotes: alreadyUpvoted ? comment.upvotes - 1 : comment.upvotes + 1,
              upvotedBy: alreadyUpvoted 
                ? comment.upvotedBy.filter(email => email !== user.email)
                : [...comment.upvotedBy, user.email],
            };
          }
          return comment;
        });
      }

      saveComments(updatedComments);
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast({
        title: "Error",
        description: "Failed to upvote comment",
        variant: "destructive",
      });
    }
  };

  // Report a comment
  const handleReportComment = (commentId: number, isReply = false, parentId?: number) => {
    try {   
      toast({
        title: "Comment reported",
        description: "Thank you for your report. Our team will review it.",
      });
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast({
        title: "Error",
        description: "Failed to report comment",
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          <MessageSquare className="mr-2 inline-block h-5 w-5" />
          Discussion ({comments.length} comments)
        </h3>
      </div>

      {/* Add new comment */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-start space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <textarea
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <div className="mt-2 flex justify-end">
              <Button
                size="sm"
                onClick={handleAddComment}
                disabled={isSubmitting || !newComment.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <AnimatePresence>
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="rounded-lg border bg-white p-4 shadow-sm"
              >
                {/* Comment header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.author.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center">
                        <span className="font-medium">{comment.author.name}</span>
                        {comment.author.isAdmin && (
                          <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                            Admin
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {(user.email === comment.author.email || user.isAdmin) && (
                        <>
                          <DropdownMenuItem onClick={() => {
                            setEditingComment(comment.id);
                            setEditContent(comment.content);
                          }}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDeleteComment(comment.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      <DropdownMenuItem onClick={() => {
                        setReplyingTo(comment.id);
                        setReplyContent("");
                      }}>
                        <Reply className="mr-2 h-4 w-4" />
                        Reply
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleReportComment(comment.id)}>
                        <Flag className="mr-2 h-4 w-4" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                {/* Comment content */}
                {editingComment === comment.id ? (
                  <div className="mt-3">
                    <textarea
                      className="w-full rounded-md border border-gray-300 p-2 text-sm"
                      rows={3}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingComment(null);
                          setEditContent("");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleEditComment(comment.id)}
                        disabled={isSubmitting || !editContent.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-700">{comment.content}</p>
                )}
                
                {/* Comment actions */}
                <div className="mt-3 flex items-center space-x-4">
                  <button
                    className={`flex items-center space-x-1 text-xs ${
                      comment.upvotedBy.includes(user.email)
                        ? "text-blue-600"
                        : "text-gray-500 hover:text-blue-600"
                    }`}
                    onClick={() => handleUpvote(comment.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{comment.upvotes}</span>
                  </button>
                  
                  <button
                    className="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600"
                    onClick={() => {
                      setReplyingTo(comment.id);
                      setReplyContent("");
                    }}
                  >
                    <Reply className="h-4 w-4" />
                    <span>Reply</span>
                  </button>
                </div>
                
                {/* Reply form */}
                {replyingTo === comment.id && (
                  <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback>
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <textarea
                          className="w-full rounded-md border border-gray-300 p-2 text-sm"
                          rows={2}
                          placeholder="Write a reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="mt-2 flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setReplyingTo(null);
                              setReplyContent("");
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(comment.id)}
                            disabled={isSubmitting || !replyContent.trim()}
                          >
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Replies */}
                {comment.replies.length > 0 && (
                  <div className="ml-8 mt-4 space-y-3 border-l-2 border-gray-100 pl-4">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="rounded-md bg-gray-50 p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback>
                                {reply.author.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{reply.author.name}</span>
                                {reply.author.isAdmin && (
                                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-500">
                                {formatDate(reply.createdAt)}
                              </p>
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {(user.email === reply.author.email || user.isAdmin) && (
                                <>
                                  <DropdownMenuItem onClick={() => {
                                    setEditingComment(reply.id);
                                    setEditContent(reply.content);
                                  }}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteComment(reply.id, true, comment.id)}
                                    className="text-red-600 focus:text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                </>
                              )}
                              <DropdownMenuItem onClick={() => handleReportComment(reply.id, true, comment.id)}>
                                <Flag className="mr-2 h-4 w-4" />
                                Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        {/* Reply content */}
                        {editingComment === reply.id ? (
                          <div className="mt-2">
                            <textarea
                              className="w-full rounded-md border border-gray-300 p-2 text-sm"
                              rows={2}
                              value={editContent}
                              onChange={(e) => setEditContent(e.target.value)}
                            />
                            <div className="mt-2 flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingComment(null);
                                  setEditContent("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleEditComment(reply.id, true, comment.id)}
                                disabled={isSubmitting || !editContent.trim()}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-sm text-gray-700">{reply.content}</p>
                        )}
                        
                        {/* Reply actions */}
                        <div className="mt-2 flex items-center space-x-3">
                          <button
                            className={`flex items-center space-x-1 text-xs ${
                              reply.upvotedBy.includes(user.email)
                                ? "text-blue-600"
                                : "text-gray-500 hover:text-blue-600"
                            }`}
                            onClick={() => handleUpvote(reply.id, true, comment.id)}
                          >
                            <ThumbsUp className="h-3 w-3" />
                            <span>{reply.upvotes}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-8">
            <MessageSquare className="mb-2 h-12 w-12 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">No Comments Yet</h3>
            <p className="text-sm text-gray-500">
              Be the first to start the discussion!
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}