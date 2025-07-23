'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconPaperclip, IconCalendar, IconUser } from '@tabler/icons-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { parseFilesFromStorage } from '../lib/fileUpload';

interface Comment {
  ticketId: string;
  createdAt: string;
  userEmail: string;
  comment: string;
  attachments?: string;
}

interface CommentListProps {
  comments: Comment[];
  adminEmails: string[];
}

export default function CommentList({ comments, adminEmails }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mt-2">No comments yet</p>
      </div>
    );
  }

  // Sort comments by date (newest first)
  const sortedComments = [...comments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedComments.map((comment, index) => {
        const isAdmin = adminEmails.includes(comment.userEmail);
        const attachments = parseFilesFromStorage(comment.attachments || '');
        
        return (
          <motion.div
            key={`${comment.ticketId}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className={isAdmin ? "border-l-4 border-l-blue-500" : ""}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <IconUser className={isAdmin ? "text-blue-500" : "text-gray-400"} size={16} />
                    <span className="text-sm font-medium">
                      {comment.userEmail}
                      {isAdmin && (
                        <Badge variant="outline" className="ml-2 text-xs bg-blue-50 text-blue-700 border-blue-200">
                          Admin
                        </Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <IconCalendar size={14} />
                    <span>
                      {new Date(comment.createdAt).toLocaleDateString()} {new Date(comment.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                
                {/* Comment content */}
                {comment.comment && (
                  <div className="py-2 whitespace-pre-wrap text-gray-800">
                    {comment.comment}
                  </div>
                )}
                
                {/* Attachments */}
                {attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <IconPaperclip size={14} />
                      <span>Attachments ({attachments.length})</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {attachments.map((file, fileIndex) => (
                        <Button
                          key={fileIndex}
                          variant="outline"
                          size="sm"
                          className="text-xs bg-gray-50 hover:bg-gray-100"
                          asChild
                        >
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            <IconPaperclip size={12} className="mr-1" />
                            {file.name}
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}