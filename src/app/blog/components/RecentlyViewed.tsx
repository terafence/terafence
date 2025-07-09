'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { blogPosts } from '../data/blogData';
import { IconHistoryToggle, IconArrowRight } from '@tabler/icons-react';

interface RecentlyViewedProps {
  currentPostId: string;
}

export default function RecentlyViewed({ currentPostId }: RecentlyViewedProps) {
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Get recently viewed posts from localStorage
      const storedPosts = localStorage.getItem('recently-viewed-posts');
      let recentPostIds: string[] = storedPosts ? JSON.parse(storedPosts) : [];
      
      // Add current post to recently viewed
      if (!recentPostIds.includes(currentPostId)) {
        recentPostIds = [currentPostId, ...recentPostIds].slice(0, 5);
        localStorage.setItem('recently-viewed-posts', JSON.stringify(recentPostIds));
      }
      
      // Filter out current post from display and get post data
      const postsToDisplay = recentPostIds
        .filter(id => id !== currentPostId)
        .map(id => blogPosts.find(post => post.id === id))
        .filter((post): post is BlogPost => post !== undefined);
      
      setRecentPosts(postsToDisplay);
    }
  }, [currentPostId]);
  
  if (recentPosts.length === 0) {
    return null;
  }
  
  return (
    <Card className="rounded-xl shadow-md border-gray-200 overflow-hidden">
      <CardHeader className="py-4 bg-gray-50 border-b border-gray-100 px-5">
        <CardTitle className="text-base font-medium flex items-center gap-2 text-gray-900">
          <IconHistoryToggle className="h-4 w-4 text-primary" />
          Recently Viewed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`} className="group flex p-4 hover:bg-gray-50 transition-colors">
                <div className="relative h-14 w-14 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                    sizes="56px"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 pr-5 relative">
                    {post.title}
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <IconArrowRight className="h-3 w-3 text-primary" />
                    </span>
                  </h4>
                  <div className="flex items-center mt-1">
                    <span className="inline-flex items-center justify-center text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                      {post.category.name}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}