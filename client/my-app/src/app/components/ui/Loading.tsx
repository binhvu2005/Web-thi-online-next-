"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Đang tải...', 
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };

  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`${sizes[size]} border-4 border-amber-200 border-t-amber-500 rounded-full`}
    />
  );

  const content = (
    <div className="flex flex-col items-center space-y-4">
      {spinner}
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`${textSizes[size]} text-gray-600 font-medium`}
        >
          {text}
        </motion.p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {content}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center justify-center p-8"
    >
      {content}
    </motion.div>
  );
};

// Pulse Loading Component
export const PulseLoading: React.FC<{ count?: number }> = ({ count = 3 }) => (
  <div className="flex items-center space-x-2">
    {Array.from({ length: count }).map((_, index) => (
      <motion.div
        key={index}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          delay: index * 0.2,
        }}
        className="w-3 h-3 bg-amber-500 rounded-full"
      />
    ))}
  </div>
);

// Skeleton Loading Component
export const Skeleton: React.FC<{ 
  className?: string;
  lines?: number;
}> = ({ className = "", lines = 1 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, index) => (
      <motion.div
        key={index}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          delay: index * 0.1,
        }}
        className={`bg-gray-200 rounded h-4 ${className}`}
      />
    ))}
  </div>
);

export default Loading;
