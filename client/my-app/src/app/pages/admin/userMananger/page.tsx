"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Lock, 
  Unlock, 
  Eye, 
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Home,
  FileText,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input,
  Loading,
  Modal,
  ConfirmModal,
  useToastNotifications
} from '@/app/components/ui';

interface Account {
  id: number;
  nameAccount: string;
  email: string;
  address: string;
  phone: string;
  img: string;
  status: number;
  lock: string;
}

export default function UserManagementPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<'name' | 'email' | 'status' | 'id'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedUser, setSelectedUser] = useState<Account | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isUsingSampleData, setIsUsingSampleData] = useState(false);
  const { success, error: showError } = useToastNotifications();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get<Account[]>('http://localhost:5000/userList');
        setAccounts(response.data);
        setFilteredAccounts(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsUsingSampleData(true);
        // Không hiển thị toast error ngay lập tức, để tránh spam
        // Chỉ log error và hiển thị empty state
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter and sort logic
  useEffect(() => {
    let filtered = [...accounts];

    // Search filter
    if (searchTerm.trim()) {
      filtered = filtered.filter(account =>
        account.nameAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort filter
    filtered.sort((a, b) => {
      let aValue: string | number, bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.nameAccount.toLowerCase();
          bValue = b.nameAccount.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    setFilteredAccounts(filtered);
  }, [accounts, searchTerm, sortBy, sortOrder]);

  // User actions
  const handleToggleStatus = async (userId: number) => {
    try {
      const user = accounts.find(u => u.id === userId);
      if (!user) return;

      const newStatus = user.status === 1 ? 0 : 1;
      await axios.patch(`http://localhost:5000/userList/${userId}`, { status: newStatus });
      
      setAccounts(prev => prev.map(u => 
        u.id === userId ? { ...u, status: newStatus } : u
      ));

      success('Thành công', `Đã ${newStatus === 1 ? 'kích hoạt' : 'vô hiệu hóa'} người dùng`);
    } catch (error) {
      showError('Lỗi', 'Không thể cập nhật trạng thái người dùng');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await axios.delete(`http://localhost:5000/userList/${userId}`);
      setAccounts(prev => prev.filter(u => u.id !== userId));
      
      success('Thành công', 'Đã xóa người dùng');
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      showError('Lỗi', 'Không thể xóa người dùng');
    }
  };

  const handleViewUser = (user: Account) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <Loading size="lg" text="Đang tải danh sách người dùng..." fullScreen />
      </div>
    );
  }

  const navigationItems = [
    { name: 'Dashboard', href: '/pages/admin/home', icon: Home, current: false },
    { name: 'Quản lý người dùng', href: '/pages/admin/userMananger', icon: Users, current: true },
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
                <h2 className="ml-4 text-lg font-semibold text-gray-900">Quản lý người dùng</h2>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500">
                  Tổng: {filteredAccounts.length} người dùng
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <Card variant="glass">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <Input
                    placeholder="Tìm kiếm theo tên hoặc email..."
              value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    icon={<Search className="w-5 h-5" />}
                    variant="filled"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as 'name' | 'email' | 'status' | 'id')}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="name">Sắp xếp theo tên</option>
                      <option value="email">Sắp xếp theo email</option>
                      <option value="status">Sắp xếp theo trạng thái</option>
                      <option value="id">Sắp xếp theo ID</option>
                    </select>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center space-x-2"
                  >
                    <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    <span>{sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Danh sách người dùng</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredAccounts.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="w-10 h-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    {searchTerm ? 'Không tìm thấy người dùng' : 'Chưa có dữ liệu người dùng'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm 
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc xóa bộ lọc' 
                      : 'Có thể server chưa chạy hoặc chưa có dữ liệu. Vui lòng kiểm tra kết nối.'
                    }
                  </p>
                  {!searchTerm && (
                    <div className="flex justify-center space-x-4">
                      <Button 
                        variant="outline" 
                        onClick={() => window.location.reload()}
                        className="flex items-center space-x-2"
                      >
                        <span>🔄</span>
                        <span>Tải lại</span>
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          // Thêm dữ liệu mẫu
                          const sampleUsers: Account[] = [
                            {
                              id: 1,
                              nameAccount: "Nguyễn Văn A",
                              email: "nguyenvana@example.com",
                              address: "Hà Nội",
                              phone: "0123456789",
                              img: "",
                              status: 1,
                              lock: "open"
                            },
                            {
                              id: 2,
                              nameAccount: "Trần Thị B",
                              email: "tranthib@example.com", 
                              address: "TP.HCM",
                              phone: "0987654321",
                              img: "",
                              status: 0,
                              lock: "lock"
                            }
                          ];
                          setAccounts(sampleUsers);
                          setFilteredAccounts(sampleUsers);
                        }}
                        className="flex items-center space-x-2"
                      >
                        <span>➕</span>
                        <span>Thêm dữ liệu mẫu</span>
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
              <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Thông tin</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">Hành động</th>
                </tr>
              </thead>
              <tbody>
                      {filteredAccounts.map((user, index) => (
                        <motion.tr
                          key={user.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="py-4 px-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-blue-600">{user.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <div className="font-medium text-gray-900">{user.nameAccount}</div>
                                <div className="text-sm text-gray-500">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Mail className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{user.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              user.status === 1 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status === 1 ? (
                                <>
                                  <UserCheck className="w-3 h-3 mr-1" />
                                  Hoạt động
                                </>
                              ) : (
                                <>
                                  <UserX className="w-3 h-3 mr-1" />
                                  Không hoạt động
                                </>
                              )}
                        </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                                className="flex items-center space-x-1"
                              >
                                <Eye className="w-4 h-4" />
                                <span>Xem</span>
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleToggleStatus(user.id)}
                                className={`flex items-center space-x-1 ${
                                  user.status === 1 ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'
                                }`}
                              >
                                {user.status === 1 ? (
                                  <>
                                    <Lock className="w-4 h-4" />
                                    <span>Khóa</span>
                                  </>
                                ) : (
                                  <>
                                    <Unlock className="w-4 h-4" />
                                    <span>Mở</span>
                                  </>
                                )}
                              </Button>
                            </div>
                    </td>
                        </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* User Details Modal */}
      <Modal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title="Thông tin người dùng"
        size="lg"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedUser.nameAccount}</h3>
                <p className="text-gray-500">ID: {selectedUser.id}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Số điện thoại</p>
                  <p className="font-medium">{selectedUser.phone || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ</p>
                  <p className="font-medium">{selectedUser.address || 'Chưa cập nhật'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  {selectedUser.status === 1 ? (
                    <UserCheck className="w-5 h-5 text-green-500" />
                  ) : (
                    <UserX className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  <p className="font-medium">
                    {selectedUser.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowUserModal(false)}
              >
                Đóng
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowUserModal(false);
                  setShowDeleteModal(true);
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa người dùng
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => selectedUser && handleDeleteUser(selectedUser.id)}
        title="Xác nhận xóa"
        message={`Bạn có chắc chắn muốn xóa người dùng "${selectedUser?.nameAccount}"? Hành động này không thể hoàn tác.`}
        confirmText="Xóa"
        cancelText="Hủy"
        variant="danger"
      />
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
                Server không khả dụng. Nhấn &quot;Thêm dữ liệu mẫu&quot; để demo.
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
