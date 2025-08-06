import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
// Giả sử bạn sẽ tạo file AuthContext.js như đã thảo luận
import { useAuth } from './AuthContext'; 

// URL của backend, nên được định nghĩa ở một nơi tập trung
const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Header = () => {
  // --- THAY ĐỔI 1: Sử dụng context thay vì state cục bộ ---
  const { user, logout } = useAuth(); 
  const navigate = useNavigate();
  const location = useLocation(); // Giữ lại location để cập nhật giỏ hàng khi chuyển trang
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const userMenuRef = useRef(null);

  // --- THAY ĐỔI 2: useEffect để lấy giỏ hàng giờ phụ thuộc vào `user` và `location` ---
  useEffect(() => {
    const fetchCartCount = async (userId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        const cartItems = response.data;
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalQuantity);
      } catch (error) {
        console.error('Không thể lấy giỏ hàng:', error);
        setCartItemCount(0); // Reset nếu có lỗi
      }
    };

    if (user && user.id) {
      fetchCartCount(user.id);
    } else {
      // Nếu không có user, reset giỏ hàng
      setCartItemCount(0);
    }
  }, [user, location]); // Chạy lại khi user thay đổi hoặc khi chuyển trang

  // Đóng menu khi click ra ngoài (giữ nguyên)
  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- THAY ĐỔI 3: Đơn giản hóa hàm logout ---
  const handleLogoutClick = () => {
    setIsUserMenuOpen(false); // Đóng menu trước
    logout(); // Gọi hàm logout từ context
  };

  const handleUserIconClick = () => {
    if (user) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-400 hover:opacity-90 transition-opacity">
            BEAUTY STORE
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/product">Sản phẩm</NavLink>
            <NavLink to="/about">Giới thiệu</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
            <NavLink to="/admin">Quản lý</NavLink>
          </nav>

          <div className="flex items-center space-x-5">
            <ActionButton Icon={Search} onClick={() => navigate('/search')} />

            {/* --- THAY ĐỔI 4: Dùng `user` để render có điều kiện --- */}
            {user && (
              <Link to="/cart" className="relative text-gray-500 hover:text-emerald-500 transition-colors duration-300">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserIconClick}
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors duration-300"
              >
                <User size={22} />
                <span className="hidden lg:inline font-medium text-gray-700">
                  {/* Dùng user.fullName thay vì userName state */}
                  {user ? `Chào, ${user.fullName.split(' ')[0]}` : 'Tài khoản'}
                </span>
                {user && (
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`}
                  />
                )}
              </button>

              {user && isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <UserCircle size={18} className="mr-3 text-emerald-500" />
                    Tài khoản của tôi
                  </Link>
                  <button
                    onClick={handleLogoutClick} // Dùng hàm đã được đơn giản hóa
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600"
                  >
                    <LogOut size={18} className="mr-3 text-emerald-500" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

// Các component phụ không thay đổi
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-lg font-medium transition-colors duration-300 group ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
    >
      {children}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`}></span>
    </Link>
  );
};

const ActionButton = ({ Icon, onClick }) => (
  <button onClick={onClick} className="text-gray-500 hover:text-emerald-500 transition-colors duration-300">
    <Icon size={22} />
  </button>
);

export default Header;
