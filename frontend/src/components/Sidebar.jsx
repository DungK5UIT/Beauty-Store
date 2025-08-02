import React from 'react';
import { Filter } from 'lucide-react';
import categories from '../data/categories.js';
import priceRanges from '../data/priceRanges.js';

const Sidebar = ({ selectedCategory, onCategoryChange, selectedPriceRange, onPriceRangeChange }) => {
  return (
    <aside className="w-56 bg-white p-4 shadow-sm max-h-108">
      <h3 className="text-base font-semibold mb-4 flex items-center">
        <Filter className="mr-2" size={20} /> Bộ lọc
      </h3>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Danh mục</h4>
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              value={cat.id}
              checked={selectedCategory === cat.id}
              onChange={(e) => onCategoryChange(e.target.value)}
            />
            <span className="text-sm">{cat.icon} {cat.name}</span>
          </label>
        ))}
      </div>

      <div className="mb-4">
        <h4 className="font-medium mb-2">Khoảng giá</h4>
        {priceRanges.map((range) => (
          <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              name="priceRange"
              value={range.id}
              checked={selectedPriceRange === range.id}
              onChange={(e) => onPriceRangeChange(e.target.value)}
            />
            <span className="text-sm">{range.label}</span>
          </label>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;