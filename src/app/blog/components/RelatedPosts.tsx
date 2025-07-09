'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IconArrowUpRight } from '@tabler/icons-react';

interface RelatedPostsProps {
  posts: BlogPost[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null;
  }
  
  return (
    <Card className="rounded-2xl border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="py-4 bg-gray-50 border-b border-gray-100">
        <CardTitle className="text-base font-medium text-gray-900">Related Articles</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${index !== 0 ? 'border-t border-gray-100' : ''}`}
            >
              <Link href={`/blog/${post.slug}`} className="group flex p-4 hover:bg-gray-50 transition-colors">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105 duration-300"
                    sizes="64px"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 flex items-start gap-1">
                    {post.title}
                    <IconArrowUpRight className="h-3 w-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-primary mt-1" />
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {post.readingTime} read
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}