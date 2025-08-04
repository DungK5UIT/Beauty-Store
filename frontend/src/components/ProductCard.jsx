import React from 'react';

const formatCurrency = (value) => {
  if (!value) return '';
  return Number(value).toLocaleString('vi-VN') + ' VNĐ';
};

const ProductCard = ({ product, onAddToCart, isLoggedIn }) => {
  const tags = product.tags ? product.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="relative bg-white-100 p-2">
        <img
          src={product.image || '/placeholder-image.jpg'}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => (e.target.src = '/placeholder-image.jpg')}
          loading="lazy"
        />
        {product.tag && (
          <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {product.tag}
          </span>
        )}
        {tags.length > 0 && (
          <div className="absolute top-4 left-4 flex flex-col space-y-1">
            {tags.map((tag, idx) => (
              <span
                key={idx}
                className="bg-orange-500 text-white text-xs px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-medium text-gray-800 mb-2 line-clamp-2" title={product.name}>
          {product.name}
        </h3>
        <div className="mb-3">
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through mr-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
          <span className="text-red-600 font-semibold">
            {formatCurrency(product.price)}
          </span>
        </div>
        <button
          onClick={onAddToCart}
          disabled={!isLoggedIn}
          className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
        >
          {isLoggedIn ? 'Thêm vào giỏ hàng' : 'Đăng nhập để mua sản phẩm'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
