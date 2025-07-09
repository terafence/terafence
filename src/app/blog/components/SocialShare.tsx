'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { IconBrandLinkedin, IconLink, IconCheck, IconBrandX, IconBrandYoutube } from '@tabler/icons-react';
import { useToast } from '@/hooks/use-toast';

interface SocialShareProps {
  post: BlogPost;
}

export default function SocialShare({ post }: SocialShareProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = post.title;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "The article link has been copied to your clipboard.",
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  const shareToSocial = (platform: 'linkedin' | 'twitter' | 'facebook' | 'youtube') => {
    let url = '';
    
    switch (platform) {
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case 'youtube':
        url = `https://www.youtube.com/share?url=${encodeURIComponent(shareUrl)}`;
        break;
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="py-4 bg-gray-50 border-b border-gray-100">
        <CardTitle className="text-base font-medium text-gray-900">Share This Article</CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <div className="grid grid-cols-4 gap-3">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('linkedin')}
              className="w-full h-10 border-gray-200 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              aria-label="Share on LinkedIn"
            >
              <IconBrandLinkedin className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('twitter')}
              className="w-full h-10 border-gray-200 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              aria-label="Share on Twitter"
            >
              <IconBrandX className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => shareToSocial('youtube')}
              className="w-full h-10 border-gray-200 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              aria-label="Share on YouTube"
            >
              <IconBrandYoutube className="h-5 w-5" />
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={copyToClipboard}
              className="w-full h-10 border-gray-200 rounded-lg hover:bg-primary/10 hover:text-primary hover:border-primary/20"
              aria-label="Copy link"
            >
              {copied ? (
                <IconCheck className="h-5 w-5 text-green-500" />
              ) : (
                <IconLink className="h-5 w-5" />
              )}
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  );
}