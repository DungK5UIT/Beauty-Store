import React from 'react';

const Footer = () => (
  <footer className="bg-gray-100 pt-12 pb-6">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <div>
          <h3 className="text-pink-600 text-xl font-bold mb-4">BEAUTY STORE</h3>
          <p className="text-gray-600 text-sm mb-4">Mang đến vẻ đẹp tự nhiên cho làn da của bạn...</p>
          <button className="bg-pink-600 text-white px-4 py-2 rounded text-sm hover:bg-pink-700">Liên hệ</button>
        </div>
        {/* Các cột còn lại giống như bạn đã viết */}
      </div>
      <div className="border-t border-gray-300 pt-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">©Beauty Store 2024</p>
        <div className="flex space-x-3">
          <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center">f</a>
          <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center">in</a>
          <a href="#" className="w-8 h-8 bg-gray-800 rounded-full text-white flex items-center justify-center">yt</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
