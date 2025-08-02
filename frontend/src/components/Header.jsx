import React from 'react';
import { Search, ShoppingCart, User, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/search');
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-2 text-sm border-b border-gray-700">
          <div>Hotline tư vấn: 012345678</div>
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center space-x-1 hover:text-yellow-600 transition-colors duration-200" 
              onClick={handleSearchClick}
            >
              <Search size={16} />
              <span>Tìm kiếm</span>
            </button>
            <button 
              className="flex items-center space-x-1 hover:text-yellow-600 transition-colors duration-200" 
              onClick={handleCartClick}
            >
              <ShoppingCart size={16} />
              <span>Giỏ hàng</span>
            </button>
            <button 
              className="flex items-center space-x-1 hover:text-yellow-600 transition-colors duration-200" 
              onClick={handleLoginClick}
            >
              <User size={16} />
              <span>Đăng nhập</span>
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-pink-600">BEAUTY STORE</Link>
          <nav className="flex space-x-8">
            <Link to="/" className="hover:text-yellow-600 transition-colors duration-200">Trang chủ</Link>
            <div className="relative group">
              <Link to="/product" className="flex items-center space-x-1 hover:text-yellow-600 transition-colors duration-200">Sản phẩm</Link>
            </div>
            <Link to="/about" className="hover:text-yellow-600 transition-colors duration-200">Giới thiệu</Link>
            <Link to="/contact" className="hover:text-yellow-600 transition-colors duration-200">Liên hệ</Link>
            <Link to="/admin" className="hover:text-yellow-600 transition-colors duration-200">Quản lý</Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;