import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const [cartItemCount, setCartItemCount] = useState(5); 

  const userMenuRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.fullName) {
      setIsLoggedIn(true);
      setUserName(user.fullName);
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuRef]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUserName('');
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const handleUserIconClick = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };

  return (
    // NEW: Hiệu ứng "Glassmorphism" - nền bán trong suốt, mờ ảo, shadow nhẹ nhàng
    <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* NEW: Logo với gradient Xanh Ngọc - Xanh Chanh tươi mát */}
          <Link to="/" className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-lime-400 hover:opacity-90 transition-opacity">
            BEAUTY STORE
          </Link>

          {/* NEW: Cập nhật màu sắc cho NavLink trên nền sáng */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/">Trang chủ</NavLink>
            <NavLink to="/product">Sản phẩm</NavLink>
            <NavLink to="/about">Giới thiệu</NavLink>
            <NavLink to="/contact">Liên hệ</NavLink>
            <NavLink to="/admin">Quản lý</NavLink>
          </nav>

          <div className="flex items-center space-x-5">
            <ActionButton Icon={Search} onClick={() => navigate('/search')} />
            
            {/* NEW: Cập nhật màu hover và badge theo theme mới */}
            <Link to="/cart" className="relative text-gray-500 hover:text-emerald-500 transition-colors duration-300">
              <ShoppingCart size={22} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>

            <div className="relative" ref={userMenuRef}>
              <button
                onClick={handleUserIconClick}
                className="flex items-center space-x-2 text-gray-500 hover:text-emerald-500 transition-colors duration-300"
              >
                <User size={22} />
                <span className="hidden lg:inline font-medium text-gray-700">
                  {isLoggedIn ? `Chào, ${userName.split(' ')[0]}` : 'Tài khoản'}
                </span>
                {isLoggedIn && <ChevronDown size={16} className={`transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />}
              </button>

              {/* NEW: Dropdown trên nền trắng sạch sẽ */}
              {isLoggedIn && isUserMenuOpen && (
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
                    onClick={handleLogout}
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

// Component tùy chỉnh cho NavLink để phù hợp với theme sáng
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`relative text-lg font-medium transition-colors duration-300 group ${isActive ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-600'}`}
    >
      {children}
      {/* NEW: Gạch chân sẽ có màu xanh và hiện rõ khi active */}
      <span className={`absolute -bottom-1 left-0 h-0.5 bg-emerald-500 transition-all duration-300 group-hover:w-full ${isActive ? 'w-full' : 'w-0'}`}></span>
    </Link>
  );
};

// Component tùy chỉnh cho ActionButton
const ActionButton = ({ Icon, onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-500 hover:text-emerald-500 transition-colors duration-300"
  >
    <Icon size={22} />
  </button>
);

export default Header;