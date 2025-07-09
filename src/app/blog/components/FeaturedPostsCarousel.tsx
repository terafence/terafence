'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { BlogPost } from '../types';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface FeaturedPostsCarouselProps {
  posts: BlogPost[];
}

export default function FeaturedPostsCarousel({ posts }: FeaturedPostsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto rotate carousel every 6 seconds, but pause on hover
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [posts.length, isPaused]);

  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + posts.length) % posts.length);
  }, [posts.length]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % posts.length);
  }, [posts.length]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="relative rounded-xl overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="aspect-[21/9] w-full relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0"
          >
            <Image
              src={posts[currentIndex].coverImage}
              alt={posts[currentIndex].title}
              fill
              className="object-cover brightness-50"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10">
              <div className="max-w-3xl">
                <Badge className="w-fit mb-3 bg-primary border-0 text-white px-3 py-1">
                  {posts[currentIndex].category.name}
                </Badge>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-3 font-heading">
                  {posts[currentIndex].title}
                </h2>
                <p className="text-white/90 max-w-2xl mb-6 hidden md:block leading-relaxed">
                  {posts[currentIndex].description}
                </p>
                <div className="flex items-center gap-4">
                  <Link href={`/blog/${posts[currentIndex].slug}`}>
                    <Button className="bg-primary text-white hover:bg-primary/90 px-6 h-11 shadow-lg shadow-primary/20">
                      Read Article
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src={posts[currentIndex].author.avatar}
                        alt={posts[currentIndex].author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>By {posts[currentIndex].author.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10 md:h-12 md:w-12"
          aria-label="Previous slide"
        >
          <IconChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="bg-black/30 text-white hover:bg-black/50 rounded-full h-10 w-10 md:h-12 md:w-12"
          aria-label="Next slide"
        >
          <IconChevronRight className="h-5 w-5 md:h-6 md:w-6" />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {posts.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
            }`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}