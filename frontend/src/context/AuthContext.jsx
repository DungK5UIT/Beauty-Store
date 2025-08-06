import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.token && parsedUser.email && parsedUser.role) {
          setUser(parsedUser);
          axios.defaults.headers.common['Authorization'] = `Bearer ${parsedUser.token}`;
        } else {
          console.warn('Dữ liệu user trong localStorage không đầy đủ:', parsedUser);
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Lỗi khi parse user từ localStorage:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Gọi API đăng nhập:', `${API_BASE_URL}/api/auth/login`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });
      const { token, id, email: userEmail, fullName, role } = response.data;
      if (!role) {
        console.warn('Response đăng nhập thiếu role, đặt mặc định USER');
        role = 'USER';
      }
      const userWithToken = { id, email: userEmail, fullName, role, token };
      setUser(userWithToken);
      localStorage.setItem('user', JSON.stringify(userWithToken));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Đăng nhập thành công:', userWithToken);
    } catch (error) {
      console.error('Lỗi đăng nhập:', error.response || error);
      throw error;
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      console.log('Gọi API đăng ký:', `${API_BASE_URL}/api/auth/register`);
      const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
        fullName,
        email,
        password,
        confirmPassword,
      });
      console.log('Đăng ký thành công:', response.data);
    } catch (error) {
      console.error('Lỗi đăng ký:', error.response || error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (user?.id) {
        console.log('Gọi API đăng xuất:', `${API_BASE_URL}/api/auth/logout`);
        await axios.post(`${API_BASE_URL}/api/auth/logout`, { id: user.id });
      }
      setUser(null);
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
      console.log('Đăng xuất thành công');
    } catch (error) {
      console.error('Lỗi đăng xuất:', error.response || error);
      setUser(null);
      localStorage.removeItem('user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);