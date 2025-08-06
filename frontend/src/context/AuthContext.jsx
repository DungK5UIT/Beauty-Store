import React, { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// URL của backend
const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

// 1. Tạo Context
const AuthContext = createContext(null);

// 2. Tạo Provider Component - "Nhà cung cấp" trạng thái
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // State để kiểm tra auth ban đầu
  const navigate = useNavigate();

  // Kiểm tra localStorage khi app khởi động
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false); // Hoàn tất kiểm tra
    }
  }, []);

  // Hàm đăng nhập
  const login = async (email, password) => {
    // Backend đã được cập nhật để chỉ cần email và password
    const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
    const userData = response.data;
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    navigate('/'); // Tự động chuyển về trang chủ sau khi đăng nhập thành công
    return userData;
  };

  // Hàm đăng ký
  const register = async (fullName, email, password, confirmPassword) => {
    const response = await axios.post(`${API_BASE_URL}/api/auth/register`, { 
      fullName, 
      email, 
      password, 
      confirmPassword,
      rememberMe: false // Giá trị mặc định
    });
    return response.data;
  };

  // Hàm đăng xuất
  const logout = async () => {
    if (user && user.id) {
      try {
        await axios.post(`${API_BASE_URL}/api/auth/logout`, { id: user.id });
      } catch (error) {
        console.error('API logout call failed, proceeding with client-side logout.', error);
      }
    }
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  // Giá trị được cung cấp cho toàn bộ ứng dụng
  const authContextValue = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  // Chỉ render các component con sau khi đã kiểm tra auth xong
  return (
    <AuthContext.Provider value={authContextValue}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// 3. Tạo custom hook để sử dụng dễ dàng
export const useAuth = () => {
  return useContext(AuthContext);
};
