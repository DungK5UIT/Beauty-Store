import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[50vh] w-[100%] mx-auto">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2080')`,
            backgroundSize: 'cover',
            width: '100%',
            height: '100%'
          }}
        >
        </div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col items-start justify-center h-[50vh] w-[40%] text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 drop-shadow-lg">
            Khám Phá Vẻ Đẹp Tự Nhiên
          </h1>
          <p className="text-sm sm:text-base lg:text-lg mb-4 max-w-xs drop-shadow-md">
            Nâng niu làn da của bạn với các sản phẩm mỹ phẩm cao cấp
          </p>
          <Link
            to="/products"
            className="inline-block bg-white hover:bg-gray-200 text-black font-semibold py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Mua sắm ngay
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;