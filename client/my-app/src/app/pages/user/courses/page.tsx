"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, Users, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Header, Footer, Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Loading } from '@/app/components/ui';
import Link from 'next/link';

// Define the Course interface
interface Course {
  id: string;
  title: string;
  img: string;
  description: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/courses');
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
    setCurrentPage(1); // Reset to first page when searching
  }, [searchQuery, courses]);

  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-20">
          <Loading size="lg" text="Đang tải khóa học..." fullScreen />
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
                Khóa học
                <span className="block text-amber-100">luyện thi</span>
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
                Khám phá các khóa học luyện thi từ tiểu học đến trung học phổ thông, 
                được thiết kế để giúp bạn đạt thành tích cao trong các kỳ thi
              </p>
            </motion.div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 bg-white/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col md:flex-row gap-4 items-center justify-between"
            >
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Tìm kiếm khóa học..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                  variant="filled"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-gray-600 font-medium">
                  {filteredCourses.length} khóa học
                </span>
                <Button variant="outline" size="md" icon={<Filter className="w-4 h-4" />}>
                  Lọc
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Không tìm thấy khóa học
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi từ khóa tìm kiếm hoặc xem tất cả khóa học
                </p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -8 }}
                  >
                    <Link href={`/pages/user/subject/${course.id}`}>
                      <Card variant="elevated" hover className="h-full">
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <img
                            src={course.img}
                            alt={course.title}
                            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            Hot
                          </div>
                        </div>
                        
                        <CardContent className="p-6">
                          <CardTitle className="text-xl mb-3 line-clamp-2">
                            {course.title}
                          </CardTitle>
                          
                          <CardDescription className="text-gray-600 mb-4 line-clamp-3">
                            {course.description}
                          </CardDescription>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4" />
                              <span>1,200+ học viên</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span>4.8</span>
                            </div>
                          </div>
                          
                          <Button variant="primary" size="md" fullWidth>
                            Xem chi tiết
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center justify-center space-x-2 mt-12"
              >
                <Button
                  variant="outline"
                  size="md"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  icon={<ChevronLeft className="w-4 h-4" />}
                >
                  Trước
                </Button>
                
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "primary" : "outline"}
                    size="md"
                    onClick={() => handlePageChange(index + 1)}
                    className="w-10 h-10 p-0"
                  >
                    {index + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  icon={<ChevronRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Sau
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
