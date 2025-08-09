import React, { useState } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';

const formatCurrency = (value) => {
  if (value == null) return '';
  return Number(value).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
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

  // Badge check
  const isNew = tags?.toLowerCase().includes('new');
  const isBestSeller = tags?.toLowerCase().includes('bán chạy');

  const handleFavoriteClick = () => {
    setIsFavorited((prev) => !prev);
  };

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
      stars.push(<Star key={`full-${i}`} size={14} className="fill-yellow-400 text-yellow-400" />);
    }
    if (halfStar) {
      stars.push(<Star key="half" size={14} className="text-yellow-400" />);
    }
    while (stars.length < 5) {
      stars.push(<Star key={`empty-${stars.length}`} size={14} className="text-gray-300" />);
    }
    return stars;
  };

  return (
    <div
      className="relative transition-all duration-300 overflow-hidden group border rounded-lg bg-white shadow-sm hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1">
        {isNew && (
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
            MỚI
          </span>
        )}
        {isBestSeller && (
          <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
            BÁN CHẠY
          </span>
        )}
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-all duration-200 shadow-sm
          ${isFavorited ? 'bg-red-500 text-white' : 'bg-white text-gray-400 hover:text-red-500'}
          ${isHovered ? 'opacity-100' : 'opacity-0'} group-hover:opacity-100`}
      >
        <Heart size={16} className={isFavorited ? 'fill-current' : ''} />
      </button>

      {/* Product Image */}
      <div
        className={`relative overflow-hidden ${
          rating === 5
            ? 'bg-gradient-to-br from-yellow-50 to-amber-50'
            : 'bg-gray-50'
        }`}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick Add Button */}
        <div
          className={`absolute inset-x-0 bottom-0 p-4 transition-all duration-300
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
        >
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            <ShoppingCart size={16} /> Thêm vào giỏ
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">{renderStars()}</div>
          <span className="text-xs text-gray-500">({reviewCount || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrency(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatCurrency(originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
