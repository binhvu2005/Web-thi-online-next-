"use client";

import React, { useState } from 'react';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle, BookOpen } from 'lucide-react';
import { Button, Input, Card, useToastNotifications } from '@/app/components/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Utility functions

const validateEmail = (email: string) => {
  return String(email).toLowerCase().match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

const validatePassword = (password: string) => {
  return password.length >= 6 && password.length <= 50;
};

const generateRandomId = () => {
  return Math.floor(10000 + Math.random() * 90000); // Random 5-digit number
};

const SignUp: React.FC = () => {
  const [nameAccount, setNameAccount] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const router = useRouter();
  const { success, error } = useToastNotifications();

  // Handle changes in form fields
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameAccount(e.target.value);
    setErrors((prev) => ({ ...prev, nameAccount: '' }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setErrors((prev) => ({ ...prev, email: '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setErrors((prev) => ({ ...prev, password: '' }));
  };

  const handleRePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRePassword(e.target.value);
    setErrors((prev) => ({ ...prev, rePassword: '' }));
  };

  // Function to check if email exists
  const checkEmailExists = async (email: string) => {
    try {
      const response = await axios.get('http://localhost:5000/userList');
      const accounts = response.data;
      return accounts.some((account: { email: string }) => account.email === email);
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    let formErrors: { [key: string]: string } = {};

    // Validate Name
    if (!nameAccount) formErrors.nameAccount = 'Tên không được để trống';

    // Validate Email
    if (!email) formErrors.email = 'Email không được để trống';
    else if (!validateEmail(email)) formErrors.email = 'Email không đúng định dạng';
    else if (email.length > 50) formErrors.email = 'Email quá dài';
    else if (await checkEmailExists(email)) formErrors.email = 'Email đã được sử dụng';

    // Validate Password
    if (!password) formErrors.password = 'Mật khẩu không được để trống';
    else if (!validatePassword(password)) formErrors.password = 'Mật khẩu phải từ 6 đến 50 ký tự';

    // Validate RePassword
    if (password !== rePassword) formErrors.rePassword = 'Mật khẩu không khớp';

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setLoading(false);
      return;
    }

    // Encrypt the password using AES before sending to the server
    const encryptedPassword = CryptoJS.AES.encrypt(password, 'your-secret-key').toString();

    try {
      const newUser = {
        id: `${generateRandomId()}`,
        nameAccount,
        email,
        password: encryptedPassword, // Encrypted password
        img: "https://th.bing.com/th/id/OIP._p7dSl1uR5eynQDkJyb1tgAAAA?rs=1&pid=ImgDetMain",
        status: 0,
        lock: "open",
        address: "chưa có",
        phone: "chưa có",
        result: []
      };

      const response = await axios.post('http://localhost:5000/userList', newUser);

      if (response.status === 201) {
        success('Đăng ký thành công!', 'Chào mừng bạn đến với OnlineTest!');
        setTimeout(() => {
          router.push('/pages/user/sign-in');
        }, 1500);
      }
    } catch (error) {
      console.error('There was an error!', error);
      error('Đăng ký thất bại', 'Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại sau.');
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
                Tham gia cùng chúng tôi
              </h1>
              <p className="text-xl text-gray-600 max-w-md mx-auto">
                Tạo tài khoản để bắt đầu hành trình học tập tuyệt vời
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="space-y-4 max-w-md mx-auto"
            >
              {[
                "Học tập mọi lúc, mọi nơi",
                "Đề thi đa dạng và phong phú",
                "Kết quả tức thì và chính xác",
                "Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp"
              ].map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Sign Up Form */}
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
                Tạo tài khoản
              </h2>
              <p className="text-gray-600">
                Điền thông tin để bắt đầu
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Input
                  label="Tên đăng ký"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  value={nameAccount}
                  onChange={handleNameChange}
                  error={errors.nameAccount}
                  icon={<User className="w-5 h-5" />}
                  variant="filled"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
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
                transition={{ duration: 0.6, delay: 0.5 }}
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
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative">
                  <Input
                    label="Xác nhận mật khẩu"
                    type={showRePassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={rePassword}
                    onChange={handleRePasswordChange}
                    error={errors.rePassword}
                    icon={<Lock className="w-5 h-5" />}
                    variant="filled"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRePassword(!showRePassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showRePassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
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
                  {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-center"
              >
                <p className="text-gray-600">
                  Bạn đã có tài khoản?{' '}
                  <Link
                    href="/pages/user/sign-in"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200"
                  >
                    Đăng nhập ngay
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

export default SignUp;
