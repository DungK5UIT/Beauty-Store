import React from 'react';
import { Filter } from 'lucide-react';
import categories from '../data/categories.js';
import priceRanges from '../data/priceRanges.js';

const Sidebar = ({ selectedCategory, onCategoryChange, selectedPriceRange, onPriceRangeChange }) => {
  return (
    // CHANGED: Tăng w (width), thêm bo góc và shadow mềm mại hơn
    <aside className="w-64 bg-white p-6 rounded-lg shadow-md">
      {/* CHANGED: Tiêu đề nổi bật với màu chủ đạo */}
      <h3 className="text-lg font-bold mb-6 flex items-center text-emerald-600">
        <Filter className="mr-2" size={24} /> BỘ LỌC SẢN PHẨM
      </h3>

      {/* --- Phần Danh mục --- */}
      <div className="mb-8">
        <h4 className="font-semibold mb-3 text-gray-800">Danh mục</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <RadioOption
              key={cat.id}
              name="category"
              id={`cat-${cat.id}`}
              value={cat.id}
              checked={selectedCategory === cat.id}
              onChange={(e) => onCategoryChange(e.target.value)}
              label={
                <>
                  {cat.icon} <span className="ml-2">{cat.name}</span>
                </>
              }
            />
          ))}
        </div>
      </div>

      {/* --- Phần Khoảng giá --- */}
      <div>
        <h4 className="font-semibold mb-3 text-gray-800">Khoảng giá</h4>
        <div className="space-y-2">
          {priceRanges.map((range) => (
            <RadioOption
              key={range.id}
              name="priceRange"
              id={`price-${range.id}`}
              value={range.id}
              checked={selectedPriceRange === range.id}
              onChange={(e) => onPriceRangeChange(e.target.value)}
              label={range.label}
            />
          ))}
        </div>
      </div>
    </aside>
  );
};

// NEW: Component RadioOption tùy chỉnh để tái sử dụng và làm code chính gọn gàng
const RadioOption = ({ id, name, value, checked, onChange, label }) => (
  <label
    htmlFor={id}
    className="flex items-center p-2 rounded-md cursor-pointer transition-colors duration-200 hover:bg-emerald-50"
  >
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="peer hidden" // Ẩn nút radio mặc định
    />
    {/* Đây là nút radio custom */}
    <span className="w-4 h-4 border-2 border-gray-300 rounded-full flex items-center justify-center transition-all duration-200 peer-checked:border-emerald-500 peer-checked:bg-emerald-500">
      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
    </span>
    {/* Label sẽ đổi màu khi được chọn */}
    <span className="ml-3 text-sm text-gray-600 font-medium transition-colors duration-200 peer-checked:text-emerald-600">
      {label}
    </span>
  </label>
);


export default Sidebar;