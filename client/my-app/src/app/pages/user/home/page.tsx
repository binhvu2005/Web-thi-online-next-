"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Header from '@/app/components/ui/Header';
import HeroBanner from '@/app/components/ui/HeroBanner';
import ExamCard from '@/app/components/ui/ExamCard';
import Footer from '@/app/components/ui/Footer';

interface Exam {
  id: string;
  name: string;
  image: string;
  sequence: number;
  idSubject: number;
  describe: string;
}

interface User {
  id: string;
  nameAccount: string;
  img: string;
}

export default function HomePage() {
  const [topExams, setTopExams] = useState<Exam[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const idUserLogin = localStorage.getItem("keyLogin");
        if (idUserLogin) {
          const userResponse = await axios.get('http://localhost:5000/userList');
          const users = userResponse.data;
          const currentUser = users.find((user: User) => user.id === idUserLogin);
          if (currentUser) {
            setUser(currentUser);
            setIsLoggedIn(true);
          }
        }

        // Fetch exams data
        const examResponse = await axios.get('http://localhost:5000/examList');
        const sortedExams = examResponse.data.sort(
          (a: Exam, b: Exam) => b.sequence - a.sequence
        );
        setTopExams(sortedExams.slice(0, 8)); // Lấy 8 đề thi phổ biến nhất
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header 
        user={user} 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
      />
      
      <main>
        {/* Hero Section */}
        <HeroBanner />
        
        {/* Featured Exams Section */}
        <section className="py-20 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Đề thi
                <span className="text-amber-600"> tiêu biểu</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Khám phá những đề thi được yêu thích nhất với hàng nghìn lượt tham gia
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {topExams.map((exam, index) => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  index={index}
                />
              ))}
            </motion.div>

            {/* View More Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <motion.a
                href="/pages/user/courses"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center space-x-2 bg-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-amber-600 transition-colors duration-200 shadow-lg"
              >
                <span>Xem tất cả đề thi</span>
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.div>
              </motion.a>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gradient-to-r from-amber-50 to-yellow-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Tại sao chọn
                <span className="text-amber-600"> OnlineTest?</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Giao diện hiện đại",
                  description: "Thiết kế đẹp mắt, thân thiện với người dùng",
                  icon: "🎨"
                },
                {
                  title: "Tính năng đầy đủ",
                  description: "Hỗ trợ đầy đủ các tính năng thi trực tuyến",
                  icon: "⚡"
                },
                {
                  title: "Kết quả tức thì",
                  description: "Nhận kết quả và đánh giá ngay sau khi thi",
                  icon: "📊"
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
