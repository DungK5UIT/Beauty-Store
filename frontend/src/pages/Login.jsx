import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const Login = ({ onBack }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  // Check login status on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      setIsLoggedIn(true);
      setUserName(user.fullName);
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    // Validate confirmPassword for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('Mật khẩu và xác nhận mật khẩu không khớp');
      setIsLoading(false);
      return;
    }

    try {
      const url = isLogin
        ? 'https://deploy-backend-production-e64e.up.railway.app/api/auth/login'
        : 'https://deploy-backend-production-e64e.up.railway.app/api/auth/register';
      const response = await axios.post(url, {
        email: formData.email,
        password: formData.password,
        ...(isLogin ? { rememberMe: formData.rememberMe } : { fullName: formData.fullName }),
      });
      const user = response.data;

      if (isLogin) {
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUserName(user.fullName);
        navigate('/', { replace: true });
        window.location.reload();
      } else {
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLogin(true);
        setFormData({
          email: formData.email,
          password: '',
          confirmPassword: '',
          fullName: '',
          rememberMe: false,
        });
      }
    } catch (err) {
      const errorMessage = err.response?.data || 'Đã có lỗi xảy ra, vui lòng thử lại';
      setError(errorMessage);
      console.error(isLogin ? 'Đăng nhập thất bại:' : 'Đăng ký thất bại:', err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.id) {
      try {
        await axios.post('https://deploy-backend-production-e64e.up.railway.app/api/auth/logout', {
          id: user.id,
        });
        setSuccessMessage('Đăng xuất thành công');
      } catch (err) {
        const errorMessage = err.response?.data || 'Đăng xuất thất bại, vui lòng thử lại';
        setError(errorMessage);
        console.error('Đăng xuất thất bại:', err.response || err);
        return; // Không tiếp tục xóa localStorage nếu đăng xuất thất bại
      }
    }
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      rememberMe: false,
    });
    setError('');
    navigate('/login', { replace: true });
    window.location.reload();
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      rememberMe: false,
    });
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-pink-600 transition-colors mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Quay lại trang chủ
          </button>
        )}
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-pink-600 rounded-full flex items-center justify-center mb-6">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoggedIn ? `Xin chào, ${userName}!` : (isLogin ? 'Đăng nhập' : 'Đăng ký')}
          </h2>
          <p className="text-gray-600">
            {isLoggedIn ? 'Bạn đã đăng nhập!' : (isLogin ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới')}
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4">{successMessage}</p>}
          {isLoading ? (
            <div className="text-center">
              <p>Đang xử lý...</p>
            </div>
          ) : !isLoggedIn ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required={!isLogin}
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      placeholder="Nhập họ và tên của bạn"
                    />
                  </div>
                </div>
              )}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
              {!isLogin && (
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required={!isLogin}
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                </div>
              )}
              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                    />
                    <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                      Ghi nhớ đăng nhập
                    </label>
                  </div>
                  <a href="#" className="text-sm text-pink-600 hover:text-pink-500">
                    Quên mật khẩu?
                  </a>
                </div>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors"
              >
                {isLogin ? 'Đăng nhập' : 'Đăng ký'}
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Hoặc</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="ml-2">Google</span>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="ml-2">Facebook</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <p className="text-gray-600 text-center">Chào mừng bạn, {userName}!</p>
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          )}
          {!isLoggedIn && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
                <button
                  type="button"
                  onClick={toggleForm}
                  className="ml-1 font-medium text-pink-600 hover:text-pink-500"
                >
                  {isLogin ? 'Đăng ký ngay' : 'Đăng nhập'}
                </button>
              </p>
            </div>
          )}
        </div>
        <div className="text-center text-xs text-gray-500">
          <p>
            Bằng việc đăng nhập, bạn đồng ý với{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Điều khoản sử dụng
            </a>{' '}
            và{' '}
            <a href="#" className="text-pink-600 hover:text-pink-500">
              Chính sách bảo mật
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;