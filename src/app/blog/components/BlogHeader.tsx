'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { IconClock, IconCalendar } from '@tabler/icons-react';

interface BlogHeaderProps {
  post: BlogPost;
}

export default function BlogHeader({ post }: BlogHeaderProps) {
  return (
    <header className="mb-10">
      {/* Cover Image */}
      <div className="relative w-full overflow-hidden rounded-2xl mb-6">
        <div className="aspect-[21/9]">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 1200px"
            priority
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Category Badge - Mobile only */}
        <div className="absolute top-4 left-4 md:hidden">
          <Badge className="bg-primary hover:bg-primary/90 text-white border-none">
            {post.category.name}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Category & Tags - Desktop */}
        <div className="hidden md:flex flex-wrap items-center gap-2 mb-2">
          <Badge className="bg-primary hover:bg-primary/90 text-white border-none px-3 py-1 text-xs">
            {post.category.name}
          </Badge>
          
          {post.tags.map((tag) => (
            <motion.div 
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Badge variant="outline" className="px-3 py-1 text-xs hover:bg-accent">
                {tag.name}
              </Badge>
            </motion.div>
          ))}
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading tracking-tight text-gray-900">
          {post.title}
        </h1>
        
        {/* Description */}
        <p className="text-lg text-gray-600 max-w-3xl">
          {post.description}
        </p>
        
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-6 py-4 border-y border-gray-200 text-gray-600">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-900">
                {post.author.name}
              </span>
              <span className="block text-xs">{post.author.bio.split(' ').slice(0, 3).join(' ')}...</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-primary" />
            <span className="text-sm">
              {format(new Date(post.publishedAt), 'MMMM d, yyyy')}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <IconClock className="h-4 w-4 text-primary" />
            <span className="text-sm">{post.readingTime} read</span>
          </div>
        </div>
        
        {/* Tags - Mobile */}
        <div className="flex md:hidden flex-wrap gap-2 mt-4">
          {post.tags.map((tag) => (
            <motion.div 
              key={tag.id}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 400, damping: 10 }}
            >
              <Badge variant="outline" className="px-3 py-1 text-xs">
                {tag.name}
              </Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </header>
  );
}
