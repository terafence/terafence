'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

interface AnimatedBookmarkButtonProps {
  postId: string;
  postTitle: string;
}

export default function AnimatedBookmarkButton({ postId, postTitle }: AnimatedBookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { toast } = useToast();

  // Check if post is already bookmarked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
      setIsBookmarked(bookmarks.some((bookmark: { id: string }) => bookmark.id === postId));
    }
  }, [postId]);

  const toggleBookmark = () => {
    if (typeof window !== 'undefined') {
      const bookmarks = JSON.parse(localStorage.getItem('blog-bookmarks') || '[]');
      
      if (isBookmarked) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter(
          (bookmark: { id: string }) => bookmark.id !== postId
        );
        localStorage.setItem('blog-bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);
        
        toast({
          title: "Removed from bookmarks",
          description: `"${postTitle}" has been removed from your bookmarks.`,
        });
      } else {
        // Add bookmark
        const updatedBookmarks = [
          ...bookmarks,
          { id: postId, title: postTitle, addedAt: new Date().toISOString() },
        ];
        localStorage.setItem('blog-bookmarks', JSON.stringify(updatedBookmarks));
        setIsBookmarked(true);
        
        toast({
          title: "Added to bookmarks",
          description: `"${postTitle}" has been added to your bookmarks.`,
        });
      }
    }
  };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }} 
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant={isBookmarked ? "default" : "outline"}
        size="sm"
        onClick={toggleBookmark}
        className={`flex items-center gap-2 rounded-lg h-10 shadow-sm ${
          isBookmarked ? "bg-primary text-white hover:bg-primary/90" : "border-gray-200 hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
        }`}
      >
        {isBookmarked ? (
          <IconBookmarkFilled className="h-4 w-4" />
        ) : (
          <IconBookmark className="h-4 w-4" />
        )}
        <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
      </Button>
    </motion.div>
  );
}