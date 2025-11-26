"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, LogOut, Menu, X, Bell, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Swal from 'sweetalert2';

interface User {
  id: string;
  nameAccount: string;
  img: string;
}

interface Exam {
  id: string;
  name: string;
}

interface HeaderProps {
  user?: User | null;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, isLoggedIn, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Exam[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const router = useRouter();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length > 0) {
      try {
        const response = await fetch('http://localhost:5000/examList');
        const exams = await response.json();
        const filtered = exams.filter((exam: Exam) =>
          exam.name.toLowerCase().includes(query.toLowerCase())
        );
        setSearchResults(filtered.slice(0, 5));
      } catch (error) {
        console.error('Error searching exams:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Bạn có chắc muốn đăng xuất?',
      text: 'Bạn sẽ cần phải đăng nhập lại để sử dụng các chức năng khác.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đăng xuất',
      cancelButtonText: 'Hủy bỏ',
      confirmButtonColor: '#f59e0b',
      cancelButtonColor: '#6b7280',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("keyLogin");
        onLogout?.();
        router.push('/pages/user/sign-in');
        Swal.fire({
          title: 'Đã đăng xuất!',
          text: 'Hẹn gặp lại bạn!',
          icon: 'success',
          confirmButtonColor: '#f59e0b',
        });
      }
    });
  };

  const navItems = [
    { href: '/pages/user/home', label: 'Trang chủ' },
    { href: '/pages/user/courses', label: 'Khóa thi' },
    { href: '/pages/user/contact', label: 'Liên hệ' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-amber-200"
          : "bg-gradient-to-r from-amber-400 to-yellow-500 shadow-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-3"
          >
            <Link href="/pages/user/home" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md">
                <span className="text-amber-600 font-bold text-xl">T</span>
              </div>
              <span className={cn(
                "text-xl font-bold hidden sm:block transition-colors duration-300",
                isScrolled ? "text-amber-600" : "text-white"
              )}>
                OnlineTest
              </span>
            </Link>
          </motion.div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-white/90 backdrop-blur-sm border border-amber-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Search Results */}
            <AnimatePresence>
              {isSearchFocused && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-amber-200 max-h-60 overflow-y-auto z-50"
                >
                  {searchResults.map((exam) => (
                    <Link
                      key={exam.id}
                      href={`/pages/user/exam/${exam.id}`}
                      className="block px-4 py-3 hover:bg-amber-50 transition-colors duration-200 border-b border-gray-100 last:border-b-0"
                    >
                      <p className="text-sm font-medium text-gray-900">{exam.name}</p>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-medium transition-colors duration-200 relative group",
                    isScrolled 
                      ? "text-gray-700 hover:text-amber-600" 
                      : "text-white hover:text-amber-100"
                  )}
                >
                  {item.label}
                  <span className={cn(
                    "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full",
                    isScrolled ? "bg-amber-600" : "bg-white"
                  )}></span>
                </Link>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {isLoggedIn && user ? (
                <div className="flex items-center space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "p-2 rounded-full transition-colors duration-200",
                      isScrolled
                        ? "text-gray-700 hover:bg-amber-100"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <Bell className="w-5 h-5" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className={cn(
                      "p-2 rounded-full transition-colors duration-200",
                      isScrolled
                        ? "text-gray-700 hover:bg-amber-100"
                        : "text-white hover:bg-white/20"
                    )}
                  >
                    <MessageCircle className="w-5 h-5" />
                  </motion.button>

                  <div className={cn(
                    "flex items-center space-x-3 rounded-full px-4 py-2 transition-colors duration-200",
                    isScrolled
                      ? "bg-amber-50"
                      : "bg-white/20"
                  )}>
                    <motion.img
                      whileHover={{ scale: 1.1 }}
                      src={user.img}
                      alt={user.nameAccount}
                      className="w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => router.push('/pages/user/profile')}
                    />
                    <span className={cn(
                      "font-medium hidden lg:block transition-colors duration-200",
                      isScrolled ? "text-gray-700" : "text-white"
                    )}>
                      Hi, {user.nameAccount}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleLogout}
                      className={cn(
                        "p-1 rounded-full transition-colors duration-200",
                        isScrolled
                          ? "text-gray-700 hover:bg-amber-100"
                          : "text-white hover:bg-white/20"
                      )}
                    >
                      <LogOut className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/pages/user/sign-in"
                    className={cn(
                      "font-medium transition-colors duration-200",
                      isScrolled
                        ? "text-gray-700 hover:text-amber-600"
                        : "text-white hover:text-amber-100"
                    )}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/pages/user/sign-up"
                    className={cn(
                      "px-4 py-2 rounded-full font-medium transition-colors duration-200",
                      isScrolled
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-white text-amber-600 hover:bg-amber-50"
                    )}
                  >
                    Đăng ký
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              "md:hidden p-2 rounded-full transition-colors duration-200",
              isScrolled
                ? "text-gray-700 hover:bg-amber-100"
                : "text-white hover:bg-white/20"
            )}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/95 backdrop-blur-md border-t border-amber-200"
            >
              <div className="px-4 py-4 space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="block text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {isLoggedIn && user ? (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <div className="flex items-center space-x-3">
                      <img
                        src={user.img}
                        alt={user.nameAccount}
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="text-gray-700 font-medium">
                        Hi, {user.nameAccount}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-red-600 hover:text-red-700 font-medium transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-200 space-y-3">
                    <Link
                      href="/pages/user/sign-in"
                      className="block text-gray-700 hover:text-amber-600 font-medium transition-colors duration-200"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      href="/pages/user/sign-up"
                      className="block bg-amber-500 text-white px-4 py-2 rounded-full font-medium hover:bg-amber-600 transition-colors duration-200 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Đăng ký
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Header;
