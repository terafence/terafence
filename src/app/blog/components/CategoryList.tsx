'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Category } from '../types';
import { IconFolders, IconChevronRight } from '@tabler/icons-react';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };
  
  return (
    <div>
      <h3 className="font-medium mb-3 flex items-center gap-1.5 text-gray-900">
        <IconFolders className="h-4 w-4 text-primary" />
        <span>Categories</span>
      </h3>
      <motion.ul 
        className="space-y-1"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {categories.map((category) => (
          <motion.li key={category.id} variants={item}>
            <Link 
              href={`/blog/category/${category.slug}`}
              className="flex items-center justify-between py-2 px-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-primary group transition-colors"
            >
              <span className="font-medium text-sm">{category.name}</span>
              <IconChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </div>
  );
}