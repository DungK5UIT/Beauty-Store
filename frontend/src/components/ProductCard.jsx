import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
// Giả sử bạn sẽ tạo file AuthContext.js như đã thảo luận
import { useAuth } from './AuthContext'; 

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

// --- THAY ĐỔI 1: Bỏ prop `isLoggedIn` ---
const ProductCard = ({ product, onAddToCart }) => {
  // --- THAY ĐỔI 2: Sử dụng context và hook `useNavigate` ---
  const { user } = useAuth();
  const navigate = useNavigate();

  // --- THAY ĐỔI 3: Tạo một hàm xử lý click thông minh hơn ---
  const handleAddToCartClick = () => {
    // Nếu chưa đăng nhập, chuyển đến trang login
    if (!user) {
      navigate('/login');
    } else {
      // Nếu đã đăng nhập, thực hiện hành động thêm vào giỏ hàng
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

        {/* --- THAY ĐỔI 4: Cập nhật nút để sử dụng hàm xử lý mới --- */}
        <button
          onClick={handleAddToCartClick}
          // Nút sẽ không bị vô hiệu hóa nữa, nó sẽ luôn có hành động
          className="w-full flex items-center justify-center bg-gradient-to-r from-emerald-500 to-lime-400 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-300 hover:opacity-90 hover:shadow-lg"
        >
          <ShoppingCart size={18} className="mr-2" />
          {/* Dùng `user` từ context để quyết định văn bản trên nút */}
          {user ? 'Thêm vào giỏ' : 'Đăng nhập để mua'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
