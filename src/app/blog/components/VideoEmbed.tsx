/* eslint-disable @next/next/no-img-element */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { IconPlayerPlay } from '@tabler/icons-react';

interface VideoEmbedProps {
  type: 'youtube' | 'local';
  src: string;
  title: string;
  poster?: string;
}

export default function VideoEmbed({ type, src, title, poster }: VideoEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const handleLoad = () => {
    setIsLoading(false);
  };
  
  if (type === 'youtube') {
    // Extract YouTube video ID if full URL is provided
    const videoId = src.includes('youtube.com') || src.includes('youtu.be')
      ? src.includes('v=')
        ? src.split('v=')[1].split('&')[0]
        : src.split('/').pop()
      : src;
      
    return (
      <div className="aspect-video w-full rounded-xl overflow-hidden my-8 shadow-lg relative">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onLoad={handleLoad}
        ></iframe>
      </div>
    );
  }
  
  // Local video
  return (
    <div className="my-8 rounded-xl overflow-hidden shadow-lg relative">
      {poster && !isPlaying && (
        <div className="absolute inset-0 z-10">
          <motion.div 
            className="relative w-full h-full bg-gray-900/50 flex items-center justify-center cursor-pointer"
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
            onClick={() => setIsPlaying(true)}
          >
            <div className="relative">
              <img 
                src={poster} 
                alt={title} 
                className="w-full h-auto"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div 
                  className="h-16 w-16 rounded-full bg-primary/80 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconPlayerPlay className="h-8 w-8 text-white" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <video
        src={src}
        title={title}
        controls={isPlaying || !poster}
        poster={poster}
        className="w-full rounded-xl shadow-lg"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      ></video>
    </div>
  );
}