"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Phone, 
  Camera, 
  Edit3, 
  Lock, 
  Save, 
  Upload,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { 
  Header, 
  Footer, 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  Button, 
  Input, 
  Modal,
  useToastNotifications 
} from "@/app/components/ui";
import Link from "next/link";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKBiGGm6pwc9FU7pRiQTQ3LmSTJ7UciL8",
  authDomain: "modul4-1747b.firebaseapp.com",
  projectId: "modul4-1747b",
  storageBucket: "modul4-1747b.appspot.com",
  messagingSenderId: "784858061545",
  appId: "1:784858061545:web:27cf15a60a8f28fc72ae78",
  measurementId: "G-850N3PFX0Q",
};


const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

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

const Profile: React.FC = () => {
  const [yourProfile, setYourProfile] = useState<Account | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { success, error } = useToastNotifications();

  // Form states
  const [editForm, setEditForm] = useState({
    nameAccount: '',
    address: '',
    phone: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Fetch user data from the backend based on keyLogin
  useEffect(() => {
    const fetchUser = async () => {
      const idUserLogin = localStorage.getItem("keyLogin");
      if (idUserLogin) {
        try {
          const response = await axios.get(
            `http://localhost:5000/userList/${idUserLogin}`
          );
          const currentUser = response.data;
          if (currentUser) {
            setYourProfile(currentUser);
            setEditForm({
              nameAccount: currentUser.nameAccount || '',
              address: currentUser.address || '',
              phone: currentUser.phone || ''
            });
          }
        } catch (err) {
          console.error("Error fetching user data:", err);
          error('Lỗi', 'Không thể tải thông tin người dùng');
        }
      }
    };

    fetchUser();
  }, []);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = async () => {
    if (!editForm.nameAccount || !editForm.address || !editForm.phone) {
      error('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    // Validate phone number
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(editForm.phone)) {
      error('Lỗi', 'Số điện thoại không hợp lệ! Vui lòng nhập từ 10 đến 15 chữ số.');
      return;
    }

    setLoading(true);
    try {
      const updatedProfile = {
        id: yourProfile?.id ?? 0,
        img: yourProfile?.img ?? "",
        password: yourProfile?.password ?? "",
        status: yourProfile?.status ?? 0,
        nameAccount: editForm.nameAccount,
        email: yourProfile?.email,
        address: editForm.address,
        phone: editForm.phone,
      };

      await saveAccountToBackend(updatedProfile);
      setYourProfile(updatedProfile as Account);
      setIsEditModalOpen(false);
      success('Thành công!', 'Thông tin cá nhân đã được cập nhật.');
    } catch (err) {
      error('Lỗi', 'Không thể cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = () => {
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = async () => {
    if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      error('Lỗi', 'Vui lòng điền đầy đủ thông tin!');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      error('Lỗi', 'Mật khẩu xác nhận không khớp!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      error('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }

    try {
      const decryptedOldPassword = CryptoJS.AES.decrypt(
        yourProfile?.password || "",
        "your-secret-key"
      ).toString(CryptoJS.enc.Utf8);

      if (decryptedOldPassword !== passwordForm.oldPassword) {
        error('Lỗi', 'Mật khẩu cũ không đúng!');
        return;
      }

      const encryptedPassword = CryptoJS.AES.encrypt(
        passwordForm.newPassword,
        "your-secret-key"
      ).toString();

      if (yourProfile) {
        const updatedProfile = { ...yourProfile, password: encryptedPassword };
        await saveAccountToBackend(updatedProfile);
        setYourProfile(updatedProfile);
        setIsPasswordModalOpen(false);
        setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
        success('Thành công!', 'Mật khẩu đã được đổi.');
      }
    } catch (err) {
      error('Lỗi', 'Không thể đổi mật khẩu');
    }
  };

  const handleChangeAvatar = () => {
    setIsAvatarModalOpen(true);
  };

  const handleUploadAvatar = async (file: File) => {
    if (!file) return;

    setUploading(true);
    try {
      const storageRef = ref(storage, `profile-pictures/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      if (yourProfile) {
        const updatedProfile = { ...yourProfile, img: downloadURL };
        await saveAccountToBackend(updatedProfile);
        setYourProfile(updatedProfile);
        setIsAvatarModalOpen(false);
        success('Thành công!', 'Ảnh đại diện đã được cập nhật.');
      }
    } catch (err) {
      error('Lỗi', 'Không thể tải lên ảnh');
    } finally {
      setUploading(false);
    }
  };

  const saveAccountToBackend = async (account: Account) => {
    try {
      const response = await axios.put(`http://localhost:5000/userList/${account.id}`, account);
      console.log("Profile updated:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

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
                Hồ sơ cá nhân
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto">
                Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
              </p>
            </motion.div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Navigation */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1"
              >
                <Card variant="glass" padding="lg" className="sticky top-24">
                  <nav className="space-y-2">
                    <Link href="/pages/user/profile">
                      <div className="flex items-center space-x-3 p-3 rounded-lg bg-amber-100 text-amber-800 font-medium">
                        <User className="w-5 h-5" />
                        <span>Thông tin cá nhân</span>
                      </div>
                    </Link>
                    <Link href="/pages/user/history">
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-gray-700 transition-colors duration-200">
                        <CheckCircle className="w-5 h-5" />
                        <span>Lịch sử làm bài</span>
                      </div>
                    </Link>
                  </nav>
                </Card>
              </motion.div>

              {/* Main Profile Content */}
              <div className="lg:col-span-3">
                {yourProfile ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Profile Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                    >
                      <Card variant="elevated" padding="lg" className="h-full">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold text-center">
                            Ảnh đại diện
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="relative inline-block">
                            <img
                              src={yourProfile.img}
                              alt="Avatar"
                              className="w-48 h-48 rounded-full object-cover mx-auto mb-6 shadow-lg"
                            />
                            <button
                              onClick={handleChangeAvatar}
                              className="absolute bottom-6 right-6 bg-amber-500 text-white p-3 rounded-full shadow-lg hover:bg-amber-600 transition-colors duration-200"
                            >
                              <Camera className="w-5 h-5" />
                            </button>
                          </div>
                          
                          <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            {yourProfile.nameAccount}
                          </h3>
                          
                          <div className="space-y-3">
                            <Button
                              variant="primary"
                              size="md"
                              fullWidth
                              onClick={handleEditProfile}
                              icon={<Edit3 className="w-4 h-4" />}
                            >
                              Chỉnh sửa thông tin
                            </Button>
                            <Button
                              variant="outline"
                              size="md"
                              fullWidth
                              onClick={handleChangePassword}
                              icon={<Lock className="w-4 h-4" />}
                            >
                              Đổi mật khẩu
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Information Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      <Card variant="elevated" padding="lg" className="h-full">
                        <CardHeader>
                          <CardTitle className="text-2xl font-bold">
                            Thông tin cá nhân
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Mail className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Email</h4>
                              <p className="text-gray-600">{yourProfile.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Địa chỉ</h4>
                              <p className="text-gray-600">{yourProfile.address}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4">
                            <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Phone className="w-5 h-5 text-amber-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Số điện thoại</h4>
                              <p className="text-gray-600">{yourProfile.phone}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Đang tải thông tin...
                    </h3>
                    <p className="text-gray-500">
                      Vui lòng đợi trong giây lát
                    </p>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Chỉnh sửa thông tin"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Tên người dùng"
            value={editForm.nameAccount}
            onChange={(e) => setEditForm({ ...editForm, nameAccount: e.target.value })}
            icon={<User className="w-5 h-5" />}
            variant="filled"
          />
          
          <Input
            label="Địa chỉ"
            value={editForm.address}
            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
            icon={<MapPin className="w-5 h-5" />}
            variant="filled"
          />
          
          <Input
            label="Số điện thoại"
            value={editForm.phone}
            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
            icon={<Phone className="w-5 h-5" />}
            variant="filled"
          />
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsEditModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSaveProfile}
              loading={loading}
              icon={<Save className="w-4 h-4" />}
            >
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Đổi mật khẩu"
        size="md"
      >
        <div className="space-y-6">
          <Input
            label="Mật khẩu cũ"
            type="password"
            value={passwordForm.oldPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
            icon={<Lock className="w-5 h-5" />}
            variant="filled"
          />
          
          <Input
            label="Mật khẩu mới"
            type="password"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            icon={<Lock className="w-5 h-5" />}
            variant="filled"
          />
          
          <Input
            label="Xác nhận mật khẩu mới"
            type="password"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            icon={<Lock className="w-5 h-5" />}
            variant="filled"
          />
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setIsPasswordModalOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={handleSavePassword}
              icon={<Save className="w-4 h-4" />}
            >
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal>

      {/* Change Avatar Modal */}
      <Modal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        title="Thay đổi ảnh đại diện"
        size="sm"
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
              <img
                src={yourProfile?.img}
                alt="Current avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-gray-600 mb-4">
              Chọn ảnh mới để thay đổi ảnh đại diện
            </p>
          </div>
          
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleUploadAvatar(file);
              }
            }}
            className="hidden"
            id="avatar-upload"
          />
          
          <label
            htmlFor="avatar-upload"
            className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-500 transition-colors duration-200"
          >
            <Upload className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">Chọn ảnh từ máy tính</span>
          </label>
          
          {uploading && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 text-amber-600">
                <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Đang tải lên...</span>
              </div>
            </div>
          )}
        </div>
      </Modal>

      <Footer />
    </div>
  );
};

export default Profile;
