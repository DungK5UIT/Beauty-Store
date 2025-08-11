import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN') + '₫';
};

const ProductCard = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  const {
    name,
    price,
    originalPrice,
    image,
    category,
    tags,
    rating,
    reviewCount,
  } = product;

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  const renderStars = () => {
    const fullStars = Math.floor(rating || 0);
    const halfStar = (rating || 0) % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={12} className="fill-yellow-400 text-yellow-400" />);
    }
    if (halfStar) {
      stars.push(<Star key="half" size={12} className="text-yellow-400" />);
    }
    while (stars.length < 5) {
      stars.push(<Star key={`empty-${stars.length}`} size={12} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div
      className="relative transition-all duration-300 overflow-hidden group max-w-[200px] mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tag góc phải */}
      {tags && (
        <span className="absolute top-3 right-3 z-10 bg-transparent border border-gray-400 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
          {tags}
        </span>
      )}

      {/* Khung ảnh nhỏ */}
      <div
        className={`relative overflow-hidden rounded-lg ${
          rating === 5
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50'
            : 'bg-gray-50'
        } w-[150px] h-[150px] flex items-center justify-center mx-auto`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Nút thêm vào giỏ */}
        <div
          className={`absolute inset-x-0 bottom-0 p-2 transition-all duration-300
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-1 px-2 rounded-md hover:bg-gray-800 transition-colors duration-200 text-sm flex items-center justify-center gap-1"
          >
            <ShoppingCart size={14} /> Thêm
          </button>
        </div>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-3 text-center">
        {/* Loại sản phẩm */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {category}
        </p>

        {/* Tên */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight text-sm">
          {name}
        </h3>

        {/* Đánh giá */}
        <div className="flex items-center gap-1 justify-center mb-2">
          {renderStars()}
          <span className="text-xs text-gray-500">({reviewCount})</span>
        </div>

        {/* Giá */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            {formatCurrency(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-xs text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
