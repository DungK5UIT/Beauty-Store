import React from 'react';

const Catagory = () => {
  const categories = [
    { id: 1, name: 'Skincare', bgColor: 'bg-gray-50', img: 'https://xfswcnmwovkwdwimszov.supabase.co/storage/v1/object/public/product-image/Kem_chong_nang_Biore_UV_Aqua-removebg-preview.png' },
    { id: 2, name: 'Makeup', bgColor: 'bg-gradient-to-br from-yellow-50 to-amber-50', img: 'link-anh-2.jpg' },
    { id: 3, name: 'Haircare', bgColor: 'bg-gray-50', img: 'link-anh-3.jpg' },
    { id: 4, name: 'Fragrances', bgColor: 'bg-gray-50', img: 'link-anh-4.jpg' },
    { id: 5, name: 'Bodycare', bgColor: 'bg-gray-50', img: 'link-anh-5.jpg' },
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Shop by Category
          </h1>
        </div>

        {/* Categories Grid */}
        <div className="w-full mx-auto grid grid-cols-5 gap-24 justify-items-center">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* Circle Container */}
              <div
                className={`
                  w-55 h-55 rounded-full ${category.bgColor} 
                  flex items-center justify-center
                  transition-all duration-200 
                  group-hover:shadow-md
                  group-hover:scale-105
                  overflow-hidden
                `}
              >
                {/* Image chiếm 80% khung */}
                <img
                  src={category.img} // chèn link ảnh ở đây
                  alt={category.name}
                  className="w-100% h-100% object-cover rounded-full"
                />
              </div>

              {/* Category Name */}
              <span className="mt-4 text-sm font-medium text-gray-700 text-center">
                {category.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catagory;
