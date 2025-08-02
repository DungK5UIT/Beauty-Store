import React from 'react';

const ProductCard = ({ product }) => {
  // Chuyển đổi chuỗi tags thành mảng nếu tồn tại
  const tags = product.tags ? product.tags.split(',').map(tag => tag.trim()) : [];

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className=" relative bg-white-100 p-2 "> {/* Tỷ lệ 5:3, thêm padding và nền */}
        <img
          src={product.image || '/placeholder-image.jpg'} // Fallback image nếu không có
          alt={product.name}
          className="w-full h-full object-contain" // Sử dụng object-contain
          onError={(e) => (e.target.src = '/placeholder-image.jpg')} // Xử lý lỗi tải ảnh
          loading="lazy" // Tối ưu tải ảnh
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
              {product.originalPrice}
            </span>
          )}
          <span className="text-red-600 font-semibold">{product.price}</span>
        </div>
        <button className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-700 transition-colors duration-200">
          Thêm vào giỏ hàng
        </button>
      </div>
    </div>
  );
};

export default ProductCard;