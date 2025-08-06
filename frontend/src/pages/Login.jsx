import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login, register, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isLoginView, setIsLoginView] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const emailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, [isLoginView]);

  useEffect(() => {
    if (user && !authLoading) {
      navigate('/', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Định dạng email không hợp lệ';
    
    if (!formData.password) newErrors.password = 'Mật khẩu không được để trống';
    else if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    
    if (!isLoginView) {
      if (!formData.fullName) newErrors.fullName = 'Họ và tên không được để trống';
      else if (formData.fullName.length < 2 || formData.fullName.length > 100) {
        newErrors.fullName = 'Họ và tên phải từ 2 đến 100 ký tự';
      }
      
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Xác nhận mật khẩu không được để trống';
      else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Mật khẩu và xác nhận mật khẩu không khớp';
      }
      
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
      if (!strongPasswordRegex.test(formData.password)) {
        newErrors.password = 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      if (isLoginView) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLoginView(true);
        setFormData({ email: formData.email, password: '', confirmPassword: '', fullName: '' });
      }
    } catch (err) {
      console.error(isLoginView ? 'Đăng nhập thất bại:' : 'Đăng ký thất bại:', err);
      const status = err.response?.status;
      let message = err.response?.data?.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
      
      if (err.message.includes('Response đăng nhập thiếu role')) {
        message = 'Lỗi hệ thống: Dữ liệu người dùng không đầy đủ';
      }

      if (status === 400) {
        if (message.includes('Email đã được sử dụng')) {
          setErrors({ email: message });
        } else if (message.includes('Mật khẩu và xác nhận mật khẩu không khớp')) {
          setErrors({ confirmPassword: message });
        } else if (message.includes('Mật khẩu phải chứa')) {
          setErrors({ password: message });
        } else {
          setErrors({ general: message });
        }
      } else if (status === 401) {
        setErrors({ general: 'Email hoặc mật khẩu không đúng' });
      } else {
        setErrors({ general: message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
    setErrors({});
    setSuccessMessage('');
  };

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (user) {
    return <div className="min-h-screen flex items-center justify-center">Đang chuyển hướng...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link to="/" className="flex items-center justify-center text-gray-600 hover:text-pink-600 transition-colors mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Quay lại trang chủ
          </Link>
          <div className="mx-auto h-20 w-20 bg-pink-600 rounded-full flex items-center justify-center mb-6">
            <User size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLoginView ? 'Đăng nhập' : 'Đăng ký'}
          </h2>
          <p className="text-gray-600">
            {isLoginView ? 'Chào mừng bạn trở lại!' : 'Tạo tài khoản mới'}
          </p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {errors.general && <p className="text-red-500 text-sm mb-4 text-center">{errors.general}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLoginView && (
              <InputField
                id="fullName"
                name="fullName"
                type="text"
                placeholder="Nhập họ và tên của bạn"
                value={formData.fullName}
                onChange={handleInputChange}
                Icon={User}
                label="Họ và tên"
                error={errors.fullName}
                required
              />
            )}
            <InputField
              id="email"
              name="email"
              type="email"
              placeholder="example@email.com"
              value={formData.email}
              onChange={handleInputChange}
              Icon={Mail}
              label="Email"
              error={errors.email}
              required
              ref={emailInputRef}
            />
            <PasswordField
              id="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleInputChange}
              show={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              label="Mật khẩu"
              error={errors.password}
              required
            />
            {!isLoginView && (
              <PasswordField
                id="confirmPassword"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                show={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                label="Xác nhận mật khẩu"
                error={errors.confirmPassword}
                required
              />
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:bg-pink-400 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginView ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button
                type="button"
                onClick={toggleView}
                className="ml-1 font-medium text-pink-600 hover:text-pink-500"
              >
                {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({ id, name, type, placeholder, value, onChange, Icon, label, error, required, ...props }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-3 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
        placeholder={placeholder}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  </div>
);

const PasswordField = ({ id, name, placeholder, value, onChange, show, onToggle, label, error, required }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input
        id={id}
        name={name}
        type={show ? 'text' : 'password'}
        required={required}
        value={value}
        onChange={onChange}
        className={`block w-full pl-10 pr-10 py-3 border ${error ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors`}
        placeholder={placeholder}
      />
      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={onToggle}>
        {show ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
      </button>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  </div>
);

export default Login;