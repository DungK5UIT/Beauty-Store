import React from 'react';
import { ShoppingCart } from 'lucide-react';

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const ProductCard = ({ product, onAddToCart, user }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-2 group">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.image || '/placeholder-image.jpg'}
            alt={product.name || 'Sản phẩm'}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            loading="lazy"
          />
        </div>

        {product.tag && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase">
            {product.tag}
          </span>
        )}
      </div>

      <div className="p-4">
        <h3
          className="font-semibold text-gray-800 text-sm mb-2 h-12 line-clamp-2"
          title={product.name || 'Sản phẩm'}
        >
          {product.name || 'Sản phẩm'}
        </h3>

        <div className="mb-3">
          <span className="text-lg font-bold text-emerald-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through ml-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={onAddToCart}
          className="w-full flex items-center justify-center bg-[#483C54] text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:opacity-90 hover:shadow-md disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <ShoppingCart size={16} className="mr-2" />
          {user ? 'Thêm vào giỏ' : 'Đăng nhập'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;