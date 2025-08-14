import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-white/80 backdrop-blur-lg shadow-sm pt-12 pb-6">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">✨</span>
            </div>
            <div>
              <h3 className="text-xl font-bold bg-[#483C54] bg-clip-text text-transparent">BEAUTY LUXE</h3>
              <p className="text-xs text-gray-500 font-medium">Premium Cosmetics</p>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-4">Mang đến vẻ đẹp tự nhiên cho làn da của bạn...</p>
          <Link to="/contact" className="bg-gradient-to-br from-rose-400 to-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-700 transition-colors duration-300">
            Liên hệ
          </Link>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Danh mục</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/products" className="hover:text-emerald-500 transition-colors duration-300">Sản phẩm</a></li>
            <li><a href="/about" className="hover:text-emerald-500 transition-colors duration-300">Giới thiệu</a></li>
            <li><a href="/contact" className="hover:text-emerald-500 transition-colors duration-300">Liên hệ</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hỗ trợ</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><a href="/faq" className="hover:text-emerald-500 transition-colors duration-300">Câu hỏi thường gặp</a></li>
            <li><a href="/shipping" className="hover:text-emerald-500 transition-colors duration-300">Vận chuyển</a></li>
            <li><a href="/returns" className="hover:text-emerald-500 transition-colors duration-300">Đổi trả</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Kết nối với chúng tôi</h3>
          <div className="flex space-x-3">
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">f</a>
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">in</a>
            <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center hover:bg-emerald-500 transition-colors duration-300">yt</a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-300 pt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">© Beauty Luxe 2025</p>
        <div className="flex space-x-3">
          <a href="#" className="text-sm text-gray-600 hover:text-emerald-500 transition-colors duration-300">Chính sách bảo mật</a>
          <a href="#" className="text-sm text-gray-600 hover:text-emerald-500 transition-colors duration-300">Điều khoản dịch vụ</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;