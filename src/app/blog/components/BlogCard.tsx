'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { BlogPost } from '../types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { IconClock, IconCalendar } from '@tabler/icons-react';

interface BlogCardProps {
  post: BlogPost;
  variant?: 'default' | 'compact';
  priority?: boolean;
}

export default function BlogCard({ post, variant = 'default', priority = false }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`} className="group block h-full">
        <Card className="overflow-hidden rounded-2xl border-gray-200 h-full hover:shadow-md transition-shadow duration-300">
          <div className="relative">
            <div className={variant === 'compact' ? 'aspect-[3/2]' : 'aspect-[3/2] sm:aspect-[5/3] md:aspect-[5/3]'}>
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes={variant === 'compact' 
                  ? '(max-width: 768px) 40vw, 250px' 
                  : '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                }
                priority={priority}
              />
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/5 to-black/40"></div>
            
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary text-white border-none">
                {post.category.name}
              </Badge>
            </div>
            
            {/* Featured Badge */}
            {post.featured && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-amber-500 text-white border-none">
                  Featured
                </Badge>
              </div>
            )}
          </div>
          
          <CardContent className={`p-5 ${variant === 'compact' ? 'space-y-2' : 'space-y-3'}`}>
            <h3 className={`font-heading font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 ${
              variant === 'compact' ? 'text-base' : 'text-xl'
            }`}>
              {post.title}
            </h3>
            
            {variant !== 'compact' && (
              <p className="text-gray-600 text-sm line-clamp-2 min-h-[40px]">
                {post.description}
              </p>
            )}
            
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
              <div className="flex items-center gap-2">
                <div className="relative h-8 w-8 rounded-full overflow-hidden border border-white shadow-sm">
                  <Image
                    src={post.author.avatar}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                    sizes="32px"
                  />
                </div>
                <span className="text-xs text-gray-700 font-medium">
                  {post.author.name}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <IconCalendar className="h-3 w-3 text-primary" />
                  {format(new Date(post.publishedAt), 'MMM d, yyyy')}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <IconClock className="h-3 w-3 text-primary" />
                  {post.readingTime}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}