/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPaperclip, IconSend, IconX, IconTrash } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
// import { addComment } from '../lib/googleSheets';
import { uploadMultipleFiles, FileInfo, formatFilesForStorage } from '../lib/fileUpload';
// import { sendTicketUpdateNotification } from '../lib/email';

interface CommentFormProps {
  ticketId: string;
  userEmail: string;
  subject: string;
  onCommentAdded: () => void;
}

export default function CommentForm({ ticketId, userEmail, subject, onCommentAdded }: CommentFormProps) {
  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeUploadedFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleUploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded = await uploadMultipleFiles(files);
      setUploadedFiles(prev => [...prev, ...uploaded]);
      setFiles([]);
      toast({
        title: 'Files Uploaded',
        description: `Successfully uploaded ${uploaded.length} files`,
      });
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload one or more files',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!comment.trim() && uploadedFiles.length === 0) {
      toast({
        title: 'Empty Comment',
        description: 'Please add a comment or attach files',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload any pending files
      if (files.length > 0) {
        await handleUploadFiles();
      }

      // Add comment to Google Sheets
      const commentData = {
        ticketId,
        createdAt: new Date().toISOString(),
        userEmail,
        comment: comment.trim(),
        attachments: formatFilesForStorage(uploadedFiles),
      };

      // const success = await addComment(commentData);

      // if (!success) {
      //   throw new Error('Failed to add comment');
      // }

      // Send notification
      // await sendTicketUpdateNotification({
      //   ticketId,
      //   userEmail,
      //   subject,
      //   updateType: 'comment',
      //   message: comment.trim(),
      //   updatedBy: userEmail,
      // });

      // Clear form
      setComment('');
      setFiles([]);
      setUploadedFiles([]);

      toast({
        title: 'Comment Added',
        description: 'Your comment has been added successfully',
      });

      // Refresh ticket comments
      onCommentAdded();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add comment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="comment">Add Comment</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Label
                htmlFor="comment-file-upload"
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
              >
                <IconPaperclip size={18} />
                <span>Attach Files</span>
              </Label>
              <Input
                id="comment-file-upload"
                type="file"
                onChange={handleFileChange}
                className="hidden"
                multiple
                accept="image/*,.pdf,.docx,.xlsx,.txt,.log"
              />
              
              {files.length > 0 && (
                <Button
                  type="button"
                  onClick={handleUploadFiles}
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                >
                  {isUploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
                </Button>
              )}
            </div>
            
            {/* Display files pending upload */}
            {files.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-2">Files to upload:</p>
                <ul className="space-y-2">
                  {files.map((file, index) => (
                    <motion.li
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-gray-400 text-xs mx-2">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeFile(index)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <IconX size={16} />
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Display already uploaded files */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 mb-2">Uploaded files:</p>
                <ul className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <motion.li
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-md text-sm"
                    >
                      <span className="truncate flex-1">{file.name}</span>
                      <span className="text-blue-400 text-xs mx-2">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <Button
                        type="button"
                        onClick={() => removeUploadedFile(index)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-700"
                      >
                        <IconTrash size={16} />
                      </Button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting || isUploading}
        >
          {isSubmitting ? 'Submitting...' : 'Add Comment'}
          <IconSend className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}