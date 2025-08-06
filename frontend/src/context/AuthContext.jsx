import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra token trong localStorage khi khởi tạo
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
    const email = localStorage.getItem('email');
    const fullName = localStorage.getItem('fullName');
    
    if (token && userId && email && fullName) {
      setUser({ id: userId, email, fullName });
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://your-api-base-url/api/auth/login', { email, password });
      const { id, email: userEmail, fullName, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('fullName', fullName);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ id, email: userEmail, fullName });
      navigate('/', { replace: true });
    } catch (error) {
      throw error;
    }
  };

  const register = async (fullName, email, password, confirmPassword) => {
    try {
      const response = await axios.post('https://your-api-base-url/api/auth/register', {
        fullName,
        email,
        password,
        confirmPassword,
      });
      const { id, email: userEmail, fullName: userFullName, token } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', id);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('fullName', userFullName);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser({ id, email: userEmail, fullName: userFullName });
      navigate('/', { replace: true });
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const userId = localStorage.getItem('userId');
      await axios.post('https://your-api-base-url/api/auth/logout', { id: userId });
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('fullName');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // Vẫn xóa token và đăng xuất phía client ngay cả khi request thất bại
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('email');
      localStorage.removeItem('fullName');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);