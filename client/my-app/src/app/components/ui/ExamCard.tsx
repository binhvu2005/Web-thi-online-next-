"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, Users, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Exam {
  id: string;
  name: string;
  image: string;
  sequence: number;
  idSubject: number;
  describe: string;
}

interface ExamCardProps {
  exam: Exam;
  index: number;
  className?: string;
}

const ExamCard: React.FC<ExamCardProps> = ({ exam, index, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className={cn("group", className)}
    >
      <Link href={`/pages/user/exam/${exam.id}`}>
        <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-amber-100 group-hover:border-amber-300">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <motion.img
              src={exam.image}
              alt={exam.name}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Floating Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              className="absolute top-3 right-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg"
            >
              Hot
            </motion.div>
          </div>

          {/* Content */}
          <div className="p-6">
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.4 }}
              className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors duration-200 line-clamp-2"
            >
              {exam.name}
            </motion.h3>

            {exam.describe && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.5 }}
                className="text-gray-600 text-sm mb-4 line-clamp-2"
              >
                {exam.describe}
              </motion.p>
            )}

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.6 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1 text-amber-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">{exam.sequence}</span>
                </div>
                <div className="flex items-center space-x-1 text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">60 phút</span>
                </div>
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition-colors duration-200 flex items-center space-x-1"
              >
                <BookOpen className="w-4 h-4" />
                <span>Thi ngay</span>
              </motion.div>
            </motion.div>
          </div>

          {/* Hover Effect Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
};

export default ExamCard;
