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
    // Giữ nguyên hiệu ứng hover
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
      <div className="relative">
        <div className="aspect-square w-full bg-gray-50 flex items-center justify-center p-3"> {/* Giảm padding hình ảnh */}
          <img
            src={product.image || '/placeholder-image.jpg'}
            alt={product.name}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => (e.target.src = '/placeholder-image.jpg')}
            loading="lazy"
          />
        </div>

        {product.tag && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full uppercase"> {/* Điều chỉnh vị trí tag */}
            {product.tag}
          </span>
        )}
      </div>

      {/* Giảm padding tổng thể của phần nội dung */}
      <div className="p-4">
        {/* Giảm chiều cao và kích thước font của tên sản phẩm */}
        <h3 className="font-semibold text-gray-800 text-base mb-2 h-10 line-clamp-2" title={product.name}>
          {product.name}
        </h3>

        <div className="mb-3">
          {/* Giảm kích thước font giá */}
          <span className="text-lg font-bold text-emerald-600">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-gray-400 text-xs line-through ml-2"> {/* Giảm font giá gốc */}
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        
        {/* Làm nút bấm nhỏ gọn hơn */}
        <button
          onClick={handleAddToCartClick}
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-bold py-2 px-3 rounded-lg text-sm transition-all duration-300 hover:opacity-90 hover:shadow-md disabled:from-gray-300 disabled:to-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
        >
          <ShoppingCart size={16} className="mr-1.5" /> {/* Giảm kích thước icon */}
          {user ? 'Thêm vào giỏ' : 'Đăng nhập'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;