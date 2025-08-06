import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

const ProductCard = ({ product, onAddToCart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCartClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      onAddToCart();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-4">
          <img
            src={product.image || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            loading="lazy"
          />
        </div>
        
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

        <button
          onClick={handleAddToCartClick}
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg"
        >
          <ShoppingCart size={18} className="mr-2" />
          {user ? 'Thêm vào giỏ hàng' : 'Đăng nhập để thêm vào giỏ'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;