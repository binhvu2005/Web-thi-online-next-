"use client";

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled' | 'outline';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = "w-full px-4 py-3 text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    default: "border border-gray-300 rounded-lg bg-white hover:border-amber-400 focus:border-amber-500",
    filled: "border-0 rounded-lg bg-gray-100 hover:bg-gray-200 focus:bg-white focus:ring-2 focus:ring-amber-500",
    outline: "border-2 border-gray-300 rounded-lg bg-transparent hover:border-amber-400 focus:border-amber-500",
  };

  const iconClasses = iconPosition === 'left' ? 'pl-12' : 'pr-12';

  return (
    <div className="space-y-2">
      {label && (
        <motion.label
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
        </motion.label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <motion.input
          ref={ref}
          id={inputId}
          className={cn(
            baseClasses,
            variants[variant],
            icon && iconClasses,
            error && "border-red-500 focus:ring-red-500",
            className
          )}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.1 }}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 flex items-center space-x-1"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;
