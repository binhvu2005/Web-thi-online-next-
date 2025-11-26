"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Award,
  Clock,
  CheckCircle,
  Home,
  FileText,
  UserCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Loading
} from '@/app/components/ui';

// Define the type for exam
interface Exam {
  id: string;
  sequence: number;
  name: string;
  level: number;
  image: string;
  describe: string;
  idSubject: number;
}

interface User {
  id: string;
  nameAccount: string;
  email: string;
  status: number;
  result: unknown[];
}

interface AdminStats {
  totalUsers: number;
  totalExams: number;
  activeUsers: number;
  totalAttempts: number;
}

export default function AdminHomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalExams: 0,
    activeUsers: 0,
    totalAttempts: 0
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
    // Fetch users from external API
        const usersResponse = await axios.get('http://localhost:5000/userList');
        setUsers(usersResponse.data);

        // Fetch exams from external API
        const examsResponse = await axios.get('http://localhost:5000/examList');
        setExams(examsResponse.data);

        // Fetch user answers for statistics
        const answersResponse = await axios.get('http://localhost:5000/userAnswer');
        const totalAttempts = answersResponse.data.length;

        // Calculate statistics
        const totalUsers = usersResponse.data.length;
        const totalExams = examsResponse.data.length;
        const activeUsers = usersResponse.data.filter((user: User) => user.status === 1).length;

        setStats({
          totalUsers,
          totalExams,
          activeUsers,
          totalAttempts
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        setIsUsingSampleData(true);
        // Thêm dữ liệu mẫu khi không kết nối được server
        const sampleUsers: User[] = [
          { id: "1", nameAccount: "Admin User", email: "admin@example.com", status: 1, result: [] },
          { id: "2", nameAccount: "Test User", email: "test@example.com", status: 1, result: [] },
          { id: "3", nameAccount: "Demo User", email: "demo@example.com", status: 0, result: [] }
        ];
        
        const sampleExams: Exam[] = [
          { id: "1", sequence: 15, name: "Đề thi Toán học", level: 1, image: "", describe: "Đề thi cơ bản", idSubject: 1 },
          { id: "2", sequence: 12, name: "Đề thi Vật lý", level: 2, image: "", describe: "Đề thi trung bình", idSubject: 2 },
          { id: "3", sequence: 8, name: "Đề thi Hóa học", level: 3, image: "", describe: "Đề thi khó", idSubject: 3 }
        ];

        setUsers(sampleUsers);
        setExams(sampleExams);
        setStats({
          totalUsers: sampleUsers.length,
          totalExams: sampleExams.length,
          activeUsers: sampleUsers.filter(u => u.status === 1).length,
          totalAttempts: 25
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Loading size="lg" text="Đang tải bảng điều khiển..." fullScreen />
      </div>
    );
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/pages/admin/home', icon: Home, current: true },
    { name: 'Quản lý người dùng', href: '/pages/admin/userMananger', icon: Users, current: false },
    { name: 'Quản lý môn học', href: '/pages/admin/subjectMananger', icon: BookOpen, current: false },
    { name: 'Quản lý đề thi', href: '/pages/admin/examMananger', icon: FileText, current: false },
    { name: 'Quản lý câu hỏi', href: '/pages/admin/questionMananger', icon: UserCheck, current: false },
    { name: 'Quản lý khóa học', href: '/pages/admin/coursesMananger', icon: BookOpen, current: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {navigationItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.name}
              </motion.a>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Đăng xuất
          </button>
        </div>
      </motion.div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 lg:hidden"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <h2 className="ml-4 text-lg font-semibold text-gray-900">Dashboard</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Chào mừng trở lại, Admin!
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card variant="glass" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Chào mừng trở lại!</h1>
                  <p className="text-blue-100 text-lg">Group 3 - Trao tri thức, nhận niềm tin!</p>
                </div>
                <div className="hidden md:block">
                  <Activity className="w-16 h-16 text-blue-200" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card variant="elevated" hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalUsers}</h3>
              <p className="text-gray-600">Tổng người dùng</p>
            </CardContent>
          </Card>

          <Card variant="elevated" hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.activeUsers}</h3>
              <p className="text-gray-600">Người dùng hoạt động</p>
            </CardContent>
          </Card>

          <Card variant="elevated" hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalExams}</h3>
              <p className="text-gray-600">Tổng đề thi</p>
            </CardContent>
          </Card>

          <Card variant="elevated" hover className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stats.totalAttempts}</h3>
              <p className="text-gray-600">Lượt thi</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Bảng xếp hạng người dùng</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Họ và tên</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Bài hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                      {users.slice(0, 5).map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              {index < 3 ? (
                                <Award className={`w-4 h-4 mr-2 ${
                                  index === 0 ? 'text-yellow-500' : 
                                  index === 1 ? 'text-gray-400' : 'text-orange-500'
                                }`} />
                              ) : null}
                              {index + 1}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.id}</td>
                          <td className="py-3 px-4 font-medium">{user.nameAccount}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.result?.length || 0}</td>
                        </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Exams Table */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5" />
                  <span>Đề thi tiêu biểu</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">#</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Lượt thi</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Tiêu đề</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Độ khó</th>
                  </tr>
                </thead>
                <tbody>
                      {exams.slice(0, 5).map((exam, index) => (
                        <motion.tr
                          key={exam.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2 text-gray-400" />
                              {exam.sequence}
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{exam.name}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              exam.level === 1 ? 'bg-green-100 text-green-800' :
                              exam.level === 2 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {exam.level === 1 ? 'Dễ' : exam.level === 2 ? 'Trung bình' : 'Khó'}
                            </span>
                          </td>
                        </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        </main>
      </div>

      {/* Sample Data Notification */}
      {isUsingSampleData && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-amber-100 border border-amber-300 rounded-lg p-4 shadow-lg max-w-sm"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-amber-800">Đang sử dụng dữ liệu mẫu</h4>
              <p className="text-xs text-amber-700 mt-1">
                Server không khả dụng. Dữ liệu hiển thị là mẫu để demo.
              </p>
            </div>
            <button
              onClick={() => setIsUsingSampleData(false)}
              className="flex-shrink-0 text-amber-600 hover:text-amber-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
