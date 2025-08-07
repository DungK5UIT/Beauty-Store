import React, { useState, useEffect, useRef } from 'react';
import { Search, ShoppingCart, User, ChevronDown, LogOut, UserCircle, Phone } from 'lucide-react'; // Thêm icon Phone
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'https://deploy-backend-production-e64e.up.railway.app';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const userMenuRef = useRef(null);
  
  // NOTE: Phần logic useEffect và các hàm xử lý không thay đổi.
  // Tôi đã ẩn đi cho gọn, bạn chỉ cần copy toàn bộ file là được.
  const [loadingCart, setLoadingCart] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });

  useEffect(() => {
    const fetchCartCount = async (userId) => {
      try {
        setLoadingCart(true);
        const response = await axios.get(`${API_BASE_URL}/api/cart/${userId}`);
        const cartItems = response.data;
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        setCartItemCount(totalQuantity);
      } catch (error) {
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
  }, [user, location]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutClick = async () => {
    setIsUserMenuOpen(false);
    await logout();
    // navigate('/'); // Chuyển về trang chủ sau khi logout
  };

  const handleUserIconClick = () => {
    if (user) {
      setIsUserMenuOpen(prev => !prev);
    } else {
      navigate('/login');
    }
  };


  return (
    // Thay đổi: Nền trắng, có đường viền mỏng bên dưới thay cho shadow
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Toast message không thay đổi */}
      {toast.show && (
        <div className={`fixed top-20 right-4 px-4 py-2 rounded-lg shadow-lg z-50 animate-fade-in-out ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
          {toast.message}
        </div>
      )}
      {/* Thay đổi: Tăng padding dọc (py-6) để header cao hơn */}
      <div className="container mx-auto px-6 py-5">
        <div className="flex justify-between items-center">
          
          {/* Thay đổi: Logo chữ đậm, màu tối */}
          <Link to="/" className="text-3xl font-bold text-gray-800 tracking-wider">
            Grostore
          </Link>

          {/* Thay đổi: NavLink được tùy chỉnh lại */}
          <nav className="hidden md:flex items-center space-x-10">
            <NavLink to="/">Home</NavLink>
            {/* Gộp chung Sản phẩm vào đây */}
            <NavLink to="/product">Browse Category</NavLink> 
            <NavLink to="/contact">Contact</NavLink>
            {user?.role === 'ADMIN' && (
              <NavLink to="/admin">Admin</NavLink>
            )}
          </nav>

          {/* Thay đổi: Nhóm các icon lại, có đường kẻ dọc phân chia */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-5 text-gray-700">
                <ActionButton Icon={Search} onClick={() => navigate('/search')} />
                <ActionButton Icon={User} onClick={handleUserIconClick} />
                {user && (
                    <Link to="/cart" className="relative text-gray-700 hover:text-brand-orange transition-colors">
                        <ShoppingCart size={24} strokeWidth={1.5}/>
                        {cartItemCount > 0 && !loadingCart && (
                        // Thay đổi: Màu của badge giỏ hàng
                        <span className="absolute -top-2 -right-3 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-xs font-bold text-white">
                            {cartItemCount}
                        </span>
                        )}
                    </Link>
                )}
            </div>

            {/* Vạch kẻ dọc */}
            <div className="h-8 w-px bg-gray-200"></div>

            {/* Thêm mục liên hệ như trong mẫu */}
            <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-100">
                    <Phone size={24} className="text-brand-orange"/>
                </div>
                <div>
                    <p className="text-gray-500 text-sm">Call us now</p>
                    <p className="text-gray-800 font-bold">+123 456 7890</p>
                </div>
            </div>
            
            {/* Dropdown menu của User không hiển thị trực tiếp ở đây nữa mà được quản lý bởi icon User ở trên */}
            <div className="relative" ref={userMenuRef}>
              {user && isUserMenuOpen && (
                // Thay đổi: Căn chỉnh lại dropdown và màu sắc
                <div className="absolute right-0 mt-4 w-56 bg-white rounded-md shadow-lg py-2 z-20 ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Welcome back,</p>
                      <p className="text-md font-semibold text-gray-800 truncate">{user.fullName}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                  >
                    <UserCircle size={18} className="mr-3" />
                    My Account
                  </Link>
                  <button
                    onClick={handleLogoutClick}
                    className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-brand-orange"
                  >
                    <LogOut size={18} className="mr-3" />
                    Logout
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

// Thay đổi: Component NavLink để loại bỏ gạch chân và đổi màu active/hover
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      // Thay đổi: Style cho NavLink, dùng màu cam làm điểm nhấn
      className={`relative text-base font-medium transition-colors duration-300
        ${isActive ? 'text-brand-orange' : 'text-gray-600 hover:text-brand-orange'}`}
    >
      {children}
    </Link>
  );
};

// Thay đổi: Component ActionButton để phù hợp với style mới
const ActionButton = ({ Icon, onClick }) => (
  <button onClick={onClick} className="text-gray-700 hover:text-brand-orange transition-colors">
    <Icon size={24} strokeWidth={1.5} />
  </button>
);


export default Header;