import React from 'react';
import { ShoppingCart } from 'lucide-react'; // NEW: Thêm icon vào nút

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const ProductCard = ({ product, onAddToCart, isLoggedIn }) => {

  return (
    // NEW: Thêm hiệu ứng hover và bo góc lớn hơn, shadow đẹp hơn
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      <div className="relative">
        {/* NEW: Thêm aspect-ratio để các card cao bằng nhau, bg-gray-50 cho ảnh có nền */}
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-4">
            <img
              src={product.image || '/placeholder-image.jpg'}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
              onError={(e) => (e.target.src = '/placeholder-image.jpg')}
              loading="lazy"
            />
        </div>
        
        {/* NEW: Thiết kế lại tag cho đẹp hơn */}
        {product.tag && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-semibold text-gray-800 mb-2 h-12 line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        {/* NEW: Thiết kế lại giá cho nổi bật */}
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

        {/* NEW: Nút với gradient, icon và hiệu ứng đẹp hơn */}
        <button
          onClick={onAddToCart}
          disabled={!isLoggedIn}
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <ShoppingCart size={18} className="mr-2" />
          {isLoggedIn ? 'Thêm vào giỏ' : 'Đăng nhập để mua'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;