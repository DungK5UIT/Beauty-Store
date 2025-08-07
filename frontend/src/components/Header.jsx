import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle, Gift } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

// Component TopBar cho thông báo khuyến mãi
const TopBar = () => (
  <div className="bg-rose-500 text-white text-sm text-center py-2 px-4 font-semibold">
    ✨ Giao hàng miễn phí cho đơn hàng trên 500k ✨
  </div>
);

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const userMenuRef = useRef(null);

  // Effect để lấy số lượng sản phẩm trong giỏ hàng
  useEffect(() => {
    const fetchCartCount = async (userId) => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        const totalQuantity = response.data.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalQuantity);
      } catch (error) {
        // Xử lý lỗi một cách thầm lặng hơn để không làm phiền người dùng
        console.error('Không thể lấy giỏ hàng:', error.response || error);
        setCartItemCount(0);
        if (error.response?.status === 401) {
          logout();
        }
      }
    };

    if (user && user.id) {
      fetchCartCount(user.id);
    } else {
      setCartItemCount(0);
    }
  }, [user, location.pathname, logout]); // Thêm location.pathname để trigger khi chuyển trang

  // Effect để đóng menu người dùng khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleUserIconClick = () => {
    if (user) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };
  
  const handleLogoutClick = async () => {
    setIsUserMenuOpen(false);
    await logout();
    setToast({ show: true, message: 'Đăng xuất thành công!', type: 'success' });
    setTimeout(() => setToast({ show: false, message: '', type: '' }), 3000);
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50">
        <TopBar />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-400 hover:opacity-90 transition-opacity">
                BEAUTY STORE
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-baseline space-x-8">
              <NavLink to="/">Trang chủ</NavLink>
              <NavLink to="/product">Sản phẩm</NavLink>
              {user?.role === 'ADMIN' && (
                <NavLink to="/admin">Quản lý</NavLink>
              )}
            </nav>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              
              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="hidden lg:block relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-64 pl-4 pr-10 py-2 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 transition-all"
                />
                <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-rose-500">
                  <Search size={20} />
                </button>
              </form>

              {/* Cart Icon */}
              <Link to="/cart" className="relative text-gray-600 hover:text-rose-500 transition-colors">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
              
              {/* User Menu */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center text-gray-600 hover:text-rose-500 transition-colors"
                >
                  <User size={24} />
                  {user ? (
                    <ChevronDown size={16} className={`ml-1 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                  ) : null}
                </button>
                {user && isUserMenuOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-lg shadow-lg py-2 z-20 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">Xin chào,</p>
                      <p className="text-sm text-rose-500 truncate">{user.fullName}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center w-full px-4 py-2 mt-1 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <UserCircle size={18} className="mr-3" />
                      Tài khoản của tôi
                    </Link>
                    <button
                      onClick={handleLogoutClick}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LogOut size={18} className="mr-3" />
                      Đăng xuất
                    </button>
                  </div>
                )}
                {!user && (
                   <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg py-2 z-20 ring-1 ring-black ring-opacity-5" hidden={!isUserMenuOpen}>
                     <Link to="/login" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">Đăng nhập</Link>
                     <Link to="/register" onClick={() => setIsUserMenuOpen(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-rose-50">Đăng ký</Link>
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Toast Notification */}
      {toast.show && (
        <div className={`fixed top-24 right-5 px-4 py-2 rounded-lg shadow-lg z-50 text-white ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {toast.message}
        </div>
      )}
    </>
  );
};

// Component NavLink với hiệu ứng gạch chân
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-base font-medium transition-colors duration-300 group ${isActive ? 'text-rose-600' : 'text-gray-600 hover:text-rose-600'}`}
    >
      {children}
      <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-0.5 bg-rose-500 transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
    </Link>
  );
};

export default Header;