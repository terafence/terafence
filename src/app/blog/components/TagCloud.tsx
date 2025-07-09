'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tag } from '../types';
import { Badge } from '@/components/ui/badge';
import { IconTag } from '@tabler/icons-react';

interface TagCloudProps {
  tags: Tag[];
}

export default function TagCloud({ tags }: TagCloudProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
  };
  
  return (
    <div>
      <h3 className="font-medium mb-3 flex items-center gap-1.5 text-gray-900">
        <IconTag className="h-4 w-4 text-primary" />
        <span>Popular Tags</span>
      </h3>
      <motion.div 
        className="flex flex-wrap gap-2" 
        variants={container}
        initial="hidden"
        animate="show"
      >
        {tags.map((tag) => (
          <motion.div
            key={tag.id}
            variants={item}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Link href={`/blog/tag/${tag.slug}`}>
              <Badge 
                variant="outline" 
                className="px-3 py-1 cursor-pointer border-gray-200 text-gray-700 hover:bg-primary hover:text-white hover:border-primary font-medium text-xs transition-colors duration-200"
              >
                {tag.name}
              </Badge>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}