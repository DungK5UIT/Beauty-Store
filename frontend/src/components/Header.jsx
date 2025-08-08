import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loadingCart, setLoadingCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const userMenuRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchCartCount = async (userId) => {
      try {
        setLoadingCart(true);
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        const cartItems = response.data;
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalQuantity);
      } catch (error) {
        const status = error.response?.status;
        let message = error.response?.data?.message || 'Không thể tải giỏ hàng';
        if (status === 401) {
          message = 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.';
          logout();
          navigate('/login');
        }
        setToast({ show: true, message, type: 'error' });
        setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
        setCartItemCount(0);
        console.error('Không thể lấy giỏ hàng:', error.response || error);
      } finally {
        setLoadingCart(false);
      }
    };

    if (user && user.id) {
      fetchCartCount(user.id);
    } else {
      setCartItemCount(0);
    }
  }, [user, location, logout, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    try {
      setIsUserMenuOpen(false);
      await logout();
      setToast({ show: true, message: 'Đăng xuất thành công', type: 'success' });
      setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    } catch (error) {
      setToast({ show: true, message: 'Lỗi khi đăng xuất, vui lòng thử lại', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
    }
  };

  const handleUserIconClick = () => {
    if (user) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };

  const handleSearchClick = () => {
    setIsSearchOpen(prev => !prev);
    setTimeout(() => searchInputRef.current?.focus(), 0); // Focus input when opened
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setToast({ show: true, message: 'Vui lòng nhập từ khóa tìm kiếm', type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/api/products/list`, {
        params: { name: searchQuery }
      });
      setIsSearchOpen(false);
      setSearchQuery('');
      navigate('/search', { state: { searchResults: response.data, query: searchQuery } });
    } catch (error) {
      const message = error.response?.data?.message || 'Không thể tìm kiếm sản phẩm';
      setToast({ show: true, message, type: 'error' });
      setTimeout(() => setToast({ show: false, message: '', type: 'error' }), 3000);
      console.error('Lỗi khi tìm kiếm:', error.response || error);
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      {toast.show && (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}

      <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white text-center py-2 text-sm font-medium">
        🎉 MIỄN PHÍ GIAO HÀNG cho đơn hàng từ 500K - Khuyến mãi đặc biệt cuối tuần! 🎉
      </div>

      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">✨</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
                BEAUTY LUXE
              </h1>
              <p className="text-xs text-gray-500 font-medium">Premium Cosmetics</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/product">Sản phẩm</NavLink>
            <NavLink to="/about">Giới thiệu</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin">Quản lý</NavLink>
            )}
          </nav>

          {/* Action Buttons and Search */}
          <div className="flex items-center space-x-5">
            <div className="relative" ref={searchInputRef}>
              <ActionButton Icon={Search} onClick={handleSearchClick} />
              {isSearchOpen && (
                <form onSubmit={handleSearchSubmit} className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 px-3 z-20 ring-1 ring-black ring-opacity-5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm..."
                    className="w-full px-3 py-2 text-sm text-gray-700 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </form>
              )}
            </div>
            {user && (
              <Link to="/cart" className="relative text-gray-500 hover:text-emerald-500 transition-colors duration-300">
                <ShoppingCart size={22} />
                {cartItemCount > 0 && !loadingCart && (
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
                    onClick={handleLogoutClick}
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