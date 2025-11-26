"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  Clock, 
  Trophy, 
  Calendar, 
  TrendingUp, 
  Filter, 
  Search,
  Award,
  BarChart3
} from "lucide-react";
import { 
  Header, 
  Footer, 
  Card, 
  Button, 
  Input,
  Loading
} from "@/app/components/ui";
import Link from "next/link";

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  address: string;
  phone: string;
  img: string;
  password: string;
  status: number;
}

export interface Exam {
  id: string;
  idSubject: number;
  level: number;
  name: string;
  image: string;
  sequence: number;
  describe: string;
}

interface Answer {
  questionId: string;
  selectedAnswer: string | null;
  isCorrect: boolean;
}

interface ExamHistory {
  id: number;
  idExam: string;
  idUser: string;
  score: number;
  time: string;
  date: string;
  answers: Answer[];
}

const HistoryPage: React.FC = () => {
  const [examHistory, setExamHistory] = useState<ExamHistory[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<ExamHistory[]>([]);
  const [examList, setExamList] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'score-high' | 'score-low'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const idUserLogin = localStorage.getItem("keyLogin");

  useEffect(() => {
    const fetchData = async () => {
      if (idUserLogin) {
        try {
          setLoading(true);
          // Fetch exam history
          const historyResponse = await axios.get(`http://localhost:5000/userAnswer?userId=${idUserLogin}`);
          setExamHistory(historyResponse.data);
          setFilteredHistory(historyResponse.data);

          // Fetch exam list
          const examResponse = await axios.get<Exam[]>("http://localhost:5000/examList");
          setExamList(examResponse.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [idUserLogin]);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...examHistory];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(item => {
        const exam = examList.find(e => e.id === item.idExam);
        return exam?.name.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Sort filter
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'score-high':
          return b.score - a.score;
        case 'score-low':
          return a.score - b.score;
        default:
    return 0;
      }
  });

    setFilteredHistory(filtered);
  }, [examHistory, examList, searchQuery, sortBy]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHistory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  // Statistics
  const totalExams = filteredHistory.length;
  const averageScore = totalExams > 0 ? Math.round(filteredHistory.reduce((sum, item) => sum + item.score, 0) / totalExams) : 0;
  const highestScore = totalExams > 0 ? Math.max(...filteredHistory.map(item => item.score)) : 0;

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20">
          <Loading size="lg" text="Đang tải lịch sử..." fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-100">
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-r from-amber-400 to-orange-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                Lịch sử làm bài
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Theo dõi tiến độ học tập và kết quả thi của bạn
              </p>
            </motion.div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card variant="glass" padding="lg" className="text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{totalExams}</h3>
                <p className="text-gray-600">Tổng số bài thi</p>
              </Card>
              
              <Card variant="glass" padding="lg" className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{averageScore}</h3>
                <p className="text-gray-600">Điểm trung bình</p>
              </Card>
              
              <Card variant="glass" padding="lg" className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{highestScore}</h3>
                <p className="text-gray-600">Điểm cao nhất</p>
              </Card>
            </motion.div>
        </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8"
            >
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Tìm kiếm bài thi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  variant="filled"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-500" />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'score-high' | 'score-low')}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="score-high">Điểm cao → thấp</option>
                    <option value="score-low">Điểm thấp → cao</option>
                </select>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* History Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-1"
              >
                <Card variant="glass" padding="lg" className="sticky top-24">
                  <nav className="space-y-2">
                    <Link href="/pages/user/profile">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200">
                        <Award className="w-5 h-5" />
                        <span>Thông tin cá nhân</span>
                      </div>
                    </Link>
                    <Link href="/pages/user/history">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-amber-100 text-amber-800 font-medium">
                        <BarChart3 className="w-5 h-5" />
                        <span>Lịch sử làm bài</span>
                      </div>
                    </Link>
                  </nav>
                </Card>
              </motion.div>

              {/* Main History Content */}
              <div className="lg:col-span-3">
                {filteredHistory.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      {searchQuery ? 'Không tìm thấy kết quả' : 'Chưa có lịch sử làm bài'}
                    </h3>
                    <p className="text-gray-500">
                      {searchQuery ? 'Thử thay đổi từ khóa tìm kiếm' : 'Hãy bắt đầu làm bài thi để xem lịch sử'}
                    </p>
                  </motion.div>
                ) : (
                  <div className="space-y-6">
                    {currentItems.map((history, index) => {
                      const exam = examList.find(e => e.id === history.idExam);
                      const scoreColor = history.score >= 8 ? 'text-green-600' : history.score >= 6 ? 'text-yellow-600' : 'text-red-600';
                      const scoreBg = history.score >= 8 ? 'bg-green-100' : history.score >= 6 ? 'bg-yellow-100' : 'bg-red-100';
                      
      return (
                        <motion.div
                          key={history.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                          whileHover={{ y: -4 }}
                        >
                          <Card variant="elevated" hover className="p-6">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4 mb-4">
                                  <div className={`w-12 h-12 ${scoreBg} rounded-full flex items-center justify-center`}>
                                    <span className={`text-lg font-bold ${scoreColor}`}>
                                      {history.score}
                                    </span>
                                  </div>
                                  <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                      {exam?.name || 'Đang tải...'}
                                    </h3>
                                    <p className="text-sm text-gray-500">Mã đề: {history.idExam}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-6 text-sm text-gray-600">
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-4 h-4" />
                                    <span>{history.time}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{new Date(history.date).toLocaleDateString('vi-VN')}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center space-x-3">
                                <Link href={`/pages/user/result/${history.id}`}>
                                  <Button variant="outline" size="sm">
                                    Xem chi tiết
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
      );
    })}

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="flex items-center justify-center space-x-2 mt-8"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                        >
                          Trước
                        </Button>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "primary" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10 p-0"
                          >
                            {page}
                          </Button>
                        ))}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Sau
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
        </div>
      </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HistoryPage;
