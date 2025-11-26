"use client";

import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, BookOpen, Users, Award } from 'lucide-react';
import { Button, Input, Card, useToastNotifications } from '@/app/components/ui';
import Link from 'next/link';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { success, error } = useToastNotifications();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let formErrors: { [key: string]: string } = {};
    if (!email) formErrors.email = 'Email không được để trống';
    if (!password) formErrors.password = 'Mật khẩu không được để trống';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/userList');
      const users = response.data;

      const currentUser = users.find(
        (user: any) => user.email === email
      );

      if (currentUser) {
        // Decrypt the password from the database
        const decryptedPassword = CryptoJS.AES.decrypt(currentUser.password, 'your-secret-key').toString(CryptoJS.enc.Utf8);

        if (decryptedPassword === password) {
          if (currentUser.lock === 'lock') {
            error('Tài khoản bị khóa', 'Tài khoản này đã bị khóa!');
          } else {
            localStorage.setItem('keyLogin', currentUser.id);
            await axios.patch(`http://localhost:5000/userList/${currentUser.id}`, { status: 1 });
            success('Đăng nhập thành công', 'Chào mừng bạn quay trở lại!');
            setTimeout(() => {
              router.push('/pages/user/home');
            }, 1000);
          }
        } else {
          error('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng!');
        }
      } else {
        error('Đăng nhập thất bại', 'Tài khoản hoặc mật khẩu không đúng!');
      }
    } catch (error) {
      console.error('Error during login:', error);
      error('Lỗi', 'Có lỗi xảy ra trong quá trình đăng nhập!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <div className="text-center space-y-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-32 h-32 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full mx-auto flex items-center justify-center shadow-2xl"
            >
              <BookOpen className="w-16 h-16 text-white" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-5xl font-bold text-gray-900">
                Chào mừng trở lại
              </h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Đăng nhập để tiếp tục hành trình học tập của bạn
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="grid grid-cols-3 gap-6 max-w-md mx-auto"
            >
              {[
                { icon: Users, value: "10,000+", label: "Học viên" },
                { icon: BookOpen, value: "500+", label: "Đề thi" },
                { icon: Award, value: "95%", label: "Tỷ lệ đỗ" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-6 h-6 text-amber-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          <Card variant="glass" padding="xl" className="backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center mb-8"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Đăng nhập
              </h2>
              <p className="text-gray-600">
                Nhập thông tin để truy cập tài khoản
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Input
                  label="Email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={handleEmailChange}
                  error={errors.email}
                  icon={<Mail className="w-5 h-5" />}
                  variant="filled"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="relative">
                  <Input
                    label="Mật khẩu"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={handlePasswordChange}
                    error={errors.password}
                    icon={<Lock className="w-5 h-5" />}
                    variant="filled"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600">Lưu mật khẩu</span>
                </label>
                <Link
                  href="#"
                  className="text-sm text-amber-600 hover:text-amber-700 transition-colors duration-200"
                >
                  Quên mật khẩu?
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  icon={<ArrowRight className="w-5 h-5" />}
                  iconPosition="right"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  Bạn chưa có tài khoản?{' '}
                  <Link
                    href="/pages/user/sign-up"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                  >
                    Đăng ký ngay
                  </Link>
                </p>
              </motion.div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
