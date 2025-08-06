import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, Mail, ArrowLeft } from 'lucide-react';
// Giả sử bạn sẽ tạo file AuthContext.js như đã thảo luận
import { useAuth } from '../context/AuthContext'; 

const Login= () => {
  // --- THAY ĐỔI 1: Sử dụng context ---
  const { login, register, user } = useAuth();
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
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- THAY ĐỔI 2: Tự động chuyển hướng nếu đã đăng nhập ---
  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- THAY ĐỔI 3: Đơn giản hóa hàm handleSubmit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      if (isLoginView) {
        // Gọi hàm login từ context
        await login(formData.email, formData.password);
        // Việc điều hướng đã được xử lý bên trong hàm login của context
      } else {
        // Gọi hàm register từ context
        await register(formData.fullName, formData.email, formData.password, formData.confirmPassword);
        setSuccessMessage('Đăng ký thành công! Vui lòng đăng nhập.');
        setIsLoginView(true); // Tự động chuyển sang form đăng nhập
        // Xóa các trường không cần thiết, giữ lại email để người dùng tiện đăng nhập
        setFormData(prev => ({ ...prev, password: '', confirmPassword: '', fullName: '' }));
      }
    } catch (err) {
      // Lấy lỗi từ response của backend đã được chuẩn hóa
      const errorMessage = err.response?.data?.message || err.message || 'Đã có lỗi xảy ra, vui lòng thử lại';
      setError(errorMessage);
      console.error(isLoginView ? 'Đăng nhập thất bại:' : 'Đăng ký thất bại:', err.response || err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    // Reset toàn bộ form khi chuyển đổi
    setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });
    setError('');
    setSuccessMessage('');
  };

  // Nếu user đã tồn tại (đang trong quá trình kiểm tra auth ban đầu), không render gì cả
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
            {/* --- THAY ĐỔI 4: Dùng Link thay vì prop onBack --- */}
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
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLoginView && (
              <InputField id="fullName" name="fullName" type="text" placeholder="Nhập họ và tên của bạn" value={formData.fullName} onChange={handleInputChange} Icon={User} label="Họ và tên" required={!isLoginView} />
            )}
            <InputField id="email" name="email" type="email" placeholder="example@email.com" value={formData.email} onChange={handleInputChange} Icon={Mail} label="Email" required />
            <PasswordField id="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleInputChange} show={showPassword} onToggle={() => setShowPassword(!showPassword)} label="Mật khẩu" />
            {!isLoginView && (
              <PasswordField id="confirmPassword" name="confirmPassword" placeholder="••••••••" value={formData.confirmPassword} onChange={handleInputChange} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} label="Xác nhận mật khẩu" required={!isLoginView} />
            )}
            
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors disabled:bg-pink-400 disabled:cursor-not-allowed">
              {isLoading ? 'Đang xử lý...' : (isLoginView ? 'Đăng nhập' : 'Đăng ký')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLoginView ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}
              <button type="button" onClick={toggleView} className="ml-1 font-medium text-pink-600 hover:text-pink-500">
                {isLoginView ? 'Đăng ký ngay' : 'Đăng nhập'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- THAY ĐỔI 5: Tách các input field thành component con cho sạch sẽ ---
const InputField = ({ id, name, type, placeholder, value, onChange, Icon, label, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
      <input id={id} name={name} type={type} required={required} value={value} onChange={onChange} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors" placeholder={placeholder} />
    </div>
  </div>
);

const PasswordField = ({ id, name, placeholder, value, onChange, show, onToggle, label, required = false }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Lock className="h-5 w-5 text-gray-400" />
      </div>
      <input id={id} name={name} type={show ? 'text' : 'password'} required={required} value={value} onChange={onChange} className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-colors" placeholder={placeholder} />
      <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={onToggle}>
        {show ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
      </button>
    </div>
  </div>
);

export default Login;
