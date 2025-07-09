'use client';

import { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

interface AnimatedBlogHeaderProps {
  title: string;
  subtitle: string;
}

export default function AnimatedBlogHeader({ title, subtitle }: AnimatedBlogHeaderProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1],
        delay: 0.2,
      },
    },
  };

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: '100px',
      transition: {
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
        delay: 0.4,
      },
    },
  };

  return (
    <div className="mb-16 text-center" ref={ref}>
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4"
        variants={titleVariants}
        initial="hidden"
        animate={controls}
      >
        {title}
      </motion.h1>

      <motion.div
        className="h-1 bg-blue-600 mx-auto rounded-full mb-6"
        variants={lineVariants}
        initial="hidden"
        animate={controls}
      />

      <motion.p
        className="text-lg text-gray-600 max-w-3xl mx-auto"
        variants={subtitleVariants}
        initial="hidden"
        animate={controls}
      >
        {subtitle}
      </motion.p>
    </div>
  );
}