import React from 'react';
import { ShoppingCart } from 'lucide-react'; // Giả sử bạn dùng lucide-react cho icon

// Hàm định dạng tiền tệ (giữ nguyên hoặc thay thế bằng hàm của bạn)
const formatCurrency = (value) => {
  if (typeof value !== 'number') return '';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ProductCard = ({ product, user, handleAddToCartClick }) => {
  return (
    // 'group' class trên thẻ cha cho phép điều khiển hiệu ứng hover của các thẻ con
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl group">
      {/* 1. KHU VỰC HÌNH ẢNH */}
      <div className="relative">
        {/*
          Phần nền màu xám nhạt cho ảnh sản phẩm.
          Ảnh sản phẩm (product.image) nên có nền trong suốt để có hiệu ứng tốt nhất.
        */}
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.image || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            loading="lazy"
          />
        </div>

        {/* Tag sản phẩm (nếu có) */}
        {product.tag && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.tag}
          </span>
        )}
      </div>

      {/* 2. KHU VỰC THÔNG TIN SẢN PHẨM */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-2 h-12 line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        {/* Hiển thị giá */}
        <div className="mb-4">
          <span className="text-xl font-bold text-emerald-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through ml-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/*
          3. NÚT "THÊM VÀO GIỎ HÀNG" (CHỈ HIỆN KHI HOVER)
          - Sử dụng max-h-0 và opacity-0 để ẩn đi.
          - Khi hover vào 'group' (thẻ cha), đổi thành max-h-20 và opacity-100 để hiện ra với hiệu ứng trượt.
        */}
        <div className="grid transition-all duration-300 ease-in-out max-h-0 opacity-0 group-hover:max-h-20 group-hover:opacity-100">
          <button
            onClick={handleAddToCartClick}
            // Style mới của nút với nền màu #483C54
            className="w-full flex items-center justify-center bg-[#483C54] text-white font-bold py-2.5 px-4 rounded-lg transition-colors duration-300 hover:bg-opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} className="mr-2" />
            {user ? 'Thêm vào giỏ hàng' : ''}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;