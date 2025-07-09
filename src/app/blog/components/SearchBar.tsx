'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { IconSearch, IconX } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts } from '../data/blogData';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof blogPosts>([]);
  
  useEffect(() => {
    if (searchTerm.trim().length >= 2) {
      const results = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a search
    console.log('Searching for:', searchTerm);
  };
  
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };
  
  return (
    <div className="relative">
      <form onSubmit={handleSearch} className="relative">
        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsActive(true)}
          onBlur={() => setTimeout(() => setIsActive(false), 200)}
          className="pl-9 pr-9 py-2 rounded-xl border-gray-200 shadow-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {searchTerm && (
          <button 
            type="button"
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <IconX className="h-4 w-4" />
          </button>
        )}
      </form>
      
      <AnimatePresence>
        {isActive && searchResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white shadow-lg rounded-xl border border-gray-200 z-50 max-h-72 overflow-auto"
          >
            <div className="p-2 space-y-1">
              {searchResults.map(post => (
                <Link 
                  href={`/blog/${post.slug}`} 
                  key={post.id}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg group"
                >
                  <div className="relative h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary line-clamp-1">
                      {post.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                      {post.category.name}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}